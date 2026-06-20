"use client";

import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Clipboard,
  Copy,
  Download,
  FileText,
  Flag,
  Lightbulb,
  Loader2,
  Megaphone,
  Radar,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";

import { mockInput } from "@/data/mockInput";
import { getMarketingAnalysis } from "@/lib/analysisService";
import {
  getScoreColor,
  getScoreLabel,
  scoreColorClasses,
  scoreDefinitions,
  scoreOrder,
  type ScoreKey,
} from "@/lib/scoring";
import type {
  CompetitorProfile,
  MarketingAnalysis,
  PositioningPoint,
  ProjectInput,
  ScoreCardMetric,
  TargetSegment,
} from "@/lib/types";
import { cn } from "@/lib/utils";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

const sections = [
  { id: "summary", label: "Executive Summary", icon: Sparkles },
  { id: "target", label: "Target Analysis", icon: Users },
  { id: "competitor", label: "Competitor", icon: Radar },
  { id: "positioning", label: "Positioning Map", icon: Target },
  { id: "usp", label: "USP Strategy", icon: Flag },
  { id: "message", label: "Message", icon: Megaphone },
  { id: "action", label: "Action Plan", icon: CheckCircle2 },
  { id: "report", label: "Final Report", icon: FileText },
];

const workflowSteps = [
  {
    title: "브랜드 정보 입력",
    description: "제품, 가격, 타겟, 마케팅 목표를 입력합니다.",
    icon: Clipboard,
  },
  {
    title: "타겟 적합도 분석",
    description: "문제 강도와 구매 가능성을 점수화합니다.",
    icon: Users,
  },
  {
    title: "경쟁사 위협도 분석",
    description: "인지도, 유사도, 채널 장악력을 비교합니다.",
    icon: Radar,
  },
  {
    title: "포지셔닝맵 시각화",
    description: "우리 브랜드와 경쟁사를 같은 축에 배치합니다.",
    icon: Target,
  },
  {
    title: "USP 도출",
    description: "경쟁사 대비 강조할 차별화 포인트를 정리합니다.",
    icon: Flag,
  },
  {
    title: "마케팅 메시지 추천",
    description: "광고와 상세페이지에 쓸 카피 방향을 제안합니다.",
    icon: Megaphone,
  },
  {
    title: "실행 우선순위 제안",
    description: "High, Medium, Low 단계별 액션을 제시합니다.",
    icon: CheckCircle2,
  },
  {
    title: "최종 보고서 생성",
    description: "Markdown 전략 리포트로 복사할 수 있게 정리합니다.",
    icon: FileText,
  },
];

const productPositioningStatement =
  "이 앱은 단순히 AI가 문장을 만들어주는 앱이 아니라, 마케팅 전략 기획자가 타겟과 경쟁사를 분석할 때 사용하는 프레임워크를 대시보드로 구현한 앱입니다.";

const sectionDescriptions = {
  summary:
    "전체 분석 결과를 한눈에 요약합니다. 핵심 타겟, 경쟁 구도, 차별화 방향, 실행 우선순위를 빠르게 확인할 수 있습니다.",
  target:
    "제품과 가장 적합한 고객군을 분석합니다. 구매 동기, 고민, 정보 탐색 채널까지 함께 판단합니다.",
  competitor:
    "경쟁사의 가격, USP, 메시지, 채널, 강약점을 비교해 시장 내 위협도와 기회 영역을 분석합니다.",
  positioning:
    "우리 브랜드와 경쟁사를 같은 기준 위에 배치하여 시장 내 위치와 빈 공간을 시각적으로 확인합니다.",
  usp: "경쟁사 대비 우리 브랜드가 강조해야 할 차별화 포인트를 정리합니다.",
  message:
    "타겟의 구매 동기와 경쟁사 메시지를 바탕으로 광고와 콘텐츠에 활용할 메시지를 제안합니다.",
  action:
    "분석 결과를 실제 마케팅 실행으로 연결합니다. 우선순위, 실행 이유, 기대효과를 기준으로 정리합니다.",
  report:
    "전체 분석 내용을 마케팅 기획서에 바로 붙여넣을 수 있는 보고서 형식으로 정리합니다.",
};

