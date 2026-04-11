'use client';

import { Copy, Link2, Share2, Trash2, X } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { DialogShell } from '@/shared/ui/DialogShell';
import { IconButton } from '@/shared/ui/IconButton';
import Spinner from '@/shared/ui/Spinner';
import { closeGlobalDialog, openGlobalDialog, useGlobalDialogOpen } from '@/shared/model/globalDialogStore';
import type { Look } from '../model/useLooks';
import type { SharedLink } from './lookShare.types';

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
    <DialogShell
      open={open}
      onOpenChange={(next) => {
        if (!next) closeGlobalDialog('look:share');
      }}
      popupClassName="max-w-[400px] max-h-[80vh] overflow-hidden rounded-[24px] flex flex-col"
      bodyClassName="flex flex-1 flex-col"
      backdropClassName="bg-black/30"
      showCloseButton={false}
    >
      {selectedLook ? (
        <>
          <div className="mb-4 flex items-center justify-between p-6 pb-4">
            <h2 className="text-[18px] font-semibold text-black">{title}</h2>
            <IconButton onClick={() => closeGlobalDialog('look:share')} tone="subtle" size="sm">
              <X size={20} color="#000" strokeWidth={2} />
            </IconButton>
          </div>

          <div className="mb-4 px-6">
            <p className="mb-3 text-[13px] font-medium text-[#666]">
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
                <div className="flex items-center justify-center py-3 text-[#999]">
                  <span className="text-[13px] font-medium">{emptyLabel}</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {sharedLinks.map((link) => (
                    <div key={link.id} className="relative">
                      <div
                        onClick={() => {
                          if (link.isExpired) return;
                          onSelectLink(selectedLink?.id === link.id ? null : link);
                        }}
                        className={`relative rounded-xl p-3 transition-colors ${
                          link.isExpired ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-[#F3F4F6]'
                        }`}
                        style={{
                          backgroundColor: '#F9FAFB',
                          border:
                            selectedLink?.id === link.id ? '2px solid #000' : '1px solid #E5E5E5',
                          opacity: link.isExpired ? 0.72 : 1,
                        }}
                      >
                        <div className="mb-2 flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <p
                              className={`relative z-10 mb-1 text-sm font-semibold text-[#000] ${
                                link.isExpired ? 'line-through' : ''
                              }`}
                            >
                              {link.name}
                            </p>
                            <p
                              className="relative z-10 truncate text-[11px] font-normal text-[#666]"
                              title={link.url}
                            >
                              {link.url}
                            </p>
                          </div>
                          <div className="relative z-10 flex shrink-0 items-center gap-2">
                            {selectedLink?.id === link.id && !link.isExpired ? (
                              <span className="rounded-full bg-black px-2 py-0.5 text-[11px] font-semibold text-white">
                                선택됨
                              </span>
                            ) : null}
                            {link.isExpired ? (
                              <span className="rounded-full bg-[#E5E7EB] px-2 py-0.5 text-[11px] font-semibold text-[#374151]">
                                만료
                              </span>
                            ) : null}
                          </div>
                        </div>
                        <p className="relative z-10 text-[11px] font-normal text-[#666]">
                          {formatDate(link.createdAt)}
                        </p>
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteLink(link.id);
                            if (selectedLink?.id === link.id) {
                              onSelectLink(null);
                            }
                          }}
                          className="absolute bottom-2 right-2 z-20 hover:bg-[#E5E7EB]"
                          size="md"
                          title="링크 삭제"
                        >
                          <Trash2 size={14} color="#333333" strokeWidth={1.5} />
                        </IconButton>
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
                <Button
                  onClick={() => onCopyLink(selectedLink.url, selectedLink.id)}
                  variant="subtle"
                  size="lg"
                  fullWidth
                >
                  <Copy size={16} color="#000" strokeWidth={2} />
                  {copiedLinkId === selectedLink.id ? copiedLabel : copyLinkLabel}
                </Button>

                <Button onClick={onKakaoShare} variant="kakao" size="lg" fullWidth>
                  <Share2 size={16} color="#3C1E1E" strokeWidth={2} />
                  {kakaoShareLabel}
                </Button>
              </div>
            ) : (
              <Button onClick={() => openGlobalDialog('look:createLink')} variant="solid" size="lg" fullWidth>
                <Link2 size={16} color="#fff" strokeWidth={2} />
                {createLinkLabel}
              </Button>
            )}
          </div>
        </>
      ) : null}
    </DialogShell>
  );
}
