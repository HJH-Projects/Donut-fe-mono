import Link from 'next/link';

const NAV_ITEMS = [
  { href: '/', label: '홈' },
  { href: '/closet', label: '옷장' },
  { href: '/look', label: '룩' },
  { href: '/my', label: '마이' },
];

export const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white">
      <div className="mx-auto flex max-w-md items-center justify-around py-4">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-sm font-medium text-gray-700"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
};
