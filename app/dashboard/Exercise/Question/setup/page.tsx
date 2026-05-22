import { db } from "@/db/drizzle";
import { questions } from "@/db/schema";
import { count, eq } from "drizzle-orm";
import SetupForm from "./_components/SetupForm";

const categoryLabel: Record<string, string> = {
  Head: "頭蓋骨",
  HeadL: "頭部（靭帯）",
  HeadE: "頭部（実習）",
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

export default async function SetupPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const { category } = searchParams;
  if (!category) {
    return (
      <div className="min-h-screen p-8 max-w-xl mx-auto">
        カテゴリーが指定されていません。
      </div>
    );
  }
  const result = await db
    .select({ value: count() })
    .from(questions)
    .where(eq(questions.category, category));
  const total = Number(result[0]?.value ?? 0);
  const label = categoryLabel[category] ?? category;
  return <SetupForm category={category} label={label} total={total} />;
}
