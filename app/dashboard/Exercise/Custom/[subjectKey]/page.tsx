import { notFound } from "next/navigation";
import { db } from "@/db/drizzle";
import { questions } from "@/db/schema";
import { inArray } from "drizzle-orm";
import { subjects } from "../../categories";
import CustomSetupForm from "../_components/CustomSetupForm";

export default async function SubjectCustomPage({
  params,
}: {
  params: { subjectKey: string };
}) {
  const { subjectKey } = params;
  const subject = subjects.find((s) => s.key === subjectKey);
  if (!subject) notFound();

  const codes = subject.categories.map((c) => c.code);
  const rows = codes.length
    ? await db
        .select({ category: questions.category })
        .from(questions)
        .where(inArray(questions.category, codes))
    : [];

  const countByCategory = new Map<string, number>();
  for (const r of rows) {
    countByCategory.set(r.category, (countByCategory.get(r.category) ?? 0) + 1);
  }

  const groups = subject.categories.map((c) => ({
    key: c.code,
    name: c.label,
    categories: [c.code],
    total: countByCategory.get(c.code) ?? 0,
  }));

  return (
    <CustomSetupForm
      groups={groups}
      title={`カスタム出題 — ${subject.name}`}
      unitLabel="分野"
      backHref="/dashboard/Exercise"
    />
  );
}
