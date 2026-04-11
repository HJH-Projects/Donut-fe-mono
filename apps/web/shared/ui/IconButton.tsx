'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/shared/ui/cn';

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  tone?: 'default' | 'subtle' | 'inverse';
  size?: 'sm' | 'md';
};

export function IconButton({
  className,
  children,
  tone = 'default',
  size = 'md',
  type = 'button',
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center transition-colors',
        tone === 'default' && 'hover:bg-gray-100',
        tone === 'subtle' && 'hover:bg-[#F3F4F6]',
        tone === 'inverse' && 'bg-black hover:bg-black/90',
        size === 'sm' ? 'rounded-md p-1' : 'rounded-lg p-1.5',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
