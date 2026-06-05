import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { getCategoryStats } from "./actions";
import { allCategoryCodes, subjects } from "./categories";
import ResultsTabs from "./_components/ResultsTabs";

export default async function ExercisePage() {
  const stats = await getCategoryStats(allCategoryCodes);
  const statsByCode = Object.fromEntries(stats.map((s) => [s.category, s]));

  return (
    <div className="min-h-screen p-8 max-w-4xl ml-12">
      <h1 className="text-4xl font-bold mb-8">問題選択</h1>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">問題一覧</h2>
          <Button asChild size="sm">
            <Link href="/dashboard/Exercise/Custom">カスタム出題</Link>
          </Button>
        </div>
        <Tabs defaultValue={subjects[0].key}>
          <TabsList>
            {subjects.map((s) => (
              <TabsTrigger key={s.key} value={s.key}>
                {s.name}
              </TabsTrigger>
            ))}
          </TabsList>
          {subjects.map((s) => (
            <TabsContent key={s.key} value={s.key}>
              <Card>
                <CardHeader>
                  <CardTitle>{s.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4">
                    {s.categories.map((c) => (
                      <Button
                        key={c.code}
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <Link
                          href={`/dashboard/Exercise/Question/setup?category=${c.code}`}
                        >
                          {c.label}
                        </Link>
                      </Button>
                    ))}
                  </div>
                </CardContent>
                {s.key === "anatomy" && (
                  <CardFooter>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        カスタム出題
                      </Button>
                    </div>
                  </CardFooter>
                )}
              </Card>
            </TabsContent>
          ))}
        </Tabs>
        <Separator />
      </div>

      <ResultsTabs subjects={subjects} statsByCode={statsByCode} />
    </div>
  );
}
