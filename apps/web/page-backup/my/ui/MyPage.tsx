'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserProfile, UserStats } from '@/shared/api/users';
import { logout } from '@/shared/api/auth';
import { BottomNav } from '@/shared/ui/BottomNav';

type Props = {
  profile: UserProfile;
  stats: UserStats;
};

const TEMPERATURE_UNITS = [
  { value: 'C', label: '섭씨 (°C)' },
  { value: 'F', label: '화씨 (°F)' },
];

const LANGUAGES = [
  { value: 'KR', label: '한국어' },
  { value: 'EN', label: 'English' },
  { value: 'JP', label: '日本語' },
];

export const MyPage = ({ profile, stats }: Props) => {
  const router = useRouter();
  const [temperatureUnit, setTemperatureUnit] = useState('C');
  const [language, setLanguage] = useState('KR');
  const [notifications, setNotifications] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  const [showTempPopover, setShowTempPopover] = useState(false);
  const [showLangPopover, setShowLangPopover] = useState(false);
  const tempRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tempRef.current && !tempRef.current.contains(event.target as Node)) {
        setShowTempPopover(false);
      }
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setShowLangPopover(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logout();
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error(error);
      alert('로그아웃에 실패했습니다.');
      setLoggingOut(false);
    }
  };

  return (
    <main className="min-h-screen bg-white pb-24">
      <header className="px-6 pt-6 pb-4">
        <h1 className="text-xl font-semibold text-gray-900">마이</h1>
      </header>

      <section className="px-6">
        {/* Profile Card */}
        <div className="rounded-2xl border border-gray-200 p-4">
          <h2 className="text-lg font-semibold text-gray-900">{profile.nickname}</h2>
          <p className="mt-1 text-sm text-gray-400">{profile.email ?? '이메일 없음'}</p>
        </div>

        {/* Stats with Icons */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-gray-200 p-3 text-center">
            <div className="flex flex-col items-center gap-1">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6 text-gray-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              <p className="text-xs text-gray-500">옷장</p>
              <p className="text-base font-semibold text-gray-900">{stats.closetCount}</p>
            </div>
          </div>
          <div className="rounded-2xl border border-gray-200 p-3 text-center">
            <div className="flex flex-col items-center gap-1">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6 text-gray-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
              </svg>
              <p className="text-xs text-gray-500">룩</p>
              <p className="text-base font-semibold text-gray-900">{stats.lookCount}</p>
            </div>
          </div>
          <div className="rounded-2xl border border-gray-200 p-3 text-center">
            <div className="flex flex-col items-center gap-1">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6 text-gray-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
              </svg>
              <p className="text-xs text-gray-500">등급</p>
              <p className="text-base font-semibold text-gray-900">{stats.grade}</p>
            </div>
          </div>
        </div>

        {/* Progress */}
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
        {/* Settings */}
        <div className="rounded-2xl border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-700">환경설정</h3>
          <div className="mt-3 space-y-3 text-sm text-gray-600">
            {/* Temperature Unit */}
            <div className="relative flex items-center justify-between" ref={tempRef}>
              <span>온도 단위</span>
              <button
                onClick={() => setShowTempPopover((prev) => !prev)}
                className="rounded-full border border-gray-200 px-3 py-1"
              >
                {temperatureUnit === 'C' ? '°C' : '°F'}
              </button>
              {showTempPopover && (
                <div className="absolute right-0 top-full z-50 mt-2 w-40 rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
                  {TEMPERATURE_UNITS.map((unit) => (
                    <button
                      key={unit.value}
                      onClick={() => {
                        setTemperatureUnit(unit.value);
                        setShowTempPopover(false);
                      }}
                      className={`w-full rounded-lg px-3 py-2 text-left text-sm ${
                        temperatureUnit === unit.value
                          ? 'bg-gray-100 font-medium'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      {unit.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Language */}
            <div className="relative flex items-center justify-between" ref={langRef}>
              <span>언어</span>
              <button
                onClick={() => setShowLangPopover((prev) => !prev)}
                className="rounded-full border border-gray-200 px-3 py-1"
              >
                {LANGUAGES.find((l) => l.value === language)?.label}
              </button>
              {showLangPopover && (
                <div className="absolute right-0 top-full z-50 mt-2 w-40 rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.value}
                      onClick={() => {
                        setLanguage(lang.value);
                        setShowLangPopover(false);
                      }}
                      className={`w-full rounded-lg px-3 py-2 text-left text-sm ${
                        language === lang.value
                          ? 'bg-gray-100 font-medium'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notifications */}
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

        {/* Support */}
        <div className="rounded-2xl border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-700">고객 지원</h3>
          <div className="mt-3 space-y-2 text-sm text-gray-600">
            <p>도움말</p>
            <p>문의하기</p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 py-3 text-sm text-gray-700 disabled:opacity-60"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
          </svg>
          {loggingOut ? '로그아웃 중...' : '로그아웃'}
        </button>
      </section>

      <BottomNav />
    </main>
  );
};
