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
  // TODO(human): 下の resetSubjectAnswers / resetAllAnswers を参考に、
  //   answers と answerStats の両方から
  //   「userId が一致 かつ Qcategory が引数 category と一致」の行を削除する。
  //   db.batch([...]) で 2 つの DELETE を 1 リクエストにまとめること。
  //   （現状はどちらも削除していないので、実装しないと「1教科のみリセット」ボタンが動きません）
  revalidatePath("/dashboard/Exercise");
}

export async function resetSubjectAnswers(categories: string[]) {
  if (categories.length === 0) return;
  const userId = await requireUserId();
  if (!userId) throw new Error("Unauthorized");
  await db.batch([
    db
      .delete(answers)
      .where(
        and(eq(answers.userId, userId), inArray(answers.Qcategory, categories)),
      ),
    db
      .delete(answerStats)
      .where(
        and(
          eq(answerStats.userId, userId),
          inArray(answerStats.Qcategory, categories),
        ),
      ),
  ]);
  revalidatePath("/dashboard/Exercise");
}

export async function resetAllAnswers() {
  const userId = await requireUserId();
  if (!userId) throw new Error("Unauthorized");
  // TODO(human): 上の resetSubjectAnswers を参考に、
  //   answers と answerStats の両方から
  //   「userId が一致」する行をすべて削除する。
  //   category による絞り込みは不要（そのユーザーの回答をまるごと消す関数）。
  //   db.batch([...]) で 2 つの DELETE を 1 リクエストにまとめること。
  revalidatePath("/dashboard/Exercise");
}
