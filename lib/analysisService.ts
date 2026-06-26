import { mockOpenAIAnalysis } from "@/data/mockOpenAIAnalysis";
import type {
  CompetitorProfile,
  ConfidenceLevel,
  EvidenceCheck,
  MarketingAnalysis,
  PositioningPoint,
  ProjectInput,
  ScoreCriterionResult,
  SourceEvidence,
  TargetRecommendation,
  TargetSegment,
} from "@/lib/types";

type CategoryProfile = {
  key: string;
  label: string;
  defaultTarget: string;
  personaJob: string;
  personaLifestyle: string;
  corePain: string;
  categoryNeed: string;
  purchaseTrigger: string;
  barrier: string;
  repeatLogic: string;
  mediaChannels: string[];
  searchIntents: string[];
  xAxis: string;
  yAxis: string;
  contentFocus: string;
  competitorRoles: string[];
  messageTone: string[];
};

type PriceTier = "low" | "mid" | "high" | "premium";

const categoryProfiles: CategoryProfile[] = [
  {
    key: "beauty",
    label: "뷰티/스킨케어",
    defaultTarget: "피부 고민을 인지한 자기관리 관심층",
    personaJob: "브랜드/영업/사무직 직장인",
    personaLifestyle:
      "외모와 컨디션이 업무·대인관계 신뢰도에 영향을 준다고 인식하지만, 복잡한 관리 루틴에는 부담을 느끼는 생활 패턴",
    corePain: "피부 컨디션 저하와 관리 루틴 피로",
    categoryNeed: "효능, 사용감, 지속 가능성이 동시에 설득되어야 하는 카테고리",
    purchaseTrigger: "피부 변화 체감, 리뷰 확인, 선물/프로모션 노출",
    barrier: "효능 근거 부족, 가격 장벽, 사용감에 대한 불확실성",
    repeatLogic: "사용감 만족과 체감 효익이 확인되면 반복 구매 가능성이 높음",
    mediaChannels: ["네이버 검색", "쇼핑 리뷰", "인스타그램", "유튜브 리뷰", "브랜드몰"],
    searchIntents: ["효능 확인", "후기 비교", "가격 비교", "사용법 탐색"],
    xAxis: "대중성 ↔ 프리미엄",
    yAxis: "간편 루틴 ↔ 고기능 케어",
    contentFocus: "사용 전후 체감, 루틴 간편성, 리뷰 신뢰",
    competitorRoles: ["프리미엄 기준점", "기능성 전문 경쟁사", "대중형 대체재", "가격 비교군"],
    messageTone: ["전문적", "신뢰 중심", "감각적", "실용적"],
  },
  {
    key: "food",
    label: "식품/음료",
    defaultTarget: "건강과 편의성을 동시에 고려하는 반복 구매 고객",
    personaJob: "바쁜 일정을 가진 직장인 또는 1인 가구",
    personaLifestyle:
      "맛, 건강, 편의성을 모두 고려하지만 매번 식단을 챙기기 어려워 쉽게 반복할 수 있는 선택지를 선호하는 생활 패턴",
    corePain: "건강한 선택과 편의성 사이의 타협",
    categoryNeed: "맛, 성분, 가격, 구매 편의성이 동시에 검증되어야 하는 카테고리",
    purchaseTrigger: "후기, 원재료/성분 확인, 할인 묶음, 정기 구매 제안",
    barrier: "맛에 대한 불확실성, 가격 대비 용량, 성분 신뢰도",
    repeatLogic: "맛과 편의성이 검증되면 루틴형 반복 구매로 이어질 가능성이 높음",
    mediaChannels: ["네이버 쇼핑", "쿠팡", "인스타그램", "숏폼 리뷰", "카카오 선물하기"],
    searchIntents: ["맛 후기", "성분 확인", "칼로리/영양 비교", "대용량/정기구매"],
    xAxis: "대중성 ↔ 프리미엄",
    yAxis: "일상 편의 ↔ 건강 기능",
    contentFocus: "맛 검증, 성분 신뢰, 반복 구매 혜택",
    competitorRoles: ["카테고리 리더", "가격 경쟁 대체재", "기능성 특화 브랜드", "편의 채널 강자"],
    messageTone: ["친근한", "건강 중심", "실용적", "리뷰 중심"],
  },
  {
    key: "digital",
    label: "앱/SaaS/디지털 서비스",
    defaultTarget: "업무 효율과 성과 개선 니즈가 있는 실무자",
    personaJob: "마케팅/운영/기획 실무자",
    personaLifestyle:
      "반복 업무와 의사결정 자료 작성에 시간을 많이 쓰며, 도입 장벽이 낮고 바로 효율을 체감할 수 있는 도구를 선호하는 업무 패턴",
    corePain: "반복 업무, 자료 정리 시간, 성과 판단의 비효율",
    categoryNeed: "명확한 사용 사례, 도입 난이도, 비용 대비 시간 절감 효과가 설득되어야 하는 카테고리",
    purchaseTrigger: "무료 체험, 데모 화면, 업무 시간 절감 사례, 팀 내 공유 가능성",
    barrier: "도입 학습 비용, 기존 툴과의 중복, 보안·데이터 신뢰 우려",
    repeatLogic: "업무 루틴에 들어가면 구독 유지와 팀 확장 가능성이 높음",
    mediaChannels: ["검색광고", "링크드인", "블로그 콘텐츠", "웨비나", "리타겟팅 광고"],
    searchIntents: ["업무 자동화", "툴 비교", "가격/요금제", "템플릿/사례"],
    xAxis: "범용성 ↔ 전문성",
    yAxis: "사용 편의 ↔ 자동화 깊이",
    contentFocus: "데모 화면, 전후 비교, 업무 시간 절감 수치",
    competitorRoles: ["카테고리 표준 툴", "저가 대체재", "전문 기능 경쟁사", "수작업 대안"],
    messageTone: ["명확한", "효율 중심", "전문적", "성과 지향"],
  },
  {
    key: "education",
    label: "교육/클래스",
    defaultTarget: "실무 역량 향상과 전환 성과를 원하는 학습자",
    personaJob: "커리어 전환 또는 역량 강화를 준비하는 직장인",
    personaLifestyle:
      "시간은 제한적이지만 결과가 분명한 학습에 투자하려 하며, 강의 품질과 적용 가능성을 구매 전 꼼꼼히 확인하는 학습 패턴",
    corePain: "학습 시간 부족과 실무 적용 불확실성",
    categoryNeed: "커리큘럼, 강사 신뢰도, 결과물, 후기 근거가 함께 제시되어야 하는 카테고리",
    purchaseTrigger: "커리큘럼 확인, 수강생 후기, 포트폴리오 예시, 한정 모집/혜택",
    barrier: "완강 가능성, 비용 부담, 실제 성과에 대한 의심",
    repeatLogic: "학습 성과를 체감하면 후속 과정과 커뮤니티 참여로 확장 가능함",
    mediaChannels: ["검색광고", "유튜브", "브런치/블로그", "커뮤니티", "이메일 CRM"],
    searchIntents: ["커리큘럼 비교", "후기 확인", "취업/전환 성과", "강사 검증"],
    xAxis: "입문성 ↔ 전문성",
    yAxis: "이론 중심 ↔ 실무 결과물",
    contentFocus: "수강 전후 변화, 결과물, 커리큘럼 구체성",
    competitorRoles: ["대형 교육 플랫폼", "전문 부트캠프", "저가 강의", "무료 콘텐츠 대체재"],
    messageTone: ["실무적", "근거 중심", "동기 부여", "성과 지향"],
  },
  {
    key: "fashion",
    label: "패션/라이프스타일",
    defaultTarget: "취향과 실용성을 함께 고려하는 스타일 관심층",
    personaJob: "트렌드와 실용성을 함께 보는 직장인/크리에이터",
    personaLifestyle:
      "브랜드 무드와 착용 장면을 중요하게 보며, 가격 대비 소재·핏·활용도를 함께 판단하는 소비 패턴",
    corePain: "나에게 맞는 스타일 선택과 가격 대비 만족도 불확실성",
    categoryNeed: "브랜드 무드, 착용 장면, 소재/품질, 스타일 확장성이 설득되어야 하는 카테고리",
    purchaseTrigger: "룩북, 착용 후기, 시즌 기획전, 한정 컬러/협업",
    barrier: "사이즈/핏 불확실성, 가격 대비 품질 우려, 유사 브랜드와의 차별성 부족",
    repeatLogic: "착용 만족과 브랜드 취향 적합성이 확인되면 시즌 반복 구매 가능성이 높음",
    mediaChannels: ["인스타그램", "무신사/패션 플랫폼", "네이버 쇼핑", "숏폼", "리타겟팅 광고"],
    searchIntents: ["착용 후기", "사이즈/핏", "가격 비교", "코디 예시"],
    xAxis: "대중성 ↔ 희소성",
    yAxis: "실용성 ↔ 패션성",
    contentFocus: "착용 장면, 스타일링, 소재/핏 신뢰",
    competitorRoles: ["트렌드 리더", "가격 대체재", "품질 비교군", "플랫폼 인기 브랜드"],
    messageTone: ["감각적", "선명한", "취향 중심", "실용적"],
  },
  {
    key: "generic",
    label: "일반 소비재/서비스",
    defaultTarget: "명확한 문제를 인지하고 대안을 비교하는 고객",
    personaJob: "구매 의사결정권을 가진 실무자 또는 소비자",
    personaLifestyle:
      "문제를 해결할 대안을 비교하며, 가격·후기·기능·신뢰도를 종합해 합리적으로 구매를 결정하는 패턴",
    corePain: "기존 선택지의 불편과 더 나은 대안 탐색",
    categoryNeed: "문제 해결력, 가격 수용성, 신뢰 근거, 경쟁 대체 가능성이 설득되어야 하는 카테고리",
    purchaseTrigger: "문제 인식, 후기 확인, 가격 비교, 명확한 혜택 제안",
    barrier: "차별성 부족, 가격 부담, 효과에 대한 불확실성",
    repeatLogic: "초기 만족이 확인되면 추천·재구매·확장 구매 가능성이 존재함",
    mediaChannels: ["검색광고", "네이버 쇼핑", "블로그 리뷰", "디스플레이 광고", "CRM"],
    searchIntents: ["추천", "후기", "비교", "가격", "문제 해결"],
    xAxis: "대중성 ↔ 전문성",
    yAxis: "가격 접근성 ↔ 가치 프리미엄",
    contentFocus: "문제 해결, 비교 우위, 후기 신뢰",
    competitorRoles: ["직접 경쟁사", "가격 비교군", "기능 대체재", "카테고리 리더"],
    messageTone: ["명확한", "실용적", "신뢰 중심", "전환 지향"],
  },
];

