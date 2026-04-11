'use client';

import type { InputHTMLAttributes } from 'react';
import { cn } from '@/shared/ui/cn';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  intent?: 'default' | 'subtle';
};

export function Input({ className, intent = 'default', ...props }: InputProps) {
  return (
    <input
      className={cn(
        'w-full outline-none text-black placeholder-gray-400',
        intent === 'default' &&
          'rounded-xl border-[1.5px] border-[#E5E5E5] px-4 py-3 text-[13px] font-normal',
        intent === 'subtle' &&
          'rounded-xl border border-[#E5E5E5] bg-[#F9FAFB] px-4 py-3 text-sm font-normal',
        className,
      )}
      {...props}
    />
  );
}
