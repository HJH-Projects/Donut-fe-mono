import Link from 'next/link';
import { Bell } from 'lucide-react';

export function BellAction() {
  return (
    <Link
      href="/notifications?recent=true"
      className="relative inline-flex h-10 w-10 items-center justify-center hover:opacity-70 transition-opacity"
      aria-label="알림"
    >
      <Bell size={22} color="#000" strokeWidth={2} />
      <span
        className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500"
        style={{ boxShadow: '0 0 0 1.5px white' }}
      />
    </Link>
  );
}
