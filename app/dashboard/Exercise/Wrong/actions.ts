"use server";

import { db } from "@/db/drizzle";
import { answerStats, questions } from "@/db/schema";
import { and, desc, eq, inArray } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export type WrongQuestion = {
  id: number;
  category: string;
  question: string;
  choices: string[];
  answer: number; // 1-indexed correct
  userAnswer: number; // 1-indexed user selected
  answeredAt: Date;
};

export async function getWrongQuestions(
  category?: string,
): Promise<WrongQuestion[]> {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;
  if (!userId) return [];

  // TODO(human): answerStats から「最新回答が不正解」な行を取得する。
  //
  // 必要な条件:
  //   1) userId が一致
  //   2) lastIsCorrect = false （最新の回答が不正解だったもの）
  //   3) category 引数が指定されている場合のみ、Qcategory が一致
  //
  // ヒント:
  // - drizzle で「必要に応じて条件を足す」パターンは、
  //     const filters = [必須条件1, 必須条件2];
  //     if (オプション) filters.push(オプション条件);
  //   とした上で .where(and(...filters)) と展開するのが定石。
  // - SELECT する列: { questionId, lastAnswer, answeredAt }
  //   - answeredAt は answerStats.updatedAt をエイリアスとして使う
  //     （回答時刻専用カラムは作らず、updatedAt で代用する設計）
  // - .orderBy(desc(answerStats.updatedAt)) で「新しく間違えた順」に並べる。
  //   (desc は drizzle-orm から import 済み)
  //
  // 期待する wrongRows の型:
  //   { questionId: number; lastAnswer: string; answeredAt: Date }[]
  const wrongRows: {
    questionId: number;
    lastAnswer: string;
    answeredAt: Date;
  }[] = [];

  if (wrongRows.length === 0) return [];

  const qIds = wrongRows.map((r) => r.questionId);
  const qRows = await db
    .select()
    .from(questions)
    .where(inArray(questions.id, qIds));
  const qById = new Map(qRows.map((q) => [q.id, q]));

  return wrongRows
    .map((r) => {
      const q = qById.get(r.questionId);
      if (!q) return null;
      return {
        id: q.id,
        category: q.category,
        question: q.question,
        choices: q.choices ?? [],
        answer: q.answer.charCodeAt(0) - 96,
        userAnswer: r.lastAnswer.charCodeAt(0) - 96,
        answeredAt: r.answeredAt,
      } satisfies WrongQuestion;
    })
    .filter((x): x is WrongQuestion => x !== null);
}
