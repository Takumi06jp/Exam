"use server";

import { db } from "@/db/drizzle";
import { answers, answerStats } from "@/db/schema";
import { and, eq, inArray, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export type CategoryStat = {
  category: string;
  correct: number;
  total: number;
};

async function requireUserId(): Promise<string | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user?.id ?? null;
}

export async function getCategoryStats(
  categories: string[],
): Promise<CategoryStat[]> {
  const empty = categories.map((c) => ({ category: c, correct: 0, total: 0 }));
  if (categories.length === 0) return empty;
  const userId = await requireUserId();
  if (!userId) return empty;

  // TODO(human): answerStats を Qcategory で GROUP BY して、各カテゴリの
  // { Qcategory: string, total: number, correct: number } を取得するクエリを書く。
  //
  //   total   = そのユーザー×カテゴリの行数（= 回答済み問題数）
  //   correct = そのうち lastIsCorrect = true の行数
  //
  // ヒント:
  // 1) drizzle の .select({ alias: sql<T>`SQL式` }) で SELECT 列を自由に指定できる。
  // 2) total は COUNT(*)::int で取得（PostgreSQL の COUNT は bigint なので int キャストで JS の number に揃える）。
  // 3) correct は PostgreSQL 標準の集約フィルタ
  //      COUNT(*) FILTER (WHERE 条件)
  //    を使うと「条件を満たす行だけを数える」が CASE 文無しで書ける。
  // 4) drizzle でカラムを SQL 式に埋める時は ${answerStats.lastIsCorrect} と書けば
  //    "answerStats"."lastIsCorrect" にコンパイルされる。
  // 5) where は and(eq(answerStats.userId, userId), inArray(answerStats.Qcategory, categories)) の形。
  // 6) groupBy(answerStats.Qcategory) を忘れずに。
  //
  // 期待する rows の型: { Qcategory: string; total: number; correct: number }[]
  //const rows: { Qcategory: string; total: number; correct: number }[] = [];
  const rows = await db
    .select({
      Qcategory: answerStats.Qcategory,
      total:   sql<number>`COUNT(*)::int`,
      correct: sql<number>`COUNT(*) FILTER (where ${answerStats.lastIsCorrect})::int`,
    })
    .from(answerStats)
    .where(and(eq(answerStats.userId, userId), inArray(answerStats.Qcategory, categories)))
    .groupBy(answerStats.Qcategory);


  const statsByCat = new Map<string, CategoryStat>(
    categories.map((c) => [c, { category: c, correct: 0, total: 0 }]),
  );
  for (const r of rows) {
    const s = statsByCat.get(r.Qcategory);
    if (!s) continue;
    s.total = r.total;
    s.correct = r.correct;
  }
  return categories.map((c) => statsByCat.get(c)!);
}

export async function resetCategoryAnswers(category: string) {
  const userId = await requireUserId();
  if (!userId) throw new Error("Unauthorized");
  await db
    .delete(answers)
    .where(
      and(eq(answers.userId, userId), eq(answers.Qcategory, category)),
    );
  revalidatePath("/dashboard/Exercise");
}

export async function resetSubjectAnswers(categories: string[]) {
  if (categories.length === 0) return;
  const userId = await requireUserId();
  if (!userId) throw new Error("Unauthorized");
  await db
    .delete(answers)
    .where(
      and(eq(answers.userId, userId), inArray(answers.Qcategory, categories)),
    );
  revalidatePath("/dashboard/Exercise");
}

export async function resetAllAnswers() {
  const userId = await requireUserId();
  if (!userId) throw new Error("Unauthorized");
  await db.delete(answers).where(eq(answers.userId, userId));
  revalidatePath("/dashboard/Exercise");
}
