export type ScoreKey =
  | "targetFitScore"
  | "competitorThreatScore"
  | "differentiationScore"
  | "marketOpportunityScore";

export type ScoreLevel = "veryHigh" | "high" | "medium" | "low";
export type ScoreColor = "green" | "blue" | "yellow" | "red";

export type ScoreCriterionDefinition = {
  label: string;
  maxScore: number;
};

export const scoreOrder: ScoreKey[] = [
  "targetFitScore",
  "competitorThreatScore",
  "differentiationScore",
  "marketOpportunityScore",
];

export const scoreDefinitions: Record<
  ScoreKey,
  {
    label: string;
    description: string;
    criteria: ScoreCriterionDefinition[];
  }
> = {
  targetFitScore: {
    label: "타겟 적합도",
    description: "제품 메시지와 핵심 고객군의 문제, 구매력, 도달 가능성을 종합 평가합니다.",
    criteria: [
      { label: "문제 강도", maxScore: 25 },
      { label: "구매력", maxScore: 20 },
      { label: "제품 필요성", maxScore: 25 },
      { label: "광고 도달 가능성", maxScore: 15 },
      { label: "반복 구매 가능성", maxScore: 15 },
    ],
  },
  competitorThreatScore: {
    label: "경쟁사 위협도",
    description: "경쟁사가 현재 시장에서 얼마나 강한 대체 선택지로 작동하는지 평가합니다.",
    criteria: [
      { label: "브랜드 인지도", maxScore: 25 },
      { label: "제품 유사도", maxScore: 25 },
      { label: "가격 경쟁력", maxScore: 15 },
      { label: "채널 장악력", maxScore: 20 },
      { label: "메시지 명확성", maxScore: 15 },
    ],
  },
  differentiationScore: {
    label: "차별화 점수",
    description: "USP가 경쟁사 대비 명확하고 타겟 고민과 연결되는 정도를 평가합니다.",
    criteria: [
      { label: "USP 명확성", maxScore: 30 },
      { label: "경쟁사 대비 차별성", maxScore: 30 },
      { label: "타겟 고민과의 연결성", maxScore: 25 },
      { label: "메시지 확장성", maxScore: 15 },
    ],
  },
  marketOpportunityScore: {
    label: "시장 기회 점수",
    description: "카테고리 성장성, 수요 강도, 경쟁 공백, 채널 확장성을 평가합니다.",
    criteria: [
      { label: "카테고리 성장성", maxScore: 25 },
      { label: "타겟 수요 강도", maxScore: 25 },
      { label: "경쟁 공백", maxScore: 20 },
      { label: "채널 확장 가능성", maxScore: 15 },
      { label: "콘텐츠 확장 가능성", maxScore: 15 },
    ],
  },
};

export const scoreColorClasses: Record<
  ScoreColor,
  {
    badge: string;
    bar: string;
    soft: string;
    text: string;
    ring: string;
  }
> = {
  green: {
    badge: "bg-emerald-50 text-emerald-700",
    bar: "from-emerald-500 to-green-400",
    soft: "bg-emerald-50",
    text: "text-emerald-700",
    ring: "ring-emerald-100",
  },
  blue: {
    badge: "bg-blue-50 text-blue-700",
    bar: "from-blue-600 to-cyan-500",
    soft: "bg-blue-50",
    text: "text-blue-700",
    ring: "ring-blue-100",
  },
  yellow: {
    badge: "bg-yellow-50 text-yellow-700",
    bar: "from-yellow-400 to-amber-400",
    soft: "bg-yellow-50",
    text: "text-yellow-700",
    ring: "ring-yellow-100",
  },
  red: {
    badge: "bg-rose-50 text-rose-700",
    bar: "from-rose-500 to-red-400",
    soft: "bg-rose-50",
    text: "text-rose-700",
    ring: "ring-rose-100",
  },
};

export function getScoreLevel(score: number): ScoreLevel {
  if (score >= 85) return "veryHigh";
  if (score >= 70) return "high";
  if (score >= 50) return "medium";
  return "low";
}

export function getScoreColor(score: number): ScoreColor {
  const level = getScoreLevel(score);

  if (level === "veryHigh") return "green";
  if (level === "high") return "blue";
  if (level === "medium") return "yellow";
  return "red";
}

export function getScoreLabel(score: number) {
  const level = getScoreLevel(score);

  if (level === "veryHigh") return "매우 높음";
  if (level === "high") return "높음";
  if (level === "medium") return "보통";
  return "낮음";
}
