import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Market Fit Lab",
  description:
    "브랜드와 제품 정보를 기반으로 타겟, 경쟁사, 포지셔닝, USP, 마케팅 실행 전략을 분석하는 웹앱",
  applicationName: "Market Fit Lab",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Market Fit Lab",
  },
  icons: {
    icon: [
      { url: "/icons/mfl-icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/mfl-icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
