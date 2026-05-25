"use server";

import { db } from "@/db/drizzle";
import { answers, questions } from "@/db/schema";
import { inArray } from "drizzle-orm";
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
  await db.insert(answers).values(
    entries.map((e) => ({
      questionId: e.questionId,
      Qcategory: e.category,
      userId,
      answer: e.answer,
      isCorrect: e.isCorrect,
    })),
  );
}
