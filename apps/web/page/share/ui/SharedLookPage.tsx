'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Share2, Trash2, Link2, Copy, X, Crown, Heart } from 'lucide-react';
import { ImageWithFallback } from '@/shared/ui/ImageWithFallback';
import { useTranslation } from 'react-i18next';
import type { CommentResponseDto, ShareLinkDetailResponseDto } from '@/shared/model/orvalSchemas';
import { Button } from '@/shared/ui/Button';
import { DialogShell } from '@/shared/ui/DialogShell';
import { IconButton } from '@/shared/ui/IconButton';
import { Text } from '@/shared/ui/Text';
import { Textarea } from '@/shared/ui/Textarea';
import { useShareDetail } from '../model/useShareDetail';
import { useToast } from '@/shared/model/useToast';
import {
  closeGlobalDialog,
  useGlobalDialogOpen,
} from '@/shared/model/globalDialogStore';

type SharedLink = {
  id: string;
  url: string;
  createdAt: Date;
};

interface SharedLookPageProps {
  sharePath: string;
  initialShareDetail?: ShareLinkDetailResponseDto | null;
  initialComments?: CommentResponseDto[];
  isLoggedIn?: boolean;
  currentUserId?: string | null;
  currentUserNickname?: string | null;
}

export function SharedLookPage({
  sharePath,
  initialShareDetail = null,
  initialComments = [],
  isLoggedIn = false,
  currentUserId = null,
  currentUserNickname = null,
}: SharedLookPageProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const toast = useToast();

  const { look, comments, addComment, deleteComment, toggleCommentLike } = useShareDetail({
    sharePath,
    initialShareDetail,
    initialComments,
    currentUserId,
    currentUserNickname,
  });

  const [newComment, setNewComment] = useState({ content: '' });
  const showShareDialog = useGlobalDialogOpen('share:links');
  const [showLinkCreator, setShowLinkCreator] = useState(false);
  const [sharedLinks, setSharedLinks] = useState<SharedLink[]>([]);
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);

  const buildShareUrl = (options?: { openExternalBrowser?: boolean }) => {
    const url = new URL(`/share/${sharePath}`, window.location.origin);
    if (options?.openExternalBrowser) {
      url.searchParams.set('openExternalBrowser', '1');
    }
    return url.toString();
  };

  const requireLogin = () => {
    if (!isLoggedIn) {
      router.push(`/login?next=/share/${sharePath}`);
      return true;
    }
    return false;
  };

  const handleAddComment = async () => {
    if (requireLogin()) return;
    if (!newComment.content.trim()) {
      toast.info(t('sharedLook.commentRequired'));
      return;
    }
    const content = newComment.content;
    setNewComment({ content: '' });
    await addComment(content);
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleCreateLink = () => {
    const linkId = Date.now().toString();
    const url = buildShareUrl();
    const newLink: SharedLink = { id: linkId, url: url, createdAt: new Date() };
    setSharedLinks([newLink, ...sharedLinks]);
    setShowLinkCreator(true);
  };

  const handleCopyLink = (url: string, linkId: string) => {
    try {
      navigator.clipboard
        .writeText(url)
        .then(() => {
          setCopiedLinkId(linkId);
          setTimeout(() => setCopiedLinkId(null), 2000);
        })
        .catch(() => {
          const textArea = document.createElement('textarea');
          textArea.value = url;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          setCopiedLinkId(linkId);
          setTimeout(() => setCopiedLinkId(null), 2000);
        });
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = url;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedLinkId(linkId);
      setTimeout(() => setCopiedLinkId(null), 2000);
    }
  };

  const handleKakaoShare = () => {
    const kakaoShareUrl = buildShareUrl({ openExternalBrowser: true });
    handleCopyLink(kakaoShareUrl, 'kakao-share');
    toast.success('카카오톡 공유용 링크를 복사했습니다.');
  };

  const handleDeleteLink = (linkId: string) => {
    if (confirm('링크를 삭제하시겠습니까?')) {
      setSharedLinks(sharedLinks.filter((link) => link.id !== linkId));
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    await deleteComment(commentId);
  };

  const handleToggleCommentLike = async (commentId: string) => {
    if (requireLogin()) return;
    await toggleCommentLike(commentId);
  };

  const closeShareDialog = () => {
    closeGlobalDialog('share:links');
    setShowLinkCreator(false);
  };

  if (!look) {
    return (
      <div className="min-h-screen w-full max-w-[500px] mx-auto bg-white flex items-center justify-center">
        <Text variant="body" className="text-[#999] text-[14px]">
          룩을 찾을 수 없습니다
        </Text>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full max-w-[500px] mx-auto bg-white pb-20">
      {showShareDialog && (
        <DialogShell
          open={showShareDialog}
          onOpenChange={(next) => {
            if (!next) closeShareDialog();
          }}
          popupClassName="w-full max-w-md max-h-[80vh] flex flex-col rounded-[16px]"
          bodyClassName="p-6"
          backdropClassName="bg-black/30"
          showCloseButton={false}
        >
          <div className="mb-4 flex items-center justify-between">
            <Text as="h3" variant="titleSm">
              {t('looks.shareDialog.title')}
            </Text>
            <IconButton
              onClick={closeShareDialog}
              className="rounded-md p-1"
              tone="default"
              size="sm"
            >
              <X size={20} color="#000" strokeWidth={2} />
            </IconButton>
          </div>

          {sharedLinks.length > 0 && (
            <div className="mb-4">
              <Text variant="captionStrong" className="mb-3 text-[#666]">
                생성된 링크 ({sharedLinks.length})
              </Text>
              <div className="max-h-[300px] space-y-2 overflow-y-auto">
                {sharedLinks.map((link) => (
                  <div
                    key={link.id}
                    className="rounded-[12px] border border-[#E5E5E5] bg-gray-50 p-3"
                  >
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <Text
                        variant="caption"
                        className="flex-1 break-all text-[12px] leading-[1.4] text-[#333]"
                      >
                        {link.url}
                      </Text>
                      <div className="flex shrink-0 items-center gap-1">
                        <IconButton
                          onClick={() => handleCopyLink(link.url, link.id)}
                          className="rounded-md p-1.5 hover:bg-gray-200"
                          tone="default"
                          size="sm"
                          title="링크 복사"
                        >
                          {copiedLinkId === link.id ? (
                            <Text as="span" variant="meta" className="text-[11px] font-semibold text-black">
                              ✓
                            </Text>
                          ) : (
                            <Copy size={14} color="#666" strokeWidth={1.5} />
                          )}
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteLink(link.id)}
                          className="rounded-md p-1.5 hover:bg-gray-200"
                          tone="default"
                          size="sm"
                          title="링크 삭제"
                        >
                          <Trash2 size={14} color="#666" strokeWidth={1.5} />
                        </IconButton>
                      </div>
                    </div>
                    <Text variant="meta" className="text-[#999]">
                      {formatDate(link.createdAt)}
                    </Text>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!showLinkCreator ? (
            <Button
              onClick={handleCreateLink}
              variant="solid"
              size="lg"
              fullWidth
            >
              <Link2 size={16} color="#fff" strokeWidth={2} />새 링크 생성
            </Button>
          ) : (
            <div className="space-y-3">
              <div
                className="rounded-[12px] border border-[#BBF7D0] bg-green-50 p-4"
              >
                <Text variant="captionStrong" className="text-center text-green-800">
                  ✓ 링크가 생성되었습니다
                </Text>
              </div>
              <Button
                onClick={() => handleCopyLink(sharedLinks[0].url, sharedLinks[0].id)}
                variant="subtle"
                size="lg"
                fullWidth
              >
                <Copy size={16} color="#000" strokeWidth={2} />
                링크 복사
              </Button>
              <Button
                onClick={handleKakaoShare}
                variant="kakao"
                size="lg"
                fullWidth
              >
                <Share2 size={16} color="#3C1E1E" strokeWidth={2} />
                카카오톡 공유
              </Button>
              <Button
                onClick={() => {
                  handleCreateLink();
                  setShowLinkCreator(false);
                }}
                variant="solid"
                size="lg"
                fullWidth
              >
                추가 링크 생성
              </Button>
            </div>
          )}
        </DialogShell>
      )}

      <div className="px-6 py-6">
        <div className="mb-8">
          <Text as="h2" variant="titleLg" className="text-[24px] tracking-normal">
            {look.name}
          </Text>
          {look.user && (
            <Text variant="body" className="mt-1 text-[#666]">
              by {look.user.nickname}
            </Text>
          )}
        </div>

        <div className="mb-8">
          <div className="grid grid-cols-2 gap-4">
            {look.items.map((item) => (
              <div key={item.id}>
                <div
                  className="aspect-square bg-gray-100 overflow-hidden"
                  style={{ borderRadius: '16px' }}
                >
                  {item.imageUrl ? (
                    <ImageWithFallback
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover object-center"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Text variant="meta" className="font-medium text-[#999]">
                        이미지 없음
                      </Text>
                    </div>
                  )}
                </div>
                <div className="mt-2">
                  <Text variant="bodyStrong" className="truncate text-[13px]">
                    {item.name}
                  </Text>
                  <Text variant="meta" className="truncate text-[#555555]">
                    {item.category}
                  </Text>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <Text as="h3" variant="bodyStrong" className="mb-4 text-[16px]">
            {t('sharedLook.comments')} ({comments.length})
          </Text>

          <div className="mb-6 divide-y divide-[#ECEEF1]">
            {comments.length === 0 ? (
              <div className="py-12 text-center">
                <Text variant="caption" className="text-[#999]">
                  {t('sharedLook.noComments')}
                </Text>
              </div>
            ) : (
              comments.map((comment) => {
                const isOwnerComment = !!(comment.userId && look.user?.id && comment.userId === look.user.id);

                return (
                <div
                  key={comment.id}
                  className="py-3 relative"
                >
                  <div className="flex items-center mb-1">
                    <div className="flex items-center gap-2">
                      {isOwnerComment && (
                        <Crown size={12} color="#F59E0B" strokeWidth={2.3} />
                      )}
                      <Text as="p" variant="bodyStrong" className="text-[13px]">
                        {comment.author}
                      </Text>
                    </div>
                  </div>
                  <Text variant="body" className="pr-12 leading-[1.55] text-[#111827]">
                    {comment.content}
                  </Text>
                  <div className="mt-0.5 pr-12 flex items-center gap-1">
                    <Text variant="meta" className="text-[#999]">
                      {formatDate(comment.createdAt)}
                    </Text>
                    {currentUserId && comment.userId === currentUserId && (
                      <>
                        <span
                          className="text-[#6B7280] text-[12px] leading-[1]"
                          aria-hidden="true"
                        >
                          ·
                        </span>
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-[11px] text-[#999] font-normal cursor-pointer hover:text-[#333] hover:underline hover:underline-offset-2 transition-colors"
                          style={{ fontFamily: "var(--font-inter), 'Inter', sans-serif" }}
                        >
                          {t('sharedLook.deleteComment')}
                        </button>
                      </>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleCommentLike(comment.id)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 inline-flex flex-col items-center gap-0.5 px-2 py-1 hover:bg-gray-100 transition-colors"
                    style={{ borderRadius: '8px' }}
                    aria-label={t('sharedLook.commentLikeAria')}
                  >
                    <Heart
                      size={16}
                      color={comment.isLiked ? '#000' : '#9CA3AF'}
                      fill={comment.isLiked ? '#000' : 'none'}
                      strokeWidth={1.8}
                    />
                    <Text as="span" variant="meta" className="leading-[1] font-semibold text-[#6B7280]">
                      {comment.likeCount}
                    </Text>
                  </button>
                </div>
                );
              })
            )}
          </div>

          <div className="p-4 bg-gray-50" style={{ borderRadius: '16px' }}>
            <Textarea
              value={newComment.content}
              onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
              onFocus={() => requireLogin()}
              placeholder={t('sharedLook.commentPlaceholder')}
              rows={3}
              className="mb-3 bg-white py-3"
            />
            <Button
              onClick={handleAddComment}
              variant="solid"
              size="lg"
              fullWidth
            >
              {t('sharedLook.postComment')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