export function MarketFitLab() {
  const [input, setInput] = useState<ProjectInput>(mockInput);
  const [analysis, setAnalysis] = useState<MarketingAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [installNotice, setInstallNotice] = useState("");

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    }

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    };
  }, []);

  const competitorNames = useMemo(
    () => input.competitors.split(",").map((item) => item.trim()).filter(Boolean),
    [input.competitors],
  );

  async function startAnalysis() {
    setLoading(true);
    setCopied(false);
    const result = await getMarketingAnalysis(input);
    setAnalysis(result);
    setLoading(false);
    window.setTimeout(() => {
      document.getElementById("summary")?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }

  async function copyReport() {
    if (!analysis) return;
    await copyTextToClipboard(analysis.finalReport);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  async function installApp() {
    if (installPrompt) {
      await installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      setInstallNotice(
        choice.outcome === "accepted"
          ? "설치가 시작되었습니다. 홈 화면 또는 앱 목록에서 Market Fit Lab을 확인하세요."
          : "설치를 취소했습니다. 필요할 때 다시 다운로드 버튼을 눌러주세요.",
      );
      setInstallPrompt(null);
      return;
    }

    setInstallNotice(
      "현재 브라우저에서는 자동 설치 창을 바로 띄울 수 없습니다. 주소창 또는 브라우저 메뉴의 ‘앱 설치’, ‘홈 화면에 추가’를 선택하면 동일한 MFL 아이콘으로 설치됩니다.",
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-950">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1480px] flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4">
          <div className="flex min-w-0 items-center gap-3">
            <Image
              src="/icons/mfl-icon-192.png"
              alt="Market Fit Lab icon"
              width={44}
              height={44}
              className="size-10 shrink-0 rounded-2xl shadow-lg shadow-slate-900/15 sm:size-11"
            />
            <div className="min-w-0">
              <p className="text-[11px] font-black uppercase tracking-[0.28em] text-blue-600">
                Market Fit Lab
              </p>
              <h1 className="truncate text-base font-black tracking-[-0.04em] sm:text-xl">
                Strategy Report Dashboard
              </h1>
            </div>
          </div>
          <button
            onClick={installApp}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-blue-700 sm:w-auto"
          >
            <Download size={16} />
            앱 다운로드
          </button>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-[1480px] gap-4 px-4 py-4 sm:gap-6 sm:px-6 sm:py-6 xl:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <nav className="sticky top-24 rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_12px_36px_rgba(15,23,42,0.06)]">
            <div className="mb-3 rounded-3xl bg-slate-950 p-4 text-white">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-blue-200">
                Report Index
              </p>
              <p className="mt-2 text-sm font-bold leading-5 text-slate-300">
                핵심 요약부터 실행 계획까지 빠르게 이동합니다.
              </p>
            </div>
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-bold text-slate-600 transition hover:bg-blue-50 hover:text-blue-700"
                >
                  <span className="grid size-8 place-items-center rounded-xl bg-slate-100 text-slate-500">
                    <Icon size={16} />
                  </span>
                  {section.label}
                </a>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0 space-y-5 sm:space-y-6">
          {installNotice && (
            <div className="rounded-3xl border border-blue-100 bg-blue-50 px-5 py-4 text-sm font-semibold text-blue-800">
              {installNotice}
            </div>
          )}

          <section className="min-w-0 overflow-hidden rounded-[24px] bg-slate-950 text-white shadow-2xl shadow-slate-950/15 sm:rounded-[32px]">
            <div className="grid min-w-0 gap-6 p-5 sm:gap-8 sm:p-7 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:p-10">
              <div className="flex min-w-0 flex-col justify-between gap-8 sm:gap-10">
                <div className="min-w-0">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-black text-blue-100">
                    <Sparkles size={14} />
                    Mock OpenAI Analysis
                  </span>
                  <h2 className="mt-5 max-w-2xl text-3xl font-black leading-tight tracking-[-0.05em] sm:text-4xl lg:text-5xl">
                    브랜드 정보를 입력하면 전략 보고서까지 자동 정리합니다.
                  </h2>
                  <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
                    실제 OpenAI API 대신 전문가 수준의 mock 분석 데이터를 불러오며,
                    추후 API 연결을 위해 service layer를 분리했습니다.
                  </p>
                  <div className="mt-5 rounded-[22px] border border-blue-300/20 bg-blue-400/10 p-4 text-sm font-bold leading-7 text-blue-50 sm:rounded-[26px] sm:p-5">
                    {productPositioningStatement}
                  </div>
                </div>
                <AnalysisWorkflow variant="dark" />
              </div>

              <ProjectForm
                input={input}
                competitorCount={competitorNames.length}
                loading={loading}
                onChange={setInput}
                onSubmit={startAnalysis}
              />
            </div>
          </section>

          {!analysis ? (
            <EmptyState loading={loading} />
          ) : (
            <AnalysisSections
              analysis={analysis}
              copied={copied}
              onCopyReport={copyReport}
            />
          )}
        </main>
      </div>
    </div>
  );
}

async function copyTextToClipboard(text: string) {
  if (window.isSecureContext && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall back for browsers or embedded previews that block clipboard permission.
    }
  }

  const selection = document.getSelection();
  const selectedRange =
    selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
  const textarea = document.createElement("textarea");

  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  textarea.style.top = "0";
  textarea.style.opacity = "0";

  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);

  let copied = false;
  try {
    copied = document.execCommand("copy");
  } catch {
    copied = false;
  } finally {
    document.body.removeChild(textarea);
    if (selection && selectedRange) {
      selection.removeAllRanges();
      selection.addRange(selectedRange);
    }
  }

  return copied;
}

function ProjectForm({
  input,
  competitorCount,
  loading,
  onChange,
  onSubmit,
}: {
  input: ProjectInput;
  competitorCount: number;
  loading: boolean;
  onChange: (input: ProjectInput) => void;
  onSubmit: () => void;
}) {
  const fields: {
    key: keyof ProjectInput;
    label: string;
    multiline?: boolean;
  }[] = [
    { key: "brandName", label: "브랜드명" },
    { key: "productName", label: "제품명" },
    { key: "category", label: "카테고리" },
    { key: "priceRange", label: "가격대" },
    { key: "productDescription", label: "제품 설명", multiline: true },
    { key: "keyFeatures", label: "핵심 기능", multiline: true },
    { key: "currentTarget", label: "현재 타겟", multiline: true },
    { key: "competitors", label: "경쟁사", multiline: true },
    { key: "marketingGoal", label: "마케팅 목표", multiline: true },
  ];

  return (
    <div className="min-w-0 rounded-[24px] border border-white/10 bg-white p-4 text-slate-950 shadow-2xl shadow-black/20 sm:rounded-[28px] sm:p-5">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-black tracking-[-0.04em]">프로젝트 입력</h3>
          <p className="mt-1 text-xs font-semibold text-slate-500">
            {competitorCount}개 경쟁사 입력됨
          </p>
        </div>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">
          local state
        </span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {fields.map((field) => (
          <label
            key={field.key}
            className={cn("block", field.multiline && "sm:col-span-2")}
          >
            <span className="mb-1.5 block text-xs font-black text-slate-600">
              {field.label}
            </span>
            {field.multiline ? (
              <textarea
                value={input[field.key]}
                rows={2}
                onChange={(event) =>
                  onChange({ ...input, [field.key]: event.target.value })
                }
                className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            ) : (
              <input
                value={input[field.key]}
                onChange={(event) =>
                  onChange({ ...input, [field.key]: event.target.value })
                }
                className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            )}
          </label>
        ))}
      </div>
      <button
        onClick={onSubmit}
        disabled={loading}
        className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 text-sm font-black text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? <Loader2 size={17} className="animate-spin" /> : <BarChart3 size={17} />}
        {loading ? "mock 분석 결과 생성 중..." : "분석 시작"}
      </button>
    </div>
  );
}

