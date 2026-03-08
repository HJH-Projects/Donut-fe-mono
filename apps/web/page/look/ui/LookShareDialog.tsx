'use client';

import { Dialog } from '@base-ui/react/dialog';
import { Check, Copy, Link2, Share2, Trash2, X } from 'lucide-react';
import Spinner from '@/shared/ui/Spinner';
import type { Look } from '../model/useLooks';
import type { SharedLink } from './lookShare.types';
import { closeGlobalDialog, openGlobalDialog, useGlobalDialogOpen } from '@/shared/model/globalDialogStore';

type LookShareDialogProps = {
  selectedLook: Look | null;
  sharedLinks: SharedLink[];
  selectedLink: SharedLink | null;
  copiedLinkId: string | null;
  isLoadingSharedLinks: boolean;
  title: string;
  generatedLinksLabel: string;
  loadingLabel: string;
  emptyLabel: string;
  copiedLabel: string;
  copyLinkLabel: string;
  kakaoShareLabel: string;
  createLinkLabel: string;
  onSelectLink: (link: SharedLink | null) => void;
  onDeleteLink: (linkId: string) => void;
  onCopyLink: (url: string, linkId: string) => void;
  onKakaoShare: () => void;
  formatDate: (date: Date) => string;
};

export function LookShareDialog({
  selectedLook,
  sharedLinks,
  selectedLink,
  copiedLinkId,
  isLoadingSharedLinks,
  title,
  generatedLinksLabel,
  loadingLabel,
  emptyLabel,
  copiedLabel,
  copyLinkLabel,
  kakaoShareLabel,
  createLinkLabel,
  onSelectLink,
  onDeleteLink,
  onCopyLink,
  onKakaoShare,
  formatDate,
}: LookShareDialogProps) {
  const open = useGlobalDialogOpen('look:share');

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) closeGlobalDialog('look:share');
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-black/30 z-50" />
        <Dialog.Popup
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white z-50 w-[90%] max-w-[400px] max-h-[80vh] flex flex-col rounded-[24px]"
          aria-describedby={undefined}
        >
          {selectedLook && (
            <>
              <div className="flex items-center justify-between mb-4 p-6 pb-4">
                <h2 className="text-black text-[18px] font-semibold">{title}</h2>
                <button onClick={() => closeGlobalDialog('look:share')} className="p-1 hover:bg-gray-100 transition-colors rounded-md">
                  <X size={20} color="#000" strokeWidth={2} />
                </button>
              </div>

              <div className="mb-4 px-6">
                <p className="text-[#666] mb-3 text-[13px] font-medium">
                  {generatedLinksLabel} ({sharedLinks.length})
                </p>
                <div className="max-h-[300px] overflow-y-auto pt-2">
                  {isLoadingSharedLinks ? (
                    <div className="flex items-center justify-center py-3">
                      <div className="inline-flex items-center gap-2 text-[#666]">
                        <Spinner size="sm" />
                        <span className="text-[13px] font-medium">{loadingLabel}</span>
                      </div>
                    </div>
                  ) : sharedLinks.length === 0 ? (
                    <div className="flex items-center justify-center text-[#999] py-3">
                      <span className="text-[13px] font-medium">{emptyLabel}</span>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {sharedLinks.map((link) => (
                        <div key={link.id} className="relative">
                          {selectedLink?.id === link.id && !link.isExpired && (
                            <div className="absolute -top-2 right-2 z-50">
                              <div className="w-6 h-6 flex items-center justify-center bg-black rounded-[var(--radius-sm)]">
                                <Check size={14} color="#FFFFFF" strokeWidth={2.5} />
                              </div>
                            </div>
                          )}

                          <div
                            onClick={() => {
                              if (link.isExpired) return;
                              onSelectLink(selectedLink?.id === link.id ? null : link);
                            }}
                            className={`p-3 transition-colors rounded-xl relative ${
                              link.isExpired ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-gray-100'
                            }`}
                            style={{
                              backgroundColor: '#F9FAFB',
                              border: selectedLink?.id === link.id ? '2px solid #000' : '1px solid #E5E5E5',
                              opacity: link.isExpired ? 0.72 : 1,
                            }}
                          >
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div className="flex-1 min-w-0">
                                <p
                                  className={`mb-1 text-sm font-semibold relative z-10 text-[#000] ${
                                    link.isExpired ? 'line-through' : ''
                                  }`}
                                >
                                  {link.name}
                                </p>
                                <p
                                  className="truncate text-[11px] font-normal relative z-10 text-[#666]"
                                  title={link.url}
                                >
                                  {link.url}
                                </p>
                              </div>
                              <div className="flex items-center gap-2 shrink-0 relative z-10">
                                {link.isExpired && (
                                  <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-[#E5E7EB] text-[#374151]">
                                    만료
                                  </span>
                                )}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteLink(link.id);
                                    if (selectedLink?.id === link.id) {
                                      onSelectLink(null);
                                    }
                                  }}
                                  className="p-1.5 hover:bg-gray-200 transition-colors rounded-md"
                                  title="링크 삭제"
                                >
                                  <Trash2 size={14} color="#333333" strokeWidth={1.5} />
                                </button>
                              </div>
                            </div>
                            <p className="text-[11px] font-normal relative z-10 text-[#666]">
                              {formatDate(link.createdAt)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="px-6 pb-6">
                {selectedLink ? (
                  <div className="space-y-3">
                    <button
                      onClick={() => onCopyLink(selectedLink.url, selectedLink.id)}
                      className="w-full px-5 py-3 text-black hover:opacity-90 transition-opacity flex items-center justify-center gap-2 rounded-xl bg-[#F5F5F5] text-sm font-semibold"
                    >
                      <Copy size={16} color="#000" strokeWidth={2} />
                      {copiedLinkId === selectedLink.id ? copiedLabel : copyLinkLabel}
                    </button>

                    <button
                      onClick={onKakaoShare}
                      className="w-full px-5 py-3 text-[#3C1E1E] hover:opacity-90 transition-opacity flex items-center justify-center gap-2 rounded-xl bg-[#FEE500] text-sm font-semibold"
                    >
                      <Share2 size={16} color="#3C1E1E" strokeWidth={2} />
                      {kakaoShareLabel}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => openGlobalDialog('look:createLink')}
                    className="w-full px-5 py-3 text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2 rounded-xl bg-black text-sm font-semibold"
                  >
                    <Link2 size={16} color="#fff" strokeWidth={2} />
                    {createLinkLabel}
                  </button>
                )}
              </div>
            </>
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
