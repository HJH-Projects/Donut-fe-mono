import { Metadata } from 'next';
import { Suspense } from 'react';
import { LoginPage } from '@/page/login/ui/LoginPage';

export const metadata: Metadata = {
  title: '로그인 | Donut',
  description: 'Donut 옷장과 함께하는 스마트한 패션 생활',
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <LoginPage />
    </Suspense>
  );
}
