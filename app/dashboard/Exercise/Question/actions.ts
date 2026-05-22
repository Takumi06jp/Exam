"use server";

import { db } from "@/db/drizzle";
import { questions } from "@/db/schema";
import { inArray } from "drizzle-orm";
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
