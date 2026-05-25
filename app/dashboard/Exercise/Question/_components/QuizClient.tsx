"use client";

import { useEffect, useRef, useState } from "react";
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
import { getQuestionsByIds, saveQuizResults } from "../actions";

type AnswerEntry = {
  questionId: number;
  category: string;
  answer: string;
  isCorrect: boolean;
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const categoryLabel: Record<string, string> = {
  Head: "頭蓋骨",
  HeadL: "頭部(ラテン語)",
  HeadE: "頭部（英語）",
  Artery: "動脈",
  Bone: "躯幹骨",
  Muscle: "筋肉",
  Nerve: "神経",
  Vessel: "血管",
  Organ: "臓器",
  Sensory: "感覚器",
  Peripheral: "末梢神経",
  Central: "中枢神経",
  Practice: "解剖実習",
  Histology: "組織学",
  Biochem1: "生化学 試験1回目",
  Biochem2: "生化学 試験2回目",
  Biochem3: "生化学 試験3回目",
  OralBiochem: "口腔生化学",
  Physiology1: "生理学 試験1回目",
  Physiology2: "生理学 試験2回目",
  OralPhysiology: "口腔生理学",
  ToothAnatomy: "歯の解剖学",
  GeneralHistogenesis: "一般組織発生",
  OralHistogenesis: "口腔組織発生",
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
  const [answeredCount, setAnsweredCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [endedEarly, setEndedEarly] = useState(false);
  const [wrongAnswers, setWrongAnswers] = useState<
    { id: number; selected: number }[]
  >([]);
  const [allAnswers, setAllAnswers] = useState<AnswerEntry[]>([]);
  const [wrongDetails, setWrongDetails] = useState<QuizQuestion[] | null>(null);
  const [loadingWrong, setLoadingWrong] = useState(false);
  const saveCalledRef = useRef(false);

  const current = shuffled[currentIndex];
  const isAnswered = selected !== null;
  const isCorrect = selected === current?.answer;

  function handleSelect(choiceNum: number) {
    if (isAnswered) return;
    setSelected(choiceNum);
    setAnsweredCount((c) => c + 1);
    const correct = choiceNum === current.answer;
    setAllAnswers((arr) => [
      ...arr,
      {
        questionId: current.id,
        category: current.category,
        answer: String.fromCharCode(96 + choiceNum),
        isCorrect: correct,
      },
    ]);
    if (correct) {
      setScore((s) => s + 1);
    } else {
      setWrongAnswers((arr) => [
        ...arr,
        { id: current.id, selected: choiceNum },
      ]);
    }
  }

  useEffect(() => {
    if (!finished) return;
    if (wrongAnswers.length === 0) {
      setWrongDetails([]);
      return;
    }
    let cancelled = false;
    setLoadingWrong(true);
    getQuestionsByIds(wrongAnswers.map((w) => w.id))
      .then((rows) => {
        if (!cancelled) setWrongDetails(rows);
      })
      .finally(() => {
        if (!cancelled) setLoadingWrong(false);
      });
    return () => {
      cancelled = true;
    };
  }, [finished, wrongAnswers]);

  useEffect(() => {
    if (!finished || saveCalledRef.current) return;
    if (allAnswers.length === 0) return;
    saveCalledRef.current = true;
    saveQuizResults(allAnswers).catch((err) => {
      console.error("Failed to save quiz results:", err);
    });
  }, [finished, allAnswers]);

  function handleNext() {
    if (currentIndex + 1 >= shuffled.length) {
      setFinished(true);
    } else {
      setCurrentIndex((i) => i + 1);
      setSelected(null);
    }
  }

  function handleFinishEarly() {
    if (finished) return;
    if (!window.confirm("ここまでで終了しますか？")) return;
    setEndedEarly(true);
    setFinished(true);
  }

  function handleRestart() {
    setShuffled(shuffle(questions));
    setCurrentIndex(0);
    setSelected(null);
    setScore(0);
    setAnsweredCount(0);
    setFinished(false);
    setEndedEarly(false);
    setWrongAnswers([]);
    setAllAnswers([]);
    setWrongDetails(null);
    saveCalledRef.current = false;
  }
  function handleQuit() {
    //dashboard/Exercise/に戻る
    window.location.href = "/dashboard/Exercise/";
  }

  if (finished) {
    const denom = endedEarly ? answeredCount : shuffled.length;
    const pct = denom > 0 ? Math.round((score / denom) * 100) : 0;
    const selectedById = new Map(
      wrongAnswers.map((w) => [w.id, w.selected]),
    );
    return (
      <div className="flex flex-col items-center min-h-screen p-8 max-w-2xl mx-auto gap-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl">
              {endedEarly ? "途中結果" : "結果"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {denom > 0 ? (
              <>
                <p className="text-lg">
                  {score} / {denom} 問正解（{pct}%）
                </p>
                <Progress value={pct} />
              </>
            ) : (
              <p className="text-lg">回答した問題はありません</p>
            )}
            {endedEarly && (
              <p className="text-sm text-muted-foreground">
                全 {shuffled.length} 問中 {answeredCount} 問に回答しました
              </p>
            )}
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button onClick={handleRestart}>もう一度</Button>
            <Button variant="outline" onClick={handleQuit}>終了</Button>
          </CardFooter>
        </Card>

        {wrongAnswers.length > 0 && (
          <div className="w-full space-y-3">
            <h2 className="text-xl font-bold">
              間違えた問題（{wrongAnswers.length}問）
            </h2>
            {loadingWrong && (
              <p className="text-sm text-muted-foreground">読み込み中...</p>
            )}
            {wrongDetails?.map((q) => {
              const userChoice = selectedById.get(q.id);
              return (
                <Card key={q.id} className="w-full">
                  <CardHeader>
                    <Badge variant="outline" className="w-fit mb-2">
                      {categoryLabel[q.category] ?? q.category}
                    </Badge>
                    <CardTitle className="text-base leading-relaxed">
                      {q.question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {q.choices.map((choice, i) => {
                      const choiceNum = i + 1;
                      const isAnswer = choiceNum === q.answer;
                      const isUserChoice = choiceNum === userChoice;
                      let cls =
                        "border rounded-md px-3 py-2 text-sm flex items-start gap-2";
                      if (isAnswer)
                        cls +=
                          " border-green-600 bg-green-50 dark:bg-green-950";
                      else if (isUserChoice)
                        cls += " border-red-600 bg-red-50 dark:bg-red-950";
                      return (
                        <div key={i} className={cls}>
                          <span className="font-bold shrink-0">
                            {choiceLabel[i]}
                          </span>
                          <span className="flex-1">{choice}</span>
                          {isAnswer && (
                            <span className="text-xs text-green-700 dark:text-green-400 shrink-0">
                              正解
                            </span>
                          )}
                          {isUserChoice && !isAnswer && (
                            <span className="text-xs text-red-700 dark:text-red-400 shrink-0">
                              あなたの解答
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen p-8 max-w-2xl mx-auto">
      <div className="w-full mb-2 flex justify-between items-center text-sm text-muted-foreground">
        <span>
          {currentIndex + 1} / {shuffled.length}
        </span>
        <div className="flex items-center gap-3">
          <span>正解: {score}</span>
          <Button variant="outline" size="sm" onClick={handleFinishEarly}>
            終了する
          </Button>
        </div>
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
