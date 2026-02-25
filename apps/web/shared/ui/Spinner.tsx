import type { HTMLAttributes } from 'react';

type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg';
type SpinnerVariant = 'ring';

const SIZE_MAP: Record<SpinnerSize, number> = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
};

interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
}

const Spinner = ({ size = 'md', variant = 'ring', className, ...props }: SpinnerProps) => {
  const px = SIZE_MAP[size];
  const rootClassName = ['inline-flex shrink-0 items-center justify-center align-middle leading-none', className]
    .filter(Boolean)
    .join(' ');

  if (variant === 'ring') {
    return (
      <span className={rootClassName} {...props}>
        <svg
          width={px}
          height={px}
          viewBox="0 0 24 24"
          fill="none"
          className="animate-spin"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.2" strokeWidth="3" />
          <path
            d="M12 3a9 9 0 0 1 9 9"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </span>
    );
  }

  return null;
};

export default Spinner;
