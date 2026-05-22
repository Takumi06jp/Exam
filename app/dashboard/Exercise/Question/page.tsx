import QuizClient from "./_components/QuizClient";
import { db } from "@/db/drizzle";
import { questions } from "@/db/schema";
import { eq } from "drizzle-orm";

export type QuizQuestion = {
  id: number;
  category: string;
  question: string;
  choices: string[];
  answer: number; // 1-indexed
};

async function loadQuestions(
  category?: string,
  limit?: number,
): Promise<QuizQuestion[]> {
  const rows = category
    ? await db.select().from(questions).where(eq(questions.category, category))
    : await db.select().from(questions);
  const mapped: QuizQuestion[] = rows.map((row) => ({
    id: row.id,
    category: row.category,
    question: row.question,
    choices: row.choices ?? [],
    answer: row.answer.charCodeAt(0) - 96,
  }));
  if (!limit || limit >= mapped.length) return mapped;
  for (let i = mapped.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [mapped[i], mapped[j]] = [mapped[j], mapped[i]];
  }
  return mapped.slice(0, limit);
}

export default async function QuestionPage({
  searchParams,
}: {
  searchParams: { category?: string; limit?: string };
}) {
  const { category, limit } = searchParams;
  const parsed = limit ? Number(limit) : NaN;
  const n = Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : undefined;
  const quizQuestions = await loadQuestions(category, n);
  return <QuizClient questions={quizQuestions} />;
}
