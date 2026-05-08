import { sql }  from "drizzle-orm";
import { db } from "@/db/drizzle";

async function main(){
    const result = await db.execute(sql`
        SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'
        ORDER BY table_name
    `);
    console.log(result);
}

main();