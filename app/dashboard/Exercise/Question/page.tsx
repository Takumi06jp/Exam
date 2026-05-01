import fs from "fs";
import path from "path";
import QuizClient from "./_components/QuizClient";

export type QuizQuestion = {
  category: string;
  question: string;
  choices: string[];
  answer: number; // 1-indexed
};

function loadQuestions(): QuizQuestion[] {
  const filePath = path.join(
    process.cwd(),
    "app/dashboard/Exercise/Data/data.js"
  );
  const content = fs
    .readFileSync(filePath, "utf16le")
    .replace(/^\uFEFF/, "");

  const allQuestions: QuizQuestion[] = [];

  // 各行の形式: Question["Category"][n] = ["q", "a1", "a2", "a3", "a4", n];
  const entryRegex =
    /Question\["(\w+)"\]\[\d+\]\s*=\s*\["([^"]*)",\s*"([^"]*)",\s*"([^"]*)",\s*"([^"]*)",\s*"([^"]*)",\s*(\d+)\s*\]/g;

  let match;
  while ((match = entryRegex.exec(content)) !== null) {
    allQuestions.push({
      category: match[1],
      question: match[2],
      choices: [match[3], match[4], match[5], match[6]],
      answer: parseInt(match[7], 10),
    });
  }

  return allQuestions;
}

export default function QuestionPage() {
  const questions = loadQuestions();
  return <QuizClient questions={questions} />;
}
