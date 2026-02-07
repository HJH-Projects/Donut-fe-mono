export default function Loading() {
  return (
    <div className="min-h-screen w-full max-w-[500px] mx-auto bg-white pb-24">
      <div className="px-6 pt-12 pb-6">
        <div className="skeleton-shimmer h-10 w-36 rounded-lg bg-gray-100 mb-2" />
        <div className="skeleton-shimmer h-5 w-48 rounded bg-gray-100" />
      </div>
      <div className="px-6">
        <div className="skeleton-shimmer h-64 rounded-2xl bg-gray-100 mb-6" />
        <div className="skeleton-shimmer h-40 rounded-2xl bg-gray-100" />
      </div>
    </div>
  );
}
