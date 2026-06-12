import { sql } from "drizzle-orm";
import { db } from "@/db/drizzle";

async function main() {
  const r = await db.execute(sql`
    SELECT
      COUNT(*)::int AS total,
      COUNT("lastAnswer")::int AS non_null,
      COUNT(*) FILTER (WHERE "lastAnswer" IS NULL)::int AS null_count
    FROM "answerStats"
  `);
  console.log(r.rows);
}
main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
