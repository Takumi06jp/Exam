"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function SetupForm({
  category,
  label,
  total,
}: {
  category: string;
  label: string;
  total: number;
}) {
  const router = useRouter();
  const initial = total === 0 ? 0 : Math.min(10, total);
  const [count, setCount] = useState<number>(initial);

  const start = () => {
    const n = Math.max(1, Math.min(Math.floor(count) || 1, total));
    router.push(
      `/dashboard/Exercise/Question?category=${encodeURIComponent(category)}&limit=${n}`,
    );
  };

  return (
    <div className="min-h-screen p-8 max-w-xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{label} — 出題設定</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            このカテゴリーには {total} 問あります。
          </p>
          <div className="space-y-2">
            <label htmlFor="count" className="text-sm font-medium">
              出題数
            </label>
            <Input
              id="count"
              type="number"
              min={1}
              max={total || 1}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              disabled={total === 0}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {[5, 10, 20, 50].map((n) =>
              n <= total ? (
                <Button
                  key={n}
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setCount(n)}
                >
                  {n}問
                </Button>
              ) : null,
            )}
            {total > 0 && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setCount(total)}
              >
                全て（{total}問）
              </Button>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button onClick={start} disabled={total === 0}>
            開始
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/Exercise">戻る</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
