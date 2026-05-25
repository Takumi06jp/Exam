"use server";

import { db } from "@/db/drizzle";
import { answers, questions } from "@/db/schema";
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

  const filters = [eq(answers.userId, userId)];
  if (category) filters.push(eq(answers.Qcategory, category));

  const rows = await db
    .select()
    .from(answers)
    .where(and(...filters))
    .orderBy(desc(answers.createdAt));

  const latestByQ = new Map<number, (typeof rows)[number]>();
  for (const r of rows) {
    if (!latestByQ.has(r.questionId)) latestByQ.set(r.questionId, r);
  }

  const wrongEntries = [...latestByQ.values()].filter((r) => !r.isCorrect);
  if (wrongEntries.length === 0) return [];

  const qIds = wrongEntries.map((r) => r.questionId);
  const qRows = await db
    .select()
    .from(questions)
    .where(inArray(questions.id, qIds));
  const qById = new Map(qRows.map((q) => [q.id, q]));

  return wrongEntries
    .map((r) => {
      const q = qById.get(r.questionId);
      if (!q) return null;
      return {
        id: q.id,
        category: q.category,
        question: q.question,
        choices: q.choices ?? [],
        answer: q.answer.charCodeAt(0) - 96,
        userAnswer: r.answer.charCodeAt(0) - 96,
        answeredAt: r.createdAt,
      } satisfies WrongQuestion;
    })
    .filter((x): x is WrongQuestion => x !== null)
    .sort((a, b) => b.answeredAt.getTime() - a.answeredAt.getTime());
}