export async function getMarketingAnalysis(
  input: ProjectInput,
): Promise<MarketingAnalysis> {
  await new Promise((resolve) => setTimeout(resolve, 700));

  if (isOdysseyProject(input)) {
    return buildOdysseyAnalysis(input);
  }

  return buildAdaptiveAnalysis(input);
}

function buildOdysseyAnalysis(input: ProjectInput): MarketingAnalysis {
  const projectName = getProjectName(input);
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
    score: 92,
    confidence: "High",
    finding:
      "현재 입력값이 오딧세이 블랙 샘플 데이터와 일치해 mock 분석의 타겟·경쟁사·메시지 구조를 그대로 활용해도 무리가 적음.",
    implication:
      "기획서 초안과 캠페인 가설 수립에 활용 가능하나, 정량 데이터 검증은 별도로 필요함.",
  };

  const inputSourceEvidence = buildInputSourceEvidence(input, inputCompletenessScore);

  analysis.executiveSummary.oneLineInsight = `${projectName}은 ${input.currentTarget}에게 ‘간편하지만 전문적인 관리 루틴’으로 제안하는 것이 적합함.`;
  analysis.reliabilityReview.overallScore = adjustedReliabilityScore;
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

  analysis.finalReport = analysis.finalReport.replaceAll(
    "오딧세이 블랙 스페셜 세트",
    projectName || "입력 제품",
  );

  return analysis;
}

