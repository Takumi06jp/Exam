import QuizClient from "./_components/QuizClient";
import { db } from "@/db/drizzle";
import { answers, questions } from "@/db/schema";
import { and, desc, eq, inArray } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export type QuizQuestion = {
  id: number;
  category: string;
  question: string;
  choices: string[];
  answer: number; // 1-indexed
};

export type AnswerStatus = "unanswered" | "incorrect" | "correct";
export type FilterMode = "random" | "unanswered" | "incorrect";

function shuffleInPlace<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function prioritizeQuestions(
  qs: QuizQuestion[],
  statusByQid: Map<number, AnswerStatus>,
  filter: FilterMode,
  limit: number,
): QuizQuestion[] {
  if (filter === "random") return shuffleInPlace([...qs]).slice(0, limit);

  const unanswered = qs.filter(q => !statusByQid.has(q.id));
  const incorrect  = qs.filter(q => statusByQid.get(q.id) === "incorrect");
  const correct    = qs.filter(q => statusByQid.get(q.id) === "correct");


  if (filter === "incorrect") {
    return [
      ...shuffleInPlace([...incorrect]),
      ...shuffleInPlace([...unanswered]),
      ...shuffleInPlace([...correct]),
    ].slice(0, limit);
  }
  return [
    ...shuffleInPlace([...unanswered]),
    ...shuffleInPlace([...incorrect]),
    ...shuffleInPlace([...correct]),
  ].slice(0, limit);
}

async function loadQuestions(
  categoryList: string[],
  limit: number | undefined,
  filter: FilterMode,
  userId: string | null,
): Promise<QuizQuestion[]> {
  const rows = categoryList.length
    ? await db
        .select()
        .from(questions)
        .where(inArray(questions.category, categoryList))
    : await db.select().from(questions);

  const mapped: QuizQuestion[] = rows.map((row) => ({
    id: row.id,
    category: row.category,
    question: row.question,
    choices: row.choices ?? [],
    answer: row.answer.charCodeAt(0) - 96,
  }));

  const effectiveLimit = !limit || limit >= mapped.length ? mapped.length : limit;

  if (filter === "random" || !userId) {
    return shuffleInPlace(mapped).slice(0, effectiveLimit);
  }

  const qids = mapped.map((q) => q.id);
  const answerRows = qids.length
    ? await db
        .select()
        .from(answers)
        .where(and(eq(answers.userId, userId), inArray(answers.questionId, qids)))
        .orderBy(desc(answers.createdAt))
    : [];

  const statusByQid = new Map<number, AnswerStatus>();
  for (const r of answerRows) {
    if (statusByQid.has(r.questionId)) continue;
    statusByQid.set(r.questionId, r.isCorrect ? "correct" : "incorrect");
  }

  return prioritizeQuestions(mapped, statusByQid, filter, effectiveLimit);
}

export default async function QuestionPage({
  searchParams,
}: {
  searchParams: {
    category?: string;
    categories?: string;
    limit?: string;
    filter?: string;
  };
}) {
  const { category, categories, limit, filter } = searchParams;

  const categoryList = categories
    ? categories.split(",").map((c) => c.trim()).filter(Boolean)
    : category
      ? [category]
      : [];

  const parsed = limit ? Number(limit) : NaN;
  const n =
    Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : undefined;

  const f: FilterMode =
    filter === "unanswered" || filter === "incorrect" ? filter : "random";

  const session =
    f === "random" ? null : await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id ?? null;

  const quizQuestions = await loadQuestions(categoryList, n, f, userId);
  return <QuizClient questions={quizQuestions} />;
}
