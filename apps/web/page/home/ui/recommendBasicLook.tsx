'use client';

import { Lightbulb } from 'lucide-react';
import type { HomeRecommendation } from './home.types';

interface RecommendBasicLookProps {
  isLoading: boolean;
  recommendation: HomeRecommendation;
  tips?: string[];
}

const RecommendBasicLook = ({ isLoading, recommendation, tips }: RecommendBasicLookProps) => {
  return (
    <>
      <div className="flex-1 px-6 relative min-h-[50vh] flex items-center">
        {isLoading ? (
          <div
            className="relative w-full h-full overflow-hidden flex items-center justify-center skeleton-shimmer"
            style={{ borderRadius: '32px', backgroundColor: '#FAFAFA' }}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-32 h-32 rounded-full" style={{ backgroundColor: '#F5F5F5' }} />
              <div
                className="w-40 h-4"
                style={{ borderRadius: '8px', backgroundColor: '#F5F5F5' }}
              />
            </div>
          </div>
        ) : (
          <div
            className="relative w-full h-full overflow-hidden bg-white"
            style={{ borderRadius: '32px' }}
          >
            {recommendation.imageUrl ? (
              <img
                src={recommendation.imageUrl}
                alt={recommendation.description || '추천 코디'}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-50">
                <p
                  className="text-[#999]"
                  style={{
                    fontFamily: "var(--font-inter), 'Inter', sans-serif",
                    fontSize: '14px',
                    fontWeight: 400,
                  }}
                >
                  코디 이미지
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="shrink-0 px-6 pb-24 pt-2">
        {isLoading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <div
                className="w-3 h-3 rounded skeleton-shimmer"
                style={{ backgroundColor: '#F5F5F5' }}
              />
              <div
                className="w-8 h-3 rounded skeleton-shimmer"
                style={{ backgroundColor: '#F5F5F5' }}
              />
            </div>
            <div className="flex flex-col gap-1.5 items-center">
              <div
                className="w-64 h-3 rounded skeleton-shimmer"
                style={{ backgroundColor: '#F5F5F5' }}
              />
              <div
                className="w-56 h-3 rounded skeleton-shimmer"
                style={{ backgroundColor: '#F5F5F5' }}
              />
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <Lightbulb size={12} color="#555555" strokeWidth={1.5} />
              <p
                className="text-[#555555]"
                style={{
                  fontFamily: "var(--font-inter), 'Inter', sans-serif",
                  fontSize: '10px',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                }}
              >
                TIP
              </p>
            </div>
            <p
              className="text-[#555555] text-center px-8"
              style={{
                fontFamily: "var(--font-inter), 'Inter', sans-serif",
                fontSize: '11px',
                fontWeight: 400,
                lineHeight: '1.3',
              }}
            >
              {tips?.join(' · ')}
            </p>
          </>
        )}
      </div>
    </>
  );
};

export default RecommendBasicLook;
