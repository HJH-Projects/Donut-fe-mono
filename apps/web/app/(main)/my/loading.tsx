export default function Loading() {
  return (
    <div className="min-h-screen w-full max-w-[500px] mx-auto bg-white pb-24">
      <div className="px-6 pt-12 pb-10">
        <div className="skeleton-shimmer h-12 w-28 rounded-lg bg-gray-100" />
      </div>
      <div className="px-6 mb-8">
        <div className="skeleton-shimmer p-8 rounded-2xl bg-gray-100 h-44" />
      </div>
      <div className="px-6 space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton-shimmer h-16 rounded-xl bg-gray-100" />
        ))}
      </div>
    </div>
  );
}
