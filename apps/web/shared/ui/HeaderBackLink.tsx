import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export function HeaderBackLink({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="p-2 hover:bg-gray-50 transition-colors -ml-2"
      style={{ borderRadius: 'var(--radius-md)' }}
    >
      <ChevronLeft size={24} color="#000" strokeWidth={2} />
    </Link>
  );
}
