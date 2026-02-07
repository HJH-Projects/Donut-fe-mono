export default function Loading() {
  return (
    <div className="min-h-screen w-full max-w-[500px] mx-auto bg-white pb-24">
      <div className="px-6 pt-12 pb-6">
        <div className="skeleton-shimmer h-10 w-32 rounded-lg bg-gray-100" />
      </div>
      <div className="px-6">
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i}>
              <div className="skeleton-shimmer aspect-square rounded-2xl bg-gray-100" />
              <div className="skeleton-shimmer mt-2 h-4 w-3/4 rounded bg-gray-100" />
              <div className="skeleton-shimmer mt-1 h-3 w-1/2 rounded bg-gray-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