function buildAdaptiveAnalysis(input: ProjectInput): MarketingAnalysis {
  const projectName = getProjectName(input);
  const brandName = input.brandName.trim() || "입력 브랜드";
  const productName = input.productName.trim() || "입력 제품";
  const category = input.category.trim() || "입력 카테고리";
  const target = input.currentTarget.trim() || inferCategoryProfile(input).defaultTarget;
  const profile = inferCategoryProfile(input);
  const competitors = splitList(input.competitors);
  const features = splitList(input.keyFeatures || input.productDescription);
  const priceTier = inferPriceTier(input.priceRange);
  const inputCompletenessScore = calculateInputCompleteness(input);
  const competitorCoverageScore = calculateCompetitorCoverage(input.competitors);
  const scoreCards = buildAdaptiveScoreCards({
    input,
    profile,
    features,
    competitors,
    priceTier,
  });
  const competitorProfiles = buildCompetitorProfiles({
    competitors,
    profile,
    priceTier,
    score: scoreCards.competitorThreatScore.score,
  });
  const targetRecommendations = buildTargetRecommendations({
    input,
    profile,
    scoreCards,
    target,
  });
  const targetSegments = buildTargetSegments(targetRecommendations, profile, productName);
  const positioning = buildPositioning({
    brandName,
    competitors,
    profile,
    priceTier,
    featureCount: features.length,
  });
  const uspList = buildUspList({
    projectName,
    target,
    profile,
    features,
    priceTier,
  });
  const messages = buildMessages({
    brandName,
    productName,
    target,
    profile,
    features,
  });
  const actionPlan = buildActionPlan({
    projectName,
    profile,
    competitors,
    target,
  });
  const reliabilityScore = buildReliabilityScore({
    inputCompletenessScore,
    competitorCoverageScore,
    scoreCards,
  });

  return {
    executiveSummary: {
      oneLineInsight: `${withTopic(projectName)} ${withSubject(target)} 겪는 ${withObject(profile.corePain)} 해결하는 ${profile.label} 솔루션으로 포지셔닝하는 전략이 적합함.`,
      keyFinding: `${category} 시장에서는 ${profile.categoryNeed}임. 현재 입력 기준으로는 ${withObject(target)} 1순위 전환 타겟으로 두고, 경쟁사 대비 ${withObject(firstFeature(features, profile.contentFocus))} 명확히 제시할 필요가 있음.`,
      recommendedDirection: `${profile.searchIntents.slice(0, 3).join(", ")} 의도를 중심으로 검색 수요를 확보하고, 랜딩/상세페이지에서는 문제 상황, 차별화 근거, 구매 장벽 해소 메시지를 한 화면에서 연결하는 전략이 적합함.`,
      risk: `실시간 검색량, 리뷰 VOC, 경쟁사 가격, 실제 광고 성과가 아직 반영되지 않았으므로 본 결과는 검증 가능한 전략 가설로 활용해야 함. 특히 ${competitors[0] || "주요 경쟁사"} 대비 차별성이 흐려지면 가격 비교로 전환될 가능성이 높음.`,
    },
    scoreCards,
    reliabilityReview: {
      overallScore: reliabilityScore,
      verdict:
        reliabilityScore >= 80
          ? `${projectName} 분석은 입력 완성도와 경쟁사 커버리지가 충분해 기획서 초안과 캠페인 가설 수립에 활용 가능한 수준으로 판단됨. 단, 실제 예산 배분 전에는 정량 데이터 검증이 필요함.`
          : `${projectName} 분석은 기본 전략 방향을 잡는 데는 활용 가능하나, 입력값 또는 경쟁사 정보가 부족해 정확도 보완이 필요함. 실제 집행 전 추가 자료 입력이 우선되어야 함.`,
      summary: `${projectName} 분석은 브랜드/제품 정보, 타겟, 경쟁사, USP, 포지셔닝, 실행 전략을 하나의 흐름으로 연결하도록 생성됨. 현재 버전은 mock analysis service 기반이므로 실시간 시장 데이터가 아닌 입력값과 전략 프레임워크를 바탕으로 한 구조화된 가설로 해석하는 것이 적합함.`,
      evidenceChecks: buildEvidenceChecks({
        input,
        profile,
        inputCompletenessScore,
        competitorCoverageScore,
        reliabilityScore,
      }),
      sourceEvidence: [
        buildInputSourceEvidence(input, inputCompletenessScore),
        {
          sourceName: "사용자 입력 경쟁사 목록",
          sourceType: "Internal",
          confidence: getConfidenceByScore(competitorCoverageScore),
          verifiedFact:
            competitors.length > 0
              ? `${competitors.join(", ")} ${competitors.length}개 브랜드가 비교군으로 입력됨.`
              : "경쟁사가 입력되지 않아 일반 비교 프레임워크로 분석됨.",
          implication:
            "입력 경쟁사는 위협도, 포지셔닝맵, USP 비교의 1차 기준으로 사용되며, 실제 시장 점유율이나 검색 노출량은 별도 확인이 필요함.",
        },
        {
          sourceName: "Market Fit Lab 전략 프레임워크",
          sourceType: "Internal",
          confidence: "Medium",
          verifiedFact:
            "타겟 적합도, 경쟁사 위협도, 차별화 점수, 시장 기회 점수를 항목별 기준에 따라 산정함.",
          implication:
            "정량 리서치가 없는 초기 단계에서도 가설과 실행 우선순위를 빠르게 정리할 수 있음.",
        },
      ],
      strengths: [
        "입력된 타겟, 경쟁사, 기능, 가격대를 기준으로 분석 문장과 점수를 재구성함.",
        "각 점수의 산출 기준과 해석 문장을 함께 제공해 의사결정 근거를 설명하기 쉬움.",
        "경쟁사 역할을 직접 경쟁, 가격 비교군, 기능 대체재, 채널 경쟁 관점으로 분리함.",
        "포지셔닝맵, USP, 메시지, 실행 계획이 같은 전략 방향으로 이어지도록 구성됨.",
      ],
      limitations: [
        "현재 버전은 mock 데이터 기반이므로 실시간 검색량, 매체 성과, 리뷰 감성, 커머스 가격이 자동 반영되지는 않음.",
        "경쟁사별 실제 USP와 가격은 사용자가 입력한 정보 또는 별도 리서치로 보완해야 함.",
        "포지셔닝 좌표는 전략적 가정에 기반하므로 소비자 조사나 전문가 평가로 보정하는 것이 적합함.",
        "제품 성과 예측은 실제 광고 A/B 테스트와 랜딩 전환 데이터를 통해 검증해야 함.",
      ],
      accuracySafeguards: [
        "입력 완성도와 경쟁사 커버리지가 낮으면 신뢰도 점수를 보수적으로 산정함.",
        "외부 데이터가 없는 항목은 확정 표현이 아니라 검증 과제로 분리함.",
        "경쟁사 정보가 부족할 때는 구체 사실을 단정하지 않고 역할 기반 비교로 표시함.",
        "최종 보고서에 다음 액션과 추가 검증 항목을 포함해 실제 집행 전 보완 경로를 제시함.",
      ],
      validationTasks: [
        {
          priority: "High",
          task: "검색량·CPC·전환 키워드 확인",
          reason: `${profile.searchIntents.slice(0, 3).join(", ")} 수요의 실제 규모와 경쟁 강도를 확인해야 예산 우선순위를 확정할 수 있음.`,
        },
        {
          priority: "High",
          task: "경쟁사 가격·리뷰·채널 노출 점검",
          reason:
            "입력 경쟁사가 실제 구매 고려 단계에서 얼마나 강한 대체재인지 확인해야 위협도와 USP 메시지를 보정할 수 있음.",
        },
        {
          priority: "Medium",
          task: "랜딩/상세페이지 메시지 A/B 테스트",
          reason:
            "핵심 USP와 구매 장벽 해소 문구가 실제 전환율에 미치는 영향을 빠르게 검증할 필요가 있음.",
        },
        {
          priority: "Medium",
          task: "리뷰 VOC 또는 고객 인터뷰 수집",
          reason:
            "고객이 실제로 쓰는 문제 표현을 반영하면 광고 카피와 상세페이지 설득력이 높아짐.",
        },
        {
          priority: "Low",
          task: "브랜드 인식 조사와 장기 콘텐츠 전략 수립",
          reason:
            "단기 전환 소재와 별도로 브랜드 신뢰와 선호도를 축적해야 장기 성장성이 높아짐.",
        },
      ],
    },
    selectionRecommendations: {
      summary:
        "타겟과 경쟁사 추천은 입력값을 기반으로 문제 강도, 구매력, 제품 필요성, 도달 가능성, 경쟁 대체 가능성을 함께 고려해 산정함.",
      selectionPrinciple:
        "타겟은 즉시 전환 가능성과 장기 육성 가능성을 나누고, 경쟁사는 직접 대체재·가격 기준점·메시지 대비군 역할을 기준으로 선정하는 것이 적합함.",
      targetRecommendations,
      competitorRecommendations: buildCompetitorRecommendations({
        competitors,
        profile,
        competitorProfiles,
      }),
    },
    targetAnalysis: {
      summary: `${projectName}의 핵심 타겟은 ${target}으로 판단됨. 이들은 ${withObject(profile.corePain)} 인지하고 있으며, ${withSubject(profile.purchaseTrigger)} 구매 행동을 촉발할 가능성이 높음.`,
      coreTarget: target,
      subTarget: `비교 탐색 고객, 초기 체험 고객, ${profile.repeatLogic.replace("가능성이", "가능성을 가진")} 고객`,
      persona: {
        name: "김민준",
        age: inferPersonaAge(target),
        job: profile.personaJob,
        lifestyle: profile.personaLifestyle,
        painPoints: [
          profile.corePain,
          "기존 선택지의 차이를 한눈에 판단하기 어려움",
          "가격 대비 효과 또는 효용을 확신하기 어려움",
          "구매 전 후기와 사용 장면을 확인하고 싶어함",
          "광고 메시지가 일반적이면 브랜드 전환 명분이 약해짐",
        ],
        purchaseMotivations: [
          profile.purchaseTrigger,
          `${firstFeature(features, "명확한 핵심 효익")}을 통해 현재 문제를 빠르게 해결하고 싶은 니즈`,
          "기존 대안보다 더 분명한 차별화 근거를 확인하고 싶은 니즈",
          "후기, 비교표, 상세 설명을 통해 실패 가능성을 낮추고 싶은 니즈",
        ],
        purchaseBarriers: [
          profile.barrier,
          "경쟁사 대비 차별성이 명확하지 않을 때 발생하는 가격 저항",
          "실제 사용 후 만족도에 대한 불확실성",
          "브랜드 신뢰 또는 후기 근거 부족",
        ],
        mediaChannels: profile.mediaChannels,
      },
      targetSegments,
    },
    competitorAnalysis: {
      summary:
        competitors.length > 0
          ? `${withObject(competitors.join(", "))} 기준으로 비교하면 시장은 직접 대체재, 가격 비교군, 기능 특화 경쟁사로 나뉨. ${withTopic(projectName)} ${withObject(firstFeature(features, profile.contentFocus))} 중심으로 경쟁 기준을 바꿔야 함.`
          : `경쟁사가 입력되지 않아 ${profile.label}의 일반 경쟁 구도로 분석함. 정확도를 높이려면 직접 경쟁 2개, 대체재 1개, 가격 비교군 1개를 추가하는 것이 적합함.`,
      competitors: competitorProfiles,
      insight: `${withSubject(competitors[0] || "카테고리 리더")} 인지도 기준점을 만들고, ${withSubject(competitors[1] || "가격 대체재")} 가격 비교를 유도할 가능성이 있음. 따라서 ${withTopic(projectName)} 기능 나열보다 ${target}의 문제 상황과 구매 장벽을 해소하는 메시지로 차별화하는 전략이 적합함.`,
    },
    positioning,
    uspStrategy: {
      summary: `${projectName}의 USP는 ${target}의 ${withObject(profile.corePain)} ${firstFeature(features, profile.contentFocus)}으로 해결한다는 문장으로 압축하는 것이 적합함.`,
      uspList,
      differentiationPoint: `기획서상 차별화 문장은 “${withTopic(projectName)} ${withSubject(target)} 겪는 ${withObject(profile.corePain)} ${firstFeature(features, profile.contentFocus)} 중심으로 해결하는 ${profile.label} 솔루션”으로 정리하는 것이 적합함.`,
      opportunityArea: `${profile.searchIntents.slice(0, 3).join(", ")} 의도를 가진 고객에게 먼저 노출하고, 상세페이지에서는 경쟁사 비교표와 구매 장벽 해소 메시지를 통해 전환을 설득할 필요가 있음.`,
    },
    messageStrategy: {
      summary: `메시지는 ${profile.corePain}을 직접 짚되 과장보다 구체적 사용 장면과 검증 가능한 효익을 중심으로 설계하는 것이 적합함.`,
      messages,
    },
    actionPlan,
    finalReport: buildFinalReport({
      projectName,
      brandName,
      productName,
      category,
      target,
      profile,
      competitors,
      targetSegments,
      competitorProfiles,
      positioning,
      uspList,
      messages,
      actionPlan,
      reliabilityScore,
    }),
  };
}

