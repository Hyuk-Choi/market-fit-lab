# Market Fit Lab

브랜드와 제품 정보를 기반으로 타겟, 경쟁사, 포지셔닝, USP, 실행 전략, 최종 Markdown 리포트를 정리하는 마케팅 전략 지원 웹앱입니다.

## 프로젝트 관점

이 앱은 단순히 AI가 문장을 만들어주는 앱이 아니라, 마케팅 전략 기획자가 타겟과 경쟁사를 분석할 때 사용하는 프레임워크를 대시보드로 구현한 앱입니다.

## 분석 흐름

1. 브랜드 정보 입력
2. 타겟 적합도 분석
3. 경쟁사 위협도 분석
4. 포지셔닝맵 시각화
5. USP 도출
6. 마케팅 메시지 추천
7. 실행 우선순위 제안
8. 최종 보고서 생성

## 주요 기능

- 브랜드/제품 정보 입력 기반 mock 분석 생성
- 타겟 적합도, 경쟁사 위협도, 차별화 점수, 시장 기회 점수 표시
- 점수별 산출 기준, 세부 배점, 해석 문장 제공
- 페르소나 카드와 타겟 세그먼트 분석
- 경쟁사 비교표와 위협도 시각화
- Recharts 기반 포지셔닝맵
- USP, 추천 메시지, 실행 우선순위 정리
- 마케팅 기획서에 붙여넣기 쉬운 최종 Markdown 리포트
- PWA 앱 다운로드 및 설치 아이콘 지원

## 기술 스택

- Next.js App Router
- TypeScript
- Tailwind CSS
- Recharts
- React state
- Mock analysis service

## 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000`을 열면 앱을 확인할 수 있습니다.

프로덕션 빌드 확인:

```bash
npm run build
```

품질 검사:

```bash
npm run lint
npm run typecheck
```

## 폴더 구조

```text
app/
  layout.tsx              # 앱 레이아웃 및 메타데이터
  page.tsx                # 메인 페이지
  manifest.ts             # PWA manifest
components/
  MarketFitLab.tsx        # 전체 대시보드 UI
data/
  mockInput.ts            # 오딧세이 블랙 샘플 입력값
  mockOpenAIAnalysis.ts   # 전문가 보고서 톤의 mock 분석 결과
lib/
  analysisService.ts      # 추후 OpenAI API로 교체 가능한 service layer
  scoring.ts              # 점수 산출 기준, 라벨, 색상 로직
  types.ts                # TypeScript 타입
  utils.ts                # 공용 유틸리티
public/
  icons/                  # 앱 설치용 아이콘
  sw.js                   # PWA service worker
```

## 현재 버전

현재 버전은 **Mock OpenAI Analysis**입니다.

실제 OpenAI API를 호출하지 않으며, API key가 없어도 앱은 정상 작동합니다. 분석 결과는 `data/mockOpenAIAnalysis.ts`와 `lib/analysisService.ts`의 mock service를 기본값으로 사용합니다.

## 환경 변수

실제 OpenAI API는 아직 사용하지 않지만, 향후 연결을 위해 `.env.example`에 예시 키를 포함했습니다.

```bash
cp .env.example .env.local
```

현재 mock 버전에서는 `.env.local` 파일이 없어도 실행됩니다.

## Vercel 배포

Vercel에서 기본 Next.js 설정으로 배포할 수 있습니다.

- Build Command: `npm run build`
- Development Command: `npm run dev`
- Output Directory: Next.js 기본값 사용
- Environment Variables: 현재 mock 버전에서는 필수 값 없음

## 향후 개발 계획

1. 실제 OpenAI API 연결
2. CSV/PDF 업로드 분석
3. 프로젝트 저장 기능
4. PDF 리포트 다운로드
5. Supabase 연동
