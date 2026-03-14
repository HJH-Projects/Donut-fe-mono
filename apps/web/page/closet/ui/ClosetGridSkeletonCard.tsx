export function ClosetGridSkeletonCard() {
  return (
    <div>
      <div className="aspect-square bg-gray-100 skeleton-shimmer rounded-2xl" />
      <div className="mt-2 space-y-1.5">
        <div className="h-[13px] bg-gray-100 skeleton-shimmer rounded w-3/4" />
        <div className="h-[11px] bg-gray-100 skeleton-shimmer rounded w-1/2" />
      </div>
    </div>
  );
}
