'use client';

import { SocialLoginList } from './SocialLoginList';

export const LoginPage = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-white">
      {/* Logo Area */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-2">Donut</h1>
        <p className="text-gray-500 text-sm">
          당신의 옷장을 스마트하게 관리하세요
        </p>
      </div>

      {/* Login Buttons */}
      <SocialLoginList />
      
      {/* Footer / Caption */}
      <div className="mt-8 text-xs text-center text-gray-400">
        <p>로그인 시 이용약관 및 개인정보처리방침에 동의하게 됩니다.</p>
      </div>
    </main>
  );
};
