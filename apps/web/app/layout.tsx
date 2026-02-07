import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { I18nProvider } from "@/shared/i18n/I18nProvider";
import { MSWProvider } from "@/shared/providers/MSWProvider";
import "./globals.css";

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
        className={`${playfair.variable} ${inter.variable} antialiased`}
      >
        <div className="mx-auto w-full max-w-[500px]">
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