function buildAdaptiveScoreCards({
  input,
  profile,
  features,
  competitors,
  priceTier,
}: {
  input: ProjectInput;
  profile: CategoryProfile;
  features: string[];
  competitors: string[];
  priceTier: PriceTier;
}): MarketingAnalysis["scoreCards"] {
  const featureBonus = Math.min(features.length, 5);
  const competitorScore = calculateCompetitorCoverage(input.competitors);
  const hasSpecificTarget = input.currentTarget.trim().length >= 8;
  const premiumPenalty = priceTier === "premium" ? 2 : 0;

  const targetCriteria = [
    criterion("문제 강도", 25, 18 + (hasSpecificTarget ? 4 : 1) + (featureBonus >= 3 ? 2 : 0)),
    criterion("구매력", 20, getPurchasingPowerScore(input.currentTarget, priceTier)),
    criterion("제품 필요성", 25, 17 + featureBonus + (input.productDescription.length > 24 ? 3 : 1)),
    criterion("광고 도달 가능성", 15, 10 + Math.min(profile.mediaChannels.length, 4)),
    criterion("반복 구매 가능성", 15, getRepeatScore(profile.key, priceTier)),
  ];

  const competitorCriteria = [
    criterion("브랜드 인지도", 25, 15 + Math.min(competitors.length * 2, 8)),
    criterion("제품 유사도", 25, competitors.length >= 3 ? 21 : competitors.length === 2 ? 18 : 14),
    criterion("가격 경쟁력", 15, priceTier === "low" ? 13 : priceTier === "mid" ? 12 : 10),
    criterion("채널 장악력", 20, 12 + Math.min(competitors.length * 2, 6)),
    criterion("메시지 명확성", 15, 10 + (competitors.length >= 3 ? 3 : 1)),
  ];

  const differentiationCriteria = [
    criterion("USP 명확성", 30, 20 + featureBonus + (input.keyFeatures.length > 20 ? 3 : 0)),
    criterion("경쟁사 대비 차별성", 30, 18 + featureBonus + (competitorScore >= 80 ? 4 : 1) - premiumPenalty),
    criterion("타겟 고민과의 연결성", 25, 17 + (hasSpecificTarget ? 4 : 1) + (input.marketingGoal.length > 16 ? 2 : 0)),
    criterion("메시지 확장성", 15, 10 + Math.min(featureBonus, 4)),
  ];

  const opportunityCriteria = [
    criterion("카테고리 성장성", 25, getCategoryGrowthScore(profile.key)),
    criterion("타겟 수요 강도", 25, 17 + (hasSpecificTarget ? 4 : 1) + (input.marketingGoal.length > 16 ? 2 : 0)),
    criterion("경쟁 공백", 20, 12 + (competitorScore >= 80 ? 4 : 2) + (featureBonus >= 3 ? 2 : 0)),
    criterion("채널 확장 가능성", 15, 10 + Math.min(profile.mediaChannels.length, 4)),
    criterion("콘텐츠 확장 가능성", 15, 10 + Math.min(featureBonus, 4)),
  ];

  return {
    targetFitScore: {
      score: sumCriteria(targetCriteria),
      reason: `${withTopic(input.currentTarget || profile.defaultTarget)} ${withObject(profile.corePain)} 인지할 가능성이 높고, 입력된 제품 특징과 구매 동기가 연결되어 타겟 적합도가 높게 판단됨.`,
      criteria: targetCriteria,
    },
    competitorThreatScore: {
      score: sumCriteria(competitorCriteria),
      reason:
        competitors.length >= 3
          ? `${competitors.slice(0, 3).join(", ")} 등 입력 경쟁사가 충분해 구매 고려 단계에서 대체 선택지로 작동할 가능성이 높음. 위협도는 높지만 비교 메시지를 설계하기에도 적합함.`
          : "경쟁사 입력이 적어 실제 위협도는 보수적으로 산정됨. 직접 경쟁사와 가격 비교군을 추가하면 분석 정확도가 높아짐.",
      criteria: competitorCriteria,
    },
    differentiationScore: {
      score: sumCriteria(differentiationCriteria),
      reason: `${withObject(firstFeature(features, profile.contentFocus))} 중심으로 USP를 압축하면 경쟁사 대비 선택 이유를 명확히 만들 수 있음.`,
      criteria: differentiationCriteria,
    },
    marketOpportunityScore: {
      score: sumCriteria(opportunityCriteria),
      reason: `${profile.label}에서는 ${profile.searchIntents.slice(0, 3).join(", ")} 수요가 존재하므로, 검색·콘텐츠·상세페이지를 연결한 실행 전략의 기회가 존재함.`,
      criteria: opportunityCriteria,
    },
  };
}

