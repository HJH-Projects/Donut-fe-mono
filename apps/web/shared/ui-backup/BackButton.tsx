 'use client';

import { useRouter } from 'next/navigation';

type Props = {
  className?: string;
  ariaLabel?: string;
};

export const BackButton = ({ className, ariaLabel = '뒤로가기' }: Props) => {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className={className ?? 'text-gray-900'}
      aria-label={ariaLabel}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        className="h-6 w-6"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
      </svg>
    </button>
  );
};
