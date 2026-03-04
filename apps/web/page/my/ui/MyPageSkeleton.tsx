'use client';

import { ChevronRight, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Gender } from '@/shared/model/gender';

interface MyPageSkeletonProps {
  initialGender?: Gender;
}

export function MyPageSkeleton({ initialGender: _ }: MyPageSkeletonProps) {
  const { t } = useTranslation();

  return (
    <div
      className="flex-1 min-h-0 w-full flex flex-col overflow-y-auto pb-24"
      style={{ backgroundColor: '#FFFFFF' }}
    >
      {/* 상단 타이틀 */}
      <div className="flex-shrink-0 px-6 pt-12 pb-10">
        <h1
          className="text-black"
          style={{
            fontFamily: "var(--font-playfair), 'Playfair Display', serif",
            fontSize: '42px',
            fontWeight: 700,
            fontStyle: 'italic',
            lineHeight: '1.1',
          }}
        >
          {'Donut'}
        </h1>
      </div>

      {/* 프로필 카드 - 검은 박스 + 반투명 플레이스홀더 */}
      <div className="px-6 mb-8">
        <div
          className="p-8"
          style={{
            backgroundColor: '#000000',
            borderRadius: 'var(--radius-xl)',
          }}
        >
          {/* 닉네임 placeholder */}
          <div className="flex items-center justify-between mb-2">
            <div
              className="h-7 w-36 rounded-md animate-pulse"
              style={{ background: 'rgba(255,255,255,0.15)' }}
            />
          </div>

          {/* 이메일 placeholder */}
          <div
            className="h-4 w-44 rounded mb-6 animate-pulse"
            style={{ background: 'rgba(255,255,255,0.10)' }}
          />

          {/* 통계 placeholder */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <div
                className="h-9 w-10 rounded mb-1 animate-pulse"
                style={{ background: 'rgba(255,255,255,0.15)' }}
              />
              <div
                className="h-3 w-16 rounded animate-pulse"
                style={{ background: 'rgba(255,255,255,0.10)' }}
              />
            </div>
            <div>
              <div
                className="h-9 w-10 rounded mb-1 animate-pulse"
                style={{ background: 'rgba(255,255,255,0.15)' }}
              />
              <div
                className="h-3 w-16 rounded animate-pulse"
                style={{ background: 'rgba(255,255,255,0.10)' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 메뉴 섹션 */}
      <div className="px-6">
        {/* 환경설정 */}
        <h3
          className="mb-4"
          style={{
            fontFamily: "var(--font-inter), 'Inter', sans-serif",
            fontSize: '13px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#737373',
          }}
        >
          {t('profile.settings')}
        </h3>
        <div className="space-y-2 mb-8">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-full px-6 py-5 flex items-center justify-between"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E5E5E5',
                borderRadius: 'var(--radius-lg)',
              }}
            >
              <div className="h-5 w-28 bg-gray-100 skeleton-shimmer rounded" />
              <ChevronRight size={20} color="#A3A3A3" strokeWidth={2} />
            </div>
          ))}
        </div>

        {/* 고객지원 */}
        <h3
          className="mb-4"
          style={{
            fontFamily: "var(--font-inter), 'Inter', sans-serif",
            fontSize: '13px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#737373',
          }}
        >
          {t('profile.support')}
        </h3>
        <div className="space-y-2 mb-8">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-full px-6 py-5 flex items-center justify-between"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E5E5E5',
                borderRadius: 'var(--radius-lg)',
              }}
            >
              <div className="h-5 w-28 bg-gray-100 skeleton-shimmer rounded" />
              <ChevronRight size={20} color="#A3A3A3" strokeWidth={2} />
            </div>
          ))}
        </div>

        {/* 로그아웃 버튼 (비활성화 상태로 표시) */}
        <button
          disabled
          className="w-full px-6 py-5 flex items-center justify-center gap-3 opacity-60 mt-4"
          style={{
            backgroundColor: '#000000',
            borderRadius: 'var(--radius-pill)',
          }}
        >
          <LogOut size={18} color="#FFFFFF" strokeWidth={2} />
          <span
            className="text-white"
            style={{
              fontFamily: "var(--font-inter), 'Inter', sans-serif",
              fontSize: '16px',
              fontWeight: 700,
            }}
          >
            {t('profile.logout')}
          </span>
        </button>
      </div>
    </div>
  );
}
