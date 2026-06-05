"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type SubjectSummary = {
  key: string;
  name: string;
  categories: string[];
  total: number;
};

type Filter = "random" | "unanswered" | "incorrect";

export default function CustomSetupForm({
  subjects,
}: {
  subjects: SubjectSummary[];
}) {
  const router = useRouter();
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [count, setCount] = useState<number>(10);
  const [filter, setFilter] = useState<Filter>("random");

  const selectedSubjects = useMemo(
    () => subjects.filter((s) => selectedKeys.has(s.key)),
    [subjects, selectedKeys],
  );
  const selectedTotal = selectedSubjects.reduce((sum, s) => sum + s.total, 0);
  const selectedCategories = selectedSubjects.flatMap((s) => s.categories);

  const toggle = (key: string) => {
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const start = () => {
    if (selectedCategories.length === 0 || selectedTotal === 0) return;
    const n = Math.max(1, Math.min(Math.floor(count) || 1, selectedTotal));
    const params = new URLSearchParams();
    params.set("categories", selectedCategories.join(","));
    params.set("limit", String(n));
    params.set("filter", filter);
    router.push(`/dashboard/Exercise/Question?${params.toString()}`);
  };

  return (
    <div className="min-h-screen p-8 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>カスタム出題 — 全教科横断</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <p className="text-sm font-medium">出題する教科を選択</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {subjects.map((s) => {
                const disabled = s.total === 0;
                const checked = selectedKeys.has(s.key);
                return (
                  <label
                    key={s.key}
                    className={`flex items-center gap-2 rounded-md border p-3 ${
                      disabled ? "opacity-50" : "cursor-pointer hover:bg-accent"
                    }`}
                  >
                    <Checkbox
                      checked={checked}
                      disabled={disabled}
                      onCheckedChange={() => toggle(s.key)}
                    />
                    <span className="flex-1 text-sm">{s.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {s.total}問
                    </span>
                  </label>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              選択中: {selectedSubjects.length}教科 / 計 {selectedTotal} 問
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="count">出題数</Label>
            <Input
              id="count"
              type="number"
              min={1}
              max={selectedTotal || 1}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              disabled={selectedTotal === 0}
            />
            <div className="flex flex-wrap gap-2">
              {[10, 20, 50, 100].map((n) =>
                n <= selectedTotal ? (
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
              {selectedTotal > 0 && (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setCount(selectedTotal)}
                >
                  全て（{selectedTotal}問）
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="filter">出題優先度</Label>
            <Select value={filter} onValueChange={(v) => setFilter(v as Filter)}>
              <SelectTrigger id="filter">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="random">ランダム</SelectItem>
                <SelectItem value="unanswered">未回答を優先</SelectItem>
                <SelectItem value="incorrect">不正解を優先</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              未回答/不正解優先を選ぶと、対象が足りない分はランダムで補充されます。
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button
            onClick={start}
            disabled={selectedTotal === 0 || selectedCategories.length === 0}
          >
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
