"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import type { CategoryStat } from "../actions";
import {
  resetAllAnswers,
  resetCategoryAnswers,
  resetSubjectAnswers,
} from "../actions";
import type { SubjectDef } from "../categories";

type Props = {
  subjects: SubjectDef[];
  statsByCode: Record<string, CategoryStat>;
};

export default function ResultsTabs({ subjects, statsByCode }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function run(action: () => Promise<void>, confirmMsg?: string) {
    if (confirmMsg && !window.confirm(confirmMsg)) return;
    startTransition(async () => {
      await action();
      router.refresh();
    });
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">前回までの結果一覧</h2>
      <Tabs defaultValue={subjects[0]?.key}>
        <TabsList>
          {subjects.map((s) => (
            <TabsTrigger key={s.key} value={s.key}>
              {s.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {subjects.map((s) => {
          const codes = s.categories.map((c) => c.code);
          const subjectTotal = codes.reduce(
            (acc, c) => acc + (statsByCode[c]?.total ?? 0),
            0,
          );
          return (
            <TabsContent key={s.key} value={s.key}>
              <Card>
                <CardHeader>
                  <CardTitle>{s.name}</CardTitle>
                  <CardDescription>
                    {s.name}の問題に関する結果
                  </CardDescription>
                </CardHeader>
                {s.categories.map((c) => {
                  const stat = statsByCode[c.code] ?? {
                    category: c.code,
                    correct: 0,
                    total: 0,
                  };
                  const pct =
                    stat.total > 0
                      ? Math.round((stat.correct / stat.total) * 100)
                      : 0;
                  const unanswered = stat.total === 0;
                  return (
                    <CardContent key={c.code}>
                      <h3 className="text-md font-bold mb-2">{c.label}</h3>
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex-1 min-w-[160px]">
                          <Progress value={pct} />
                        </div>
                        {unanswered ? (
                          <Badge variant="secondary">未回答</Badge>
                        ) : (
                          <span className="text-sm font-bold whitespace-nowrap">
                            正答率：{pct}%（{stat.correct}/{stat.total}）
                          </span>
                        )}
                        <Button asChild variant="outline" size="sm">
                          <Link
                            href={`/dashboard/Exercise/Wrong?category=${c.code}`}
                          >
                            間違えた問題
                          </Link>
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={unanswered || isPending}
                          onClick={() =>
                            run(
                              () => resetCategoryAnswers(c.code),
                              `${c.label} の履歴をリセットしますか？`,
                            )
                          }
                        >
                          リセット
                        </Button>
                      </div>
                    </CardContent>
                  );
                })}
                <CardFooter>
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={subjectTotal === 0 || isPending}
                    onClick={() =>
                      run(
                        () => resetSubjectAnswers(codes),
                        `${s.name} の全カテゴリの履歴を削除しますか？`,
                      )
                    }
                  >
                    全て消去
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
      <div className="mt-4 flex flex-wrap gap-4">
        <Button
          variant="destructive"
          size="sm"
          disabled={isPending}
          onClick={() =>
            run(
              () => resetAllAnswers(),
              "すべての結果を初期化しますか？この操作は取り消せません。",
            )
          }
        >
          すべての結果を初期化する
        </Button>
      </div>
    </div>
  );
}
