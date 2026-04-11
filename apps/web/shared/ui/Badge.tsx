'use client';

import type { HTMLAttributes, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/ui/cn';

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-full px-2 py-0.5 text-[11px] font-semibold',
  {
    variants: {
      variant: {
        solid: 'bg-black text-white',
        muted: 'bg-[#E5E7EB] text-[#374151]',
      },
    },
    defaultVariants: {
      variant: 'solid',
    },
  },
);

type BadgeProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants> & {
    children: ReactNode;
  };

export function Badge({ className, variant, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {children}
    </span>
  );
}