function buildCompetitorProfiles({
  competitors,
  profile,
  priceTier,
  score,
}: {
  competitors: string[];
  profile: CategoryProfile;
  priceTier: PriceTier;
  score: number;
}): CompetitorProfile[] {
  const names =
    competitors.length > 0
      ? competitors
      : ["카테고리 리더 후보", "가격 대체재 후보", "기능 특화 후보"];

  return names.slice(0, 5).map((name, index) => {
    const role = profile.competitorRoles[index % profile.competitorRoles.length];
    const tone = profile.messageTone[index % profile.messageTone.length];
    const threatScore = clampScore(score - 8 + index * 3 - (index > 2 ? 5 : 0));

    return {
      name,
      priceLevel: getCompetitorPriceLevel(priceTier, index),
      usp: `${role} 역할을 하는 ${profile.label} 내 주요 비교군`,
      strength:
        index === 0
          ? "인지도와 기존 고객 신뢰를 기반으로 구매 고려 단계에서 먼저 떠오를 가능성이 높음"
          : `${role} 관점에서 특정 고객군의 비교 기준을 만들 가능성이 있음`,
      weakness:
        "입력 제품이 더 구체적인 문제 해결 장면과 차별화 근거를 제시하면 전환 단계에서 방어 가능함",
      threatScore,
      messageTone: tone,
      channel: profile.mediaChannels.slice(0, 4).join(", "),
    };
  });
}

function buildTargetRecommendations({
  input,
  profile,
  scoreCards,
  target,
}: {
  input: ProjectInput;
  profile: CategoryProfile;
  scoreCards: MarketingAnalysis["scoreCards"];
  target: string;
}): TargetRecommendation[] {
  const baseCriteria = scoreCards.targetFitScore.criteria;
  const primaryScore = scoreCards.targetFitScore.score;

  return [
    {
      segmentName: `${target} 핵심 전환 타겟`,
      priority: "Primary",
      selectionScore: primaryScore,
      confidence: getConfidenceByScore(primaryScore),
      rationale: `${profile.corePain}이 뚜렷하고 ${profile.purchaseTrigger}에 반응할 가능성이 높아 1순위 전환 타겟으로 판단됨.`,
      evidence: [
        `제품 설명에서 ${input.productDescription || profile.categoryNeed}이 확인됨.`,
        `핵심 기능은 ${input.keyFeatures || profile.contentFocus}으로 정리됨.`,
        `마케팅 목표가 ${input.marketingGoal || "신규 유입과 전환 개선"}에 맞춰져 있음.`,
        `${profile.mediaChannels.slice(0, 3).join(", ")} 채널로 도달 가능성이 있음.`,
      ],
      recommendedUse:
        "검색광고, 상세페이지 첫 화면, 리타겟팅 전환 소재의 1순위 타겟으로 운영하는 것이 적합함.",
      criteria: baseCriteria,
    },
    {
      segmentName: "비교 탐색 고객",
      priority: "Secondary",
      selectionScore: clampScore(primaryScore - 7),
      confidence: getConfidenceByScore(primaryScore - 7),
      rationale:
        "경쟁사와 대체재를 비교하며 실패 가능성을 낮추려는 고객군으로, 비교표와 후기 근거가 전환에 영향을 줄 가능성이 높음.",
      evidence: [
        `${profile.searchIntents.slice(1, 4).join(", ")} 검색 의도가 존재함.`,
        "가격과 기능을 함께 검토하는 구매 여정에 있음.",
        "경쟁사 대비 차별화 문장이 명확할수록 전환 가능성이 높음.",
      ],
      recommendedUse:
        "경쟁사 비교 콘텐츠, FAQ, 상세페이지 중단 설득 영역, 리뷰형 소재에 활용하는 것이 적합함.",
      criteria: lowerCriteria(baseCriteria, 2),
    },
    {
      segmentName: "초기 체험 고객",
      priority: "Test",
      selectionScore: clampScore(primaryScore - 14),
      confidence: "Medium",
      rationale:
        "문제 인식은 있으나 구매 확신이 낮아 할인, 체험, 쉬운 설명, 짧은 소재로 반응을 테스트할 필요가 있음.",
      evidence: [
        "브랜드 전환 장벽이 존재함.",
        "짧은 콘텐츠와 명확한 혜택에 반응할 가능성이 있음.",
        "즉시 전환보다 유입과 리타겟팅 풀 확보 목적에 적합함.",
      ],
      recommendedUse:
        "디스플레이, 숏폼, 체험형 프로모션의 테스트 타겟으로 분리 운영하는 것이 적합함.",
      criteria: lowerCriteria(baseCriteria, 4),
    },
  ];
}

function buildTargetSegments(
  recommendations: TargetRecommendation[],
  profile: CategoryProfile,
  productName: string,
): TargetSegment[] {
  return recommendations.map((item) => ({
    name: item.segmentName,
    description: item.rationale,
    fitScore: item.selectionScore,
    reason: item.evidence.slice(0, 2).join(" "),
    recommendedMessage:
      item.priority === "Primary"
        ? `${productName}, ${withObject(profile.corePain)} 더 쉽게 해결하는 선택.`
        : item.priority === "Secondary"
          ? `비교할수록 분명한 ${productName}의 차별화 포인트.`
          : `먼저 경험하고 판단할 수 있는 ${productName} 테스트 제안.`,
  }));
}

function buildCompetitorRecommendations({
  competitors,
  profile,
  competitorProfiles,
}: {
  competitors: string[];
  profile: CategoryProfile;
  competitorProfiles: CompetitorProfile[];
}): MarketingAnalysis["selectionRecommendations"]["competitorRecommendations"] {
  return competitorProfiles.map((competitor, index) => {
    const selectionScore = clampScore(competitor.threatScore + 3);

    return {
      brandName: competitor.name,
      role: profile.competitorRoles[index % profile.competitorRoles.length],
      priority: index < 2 ? "Primary" : index < 4 ? "Secondary" : "Test",
      selectionScore,
      confidence: competitors.length > index ? getConfidenceByScore(selectionScore) : "Low",
      rationale: `${withTopic(competitor.name)} ${competitor.usp}으로 설정할 수 있어 포지셔닝과 메시지 비교에 유용함.`,
      evidence: [
        `입력 경쟁사 목록에서 ${competitor.name}이 확인됨.`,
        `${competitor.messageTone} 메시지 톤을 가진 비교군으로 분석됨.`,
        `${competitor.channel} 채널에서 비교 노출 가능성을 점검할 필요가 있음.`,
      ],
      watchPoint:
        "실제 가격, 리뷰 수, 검색 노출량은 변동 가능성이 있으므로 집행 전 별도 검증이 필요함.",
      criteria: [
        criterion("카테고리 유사성", 25, 18 + Math.min(index === 0 ? 5 : 3, 5)),
        criterion("타겟 중복도", 25, 17 + (index < 2 ? 5 : 3)),
        criterion("가격 비교 가능성", 20, 14 + (index < 3 ? 3 : 1)),
        criterion("채널 노출 가능성", 20, 13 + (index < 2 ? 4 : 2)),
        criterion("메시지 대비 가치", 10, 7 + (index < 2 ? 2 : 1)),
      ],
    };
  });
}

function buildPositioning({
  brandName,
  competitors,
  profile,
  priceTier,
  featureCount,
}: {
  brandName: string;
  competitors: string[];
  profile: CategoryProfile;
  priceTier: PriceTier;
  featureCount: number;
}): MarketingAnalysis["positioning"] {
  const ourX = priceTier === "premium" ? 84 : priceTier === "high" ? 76 : priceTier === "mid" ? 62 : 42;
  const ourY = clampScore(56 + Math.min(featureCount, 5) * 7 + (profile.key === "digital" ? 6 : 0));
  const names =
    competitors.length > 0
      ? competitors
      : ["카테고리 리더 후보", "가격 대체재 후보", "기능 특화 후보"];
  const competitorPoints: PositioningPoint[] = names.slice(0, 5).map((name, index) => ({
    name,
    x: clampScore(ourX + [-12, 16, -24, 8, -6][index % 5]),
    y: clampScore(ourY + [10, -8, -16, 14, -4][index % 5]),
    type: "competitor",
  }));

  return {
    xAxis: profile.xAxis,
    yAxis: profile.yAxis,
    mapData: [{ name: brandName, x: ourX, y: ourY, type: "ourBrand" }, ...competitorPoints],
    interpretation: `${withTopic(brandName)} ${profile.xAxis.split("↔")[1]?.trim() || "차별화"}과 ${profile.yAxis.split("↔")[1]?.trim() || "가치"} 방향에서 경쟁사 대비 선택 이유를 명확히 해야 함. 특히 ${withObject(profile.corePain)} 해결하는 구체적 사용 장면을 제시하면 시장 내 빈 공간을 확보할 가능성이 높음.`,
  };
}

