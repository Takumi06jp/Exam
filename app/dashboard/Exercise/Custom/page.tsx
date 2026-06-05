import { db } from "@/db/drizzle";
import { questions } from "@/db/schema";
import { inArray } from "drizzle-orm";
import { subjects } from "../categories";
import CustomSetupForm from "./_components/CustomSetupForm";

export default async function CustomPage() {
  const rows = await db
    .select({ category: questions.category })
    .from(questions)
    .where(
      inArray(
        questions.category,
        subjects.flatMap((s) => s.categories.map((c) => c.code)),
      ),
    );

  const countByCategory = new Map<string, number>();
  for (const r of rows) {
    countByCategory.set(r.category, (countByCategory.get(r.category) ?? 0) + 1);
  }

  const subjectSummaries = subjects.map((s) => ({
    key: s.key,
    name: s.name,
    categories: s.categories.map((c) => c.code),
    total: s.categories.reduce(
      (sum, c) => sum + (countByCategory.get(c.code) ?? 0),
      0,
    ),
  }));

  return <CustomSetupForm subjects={subjectSummaries} />;
}
