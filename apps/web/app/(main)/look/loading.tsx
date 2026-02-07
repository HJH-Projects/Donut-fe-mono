export default function Loading() {
  return (
    <div className="min-h-screen w-full max-w-[500px] mx-auto bg-white pb-24">
      <div className="px-6 pt-12 pb-6">
        <div className="skeleton-shimmer h-10 w-24 rounded-lg bg-gray-100" />
      </div>
      <div className="px-6 space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-5 rounded-2xl border border-gray-100">
            <div className="skeleton-shimmer h-5 w-40 rounded bg-gray-100 mb-3" />
            <div className="flex gap-2 mb-3">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="skeleton-shimmer h-6 w-16 rounded-full bg-gray-100" />
              ))}
            </div>
            <div className="flex gap-2">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="skeleton-shimmer w-14 h-14 rounded-xl bg-gray-100" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
