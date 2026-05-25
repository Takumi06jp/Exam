import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { labelOf } from "../categories";
import { getWrongQuestions } from "./actions";

const choiceLabel = ["①", "②", "③", "④"];

export default async function WrongQuestionsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const wrong = await getWrongQuestions(category);
  const heading = category ? `${labelOf(category)} の間違えた問題` : "間違えた問題一覧";

  return (
    <div className="min-h-screen p-8 max-w-3xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{heading}</h1>
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/Exercise">← Exercise に戻る</Link>
        </Button>
      </div>

      {wrong.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            最新の解答で誤答だった問題はありません。
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {wrong.length} 問（問題ごとに最新の解答のみ表示）
          </p>
          {wrong.map((q) => (
            <Card key={q.id} className="w-full">
              <CardHeader>
                <Badge variant="outline" className="w-fit mb-2">
                  {labelOf(q.category)}
                </Badge>
                <CardTitle className="text-base leading-relaxed">
                  {q.question}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {q.choices.map((choice, i) => {
                  const choiceNum = i + 1;
                  const isAnswer = choiceNum === q.answer;
                  const isUserChoice = choiceNum === q.userAnswer;
                  let cls =
                    "border rounded-md px-3 py-2 text-sm flex items-start gap-2";
                  if (isAnswer)
                    cls += " border-green-600 bg-green-50 dark:bg-green-950";
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
                <p className="text-xs text-muted-foreground pt-1">
                  解答日時：{q.answeredAt.toLocaleString("ja-JP")}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
