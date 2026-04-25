import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import './globals.css';
import { I18nProvider } from '@/shared/model/i18n/I18nProvider';
import { MSWProvider } from '@/shared/model/providers/MSWProvider';
import { ToastProvider } from '@/shared/ui/ToastProvider';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'OOTD',
  description: '오늘의 코디',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={` ${inter.variable} antialiased bg-[#f5f5f5]`}>
        <div className="mx-auto w-full max-w-[500px]">
          <I18nProvider>
            <MSWProvider>
              <ToastProvider>{children}</ToastProvider>
            </MSWProvider>
          </I18nProvider>
        </div>
      </body>
    </html>
  );
}
