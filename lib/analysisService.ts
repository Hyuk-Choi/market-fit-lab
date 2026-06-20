import { mockOpenAIAnalysis } from "@/data/mockOpenAIAnalysis";
import type { MarketingAnalysis, ProjectInput } from "@/lib/types";

export async function getMarketingAnalysis(
  input: ProjectInput,
): Promise<MarketingAnalysis> {
  await new Promise((resolve) => setTimeout(resolve, 700));
  const projectName = `${input.brandName} ${input.productName}`;

  return {
    ...mockOpenAIAnalysis,
    executiveSummary: {
      ...mockOpenAIAnalysis.executiveSummary,
      oneLineInsight: `${projectName}은 ${input.currentTarget}에게 ‘간편하지만 전문적인 관리 루틴’으로 제안하는 것이 적합함.`,
    },
    finalReport: mockOpenAIAnalysis.finalReport.replaceAll(
      "오딧세이 블랙 스페셜 세트",
      projectName,
    ),
  };
}
