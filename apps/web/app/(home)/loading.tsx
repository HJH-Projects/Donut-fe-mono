import { BottomNav } from '@/shared/ui/BottomNav';

const HomeLoading = () => {
  return (
    <main className="min-h-screen bg-white pb-24">
      <header className="px-6 pt-6 pb-4">
        <h1 className="text-xl font-semibold text-gray-900">Donut</h1>
      </header>
      <section className="px-6">
        <div className="rounded-2xl border border-gray-200 p-4">
          <div className="h-4 w-24 animate-pulse rounded bg-gray-100" />
          <div className="mt-3 flex items-end gap-3">
            <div className="h-8 w-20 animate-pulse rounded bg-gray-100" />
            <div className="h-4 w-40 animate-pulse rounded bg-gray-100" />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <div className="h-3 w-16 animate-pulse rounded bg-gray-100" />
            <div className="h-3 w-16 animate-pulse rounded bg-gray-100" />
            <div className="h-3 w-16 animate-pulse rounded bg-gray-100" />
          </div>
          <div className="mt-4 h-4 w-48 animate-pulse rounded bg-gray-100" />
        </div>
      </section>
      <section className="mt-6 px-6">
        <div className="h-[60vh] w-full overflow-hidden rounded-3xl bg-gray-100 animate-pulse" />
      </section>
      <BottomNav />
    </main>
  );
};

export default HomeLoading;