function EmptyState({ loading }: { loading: boolean }) {
  return (
    <section className="rounded-[24px] border border-dashed border-slate-300 bg-white p-5 text-center shadow-sm sm:rounded-[32px] sm:p-10">
      <div className="mx-auto grid size-16 place-items-center rounded-3xl bg-blue-50 text-blue-700">
        {loading ? <Loader2 className="animate-spin" /> : <Clipboard />}
      </div>
      <h3 className="mt-5 text-xl font-black tracking-[-0.04em] sm:text-2xl">
        분석 시작 버튼을 누르면 대시보드가 생성됩니다.
      </h3>
      <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-500">
        Executive Summary, 타겟 분석, 경쟁사 비교, 포지셔닝맵, USP, 메시지 전략,
        실행 우선순위, 최종 Markdown 리포트가 순서대로 표시됩니다.
      </p>
      <div className="mt-8 text-left">
        <AnalysisWorkflow variant="light" />
      </div>
    </section>
  );
}

function AnalysisWorkflow({ variant }: { variant: "dark" | "light" }) {
  const isDark = variant === "dark";

  return (
    <div
      className={cn(
        "min-w-0 rounded-[24px] border p-4 sm:rounded-[28px]",
        isDark
          ? "border-white/10 bg-white/[0.06]"
          : "border-slate-200 bg-slate-50",
      )}
    >
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
        <div>
          <p
            className={cn(
              "text-[10px] font-black uppercase tracking-[0.22em]",
              isDark ? "text-blue-200" : "text-blue-600",
            )}
          >
            Analysis Flow
          </p>
          <h3
            className={cn(
              "mt-1 text-base font-black tracking-[-0.04em] sm:text-lg",
              isDark ? "text-white" : "text-slate-950",
            )}
          >
            브랜드 정보 입력부터 최종 보고서 생성까지
          </h3>
        </div>
        <span
          className={cn(
            "rounded-full px-3 py-1 text-xs font-black",
            isDark ? "bg-white/10 text-blue-100" : "bg-blue-50 text-blue-700",
          )}
        >
          8-step workflow
        </span>
      </div>
      <div className="mt-4 grid min-w-0 gap-3 sm:grid-cols-2 2xl:grid-cols-4">
        {workflowSteps.map((step, index) => {
          const Icon = step.icon;

          return (
            <div
              key={step.title}
              className={cn(
                "min-w-0 rounded-2xl border p-4",
                isDark
                  ? "border-white/10 bg-slate-950/35"
                  : "border-slate-200 bg-white",
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <span
                  className={cn(
                    "text-xs font-black",
                    isDark ? "text-blue-200" : "text-blue-700",
                  )}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span
                  className={cn(
                    "grid size-8 place-items-center rounded-xl",
                    isDark
                      ? "bg-white/10 text-blue-100"
                      : "bg-blue-50 text-blue-700",
                  )}
                >
                  <Icon size={16} />
                </span>
              </div>
              <strong
                className={cn(
                  "mt-3 block break-keep text-sm font-black leading-5",
                  isDark ? "text-white" : "text-slate-950",
                )}
              >
                {step.title}
              </strong>
              <p
                className={cn(
                  "mt-2 text-xs font-semibold leading-5",
                  isDark ? "text-slate-400" : "text-slate-500",
                )}
              >
                {step.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AnalysisSections({
  analysis,
  copied,
  onCopyReport,
}: {
  analysis: MarketingAnalysis;
  copied: boolean;
  onCopyReport: () => void;
}) {
  return (
    <div className="min-w-0 space-y-5 sm:space-y-6">
      <SectionCard
        id="summary"
        eyebrow="Executive Summary"
        title="시장 적합성과 실행 우선순위를 한 화면에서 판단하세요."
        description={sectionDescriptions.summary}
        featured
      >
        <div className="mb-5 grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <div className="min-w-0 rounded-[24px] bg-gradient-to-br from-slate-950 via-[#172554] to-[#312e81] p-5 text-white shadow-[0_18px_50px_rgba(15,23,42,0.22)] sm:rounded-[28px] sm:p-6">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-blue-200">
              <Lightbulb size={15} />
              Strategic Conclusion
            </div>
            <p className="mt-5 text-xl font-black leading-8 tracking-[-0.04em] sm:text-2xl sm:leading-9 lg:text-3xl lg:leading-10">
              {analysis.executiveSummary.oneLineInsight}
            </p>
            <div className="mt-6 grid gap-3 md:grid-cols-3">
              <MiniConclusion
                label="핵심 타겟"
                value={analysis.targetAnalysis.coreTarget}
              />
              <MiniConclusion
                label="차별화 방향"
                value="프리미엄 멀티케어 · 2종 루틴"
              />
              <MiniConclusion
                label="실행 우선"
                value="검색광고 · 상세페이지 · 디스플레이"
              />
            </div>
          </div>
          <div className="grid gap-4">
            <InsightBox
              title="주요 발견점"
              body={analysis.executiveSummary.keyFinding}
              tone="neutral"
            />
            <InsightBox
              title="추천 전략 방향"
              body={analysis.executiveSummary.recommendedDirection}
              tone="opportunity"
            />
          </div>
        </div>
        <div className="grid min-w-0 gap-4 lg:grid-cols-2 2xl:grid-cols-4">
          {scoreOrder.map((key) => (
            <ScoreCard
              key={key}
              id={key}
              metric={analysis.scoreCards[key]}
            />
          ))}
        </div>
        <InsightBox
          title="주의해야 할 리스크"
          body={analysis.executiveSummary.risk}
          tone="risk"
          className="mt-5"
        />
      </SectionCard>

      <SectionCard
        id="target"
        eyebrow="Target Analysis"
        title="제품과 가장 적합한 고객군을 분석합니다."
        description={sectionDescriptions.target}
      >
        <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <PersonaCard analysis={analysis} />
          <div className="grid gap-4">
            <InsightBox
              title="핵심 타겟"
              body={analysis.targetAnalysis.coreTarget}
              tone="primary"
            />
            <InsightBox
              title="확장 타겟"
              body={analysis.targetAnalysis.subTarget}
              tone="neutral"
            />
            <InsightBox
              title="핵심 결론"
              body={analysis.targetAnalysis.summary}
              tone="opportunity"
            />
          </div>
        </div>
        <div className="mt-6 grid min-w-0 gap-4 md:grid-cols-2 2xl:grid-cols-4">
          {analysis.targetAnalysis.targetSegments.map((segment) => (
            <TargetSegmentCard key={segment.name} segment={segment} />
          ))}
        </div>
      </SectionCard>

      <SectionCard
        id="competitor"
        eyebrow="Competitor Analysis"
        title="경쟁사별 위협도와 기회 영역을 비교합니다."
        description={sectionDescriptions.competitor}
      >
        <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)]">
          <InsightBox
            title="경쟁 구도 요약"
            body={analysis.competitorAnalysis.summary}
            tone="neutral"
          />
          <InsightBox
            title="핵심 기회 영역"
            body={analysis.competitorAnalysis.insight}
            tone="primary"
          />
        </div>
        <CompetitorTable competitors={analysis.competitorAnalysis.competitors} />
      </SectionCard>

      <SectionCard
        id="positioning"
        eyebrow="Positioning Map"
        title="브랜드가 차지해야 할 시장 좌표를 시각화합니다."
        description={sectionDescriptions.positioning}
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
              Axis
            </p>
            <p className="mt-1 text-sm font-black text-slate-700">
              X: {analysis.positioning.xAxis} · Y: {analysis.positioning.yAxis}
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-black text-slate-600">
            <span className="inline-flex items-center gap-2">
              <span className="size-3 rounded-full bg-blue-600 ring-4 ring-blue-100" />
              우리 브랜드
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="size-3 rounded-full bg-slate-400" />
              경쟁사
            </span>
          </div>
        </div>
        <div className="overflow-x-auto rounded-[24px] border border-slate-200 bg-white p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] sm:rounded-[28px] sm:p-5">
          <div className="h-[380px] min-w-[620px] sm:h-[520px] sm:min-w-0">
            <ResponsiveContainer
              width="100%"
              height="100%"
              minWidth={320}
              minHeight={320}
              initialDimension={{ width: 620, height: 380 }}
            >
              <ScatterChart margin={{ top: 20, right: 30, bottom: 35, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="x"
                  domain={[0, 100]}
                  name={analysis.positioning.xAxis}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  label={{ value: analysis.positioning.xAxis, position: "insideBottom", offset: -20 }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  domain={[0, 100]}
                  name={analysis.positioning.yAxis}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  label={{ value: analysis.positioning.yAxis, angle: -90, position: "insideLeft" }}
                />
                <ZAxis range={[140, 190]} />
                <Tooltip content={<PositioningTooltip />} />
                <Scatter data={analysis.positioning.mapData} shape={<PositioningDot />}>
                  <LabelList dataKey="name" position="top" style={{ fontWeight: 800, fontSize: 12 }} />
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
        <p className="mt-2 text-xs font-bold text-slate-400 sm:hidden">
          포지셔닝맵은 좌우로 스크롤해 전체 좌표를 확인할 수 있습니다.
        </p>
        <InsightBox
          title="포지셔닝 해석"
          body={analysis.positioning.interpretation}
          tone="primary"
          className="mt-5"
        />
      </SectionCard>

      <SectionCard
        id="usp"
        eyebrow="USP Strategy"
        title="경쟁사와 비교했을 때 강조해야 할 차별화 포인트를 정리합니다."
        description={sectionDescriptions.usp}
      >
        <InsightBox
          title="USP 핵심 결론"
          body={analysis.uspStrategy.summary}
          tone="primary"
          className="mb-5"
        />
        <div className="grid min-w-0 gap-4 md:grid-cols-2 2xl:grid-cols-4">
          {analysis.uspStrategy.uspList.map((usp, index) => (
            <BulletCard key={usp} index={index + 1} body={usp} />
          ))}
        </div>
        <div className="mt-5 grid min-w-0 gap-4 lg:grid-cols-2">
          <InsightBox
            title="차별화 포인트"
            body={analysis.uspStrategy.differentiationPoint}
            tone="neutral"
          />
          <InsightBox
            title="시장 기회 영역"
            body={analysis.uspStrategy.opportunityArea}
            tone="opportunity"
          />
        </div>
      </SectionCard>

      <SectionCard
        id="message"
        eyebrow="Message Strategy"
        title="광고와 콘텐츠에 바로 활용할 카피 방향을 제안합니다."
        description={sectionDescriptions.message}
      >
        <InsightBox
          title="메시지 설계 원칙"
          body={analysis.messageStrategy.summary}
          tone="neutral"
          className="mb-5"
        />
        <div className="grid min-w-0 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
          {analysis.messageStrategy.messages.map((message) => (
            <div
              key={message.angle}
              className="min-w-0 rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_12px_32px_rgba(15,23,42,0.05)] sm:rounded-[28px] sm:p-5"
            >
              <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-black text-violet-700">
                {message.angle}
              </span>
              <h3 className="mt-4 text-xl font-black leading-7 tracking-[-0.05em] text-slate-950 sm:text-2xl sm:leading-8">
                {message.mainCopy}
              </h3>
              <p className="mt-3 rounded-2xl bg-blue-50 p-3 text-sm font-black leading-6 text-blue-800">
                {message.subCopy}
              </p>
              <p className="mt-4 text-sm font-medium leading-6 text-slate-500">
                {message.reason}
              </p>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        id="action"
        eyebrow="Action Plan"
        title="분석 결과를 실제 마케팅 실행으로 연결합니다."
        description={sectionDescriptions.action}
      >
        <InsightBox
          title="실행 전략 요약"
          body={analysis.actionPlan.summary}
          tone="opportunity"
          className="mb-5"
        />
        <div className="space-y-3">
          {analysis.actionPlan.priorities.map((priority) => (
            <div
              key={priority.action}
              className="grid min-w-0 gap-4 rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)] sm:rounded-[28px] sm:p-5 lg:grid-cols-[120px_minmax(0,1fr)_minmax(0,0.85fr)]"
            >
              <PriorityBadge priority={priority.priority} />
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                  실행 과제
                </p>
                <h3 className="mt-1 text-lg font-black text-slate-950">
                  {priority.action}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {priority.reason}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 text-sm font-bold leading-6 text-slate-700">
                <span className="mb-1 block text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                  Expected Impact
                </span>
                {priority.expectedImpact}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        id="report"
        eyebrow="Final Report"
        title="최종 리포트를 문서형 스타일로 확인하고 복사합니다."
        description={sectionDescriptions.report}
        action={
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <button
              onClick={onCopyReport}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-black text-white transition hover:bg-blue-700"
            >
              <Copy size={16} />
              {copied ? "복사 완료" : "Copy Report"}
            </button>
            {copied && (
              <span
                role="status"
                className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700 ring-1 ring-emerald-100"
              >
                Markdown 리포트가 복사되었습니다.
              </span>
            )}
          </div>
        }
      >
        <MarkdownReport markdown={analysis.finalReport} />
      </SectionCard>
    </div>
  );
}

function SectionCard({
  id,
  eyebrow,
  title,
  description,
  action,
  featured = false,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
  featured?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        "min-w-0 rounded-[24px] border bg-white shadow-[0_14px_42px_rgba(15,23,42,0.06)] sm:rounded-[32px]",
        featured
          ? "border-blue-100 p-5 sm:p-7 lg:p-8"
          : "border-slate-200 p-5 sm:p-6",
      )}
    >
      <div className="mb-5 flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-600">
            {eyebrow}
          </p>
          <h2
            className={cn(
              "mt-2 font-black tracking-[-0.04em] text-slate-950",
              featured
                ? "text-2xl sm:text-3xl lg:text-4xl"
                : "text-xl sm:text-2xl",
            )}
          >
            {title}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            {description}
          </p>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function MiniConclusion({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-blue-200">
        {label}
      </p>
      <p className="mt-2 text-sm font-black leading-5 text-white">{value}</p>
    </div>
  );
}

function ScoreCard({
  id,
  metric,
}: {
  id: ScoreKey;
  metric: ScoreCardMetric;
}) {
  const definition = scoreDefinitions[id];
  const score = Math.min(Math.max(metric.score, 0), 100);
  const color = getScoreColor(score);
  const theme = scoreColorClasses[color];
  const totalMaxScore = metric.criteria.reduce(
    (total, criterion) => total + criterion.maxScore,
    0,
  );

  return (
    <div className="min-w-0 rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:rounded-[28px] sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <span className="text-sm font-black text-slate-900">
            {definition.label}
          </span>
          <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">
            {definition.description}
          </p>
        </div>
        <span className={cn("w-fit shrink-0 rounded-full px-2.5 py-1 text-xs font-black", theme.badge)}>
          {getScoreLabel(score)}
        </span>
      </div>
      <div className="mt-4 flex items-end justify-between gap-3">
        <strong className="block text-4xl font-black tracking-[-0.07em] text-slate-950 sm:text-5xl">
          {score}
        </strong>
        <span className={cn("mb-1 rounded-2xl px-3 py-1 text-[11px] font-black ring-1", theme.soft, theme.text, theme.ring)}>
          100점 기준
        </span>
      </div>
      <div className="mt-4 h-2 rounded-full bg-slate-100">
        <div
          className={cn("h-2 rounded-full bg-gradient-to-r", theme.bar)}
          style={{ width: `${score}%` }}
        />
      </div>
      <div className="mt-2 flex justify-between text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
        <span>0</span>
        <span>100</span>
      </div>
      <p className="mt-4 rounded-2xl bg-slate-50 p-3 text-xs font-semibold leading-5 text-slate-600">
        <span className="font-black text-slate-900">해석: </span>
        {metric.reason}
      </p>
      <details className="group mt-3 rounded-2xl border border-slate-200 bg-white p-3">
        <summary className="flex cursor-pointer list-none flex-col gap-2 text-xs font-black text-slate-700 sm:flex-row sm:items-center sm:justify-between [&::-webkit-details-marker]:hidden">
          <span>산출 기준 보기</span>
          <span className={cn("w-fit rounded-full px-2 py-1", theme.soft, theme.text)}>
            총 {totalMaxScore}점
          </span>
        </summary>
        <div className="mt-3 space-y-3">
          {metric.criteria.map((criterion) => {
            const criterionPercent = Math.min(
              Math.max((criterion.score / criterion.maxScore) * 100, 0),
              100,
            );

            return (
              <div key={criterion.label}>
                <div className="flex items-center justify-between gap-3 text-xs">
                  <span className="font-bold text-slate-600">
                    {criterion.label}
                  </span>
                  <span className="font-black text-slate-900">
                    {criterion.score}/{criterion.maxScore}점
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 rounded-full bg-slate-100">
                  <div
                    className={cn("h-1.5 rounded-full bg-gradient-to-r", theme.bar)}
                    style={{ width: `${criterionPercent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </details>
    </div>
  );
}

function InsightBox({
  title,
  body,
  tone = "neutral",
  className,
}: {
  title: string;
  body: string;
  tone?: "primary" | "neutral" | "opportunity" | "risk";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "min-w-0 rounded-[22px] border p-4 sm:rounded-[26px] sm:p-5",
        tone === "primary" && "border-blue-100 bg-blue-50",
        tone === "opportunity" && "border-emerald-100 bg-emerald-50",
        tone === "risk" && "border-rose-100 bg-rose-50",
        tone === "neutral" && "border-slate-200 bg-slate-50",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        {tone === "risk" ? (
          <AlertTriangle size={16} className="text-rose-600" />
        ) : tone === "opportunity" ? (
          <TrendingUp size={16} className="text-emerald-600" />
        ) : tone === "primary" ? (
          <Lightbulb size={16} className="text-blue-600" />
        ) : (
          <CheckCircle2 size={16} className="text-slate-500" />
        )}
        <h3 className="text-sm font-black text-slate-900">{title}</h3>
      </div>
      <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">{body}</p>
    </div>
  );
}

function PillGroup({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mt-5">
      <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-slate-400">
        {title}
      </p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span key={item} className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function PersonaCard({ analysis }: { analysis: MarketingAnalysis }) {
  const persona = analysis.targetAnalysis.persona;

  return (
    <div className="min-w-0 rounded-[24px] bg-slate-950 p-5 text-white shadow-[0_18px_50px_rgba(15,23,42,0.2)] sm:rounded-[30px] sm:p-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-200">
            Persona Card
          </p>
          <h3 className="mt-4 text-2xl font-black tracking-[-0.04em] sm:text-3xl">
            {persona.name}
          </h3>
          <p className="mt-1 font-bold text-slate-300">
            {persona.age}세 · {persona.job}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-blue-500/15 px-3 py-1 text-xs font-black text-blue-200 ring-1 ring-blue-300/20">
          Core Target
        </span>
      </div>
      <p className="mt-5 text-sm font-medium leading-7 text-slate-300">
        {persona.lifestyle}
      </p>
      <div className="mt-6 grid gap-3 md:grid-cols-3">
        <PersonaList title="피부 고민" items={persona.painPoints.slice(0, 4)} tone="risk" />
        <PersonaList
          title="구매 동기"
          items={persona.purchaseMotivations.slice(0, 4)}
          tone="opportunity"
        />
        <PersonaList
          title="구매 장벽"
          items={persona.purchaseBarriers.slice(0, 4)}
          tone="neutral"
        />
      </div>
      <PillGroup title="정보 탐색 채널" items={persona.mediaChannels} />
    </div>
  );
}

function PersonaList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "risk" | "opportunity" | "neutral";
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
      <p
        className={cn(
          "text-[11px] font-black",
          tone === "risk" && "text-rose-200",
          tone === "opportunity" && "text-emerald-200",
          tone === "neutral" && "text-slate-300",
        )}
      >
        {title}
      </p>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-xs font-medium leading-5 text-slate-300">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-blue-300" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function TargetSegmentCard({ segment }: { segment: TargetSegment }) {
  return (
    <div className="min-w-0 rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)] sm:rounded-[28px] sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-black leading-5 text-slate-950">{segment.name}</h3>
        <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-black text-white shadow-sm">
          {segment.fitScore}점
        </span>
      </div>
      <div className="mt-4 h-2 rounded-full bg-slate-100">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-blue-600 to-violet-500"
          style={{ width: `${segment.fitScore}%` }}
        />
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-500">{segment.description}</p>
      <p className="mt-4 text-sm font-semibold leading-6 text-slate-700">{segment.reason}</p>
      <p className="mt-4 rounded-2xl bg-blue-50 p-3 text-sm font-black leading-6 text-blue-700">
        {segment.recommendedMessage}
      </p>
    </div>
  );
}

function BulletCard({ index, body }: { index: number; body: string }) {
  return (
    <div className="min-w-0 rounded-[22px] border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-4 shadow-[0_10px_28px_rgba(37,99,235,0.06)] sm:rounded-[26px] sm:p-5">
      <div className="flex items-center justify-between">
        <span className="grid size-9 place-items-center rounded-2xl bg-blue-600 text-sm font-black text-white">
          {String(index).padStart(2, "0")}
        </span>
        <Flag size={18} className="text-blue-600" />
      </div>
      <p className="mt-4 text-sm font-black leading-6 text-slate-900">{body}</p>
    </div>
  );
}

function CompetitorTable({ competitors }: { competitors: CompetitorProfile[] }) {
  return (
    <div className="mt-5 min-w-0 overflow-x-auto rounded-[24px] border border-slate-200 bg-white shadow-[0_12px_34px_rgba(15,23,42,0.05)] sm:rounded-[28px]">
      <table className="w-full min-w-[1280px] border-collapse text-left text-sm">
        <thead className="bg-slate-950 text-white">
          <tr>
            <th className="px-5 py-5 text-xs uppercase tracking-[0.16em]">브랜드</th>
            <th className="px-5 py-5 text-xs uppercase tracking-[0.16em]">가격</th>
            <th className="px-5 py-5 text-xs uppercase tracking-[0.16em]">USP</th>
            <th className="px-5 py-5 text-xs uppercase tracking-[0.16em]">강점</th>
            <th className="px-5 py-5 text-xs uppercase tracking-[0.16em]">약점</th>
            <th className="px-5 py-5 text-xs uppercase tracking-[0.16em]">톤 / 채널</th>
            <th className="px-5 py-5 text-xs uppercase tracking-[0.16em]">위협도</th>
          </tr>
        </thead>
        <tbody>
          {competitors.map((competitor) => (
            <tr
              key={competitor.name}
              className="border-t border-slate-100 align-top transition hover:bg-slate-50"
            >
              <td className="px-5 py-5">
                <p className="font-black text-slate-950">{competitor.name}</p>
                <p className="mt-1 text-xs font-bold text-slate-400">
                  competitor
                </p>
              </td>
              <td className="px-5 py-5 font-bold text-slate-600">
                {competitor.priceLevel}
              </td>
              <td className="px-5 py-5 leading-6 text-slate-600">
                {competitor.usp}
              </td>
              <td className="px-5 py-5 leading-6 text-slate-600">
                {competitor.strength}
              </td>
              <td className="px-5 py-5 leading-6 text-slate-600">
                {competitor.weakness}
              </td>
              <td className="px-5 py-5">
                <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-black text-violet-700">
                  {competitor.messageTone}
                </span>
                <p className="mt-3 max-w-[220px] text-xs font-semibold leading-5 text-slate-500">
                  {competitor.channel}
                </p>
              </td>
              <td className="px-5 py-5">
                <ThreatMeter score={competitor.threatScore} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="border-t border-slate-100 bg-slate-50 px-4 py-3 text-xs font-bold text-slate-400 sm:hidden">
        경쟁사 비교표는 좌우로 스크롤해 전체 항목을 확인할 수 있습니다.
      </p>
    </div>
  );
}

function ThreatMeter({ score }: { score: number }) {
  const high = score >= 85;
  const medium = score >= 75 && score < 85;

  return (
    <div className="min-w-[150px]">
      <span
        className={cn(
          "rounded-full px-3 py-1 text-xs font-black",
          high && "bg-rose-100 text-rose-700",
          medium && "bg-amber-100 text-amber-700",
          !high && !medium && "bg-slate-100 text-slate-600",
        )}
      >
        {score}점 · {high ? "매우 높음" : medium ? "높음" : "보통"}
      </span>
      <div className="mt-3 h-2 rounded-full bg-slate-100">
        <div
          className={cn(
            "h-2 rounded-full bg-gradient-to-r",
            high && "from-rose-500 to-orange-400",
            medium && "from-amber-400 to-orange-400",
            !high && !medium && "from-slate-400 to-slate-500",
          )}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

function PositioningTooltip({ active, payload }: { active?: boolean; payload?: { payload: PositioningPoint }[] }) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 text-sm shadow-xl">
      <p className="font-black">{point.name}</p>
      <p className="mt-1 text-slate-500">x {point.x} · y {point.y}</p>
    </div>
  );
}

function PositioningDot(props: unknown) {
  const { cx, cy, payload } = props as {
    cx?: number;
    cy?: number;
    payload?: PositioningPoint;
  };
  if (cx === undefined || cy === undefined || !payload) return null;
  const isOurs = payload.type === "ourBrand";
  return (
    <g>
      {isOurs && (
        <circle
          cx={cx}
          cy={cy}
          r={18}
          fill="#2563eb"
          opacity={0.16}
        />
      )}
      <circle
        cx={cx}
        cy={cy}
        r={isOurs ? 11 : 8}
        fill={isOurs ? "#2563eb" : "#94a3b8"}
        stroke="#ffffff"
        strokeWidth={3}
      />
    </g>
  );
}

function PriorityBadge({ priority }: { priority: "High" | "Medium" | "Low" }) {
  return (
    <div
      className={cn(
        "flex h-full min-h-16 flex-col items-center justify-center rounded-2xl px-3 py-3 text-center sm:min-h-20 sm:py-0",
        priority === "High" && "bg-rose-50 text-rose-700 ring-1 ring-rose-100",
        priority === "Medium" && "bg-amber-50 text-amber-700 ring-1 ring-amber-100",
        priority === "Low" && "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
      )}
    >
      <span className="text-[10px] font-black uppercase tracking-[0.18em]">
        Priority
      </span>
      <span className="mt-1 text-lg font-black">{priority}</span>
    </div>
  );
}

function MarkdownReport({ markdown }: { markdown: string }) {
  const lines = markdown.split("\n");

  return (
    <article className="max-h-[680px] min-w-0 overflow-auto rounded-[24px] border border-slate-200 bg-white p-4 shadow-inner sm:rounded-[28px] sm:p-6">
      <div className="mx-auto max-w-4xl space-y-3">
        {lines.map((rawLine, index) => {
          const line = rawLine.trim();
          const key = `${index}-${line}`;

          if (!line) {
            return <div key={key} className="h-2" />;
          }

          if (line.startsWith("# ")) {
            return (
              <h1
                key={key}
                className="border-b border-slate-200 pb-4 text-2xl font-black tracking-[-0.05em] text-slate-950 sm:text-3xl"
              >
                {renderInlineMarkdown(line.replace("# ", ""))}
              </h1>
            );
          }

          if (line.startsWith("## ")) {
            return (
              <h2
                key={key}
                className="pt-5 text-xl font-black tracking-[-0.03em] text-blue-800"
              >
                {renderInlineMarkdown(line.replace("## ", ""))}
              </h2>
            );
          }

          if (line.startsWith("### ")) {
            return (
              <h3
                key={key}
                className="pt-3 text-base font-black text-slate-900"
              >
                {renderInlineMarkdown(line.replace("### ", ""))}
              </h3>
            );
          }

          if (line.startsWith("- ")) {
            return (
              <p key={key} className="flex min-w-0 gap-3 text-sm font-semibold leading-7 text-slate-700">
                <span className="mt-3 size-1.5 shrink-0 rounded-full bg-blue-600" />
                <span>{renderInlineMarkdown(line.replace("- ", ""))}</span>
              </p>
            );
          }

          if (/^\d+\.\s/.test(line)) {
            return (
              <p key={key} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold leading-7 text-slate-700">
                {renderInlineMarkdown(line)}
              </p>
            );
          }

          return (
            <p key={key} className="text-sm font-medium leading-7 text-slate-600">
              {renderInlineMarkdown(line)}
            </p>
          );
        })}
      </div>
    </article>
  );
}

function renderInlineMarkdown(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={`${part}-${index}`} className="font-black text-slate-950">
          {part.slice(2, -2)}
        </strong>
      );
    }

    return part;
  });
}
