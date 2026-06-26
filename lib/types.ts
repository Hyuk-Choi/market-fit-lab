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

export type ConfidenceLevel = "High" | "Medium" | "Low";

export type EvidenceCheck = {
  label: string;
  score: number;
  confidence: ConfidenceLevel;
  finding: string;
  implication: string;
};

export type SourceEvidence = {
  sourceName: string;
  sourceType: "Official" | "Retail" | "Market" | "Internal";
  confidence: ConfidenceLevel;
  verifiedFact: string;
  implication: string;
  url?: string;
};

export type ValidationTask = {
  priority: "High" | "Medium" | "Low";
  task: string;
  reason: string;
};

export type ResearchStageStatus = "Ready" | "Needs Validation" | "Insufficient";

export type ResearchStage = {
  stage: string;
  score: number;
  status: ResearchStageStatus;
  finding: string;
  requiredEvidence: string[];
  impact: string;
};

export type ResearchReview = {
  readinessScore: number;
  verdict: string;
  methodology: string;
  stages: ResearchStage[];
  minimumEvidence: string[];
  missingEvidence: string[];
  assumptions: string[];
  recommendedResearch: ValidationTask[];
};

export type RecommendationPriority = "Primary" | "Secondary" | "Test";

export type TargetRecommendation = {
  segmentName: string;
  priority: RecommendationPriority;
  selectionScore: number;
  confidence: ConfidenceLevel;
  rationale: string;
  evidence: string[];
  recommendedUse: string;
  criteria: ScoreCriterionResult[];
};

export type CompetitorRecommendation = {
  brandName: string;
  role: string;
  priority: RecommendationPriority;
  selectionScore: number;
  confidence: ConfidenceLevel;
  rationale: string;
  evidence: string[];
  watchPoint: string;
  criteria: ScoreCriterionResult[];
};

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
  researchReview?: ResearchReview;
  reliabilityReview: {
    overallScore: number;
    verdict: string;
    summary: string;
    evidenceChecks: EvidenceCheck[];
    sourceEvidence: SourceEvidence[];
    strengths: string[];
    limitations: string[];
    accuracySafeguards: string[];
    validationTasks: ValidationTask[];
  };
  selectionRecommendations: {
    summary: string;
    selectionPrinciple: string;
    targetRecommendations: TargetRecommendation[];
    competitorRecommendations: CompetitorRecommendation[];
  };
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
