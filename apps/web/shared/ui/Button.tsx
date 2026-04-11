'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/shared/ui/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 transition-all disabled:cursor-not-allowed disabled:opacity-60',
  {
    variants: {
      variant: {
        solid: 'bg-black text-white hover:opacity-90',
        secondary: 'border-[1.5px] border-[#E5E5E5] bg-white text-black hover:bg-gray-50',
        subtle: 'bg-[#F3F4F6] text-black hover:opacity-90',
        kakao: 'bg-[#FEE500] text-[#3C1E1E] hover:opacity-90',
        danger: 'bg-red-500 text-white hover:opacity-90',
        ghost: 'bg-transparent text-[#555555] hover:opacity-70 disabled:opacity-40',
      },
      size: {
        sm: 'px-3 py-1.5 text-[12px] font-medium rounded-2xl',
        md: 'px-4 py-3 text-sm font-semibold rounded-xl',
        lg: 'px-5 py-3 text-sm font-semibold rounded-xl',
        xl: 'py-4 text-sm font-semibold rounded-[var(--radius-pill)]',
        icon: 'p-1.5 rounded-lg',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'solid',
      size: 'md',
      fullWidth: false,
    },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    children: ReactNode;
  };

export function Button({
  className,
  variant,
  size,
  fullWidth,
  type = 'button',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      {...props}
    >
      {children}
    </button>
  );
}

export { buttonVariants };