function buildUspList({
  projectName,
  target,
  profile,
  features,
  priceTier,
}: {
  projectName: string;
  target: string;
  profile: CategoryProfile;
  features: string[];
  priceTier: PriceTier;
}) {
  const featurePhrase = firstFeature(features, profile.contentFocus);
  const priceMessage =
    priceTier === "premium" || priceTier === "high"
      ? "가격을 정당화할 수 있는 명확한 효익과 신뢰 근거"
      : "접근 가능한 가격대에서 체감 가능한 실용 가치";

  return [
    `${withSubject(target)} 겪는 ${withObject(profile.corePain)} ${featurePhrase} 중심으로 해결하는 제안`,
    `${profile.categoryNeed}라는 카테고리 특성에 맞춰 구매 이유를 한 문장으로 압축할 수 있음`,
    `${priceMessage}를 상세페이지와 광고 메시지에서 일관되게 제시 가능함`,
    `${projectName}만의 사용 장면, 후기 근거, 비교 우위를 콘텐츠로 확장할 수 있음`,
  ];
}

function buildMessages({
  brandName,
  productName,
  target,
  profile,
  features,
}: {
  brandName: string;
  productName: string;
  target: string;
  profile: CategoryProfile;
  features: string[];
}): MarketingAnalysis["messageStrategy"]["messages"] {
  const featurePhrase = firstFeature(features, profile.contentFocus);

  return [
    {
      angle: "핵심 전환 카피",
      mainCopy: `${withObject(target)} 위한 더 분명한 선택`,
      subCopy: `${withTopic(productName)} ${withObject(profile.corePain)} ${featurePhrase}으로 해결합니다.`,
      reason:
        "타겟과 문제 상황을 직접 연결해 검색광고와 랜딩 첫 화면에서 제품 이해도를 높일 수 있음.",
    },
    {
      angle: "문제 인식 카피",
      mainCopy: `지금 불편한 이유, 선택 기준이 달라져야 할 때`,
      subCopy: `${withSubject(brandName)} 제안하는 ${profile.label} 솔루션으로 비교 기준을 바꿔보세요.`,
      reason:
        "기존 대안에 만족하지 못하는 고객의 문제 인식을 자극해 유입 가능성을 높임.",
    },
    {
      angle: "경쟁 비교 카피",
      mainCopy: `비교할수록 중요한 건 ${featurePhrase}`,
      subCopy: `가격보다 먼저 확인해야 할 ${productName}의 차별화 포인트.`,
      reason:
        "경쟁사 비교 단계에서 단순 가격 경쟁으로 빠지지 않도록 선택 기준을 재정의함.",
    },
    {
      angle: "상세페이지 헤드라인",
      mainCopy: `${profile.corePain}, 이제 한 화면에서 이해되게`,
      subCopy: `문제, 기능, 후기, 구매 이유를 ${productName} 하나의 메시지로 연결합니다.`,
      reason:
        "구매 직전 이탈 요인인 정보 부족과 차별성 불명확성을 줄이는 설명형 메시지로 적합함.",
    },
    {
      angle: "리타겟팅 카피",
      mainCopy: `아직 고민 중이라면, 비교 기준부터 확인하세요`,
      subCopy: `${withSubject(productName)} ${target}에게 적합한 이유를 핵심만 정리했습니다.`,
      reason:
        "방문 후 미전환 고객에게 재방문 명분을 제공하고 FAQ·비교표 콘텐츠로 연결하기 좋음.",
    },
  ];
}

function buildActionPlan({
  projectName,
  profile,
  competitors,
  target,
}: {
  projectName: string;
  profile: CategoryProfile;
  competitors: string[];
  target: string;
}): MarketingAnalysis["actionPlan"] {
  return {
    summary: `${projectName}의 실행 전략은 고의도 검색 수요 확보, 랜딩 메시지 개선, 경쟁 비교 콘텐츠, 리타겟팅 검증 순서로 진행하는 것이 적합함.`,
    priorities: [
      {
        priority: "High",
        action: "검색광고 키워드 구조 설계",
        reason: `${profile.searchIntents.slice(0, 4).join(", ")} 의도를 가진 고객은 문제 인식과 구매 검토가 동시에 존재해 즉시 테스트 가치가 높음.`,
        expectedImpact: "고의도 유입 확보, 전환 키워드 발굴, 초기 성과 데이터 축적",
      },
      {
        priority: "High",
        action: "랜딩/상세페이지 첫 화면 메시지 개선",
        reason: `${withSubject(target)} 느끼는 ${profile.corePain}과 제품 차별화 근거를 첫 화면에서 연결해야 이탈을 줄일 수 있음.`,
        expectedImpact: "제품 이해도 개선, 가격 저항 완화, 전환율 상승 가능성",
      },
      {
        priority: "High",
        action: "경쟁사 비교표와 FAQ 콘텐츠 제작",
        reason:
          competitors.length > 0
            ? `${competitors.slice(0, 3).join(", ")}와 비교하는 고객에게 선택 기준을 선점할 필요가 있음.`
            : "경쟁사 정보가 부족할수록 고객은 가격 중심으로 비교할 가능성이 높으므로 자체 비교 기준이 필요함.",
        expectedImpact: "비교 단계 이탈 감소, USP 이해도 상승, 리타겟팅 소재 확장",
      },
      {
        priority: "Medium",
        action: `${profile.contentFocus} 중심 콘텐츠 테스트`,
        reason: "광고에서 약속한 효익을 콘텐츠와 상세페이지에서 반복 확인시켜야 신뢰도가 높아짐.",
        expectedImpact: "콘텐츠 체류시간 증가, 광고 소재 재활용, 후기 기반 설득력 강화",
      },
      {
        priority: "Medium",
        action: "타겟별 메시지 A/B 테스트",
        reason: "핵심 전환 타겟, 비교 탐색 고객, 초기 체험 고객은 반응 문구가 다르므로 소재별 효율을 분리 검증해야 함.",
        expectedImpact: "효율 소재 발굴, 예산 재배분 근거 확보, 캠페인 학습 속도 개선",
      },
      {
        priority: "Low",
        action: "브랜드 신뢰 자산 구축",
        reason: "단기 퍼포먼스만으로는 카테고리 신뢰를 장기적으로 확보하기 어려우므로 후기, 사례, 전문가 콘텐츠를 축적할 필요가 있음.",
        expectedImpact: "브랜드 선호도 개선, 재방문율 상승, 장기 CAC 방어",
      },
    ],
  };
}

