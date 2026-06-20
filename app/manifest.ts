import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Market Fit Lab",
    short_name: "MFL",
    description:
      "브랜드와 제품 정보를 기반으로 타겟, 경쟁사, 포지셔닝, USP, 마케팅 실행 전략을 분석하는 웹앱",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#0f172a",
    theme_color: "#0f172a",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icons/mfl-icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/mfl-icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/mfl-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
