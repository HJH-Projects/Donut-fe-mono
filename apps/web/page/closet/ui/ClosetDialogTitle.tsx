'use client';

type ClosetDialogTitleProps = {
  title: string;
  className?: string;
};

export function ClosetDialogTitle({ title, className }: ClosetDialogTitleProps) {
  return (
    <h2 className={className ? `text-black text-[18px] font-semibold ${className}` : 'text-black text-[18px] font-semibold'}>
      {title}
    </h2>
  );
}
