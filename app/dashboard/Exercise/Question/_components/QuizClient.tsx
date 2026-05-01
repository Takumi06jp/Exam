"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { QuizQuestion } from "../page";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const categoryLabel: Record<string, string> = {
  Head: "頭部",
  HeadL: "頭部（靭帯）",
  HeadE: "頭部（実習）",
  Artery: "動脈",
};

const choiceLabel = ["①", "②", "③", "④"];

export default function QuizClient({
  questions,
}: {
  questions: QuizQuestion[];
}) {
  const [shuffled, setShuffled] = useState(() => shuffle(questions));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const current = shuffled[currentIndex];
  const isAnswered = selected !== null;
  const isCorrect = selected === current?.answer;

  function handleSelect(choiceNum: number) {
    if (isAnswered) return;
    setSelected(choiceNum);
    if (choiceNum === current.answer) {
      setScore((s) => s + 1);
    }
  }

  function handleNext() {
    if (currentIndex + 1 >= shuffled.length) {
      setFinished(true);
    } else {
      setCurrentIndex((i) => i + 1);
      setSelected(null);
    }
  }

  function handleRestart() {
    setShuffled(shuffle(questions));
    setCurrentIndex(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  }

  if (finished) {
    const pct = Math.round((score / shuffled.length) * 100);
    return (
      <div className="flex items-center justify-center min-h-screen p-8">
        <Card className="w-full max-w-xl">
          <CardHeader>
            <CardTitle className="text-2xl">結果</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg">
              {score} / {shuffled.length} 問正解（{pct}%）
            </p>
            <Progress value={pct} />
          </CardContent>
          <CardFooter>
            <Button onClick={handleRestart}>もう一度</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen p-8 max-w-2xl mx-auto">
      <div className="w-full mb-2 flex justify-between text-sm text-muted-foreground">
        <span>
          {currentIndex + 1} / {shuffled.length}
        </span>
        <span>正解: {score}</span>
      </div>
      <Progress
        value={(currentIndex / shuffled.length) * 100}
        className="w-full mb-6"
      />

      <Card className="w-full">
        <CardHeader>
          <Badge variant="outline" className="w-fit mb-2">
            {categoryLabel[current.category] ?? current.category}
          </Badge>
          <CardTitle className="text-lg leading-relaxed">
            {current.question}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {current.choices.map((choice, i) => {
            const choiceNum = i + 1;
            let variant: "default" | "outline" | "destructive" =
              "outline";
            if (isAnswered) {
              if (choiceNum === current.answer) variant = "default";
              else if (choiceNum === selected) variant = "destructive";
            }
            return (
              <Button
                key={i}
                variant={variant}
                className="w-full justify-start h-auto py-3 px-4 text-left whitespace-normal"
                onClick={() => handleSelect(choiceNum)}
                disabled={isAnswered}
              >
                <span className="mr-2 font-bold shrink-0">
                  {choiceLabel[i]}
                </span>
                {choice}
              </Button>
            );
          })}
        </CardContent>

        {isAnswered && (
          <CardFooter className="flex flex-col items-start gap-3">
            <p
              className={`font-bold text-lg ${isCorrect ? "text-green-600" : "text-red-600"}`}
            >
              {isCorrect
                ? "正解！"
                : `不正解 — 正解は ${choiceLabel[current.answer - 1]}`}
            </p>
            <Button onClick={handleNext}>
              {currentIndex + 1 >= shuffled.length
                ? "結果を見る"
                : "次の問題"}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
