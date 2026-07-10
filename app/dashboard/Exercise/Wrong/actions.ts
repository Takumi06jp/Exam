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

  const filters = [eq(answerStats.userId, userId),eq(answerStats.lastIsCorrect, false)];
  if (category){filters.push(eq(answerStats.Qcategory,category))}
  const wrongRows = await db
    .select({ questionId:answerStats.questionId,lastAnswer:answerStats.lastAnswer,answeredAt:answerStats.updatedAt})
    .from(answerStats)
    .where(and(...filters))
    .orderBy(desc(answerStats.updatedAt));
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
