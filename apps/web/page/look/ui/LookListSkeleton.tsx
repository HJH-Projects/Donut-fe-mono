export function LookListSkeleton() {
  return (
    <>
      {/* 개수 표시 영역 높이 확보 */}
      <div className="shrink-0 px-6 pb-2 pt-1 flex justify-end">
        <div className="h-[16px] w-10 bg-gray-100 skeleton-shimmer rounded" />
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        <div className="px-6 pt-2 flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="p-4 bg-white rounded-2xl shadow-[0_-2px_8px_rgba(0,0,0,0.04),0_6px_16px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)]"
            >
              {/* 이미지 갤러리 placeholder */}
              <div className="py-3 flex gap-2 px-4">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div
                    key={j}
                    className="w-[72px] h-[72px] bg-gray-100 skeleton-shimmer shrink-0 rounded-full"
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
