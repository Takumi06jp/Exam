export type CategoryDef = { code: string; label: string };
export type SubjectDef = { key: string; name: string; categories: CategoryDef[] };

export const subjects: SubjectDef[] = [
  {
    key: "anatomy",
    name: "解剖学",
    categories: [
      { code: "Bone", label: "躯幹骨" },
      { code: "Head", label: "頭蓋骨" },
      { code: "Muscle", label: "筋肉" },
      { code: "Nerve", label: "神経" },
      { code: "Vessel", label: "血管" },
      { code: "Organ", label: "臓器" },
      { code: "Sensory", label: "感覚器" },
      { code: "Peripheral", label: "末梢神経" },
      { code: "Central", label: "中枢神経" },
      { code: "Practice", label: "解剖実習" },
      { code: "HeadL", label: "頭蓋骨（ラテン名）" },
      { code: "HeadE", label: "頭蓋骨（英語名）" },
    ],
  },
  {
    key: "histology",
    name: "組織学",
    categories: [{ code: "Histology", label: "組織学" }],
  },
  {
    key: "biochem",
    name: "生化学",
    categories: [
      { code: "Biochem1", label: "試験1回目" },
      { code: "Biochem2", label: "試験2回目" },
      { code: "Biochem3", label: "試験3回目" },
      { code: "OralBiochem", label: "口腔生化学" },
    ],
  },
  {
    key: "physiology",
    name: "生理学",
    categories: [
      { code: "Physiology1", label: "試験1回目" },
      { code: "Physiology2", label: "試験2回目" },
      { code: "OralPhysiology", label: "口腔生理学" },
    ],
  },
  {
    key: "oral_anatomy",
    name: "口腔解剖学",
    categories: [
      { code: "ToothAnatomy", label: "歯の解剖学" },
      { code: "GeneralHistogenesis", label: "一般組織発生" },
      { code: "OralHistogenesis", label: "口腔組織発生" },
    ],
  },
];

export const allCategoryCodes = subjects.flatMap((s) =>
  s.categories.map((c) => c.code),
);

export function labelOf(code: string): string {
  for (const s of subjects) {
    for (const c of s.categories) if (c.code === code) return c.label;
  }
  return code;
}
