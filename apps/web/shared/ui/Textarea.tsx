'use client';

import type { TextareaHTMLAttributes } from 'react';
import { cn } from '@/shared/ui/cn';

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        'w-full resize-none rounded-xl border-[1.5px] border-[#E5E5E5] px-4 py-2.5 text-[13px] font-normal text-black outline-none placeholder-gray-400',
        className,
      )}
      {...props}
    />
  );
}
