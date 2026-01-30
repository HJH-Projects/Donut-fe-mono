import { LookItem } from '@/shared/api/looks';

type Props = {
  detail: LookItem;
};

export const LookDetailPage = ({ detail }: Props) => {
  return (
    <main className="min-h-screen bg-white pb-24">
      <header className="px-6 pt-6 pb-4">
        <h1 className="text-xl font-semibold text-gray-900">{detail.name}</h1>
      </header>

      <section className="px-6">
        <div className="grid grid-cols-2 gap-3">
          {detail.items.map((item) => (
            <div key={item.id} className="aspect-square overflow-hidden rounded-2xl bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.clothes?.imageUrl}
                alt={item.clothes?.title ?? '옷'}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};
