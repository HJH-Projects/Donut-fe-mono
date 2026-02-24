import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";

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
