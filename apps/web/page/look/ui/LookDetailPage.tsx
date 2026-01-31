import Link from 'next/link';
import type { LookItem } from '@/shared/api/looks';
import { BackButton } from '@/shared/ui/BackButton';

type Props = {
  detail: LookItem;
};

export const LookDetailPage = ({ detail }: Props) => {
  return (
    <main className="min-h-screen bg-white pb-24">
      <header className="flex items-center justify-between px-6 pt-6 pb-4">
        <BackButton />
        <h1 className="text-xl font-semibold text-gray-900">{detail.name}</h1>
        <button type="button" className="text-gray-900" aria-label="공유하기">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 16v-7m0 0l-3 3m3-3l3 3M5 20h14a1 1 0 001-1v-3M4 16v3a1 1 0 001 1"
            />
          </svg>
        </button>
      </header>

      <section className="px-6">
        <div className="grid grid-cols-2 gap-3">
          {detail.items.map((item) => {
            const href = item.clothesId ? `/closet/${item.clothesId}` : undefined;
            const Card = (
              <div className="aspect-square overflow-hidden rounded-2xl bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.clothes?.imageUrl}
                  alt={item.clothes?.title ?? '옷'}
                  className="h-full w-full object-cover"
                />
              </div>
            );

            if (!href) return <div key={item.id}>{Card}</div>;

            return (
              <Link key={item.id} href={href}>
                {Card}
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
};
