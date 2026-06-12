import { sql } from "drizzle-orm";
import { db } from "@/db/drizzle";

async function main() {
  // 新クエリ: answerStats を直接 GROUP BY
  const fromStats = await db.execute(sql`
    SELECT
      "Qcategory",
      COUNT(*)::int                                AS total,
      COUNT(*) FILTER (WHERE "lastIsCorrect")::int AS correct
    FROM "answerStats"
    GROUP BY "Qcategory"
    ORDER BY "Qcategory"
  `);

  // 旧ロジック相当: answers から (userId, questionId) ごとに最新行だけ採用して集計
  const fromAnswers = await db.execute(sql`
    WITH latest AS (
      SELECT DISTINCT ON ("userId","questionId")
        "Qcategory", "isCorrect"
      FROM answers
      ORDER BY "userId", "questionId", "createdAt" DESC
    )
    SELECT
      "Qcategory",
      COUNT(*)::int                            AS total,
      COUNT(*) FILTER (WHERE "isCorrect")::int AS correct
    FROM latest
    GROUP BY "Qcategory"
    ORDER BY "Qcategory"
  `);

  console.log("[new] answerStats GROUP BY:");
  console.table(fromStats.rows);
  console.log("[old] answers latest-per-question GROUP BY:");
  console.table(fromAnswers.rows);

  type Row = { Qcategory: string; total: number; correct: number };
  const a = new Map((fromStats.rows as Row[]).map((r) => [r.Qcategory, r]));
  const b = new Map((fromAnswers.rows as Row[]).map((r) => [r.Qcategory, r]));

  const keys = new Set([...a.keys(), ...b.keys()]);
  let mismatches = 0;
  for (const k of keys) {
    const x = a.get(k);
    const y = b.get(k);
    if (
      !x || !y ||
      x.total !== y.total ||
      x.correct !== y.correct
    ) {
      mismatches += 1;
      console.log(`  ⚠ mismatch on ${k}: new=${JSON.stringify(x)} old=${JSON.stringify(y)}`);
    }
  }
  console.log(
    mismatches === 0
      ? `✓ all ${keys.size} categories match between answerStats and answers`
      : `✗ ${mismatches} mismatches found`,
  );
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
