import { ClosetGridSkeletonCard } from './ClosetGridSkeletonCard';

export function ClosetGridSkeleton() {
  return (
    <>
      {/* 아이템 개수 placeholder */}
      <div className="shrink-0 px-6 pb-4">
        <div className="h-[18px] w-14 rounded bg-gray-100 skeleton-shimmer" />
      </div>

      {/* 그리드 skeleton */}
      <div className="flex-1 overflow-y-auto px-6 pb-24">
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ClosetGridSkeletonCard key={i} />
          ))}
        </div>
      </div>
    </>
  );
}
