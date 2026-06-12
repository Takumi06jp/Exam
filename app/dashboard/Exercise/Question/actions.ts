"use server";

import { db } from "@/db/drizzle";
import { answers, answerStats, questions } from "@/db/schema";
import { inArray, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import type { QuizQuestion } from "./page";

export async function getQuestionsByIds(
  ids: number[],
): Promise<QuizQuestion[]> {
  if (ids.length === 0) return [];
  const rows = await db
    .select()
    .from(questions)
    .where(inArray(questions.id, ids));
  return rows.map((row) => ({
    id: row.id,
    category: row.category,
    question: row.question,
    choices: row.choices ?? [],
    answer: row.answer.charCodeAt(0) - 96,
  }));
}

export type SaveAnswerEntry = {
  questionId: number;
  category: string;
  answer: string;
  isCorrect: boolean;
};

export async function saveQuizResults(entries: SaveAnswerEntry[]) {
  if (entries.length === 0) return;
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;
  if (!userId) throw new Error("Unauthorized");

  const answersRows = entries.map((e) => ({
    questionId: e.questionId,
    Qcategory: e.category,
    userId,
    answer: e.answer,
    isCorrect: e.isCorrect,
  }));

  const statsRows = entries.map((e) => ({
    userId,
    questionId: e.questionId,
    Qcategory: e.category,
    correctCount: e.isCorrect ? 1 : 0,
    incorrectCount: e.isCorrect ? 0 : 1,
    lastIsCorrect: e.isCorrect,
  }));

  await db.batch([
    db.insert(answers).values(answersRows),
    db
      .insert(answerStats)
      .values(statsRows)
      .onConflictDoUpdate({
        target: [answerStats.userId, answerStats.questionId],
        set: {
          // TODO(human): 既存行の集計値を更新するロジックを書く。
          // - correctCount   : 既存値 + 今回の値（累積）
          // - incorrectCount : 既存値 + 今回の値（累積）
          // - lastIsCorrect  : 今回の値で上書き
          // - updatedAt      : 現在時刻に更新
          //
          // ヒント:
          // - drizzle の sql テンプレートタグで `${answerStats.correctCount}` と書くと
          //   "answerStats"."correctCount" にコンパイルされる（既存行の値の参照）
          // - PostgreSQL の予約語 `excluded."colName"` で「INSERT しようとしていた値」を参照できる
          //   sql テンプレ内に直接 sql`excluded."correctCount"` のように書く
          // - lastIsCorrect は累積ではなく上書きなので excluded の値そのまま
          // - updatedAt は JS の new Date() でも sql`NOW()` でも OK

          lastIsCorrect: 
        },
      }),
  ]);
}
