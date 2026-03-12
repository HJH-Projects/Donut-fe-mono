import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

type HeaderBackLinkProps = {
  href: string;
  disableHover?: boolean;
};

export function HeaderBackLink({ href, disableHover = false }: HeaderBackLinkProps) {
  return (
    <Link
      href={href}
      className={`p-2 -ml-2 ${disableHover ? '' : 'hover:bg-gray-50 transition-colors'}`}
      style={{ borderRadius: 'var(--radius-md)' }}
    >
      <ChevronLeft size={24} color="#000" strokeWidth={2} />
    </Link>
  );
}
