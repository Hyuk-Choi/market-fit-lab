import { mockOpenAIAnalysis } from "@/data/mockOpenAIAnalysis";
import type {
  ConfidenceLevel,
  EvidenceCheck,
  MarketingAnalysis,
  ProjectInput,
  SourceEvidence,
} from "@/lib/types";

export async function getMarketingAnalysis(
  input: ProjectInput,
): Promise<MarketingAnalysis> {
  await new Promise((resolve) => setTimeout(resolve, 700));
  const projectName = `${input.brandName} ${input.productName}`.trim();
  const isOdysseySample = isOdysseyProject(input);
  const inputCompletenessScore = calculateInputCompleteness(input);
  const competitorCoverageScore = calculateCompetitorCoverage(input.competitors);
  const reliabilityPenalty =
    (inputCompletenessScore < 95 ? 4 : 0) +
    (inputCompletenessScore < 80 ? 6 : 0) +
    (competitorCoverageScore < 80 ? 6 : 0) +
    (isOdysseySample ? 0 : 18);
  const adjustedReliabilityScore = clampScore(
    mockOpenAIAnalysis.reliabilityReview.overallScore - reliabilityPenalty,
  );
  const analysis = structuredClone(mockOpenAIAnalysis) as MarketingAnalysis;

  const inputCompletenessCheck: EvidenceCheck = {
    label: "입력 데이터 완성도",
    score: inputCompletenessScore,
    confidence: getConfidenceByScore(inputCompletenessScore),
    finding: buildInputCompletenessFinding(input, inputCompletenessScore),
    implication:
      inputCompletenessScore >= 95
        ? "현재 입력값만으로도 전략 가설 생성에는 충분하나, 실제 예산 집행 전에는 검색량·가격·리뷰·성과 데이터 보강이 필요함."
        : "필수 입력이 부족하면 타겟·경쟁사·포지셔닝 추천이 일반론에 가까워질 수 있으므로 빈 항목을 보완해야 함.",
  };

  const competitorCoverageCheck: EvidenceCheck = {
    label: "경쟁사 입력 커버리지",
    score: competitorCoverageScore,
    confidence: getConfidenceByScore(competitorCoverageScore),
    finding: buildCompetitorCoverageFinding(input.competitors),
    implication:
      competitorCoverageScore >= 85
        ? "직접 경쟁, 기능성 경쟁, 대중형 경쟁, 가격 비교군을 나누어 분석하기에 적합한 수준으로 판단됨."
        : "경쟁사가 적게 입력되면 시장 공백과 위협도 판단이 왜곡될 수 있으므로 최소 3~4개 비교군을 입력하는 것이 적합함.",
  };

  const sampleFitCheck: EvidenceCheck = {
    label: "샘플 분석 적합성",
    score: isOdysseySample ? 92 : 52,
    confidence: isOdysseySample ? "High" : "Low",
    finding: isOdysseySample
      ? "현재 입력값이 오딧세이 블랙 샘플 데이터와 일치해 mock 분석의 타겟·경쟁사·메시지 구조를 그대로 활용해도 무리가 적음."
      : "현재 입력값은 오딧세이 블랙 샘플과 다르므로, 화면의 세부 타겟·경쟁사·메시지는 벤치마크 예시로만 해석해야 함.",
    implication: isOdysseySample
      ? "기획서 초안과 캠페인 가설 수립에 활용 가능하나, 정량 데이터 검증은 별도로 필요함."
      : "다른 브랜드/카테고리 분석에는 실제 OpenAI API 또는 업로드 데이터 기반 분석으로 전환하기 전까지 신뢰도를 보수적으로 봐야 함.",
  };

  const inputSourceEvidence: SourceEvidence = {
    sourceName: "현재 프로젝트 입력값",
    sourceType: "Internal",
    confidence: getConfidenceByScore(inputCompletenessScore),
    verifiedFact: `브랜드/제품: ${projectName || "미입력"}, 카테고리: ${
      input.category || "미입력"
    }, 입력 경쟁사 수: ${splitList(input.competitors).length}개.`,
    implication:
      "앱은 입력값을 분석의 1차 근거로 사용하며, 입력이 구체적일수록 신뢰도와 추천 정확도가 높아짐.",
  };

  analysis.executiveSummary.oneLineInsight = `${projectName}은 ${input.currentTarget}에게 ‘간편하지만 전문적인 관리 루틴’으로 제안하는 것이 적합함.`;
  analysis.reliabilityReview.overallScore = adjustedReliabilityScore;
  analysis.reliabilityReview.verdict = isOdysseySample
    ? analysis.reliabilityReview.verdict
    : `${projectName} 입력은 현재 오딧세이 블랙 샘플 mock 분석과 다르므로, 본 결과는 정확한 자동 분석이라기보다 마케팅 전략 프레임워크 예시로 해석해야 함. 실제 타겟·경쟁사 추천 정확도를 확보하려면 해당 브랜드의 검색량, 리뷰, 가격, 판매 채널, 광고 성과 데이터를 추가해야 함.`;
  analysis.reliabilityReview.evidenceChecks = [
    inputCompletenessCheck,
    competitorCoverageCheck,
    sampleFitCheck,
    ...analysis.reliabilityReview.evidenceChecks.filter(
      (check) =>
        check.label !== "입력 데이터 완성도" &&
        check.label !== "경쟁사 입력 커버리지" &&
        check.label !== "샘플 분석 적합성",
    ),
  ];
  analysis.reliabilityReview.sourceEvidence = [
    inputSourceEvidence,
    ...analysis.reliabilityReview.sourceEvidence,
  ];

  if (!isOdysseySample) {
    analysis.reliabilityReview.limitations = [
      "현재 입력값은 오딧세이 블랙 샘플과 다르므로 세부 페르소나, 경쟁사, 메시지는 벤치마크 예시로만 활용해야 함.",
      ...analysis.reliabilityReview.limitations,
    ];
  }

  const replacedReport = analysis.finalReport.replaceAll(
    "오딧세이 블랙 스페셜 세트",
    projectName || "입력 제품",
  );
  analysis.finalReport = isOdysseySample
    ? replacedReport
    : `> 정확도 주의: 현재 리포트는 오딧세이 블랙 샘플 mock 분석을 ${projectName || "입력 제품"}에 맞게 일부 치환한 결과입니다. 실제 의사결정 전에는 해당 브랜드의 실제 타겟, 경쟁사, 가격, 리뷰, 검색량, 광고 성과 데이터로 재분석해야 합니다.\n\n${replacedReport}`;

  return analysis;
}

