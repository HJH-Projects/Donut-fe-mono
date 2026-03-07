'use client';

import { ClosetDialogTitle } from './ClosetDialogTitle';

type ClosetDialogSectionHeaderProps = {
  title: string;
};

export function ClosetDialogSectionHeader({ title }: ClosetDialogSectionHeaderProps) {
  return (
    <div className="shrink-0 p-6 pb-4 bg-white rounded-t-[24px]">
      <ClosetDialogTitle title={title} />
    </div>
  );
}
