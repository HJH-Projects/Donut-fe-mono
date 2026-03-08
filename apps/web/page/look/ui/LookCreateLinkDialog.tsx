'use client';

import { Dialog } from '@base-ui/react/dialog';
import { Link2, X } from 'lucide-react';
import Spinner from '@/shared/ui/Spinner';
import type { Look } from '../model/useLooks';
import { closeGlobalDialog, useGlobalDialogOpen } from '@/shared/model/globalDialogStore';

type LookCreateLinkDialogProps = {
  selectedLook: Look | null;
  linkName: string;
  titleCreateNewLink: string;
  placeholder: string;
  cancelLabel: string;
  confirmLabel: string;
  isCreating: boolean;
  onLinkNameChange: (value: string) => void;
  onCreateLink: () => void;
};

export function LookCreateLinkDialog({
  selectedLook,
  linkName,
  titleCreateNewLink,
  placeholder,
  cancelLabel,
  confirmLabel,
  isCreating,
  onLinkNameChange,
  onCreateLink,
}: LookCreateLinkDialogProps) {
  const open = useGlobalDialogOpen('look:createLink');

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) closeGlobalDialog('look:createLink');
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-black/30 z-50" />
        <Dialog.Popup
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white z-50 w-[90%] max-w-[400px] rounded-[24px]"
          aria-describedby={undefined}
        >
          {selectedLook && (
            <>
              <div className="shrink-0 p-6 pb-4 flex items-start justify-between">
                <h2 className="text-black text-[20px] font-semibold">{selectedLook.name}</h2>
                <button onClick={() => closeGlobalDialog('look:createLink')} className="p-1.5 hover:bg-gray-100 transition-colors rounded-lg">
                  <X size={20} color="#000" strokeWidth={1.5} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 pb-4">
                <h4 className="text-black mb-3 text-[13px] font-semibold">{titleCreateNewLink}</h4>
                <input
                  type="text"
                  value={linkName}
                  onChange={(e) => onLinkNameChange(e.target.value)}
                  className="w-full px-4 py-3 text-black mb-4 rounded-xl bg-[#F5F5F5] text-sm font-normal border border-[#E5E5E5]"
                  placeholder={placeholder}
                />
              </div>

              <div className="shrink-0 p-6 pt-4 flex gap-3">
                <button
                  onClick={() => closeGlobalDialog('look:createLink')}
                  disabled={isCreating}
                  className="flex-1 px-5 py-3 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors rounded-xl border-[1.5px] border-[#E5E5E5] text-sm font-semibold text-black disabled:opacity-60"
                >
                  {cancelLabel}
                </button>
                <button
                  onClick={onCreateLink}
                  disabled={isCreating}
                  className="flex-1 px-5 py-3 flex items-center justify-center gap-2 text-white hover:opacity-90 transition-opacity rounded-xl bg-black text-sm font-semibold disabled:opacity-60"
                >
                  {isCreating ? (
                    <>
                      <Spinner size="sm" className="text-white" />
                      생성 중...
                    </>
                  ) : (
                    <>
                      <Link2 size={16} strokeWidth={2} />
                      {confirmLabel}
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
