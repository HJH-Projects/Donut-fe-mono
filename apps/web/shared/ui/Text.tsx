'use client';

import type { ElementType, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/ui/cn';

const textVariants = cva('', {
  variants: {
    variant: {
      titleLg: 'text-[28px] font-bold tracking-[-0.02em] text-black',
      titleMd: 'text-[20px] font-bold text-black',
      titleSm: 'text-[18px] font-semibold text-black',
      body: 'text-sm font-normal text-black',
      bodyStrong: 'text-sm font-semibold text-black',
      caption: 'text-[13px] font-normal text-[#666]',
      captionStrong: 'text-[13px] font-medium text-[#666]',
      meta: 'text-[11px] font-normal text-[#999]',
      sectionLabel:
        "text-[13px] font-semibold uppercase tracking-[0.08em] text-[#737373]",
    },
  },
  defaultVariants: {
    variant: 'body',
  },
});

type TextProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  className?: string;
} & VariantProps<typeof textVariants>;

export function Text<T extends ElementType = 'p'>({
  as,
  children,
  className,
  variant,
}: TextProps<T>) {
  const Component = as || 'p';
  return <Component className={cn(textVariants({ variant }), className)}>{children}</Component>;
}
