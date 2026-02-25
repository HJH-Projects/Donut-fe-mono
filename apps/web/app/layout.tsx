import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";

import Script from "next/script";
import "./globals.css";
import { I18nProvider } from "@/shared/model/i18n/I18nProvider";
import { MSWProvider } from "@/shared/model/providers/MSWProvider";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OOTD",
  description: "오늘의 코디",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <Script
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAPS_JS_KEY}&autoload=false&libraries=services`}
        strategy="afterInteractive"
      />
      <body
        className={`${playfair.variable} ${inter.variable} antialiased bg-[#f5f5f5]` } 
      >
        <div className="mx-auto w-full max-w-[500px]"  >
          <I18nProvider>
            <MSWProvider>
              {children}
            </MSWProvider>
          </I18nProvider>
        </div>
      </body>
    </html>
  );
}
