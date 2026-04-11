'use client';

import { Dialog } from '@base-ui/react/dialog';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/shared/ui/cn';
import { IconButton } from '@/shared/ui/IconButton';

type DialogShellProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  title?: ReactNode;
  showCloseButton?: boolean;
  closeLabel?: string;
  popupClassName?: string;
  bodyClassName?: string;
  backdropClassName?: string;
  titleClassName?: string;
  titleAs?: 'h1' | 'h2';
  titleSpacing?: 'compact' | 'default' | 'none';
  zIndexClassName?: string;
};

export function DialogShell({
  open,
  onOpenChange,
  children,
  title,
  showCloseButton = true,
  closeLabel = '닫기',
  popupClassName,
  bodyClassName,
  backdropClassName,
  titleClassName,
  titleAs = 'h2',
  titleSpacing = 'default',
  zIndexClassName = 'z-50',
}: DialogShellProps) {
  const TitleTag = titleAs;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className={cn('fixed inset-0 bg-black/40', zIndexClassName, backdropClassName)} />
        <Dialog.Popup
          className={cn(
            'fixed top-1/2 left-1/2 w-[90%] -translate-x-1/2 -translate-y-1/2 bg-white',
            zIndexClassName,
            popupClassName,
          )}
          aria-describedby={undefined}
        >
          {showCloseButton ? (
            <IconButton
              aria-label={closeLabel}
              className="absolute top-8 right-8"
              tone="default"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              <X size={18} color="#000" strokeWidth={1.8} />
            </IconButton>
          ) : null}

          <div className={bodyClassName}>
            {title ? (
              <TitleTag
                className={cn(
                  'text-black',
                  titleSpacing === 'compact' && 'mb-4 text-[18px] font-semibold',
                  titleSpacing === 'default' && 'mb-8 text-[28px] font-bold',
                  titleSpacing === 'none' && 'text-[20px] font-bold',
                  titleClassName,
                )}
              >
                {title}
              </TitleTag>
            ) : null}
            {children}
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
