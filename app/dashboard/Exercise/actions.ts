"use server";

import { db } from "@/db/drizzle";
import { answers } from "@/db/schema";
import { and, desc, eq, inArray } from "drizzle-orm";
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
    .select()
    .from(answers)
    .where(
      and(
        eq(answers.userId, userId),
        inArray(answers.Qcategory, categories),
      ),
    )
    .orderBy(desc(answers.createdAt));

  const latestByQ = new Map<number, (typeof rows)[number]>();
  for (const r of rows) {
    if (!latestByQ.has(r.questionId)) latestByQ.set(r.questionId, r);
  }

  const stats = new Map<string, CategoryStat>(
    categories.map((c) => [c, { category: c, correct: 0, total: 0 }]),
  );
  for (const r of latestByQ.values()) {
    const s = stats.get(r.Qcategory);
    if (!s) continue;
    s.total += 1;
    if (r.isCorrect) s.correct += 1;
  }
  return categories.map((c) => stats.get(c)!);
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
