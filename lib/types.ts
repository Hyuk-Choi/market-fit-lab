import type { ScoreKey } from "@/lib/scoring";

export type ProjectInput = {
  brandName: string;
  productName: string;
  category: string;
  priceRange: string;
  productDescription: string;
  keyFeatures: string;
  currentTarget: string;
  competitors: string;
  marketingGoal: string;
};

export type ScoreCriterionResult = {
  label: string;
  score: number;
  maxScore: number;
};

export type ScoreCardMetric = {
  score: number;
  reason: string;
  criteria: ScoreCriterionResult[];
};

export type ScoreCards = Record<ScoreKey, ScoreCardMetric>;

export type TargetSegment = {
  name: string;
  description: string;
  fitScore: number;
  reason: string;
  recommendedMessage: string;
};

export type CompetitorProfile = {
  name: string;
  priceLevel: string;
  usp: string;
  strength: string;
  weakness: string;
  threatScore: number;
  messageTone: string;
  channel: string;
};

export type PositioningPoint = {
  name: string;
  x: number;
  y: number;
  type: "ourBrand" | "competitor";
};

export type MarketingAnalysis = {
  executiveSummary: {
    oneLineInsight: string;
    keyFinding: string;
    recommendedDirection: string;
    risk: string;
  };
  scoreCards: ScoreCards;
  targetAnalysis: {
    summary: string;
    coreTarget: string;
    subTarget: string;
    persona: {
      name: string;
      age: number;
      job: string;
      lifestyle: string;
      painPoints: string[];
      purchaseMotivations: string[];
      purchaseBarriers: string[];
      mediaChannels: string[];
    };
    targetSegments: TargetSegment[];
  };
  competitorAnalysis: {
    summary: string;
    competitors: CompetitorProfile[];
    insight: string;
  };
  positioning: {
    xAxis: string;
    yAxis: string;
    mapData: PositioningPoint[];
    interpretation: string;
  };
  uspStrategy: {
    summary: string;
    uspList: string[];
    differentiationPoint: string;
    opportunityArea: string;
  };
  messageStrategy: {
    summary: string;
    messages: {
      angle: string;
      mainCopy: string;
      subCopy: string;
      reason: string;
    }[];
  };
  actionPlan: {
    summary: string;
    priorities: {
      priority: "High" | "Medium" | "Low";
      action: string;
      reason: string;
      expectedImpact: string;
    }[];
  };
  finalReport: string;
};
