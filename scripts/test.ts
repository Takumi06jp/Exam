import { sql }  from "drizzle-orm";
import { db } from "@/db/drizzle";
import account from "@/db/schema";

async function main(){
    const result = await db.select({ id: account.id }).from(account);

    console.log(result);
}

main();