function buildFinalReport({
  projectName,
  brandName,
  productName,
  category,
  target,
  profile,
  competitors,
  targetSegments,
  competitorProfiles,
  positioning,
  uspList,
  messages,
  actionPlan,
  reliabilityScore,
}: {
  projectName: string;
  brandName: string;
  productName: string;
  category: string;
  target: string;
  profile: CategoryProfile;
  competitors: string[];
  targetSegments: TargetSegment[];
  competitorProfiles: CompetitorProfile[];
  positioning: MarketingAnalysis["positioning"];
  uspList: string[];
  messages: MarketingAnalysis["messageStrategy"]["messages"];
  actionPlan: MarketingAnalysis["actionPlan"];
  reliabilityScore: number;
}) {
  const competitorSummary =
    competitorProfiles.length > 0
      ? competitorProfiles
          .map(
            (competitor) =>
              `- ${competitor.name}: ${competitor.usp}. 위협도 ${competitor.threatScore}점으로 판단됨.`,
          )
          .join("\n")
      : "- 경쟁사 정보가 부족해 직접 경쟁사, 가격 대체재, 카테고리 리더를 추가 입력할 필요가 있음.";

  return `# Market Fit Lab 최종 전략 리포트

## 1. 분석 개요
${withTopic(projectName)} ${category} 카테고리에서 ${withSubject(target)} 겪는 **${profile.corePain}**을 해결하는 방향으로 포지셔닝하는 것이 적합함.

현재 분석은 사용자가 입력한 브랜드/제품 정보, 타겟, 경쟁사, 가격대, 핵심 기능을 바탕으로 생성한 mock analysis service 기반 전략 보고서임. 실시간 검색량, 광고 CPC, 리뷰 감성, 커머스 가격 데이터가 직접 반영된 결과는 아니므로, 실제 집행 전에는 정량 데이터 검증이 필요함.

분석 신뢰도는 ${reliabilityScore}점으로 판단됨. 입력 정보와 경쟁사 커버리지가 충분할수록 기획서 초안과 캠페인 가설 수립에 활용 가능성이 높음.

## 2. 핵심 결론
**핵심 타겟은 ${target}으로 판단됨.** 이들은 ${profile.corePain}을 인지하고 있으며, ${profile.purchaseTrigger}에 의해 구매 검토가 촉발될 가능성이 높음.

${withTopic(brandName)} 경쟁사와 정면 가격 경쟁을 하기보다 **${firstFeature(uspList, profile.contentFocus)}**을 중심으로 선택 이유를 명확히 해야 함. 특히 ${profile.categoryNeed}이므로, 광고-콘텐츠-랜딩페이지의 메시지가 일관되어야 함.

## 3. 핵심 타겟 정의
${withTopic(target)} 문제 인식과 구매 검토 가능성이 동시에 존재하는 고객군임. 이들은 단순한 제품 설명보다 현재 불편, 기대 효과, 실패 가능성 해소 근거를 함께 확인하려는 경향이 있음.

${targetSegments
  .map((segment) => `- ${segment.name}: ${segment.reason} 적합도 ${segment.fitScore}점으로 판단됨.`)
  .join("\n")}

## 4. 페르소나 요약
대표 페르소나는 ${profile.personaJob} 성향의 고객으로 설정할 수 있음. 이 고객은 ${profile.personaLifestyle}을 보임.

주요 고민은 ${profile.corePain}, 가격 대비 효용 불확실성, 경쟁 대안 비교 피로로 정리됨. 구매 동기는 ${profile.purchaseTrigger}이며, 구매 장벽은 ${profile.barrier}로 판단됨.

## 5. 경쟁사 분석 요약
${competitors.length > 0 ? `${withObject(competitors.join(", "))} 주요 비교군으로 설정함.` : "현재 경쟁사 입력이 부족하므로 일반 카테고리 경쟁 구도로 분석함."}

${competitorSummary}

따라서 ${withTopic(projectName)} 경쟁사보다 더 구체적인 사용 장면과 구매 이유를 제시해야 함. 경쟁사가 인지도나 가격을 선점하고 있을 경우, ${withTopic(brandName)} 문제 해결력과 차별화 근거를 중심으로 비교 기준을 전환하는 전략이 적합함.

## 6. 포지셔닝 해석
포지셔닝 기준은 **${positioning.xAxis}**, **${positioning.yAxis}**로 설정함.

${positioning.interpretation}

포지셔닝 문장은 다음과 같이 정리할 수 있음.

**“${withTopic(projectName)} ${withSubject(target)} 겪는 ${withObject(profile.corePain)} ${profile.contentFocus} 중심으로 해결하는 ${profile.label} 솔루션이다.”**

## 7. 차별화 전략
차별화 전략은 기능 나열보다 고객이 바로 이해할 수 있는 구매 이유로 압축하는 것이 적합함.

${uspList.map((usp) => `- ${usp}`).join("\n")}

## 8. 추천 마케팅 메시지
메시지는 ${profile.corePain}을 자극하되, 과장보다 구체적 사용 장면과 검증 가능한 효익을 중심으로 설계하는 것이 적합함.

${messages
  .map((message) => `- ${message.angle}: **${message.mainCopy}** / ${message.subCopy}`)
  .join("\n")}

## 9. 실행 우선순위
### High: 즉시 실행해야 하는 전략
${actionPlan.priorities
  .filter((item) => item.priority === "High")
  .map((item) => `- ${item.action}: ${item.reason}`)
  .join("\n")}

### Medium: 2차 테스트 전략
${actionPlan.priorities
  .filter((item) => item.priority === "Medium")
  .map((item) => `- ${item.action}: ${item.reason}`)
  .join("\n")}

### Low: 장기적으로 고려할 전략
${actionPlan.priorities
  .filter((item) => item.priority === "Low")
  .map((item) => `- ${item.action}: ${item.reason}`)
  .join("\n")}

## 10. 다음 액션
1. ${profile.searchIntents.slice(0, 3).join(", ")} 중심의 검색 키워드와 콘텐츠 주제를 정리함.
2. 상세페이지 첫 화면에 문제, 차별화 근거, CTA를 한 번에 배치함.
3. ${competitors[0] || "주요 경쟁사"}와 비교되는 메시지를 FAQ와 비교표로 보강함.
4. 핵심 타겟과 비교 탐색 고객을 분리해 광고 소재 A/B 테스트를 진행함.
5. 리뷰 VOC, 검색량, 경쟁사 가격, 전환율 데이터를 수집해 현재 점수와 메시지를 보정함.

**결론적으로 ${withTopic(productName)} ${target}의 문제를 명확히 겨냥할 경우 기획서와 캠페인 초안으로 활용 가능한 전략 방향을 확보할 수 있음. 성공 조건은 “무엇이 좋은가”보다 “왜 지금 이 고객에게 필요한가”를 더 구체적으로 설득하는 것임.**`;
}

