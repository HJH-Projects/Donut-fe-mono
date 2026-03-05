export function LookListSkeleton() {
  return (
    <>
      {/* 개수 표시 영역 높이 확보 */}
      <div className="flex-shrink-0 px-6 pb-2 pt-1 flex justify-end">
        <div className="h-[16px] w-10 bg-gray-100 skeleton-shimmer rounded" />
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        <div className="px-6" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              style={{
                padding: '16px',
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.06)',
              }}
            >
              {/* 이미지 갤러리 placeholder */}
              <div className="py-3 flex gap-2 px-4">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div
                    key={j}
                    className="w-[64px] h-[64px] bg-gray-100 skeleton-shimmer flex-shrink-0"
                    style={{ borderRadius: '100px' }}
                  />
                ))}
              </div>

              {/* 이름 placeholder */}
              <div className="px-4 pt-2 mb-2">
                <div className="h-[20px] w-2/3 bg-gray-100 skeleton-shimmer rounded" />
              </div>

              {/* 태그 + 아이템 개수 placeholder */}
              <div className="px-4 flex gap-2 mb-8">
                <div className="h-5 w-16 bg-gray-100 skeleton-shimmer rounded-full" />
                <div className="h-5 w-16 bg-gray-100 skeleton-shimmer rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
