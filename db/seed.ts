import fs from 'fs';
import path from 'path';

import {db} from './drizzle';
import {questions} from './schema';

//Question["Head"][0] = ["次のうち眼窩を構成する骨ではないものは？", "鼻骨", "口蓋骨", "蝶形骨", "上顎骨", 1];
type Row = {
  category: string;
  languages: string;
  question: string;
  choices: string[];
  answer: string;
};

function numberToLetter(num: string | number): string {
    return String.fromCharCode(96 + Number(num));
}

function loadFromDataJs(): Row[] {
    const filePath = path.join(process.cwd(), "app/dashboard/Exercise/Data/data.js");
    const content = fs
        .readFileSync(filePath, "utf16le")
        .replace(/^\uFEFF/, "");
    const entryRegex =
        /Question\["([^"]+)"\]\[\d+\]\s*=\s*\["([^"]+)",\s*"([^"]+)",\s*"([^"]+)",\s*"([^"]+)",\s*"([^"]+)",\s*(\d+)\];/g;
    const Rows: Row[] = [];
    let match;
    while ((match = entryRegex.exec(content)) !== null) {
        Rows.push({
            category: match[1],
            languages: "ja",
            question: match[2],
            choices: [match[3], match[4], match[5], match[6]],
            answer: numberToLetter(match[7]),
        });
    }
    return Rows;
}

async function main() {
    const Rows = loadFromDataJs();
    console.log(Rows.length);
    await db.delete(questions);
    console.log("Deleted existing questions");
    await db.insert(questions).values(Rows);
}

main();