function buildEvidenceChecks({
  input,
  profile,
  inputCompletenessScore,
  competitorCoverageScore,
  reliabilityScore,
}: {
  input: ProjectInput;
  profile: CategoryProfile;
  inputCompletenessScore: number;
  competitorCoverageScore: number;
  reliabilityScore: number;
}): EvidenceCheck[] {
  return [
    {
      label: "입력 데이터 완성도",
      score: inputCompletenessScore,
      confidence: getConfidenceByScore(inputCompletenessScore),
      finding: buildInputCompletenessFinding(input, inputCompletenessScore),
      implication:
        inputCompletenessScore >= 85
          ? "현재 입력값은 전략 가설을 생성하기에 충분한 수준으로 판단됨."
          : "입력값이 부족하면 분석이 일반론에 가까워질 수 있으므로 제품 설명, 기능, 경쟁사를 보완해야 함.",
    },
    {
      label: "경쟁사 입력 커버리지",
      score: competitorCoverageScore,
      confidence: getConfidenceByScore(competitorCoverageScore),
      finding: buildCompetitorCoverageFinding(input.competitors),
      implication:
        competitorCoverageScore >= 80
          ? "경쟁 구도와 포지셔닝을 비교하기에 충분한 입력으로 판단됨."
          : "최소 3~4개 비교군을 입력해야 위협도와 시장 공백 판단이 안정화됨.",
    },
    {
      label: "카테고리 분석 적합성",
      score: 84,
      confidence: "High",
      finding: `${profile.label} 카테고리 특성에 맞춰 구매 동기, 장벽, 채널, 메시지를 재구성함.`,
      implication:
        "카테고리별 일반 프레임워크는 적용되었으나, 실제 브랜드별 시장 데이터로 추가 보정할 필요가 있음.",
    },
    {
      label: "포지셔닝 논리 일관성",
      score: 82,
      confidence: "High",
      finding: "타겟 문제, USP, 경쟁 비교, 메시지, 실행 계획이 같은 방향으로 연결됨.",
      implication:
        "기획서 초안과 캠페인 가설 수립에 활용 가능한 수준으로 판단됨.",
    },
    {
      label: "외부 데이터 검증 수준",
      score: 55,
      confidence: "Low",
      finding:
        "실시간 검색량, 광고 CPC, 리뷰 감성, 커머스 가격, 실제 판매 데이터는 아직 자동 반영되지 않음.",
      implication:
        "예산 집행 전 네이버 키워드, 커머스 가격, 리뷰 VOC, 광고 테스트 데이터로 검증해야 함.",
    },
    {
      label: "종합 활용 가능성",
      score: reliabilityScore,
      confidence: getConfidenceByScore(reliabilityScore),
      finding:
        "현재 결과는 확정 결론이 아니라 실행 가능한 전략 가설과 보고서 초안으로 활용하는 것이 적합함.",
      implication:
        "초기 기획서, 내부 공유 자료, 광고 테스트 설계에는 활용 가능하나 정량 데이터 보정 후 최종 의사결정에 사용하는 것이 안전함.",
    },
  ];
}

function buildReliabilityScore({
  inputCompletenessScore,
  competitorCoverageScore,
  scoreCards,
}: {
  inputCompletenessScore: number;
  competitorCoverageScore: number;
  scoreCards: MarketingAnalysis["scoreCards"];
}) {
  const scoreAverage = Math.round(
    (scoreCards.targetFitScore.score +
      scoreCards.competitorThreatScore.score +
      scoreCards.differentiationScore.score +
      scoreCards.marketOpportunityScore.score) /
      4,
  );

  return clampScore(
    Math.round(inputCompletenessScore * 0.35 + competitorCoverageScore * 0.25 + scoreAverage * 0.25 + 12),
  );
}

function buildInputSourceEvidence(
  input: ProjectInput,
  inputCompletenessScore: number,
): SourceEvidence {
  const projectName = getProjectName(input);

  return {
    sourceName: "현재 프로젝트 입력값",
    sourceType: "Internal",
    confidence: getConfidenceByScore(inputCompletenessScore),
    verifiedFact: `브랜드/제품: ${projectName || "미입력"}, 카테고리: ${
      input.category || "미입력"
    }, 입력 경쟁사 수: ${splitList(input.competitors).length}개.`,
    implication:
      "앱은 입력값을 분석의 1차 근거로 사용하며, 입력이 구체적일수록 신뢰도와 추천 정확도가 높아짐.",
  };
}

function inferCategoryProfile(input: ProjectInput): CategoryProfile {
  const text = `${input.category} ${input.productName} ${input.productDescription} ${input.keyFeatures}`.toLowerCase();

  if (containsAny(text, ["스킨", "뷰티", "화장품", "세럼", "크림", "케어", "beauty", "skin"])) {
    return categoryProfiles[0];
  }
  if (containsAny(text, ["식품", "음료", "푸드", "간식", "프로틴", "커피", "food", "drink"])) {
    return categoryProfiles[1];
  }
  if (containsAny(text, ["앱", "saas", "소프트웨어", "ai", "툴", "플랫폼", "dashboard", "crm"])) {
    return categoryProfiles[2];
  }
  if (containsAny(text, ["교육", "강의", "클래스", "부트캠프", "학습", "course", "class"])) {
    return categoryProfiles[3];
  }
  if (containsAny(text, ["패션", "의류", "가방", "신발", "라이프스타일", "fashion", "wear"])) {
    return categoryProfiles[4];
  }

  return categoryProfiles[5];
}

function inferPriceTier(priceRange: string): PriceTier {
  const text = priceRange.toLowerCase();
  if (containsAny(text, ["프리미엄", "고가", "premium", "high", "30만", "50만"])) return "premium";
  if (containsAny(text, ["중고가", "상위", "비싼"])) return "high";
  if (containsAny(text, ["저가", "가성비", "low", "무료", "free"])) return "low";
  return "mid";
}

function getPurchasingPowerScore(target: string, priceTier: PriceTier) {
  const text = target.toLowerCase();
  const base = priceTier === "premium" ? 14 : priceTier === "high" ? 15 : priceTier === "mid" ? 16 : 17;
  const bonus = containsAny(text, ["30", "40", "직장", "전문", "관리자", "b2b", "기업"]) ? 3 : 1;
  return Math.min(base + bonus, 20);
}

function getRepeatScore(categoryKey: string, priceTier: PriceTier) {
  const baseByCategory: Record<string, number> = {
    beauty: 13,
    food: 14,
    digital: 14,
    education: 10,
    fashion: 11,
    generic: 12,
  };
  return Math.max((baseByCategory[categoryKey] || 12) - (priceTier === "premium" ? 1 : 0), 8);
}

function getCategoryGrowthScore(categoryKey: string) {
  const scoreByCategory: Record<string, number> = {
    beauty: 21,
    food: 20,
    digital: 23,
    education: 20,
    fashion: 19,
    generic: 18,
  };
  return scoreByCategory[categoryKey] || 18;
}

function getCompetitorPriceLevel(priceTier: PriceTier, index: number) {
  if (index === 0) return priceTier === "premium" ? "고가~프리미엄" : "유사 가격대";
  if (index === 1) return priceTier === "low" ? "저가~중가" : "중가~유사 가격대";
  if (index === 2) return "가격 비교 필요";
  return "채널별 변동";
}

function inferPersonaAge(target: string) {
  const matched = target.match(/(\d{2})/);
  if (!matched) return 34;
  const age = Number(matched[1]);
  if (Number.isNaN(age)) return 34;
  return Math.min(Math.max(age + 2, 24), 49);
}

function criterion(label: string, maxScore: number, score: number): ScoreCriterionResult {
  return {
    label,
    score: Math.min(Math.max(Math.round(score), 0), maxScore),
    maxScore,
  };
}

function lowerCriteria(criteria: ScoreCriterionResult[], amount: number) {
  return criteria.map((item) => criterion(item.label, item.maxScore, item.score - amount));
}

function sumCriteria(criteria: ScoreCriterionResult[]) {
  return criteria.reduce((total, item) => total + item.score, 0);
}

function firstFeature(features: string[], fallback: string) {
  return features[0]?.trim() || fallback;
}

function withTopic(value: string) {
  return `${value}${hasFinalConsonant(value) ? "은" : "는"}`;
}

function withSubject(value: string) {
  return `${value}${hasFinalConsonant(value) ? "이" : "가"}`;
}

function withObject(value: string) {
  return `${value}${hasFinalConsonant(value) ? "을" : "를"}`;
}

function hasFinalConsonant(value: string) {
  const lastChar = value.trim().at(-1);
  if (!lastChar) return false;

  const code = lastChar.charCodeAt(0);
  if (code < 0xac00 || code > 0xd7a3) return false;

  return (code - 0xac00) % 28 !== 0;
}

function containsAny(value: string, keywords: string[]) {
  return keywords.some((keyword) => value.includes(keyword));
}

function getProjectName(input: ProjectInput) {
  return `${input.brandName} ${input.productName}`.trim() || "입력 브랜드";
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
