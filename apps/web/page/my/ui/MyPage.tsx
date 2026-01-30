'use client';

import { useState } from 'react';
import { UserProfile, UserStats } from '@/shared/api/users';
import { BottomNav } from '@/shared/ui/BottomNav';

type Props = {
  profile: UserProfile;
  stats: UserStats;
};

export const MyPage = ({ profile, stats }: Props) => {
  const [temperatureUnit, setTemperatureUnit] = useState('C');
  const [language, setLanguage] = useState('KR');
  const [notifications, setNotifications] = useState(true);

  return (
    <main className="min-h-screen bg-white pb-24">
      <header className="px-6 pt-6 pb-4">
        <h1 className="text-xl font-semibold text-gray-900">마이</h1>
      </header>

      <section className="px-6">
        <div className="rounded-2xl border border-gray-200 p-4">
          <p className="text-sm text-gray-500">{profile.email ?? '이메일 없음'}</p>
          <h2 className="mt-1 text-lg font-semibold text-gray-900">{profile.nickname}</h2>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-gray-200 p-3 text-center">
            <p className="text-xs text-gray-500">옷장</p>
            <p className="mt-1 text-base font-semibold text-gray-900">{stats.closetCount}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 p-3 text-center">
            <p className="text-xs text-gray-500">룩</p>
            <p className="mt-1 text-base font-semibold text-gray-900">{stats.lookCount}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 p-3 text-center">
            <p className="text-xs text-gray-500">등급</p>
            <p className="mt-1 text-base font-semibold text-gray-900">{stats.grade}</p>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-gray-200 p-4">
          <p className="text-sm text-gray-500">다음 등급까지</p>
          <div className="mt-2 h-2 w-full rounded-full bg-gray-100">
            <div
              className="h-2 rounded-full bg-black"
              style={{ width: `${Math.round(stats.gradeProgress * 100)}%` }}
            />
          </div>
        </div>
      </section>

      <section className="mt-6 px-6 space-y-4">
        <div className="rounded-2xl border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-700">환경설정</h3>
          <div className="mt-3 space-y-3 text-sm text-gray-600">
            <div className="flex items-center justify-between">
              <span>온도 단위</span>
              <button
                onClick={() => setTemperatureUnit((prev) => (prev === 'C' ? 'F' : 'C'))}
                className="rounded-full border border-gray-200 px-3 py-1"
              >
                {temperatureUnit}
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span>언어</span>
              <button
                onClick={() => setLanguage((prev) => (prev === 'KR' ? 'EN' : 'KR'))}
                className="rounded-full border border-gray-200 px-3 py-1"
              >
                {language}
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span>알림</span>
              <button
                onClick={() => setNotifications((prev) => !prev)}
                className="rounded-full border border-gray-200 px-3 py-1"
              >
                {notifications ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-700">고객 지원</h3>
          <div className="mt-3 space-y-2 text-sm text-gray-600">
            <p>도움말</p>
            <p>문의하기</p>
          </div>
        </div>

        <button className="w-full rounded-2xl border border-gray-200 py-3 text-sm text-gray-700">
          로그아웃
        </button>
      </section>

      <BottomNav />
    </main>
  );
};