function isOdysseyProject(input: ProjectInput) {
  const text = `${input.brandName} ${input.productName}`.toLowerCase();
  return text.includes("odyssey") || text.includes("오딧세이");
}

function calculateInputCompleteness(input: ProjectInput) {
  const fields: (keyof ProjectInput)[] = [
    "brandName",
    "productName",
    "category",
    "priceRange",
    "productDescription",
    "keyFeatures",
    "currentTarget",
    "competitors",
    "marketingGoal",
  ];
  const completed = fields.filter((field) => input[field].trim().length > 0).length;
  const lengthBonus = [
    input.productDescription,
    input.keyFeatures,
    input.currentTarget,
    input.marketingGoal,
  ].filter((value) => value.trim().length >= 12).length;

  return clampScore(Math.round((completed / fields.length) * 82 + lengthBonus * 4.5));
}

function calculateCompetitorCoverage(competitors: string) {
  const count = splitList(competitors).length;
  if (count >= 4) return 92;
  if (count === 3) return 82;
  if (count === 2) return 68;
  if (count === 1) return 48;
  return 25;
}

function buildInputCompletenessFinding(input: ProjectInput, score: number) {
  const missingFields = Object.entries(input)
    .filter(([, value]) => value.trim().length === 0)
    .map(([key]) => key);

  if (missingFields.length === 0) {
    return `브랜드, 제품, 카테고리, 가격대, 기능, 현재 타겟, 경쟁사, 목표가 모두 입력되어 입력 완성도는 ${score}점으로 판단됨.`;
  }

  return `입력 완성도는 ${score}점이며, ${missingFields.join(
    ", ",
  )} 항목이 비어 있어 분석 정확도가 낮아질 수 있음.`;
}

function buildCompetitorCoverageFinding(competitors: string) {
  const competitorNames = splitList(competitors);
  if (competitorNames.length === 0) {
    return "경쟁사가 입력되지 않아 위협도, 포지셔닝, USP 판단이 일반론에 머물 가능성이 높음.";
  }

  return `${competitorNames.join(
    ", ",
  )} 총 ${competitorNames.length}개 경쟁사가 입력되어 비교군 커버리지를 평가함.`;
}

function splitList(value: string) {
  return value
    .split(/[,，、\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function getConfidenceByScore(score: number): ConfidenceLevel {
  if (score >= 85) return "High";
  if (score >= 65) return "Medium";
  return "Low";
}

function clampScore(score: number) {
  return Math.min(Math.max(score, 0), 100);
}
