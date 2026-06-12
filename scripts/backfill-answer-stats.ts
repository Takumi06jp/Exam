import { sql } from "drizzle-orm";
import { db } from "@/db/drizzle";

async function main() {
  const before = await db.execute(sql`SELECT COUNT(*)::int AS n FROM "answerStats"`);
  console.log(`[before] answerStats rows: ${(before.rows[0] as { n: number }).n}`);

  const sourceCount = await db.execute(
    sql`SELECT COUNT(DISTINCT ("userId","questionId"))::int AS n FROM answers`,
  );
  console.log(
    `[source] unique (userId,questionId) in answers: ${(sourceCount.rows[0] as { n: number }).n}`,
  );

  await db.execute(sql`
    WITH aggregated AS (
      SELECT
        "userId",
        "questionId",
        MIN("Qcategory") AS "Qcategory",
        COUNT(*) FILTER (WHERE "isCorrect")     AS correct_count,
        COUNT(*) FILTER (WHERE NOT "isCorrect") AS incorrect_count,
        MAX("createdAt")                        AS updated_at
      FROM answers
      GROUP BY "userId", "questionId"
    ),
    latest AS (
      SELECT DISTINCT ON ("userId","questionId")
        "userId", "questionId", "isCorrect" AS last_is_correct
      FROM answers
      ORDER BY "userId", "questionId", "createdAt" DESC
    )
    INSERT INTO "answerStats"
      ("userId","questionId","Qcategory","correctCount","incorrectCount","lastIsCorrect","updatedAt")
    SELECT
      a."userId", a."questionId", a."Qcategory",
      a.correct_count, a.incorrect_count,
      l.last_is_correct, a.updated_at
    FROM aggregated a
    JOIN latest l USING ("userId","questionId")
    ON CONFLICT ("userId","questionId") DO UPDATE SET
      "Qcategory"      = EXCLUDED."Qcategory",
      "correctCount"   = EXCLUDED."correctCount",
      "incorrectCount" = EXCLUDED."incorrectCount",
      "lastIsCorrect"  = EXCLUDED."lastIsCorrect",
      "updatedAt"      = EXCLUDED."updatedAt"
  `);

  const after = await db.execute(sql`SELECT COUNT(*)::int AS n FROM "answerStats"`);
  console.log(`[after]  answerStats rows: ${(after.rows[0] as { n: number }).n}`);

  const sample = await db.execute(sql`
    SELECT "userId","questionId","Qcategory","correctCount","incorrectCount","lastIsCorrect"
    FROM "answerStats"
    ORDER BY "updatedAt" DESC
    LIMIT 5
  `);
  console.log("[sample] top 5 by updatedAt:");
  console.table(sample.rows);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
