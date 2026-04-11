'use client';

import type { HTMLAttributes, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/ui/cn';

const cardVariants = cva('bg-white', {
  variants: {
    variant: {
      surface: 'rounded-2xl border border-[#E5E5E5]',
      elevated:
        'rounded-2xl shadow-[0_-2px_8px_rgba(0,0,0,0.04),0_6px_16px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)]',
      outlined: 'rounded-[var(--radius-lg)] border border-[#E5E5E5]',
    },
    interactive: {
      true: 'transition-all hover:bg-gray-50',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'surface',
    interactive: false,
  },
});

type CardProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof cardVariants> & {
    children: ReactNode;
    as?: 'div' | 'section' | 'article';
  };

export function Card({
  as = 'div',
  children,
  className,
  variant,
  interactive,
  ...props
}: CardProps) {
  const Component = as;
  return (
    <Component className={cn(cardVariants({ variant, interactive }), className)} {...props}>
      {children}
    </Component>
  );
}
