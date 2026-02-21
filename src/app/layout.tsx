import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-kr",
  display: "swap",
});

export const metadata: Metadata = {
  title: "냥멍천명 - AI 반려동물 관상 분석",
  description:
    "반려동물 사진 한 장으로 AI가 관상을 분석합니다. 복덩이 지수, 전생 스토리, 주인 궁합까지!",
  openGraph: {
    title: "냥멍천명 - AI 반려동물 관상 분석",
    description:
      "반려동물 사진 한 장으로 AI가 관상을 분석합니다. 복덩이 지수, 전생 스토리, 주인 궁합까지!",
    type: "website",
    locale: "ko_KR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        {/* 카카오 AdFit */}
        <Script
          src="//t1.daumcdn.net/kas/static/ba.min.js"
          strategy="afterInteractive"
        />
        {/* Google AdSense (선택) */}
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </head>
      <body
        className={`${notoSansKr.variable} font-sans antialiased bg-pet-dark text-pet-light paws-bg`}
      >
        <div className="max-w-lg mx-auto min-h-dvh relative flex flex-col">
          {children}
          <footer className="mt-auto py-4 px-4 text-center text-xs text-pet-cream/50 border-t border-pet-apricot/10 space-y-1">
            <p>
              본 서비스는 엔터테인먼트 목적이며, AI 관상 분석은 과학적 근거에
              기반하지 않습니다.
            </p>
            <p>
              반려동물의 건강 관련 사항은 반드시 수의사와 상담하세요.
            </p>
            <p className="flex items-center justify-center gap-1">
              <span>&#128274;</span> 모든 사진은 AI 분석 후 즉시 삭제됩니다
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}
