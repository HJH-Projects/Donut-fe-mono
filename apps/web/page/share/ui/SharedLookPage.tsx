'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Share2, Trash2, Link2, Copy, X } from "lucide-react";
import { ImageWithFallback } from "@/shared/ui/ImageWithFallback";
import { useTranslation } from "react-i18next";
import type { CommentResponseDto, ShareLinkDetailResponseDto } from '@/shared/model/orvalSchemas';
import { useShareDetail } from "../model/useShareDetail";
import { useToast } from "@/shared/model/useToast";

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
}

export function SharedLookPage({ sharePath, initialShareDetail = null, initialComments = [], isLoggedIn = false }: SharedLookPageProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const toast = useToast();

  const {
    look,
    comments,
    addComment,
    deleteComment,
  } = useShareDetail({ sharePath, initialShareDetail, initialComments });

  const [newComment, setNewComment] = useState({ content: "" });
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showLinkCreator, setShowLinkCreator] = useState(false);
  const [sharedLinks, setSharedLinks] = useState<SharedLink[]>([]);
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);

  const currentUser = { id: "current-user-id", name: "나" };


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
    setNewComment({ content: "" });
    await addComment(content);
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (minutes < 1) return "방금 전";
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
    const url = `${window.location.origin}/share/${sharePath}`;
    const newLink: SharedLink = { id: linkId, url: url, createdAt: new Date() };
    setSharedLinks([newLink, ...sharedLinks]);
    setShowLinkCreator(true);
  };

  const handleCopyLink = (url: string, linkId: string) => {
    try {
      navigator.clipboard.writeText(url).then(() => {
        setCopiedLinkId(linkId);
        setTimeout(() => setCopiedLinkId(null), 2000);
      }).catch(() => {
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
    toast.info("카카오톡 공유 기능은 Kakao SDK 연동이 필요합니다.");
  };

  const handleDeleteLink = (linkId: string) => {
    if (confirm("링크를 삭제하시겠습니까?")) {
      setSharedLinks(sharedLinks.filter((link) => link.id !== linkId));
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (confirm(t('sharedLook.deleteCommentConfirm'))) {
      await deleteComment(commentId);
    }
  };

  if (!look) {
    return (
      <div className="min-h-screen w-full max-w-[500px] mx-auto bg-white flex items-center justify-center">
        <p className="text-[#999]" style={{ fontFamily: "var(--font-inter), 'Inter', sans-serif", fontSize: "14px", fontWeight: 400 }}>
          룩을 찾을 수 없습니다
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full max-w-[500px] mx-auto bg-white pb-20">
      {showShareDialog && (
        <div
          className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-6"
          onClick={() => { setShowShareDialog(false); setShowLinkCreator(false); }}
        >
          <div
            className="bg-white p-6 w-full max-w-md max-h-[80vh] flex flex-col"
            style={{ borderRadius: "16px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-black" style={{ fontFamily: "var(--font-inter), 'Inter', sans-serif", fontSize: "18px", fontWeight: 600 }}>
                {t('looks.shareDialog.title')}
              </h3>
              <button
                onClick={() => { setShowShareDialog(false); setShowLinkCreator(false); }}
                className="p-1 hover:bg-gray-100 transition-colors"
                style={{ borderRadius: "6px" }}
              >
                <X size={20} color="#000" strokeWidth={2} />
              </button>
            </div>

            {sharedLinks.length > 0 && (
              <div className="mb-4">
                <p className="text-[#666] mb-3" style={{ fontFamily: "var(--font-inter), 'Inter', sans-serif", fontSize: "13px", fontWeight: 500 }}>
                  생성된 링크 ({sharedLinks.length})
                </p>
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {sharedLinks.map((link) => (
                    <div key={link.id} className="p-3 bg-gray-50" style={{ borderRadius: "12px", border: "1px solid #E5E5E5" }}>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="text-[#333] flex-1 break-all" style={{ fontFamily: "var(--font-inter), 'Inter', sans-serif", fontSize: "12px", fontWeight: 400, lineHeight: "1.4" }}>
                          {link.url}
                        </p>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button onClick={() => handleCopyLink(link.url, link.id)} className="p-1.5 hover:bg-gray-200 transition-colors" style={{ borderRadius: "6px" }} title="링크 복사">
                            {copiedLinkId === link.id ? (
                              <span style={{ fontFamily: "var(--font-inter), 'Inter', sans-serif", fontSize: "11px", fontWeight: 600, color: "#000" }}>✓</span>
                            ) : (
                              <Copy size={14} color="#666" strokeWidth={1.5} />
                            )}
                          </button>
                          <button onClick={() => handleDeleteLink(link.id)} className="p-1.5 hover:bg-gray-200 transition-colors" style={{ borderRadius: "6px" }} title="링크 삭제">
                            <Trash2 size={14} color="#666" strokeWidth={1.5} />
                          </button>
                        </div>
                      </div>
                      <p className="text-[#999]" style={{ fontFamily: "var(--font-inter), 'Inter', sans-serif", fontSize: "11px", fontWeight: 400 }}>
                        {formatDate(link.createdAt)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!showLinkCreator ? (
              <button
                onClick={handleCreateLink}
                className="w-full px-5 py-3 text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                style={{ borderRadius: "12px", backgroundColor: "#000", fontFamily: "var(--font-inter), 'Inter', sans-serif", fontSize: "14px", fontWeight: 600 }}
              >
                <Link2 size={16} color="#fff" strokeWidth={2} />
                새 링크 생성
              </button>
            ) : (
              <div className="space-y-3">
                <div className="p-4 bg-green-50" style={{ borderRadius: "12px", border: "1px solid #BBF7D0" }}>
                  <p className="text-green-800 text-center" style={{ fontFamily: "var(--font-inter), 'Inter', sans-serif", fontSize: "13px", fontWeight: 600 }}>
                    ✓ 링크가 생성되었습니다
                  </p>
                </div>
                <button
                  onClick={() => handleCopyLink(sharedLinks[0].url, sharedLinks[0].id)}
                  className="w-full px-5 py-3 text-black hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  style={{ borderRadius: "12px", backgroundColor: "#F5F5F5", fontFamily: "var(--font-inter), 'Inter', sans-serif", fontSize: "14px", fontWeight: 600 }}
                >
                  <Copy size={16} color="#000" strokeWidth={2} />
                  링크 복사
                </button>
                <button
                  onClick={handleKakaoShare}
                  className="w-full px-5 py-3 text-[#3C1E1E] hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  style={{ borderRadius: "12px", backgroundColor: "#FEE500", fontFamily: "var(--font-inter), 'Inter', sans-serif", fontSize: "14px", fontWeight: 600 }}
                >
                  <Share2 size={16} color="#3C1E1E" strokeWidth={2} />
                  카카오톡 공유
                </button>
                <button
                  onClick={() => { handleCreateLink(); setShowLinkCreator(false); }}
                  className="w-full px-5 py-3 text-white hover:opacity-90 transition-opacity"
                  style={{ borderRadius: "12px", backgroundColor: "#000", fontFamily: "var(--font-inter), 'Inter', sans-serif", fontSize: "14px", fontWeight: 600 }}
                >
                  추가 링크 생성
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="px-6 py-6">
        <div className="mb-8">
          <h2 className="text-black" style={{ fontFamily: "var(--font-inter), 'Inter', sans-serif", fontSize: "24px", fontWeight: 700 }}>
            {look.name}
          </h2>
          {look.user && (
            <p className="text-[#666] mt-1" style={{ fontFamily: "var(--font-inter), 'Inter', sans-serif", fontSize: "14px", fontWeight: 400 }}>
              by {look.user.nickname}
            </p>
          )}
        </div>

        <div className="mb-8">
          <div className="grid grid-cols-2 gap-4">
            {look.items.map((item) => (
              <div key={item.id}>
                <div className="aspect-square bg-gray-100 overflow-hidden" style={{ borderRadius: "16px" }}>
                  {item.imageUrl ? (
                    <ImageWithFallback src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <p className="text-[#999]" style={{ fontFamily: "var(--font-inter), 'Inter', sans-serif", fontSize: "11px", fontWeight: 500 }}>
                        이미지 없음
                      </p>
                    </div>
                  )}
                </div>
                <div className="mt-2">
                  <p className="text-black truncate" style={{ fontFamily: "var(--font-inter), 'Inter', sans-serif", fontSize: "13px", fontWeight: 600 }}>
                    {item.name}
                  </p>
                  <p className="text-[#555555] truncate" style={{ fontFamily: "var(--font-inter), 'Inter', sans-serif", fontSize: "11px", fontWeight: 400 }}>
                    {item.category}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <h3 className="text-black mb-4" style={{ fontFamily: "var(--font-inter), 'Inter', sans-serif", fontSize: "16px", fontWeight: 600 }}>
            {t('sharedLook.comments')} ({comments.length})
          </h3>

          <div className="space-y-2 mb-6">
            {comments.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-[#999]" style={{ fontFamily: "var(--font-inter), 'Inter', sans-serif", fontSize: "13px", fontWeight: 400 }}>
                  {t('sharedLook.noComments')}
                </p>
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="p-4 bg-white relative" style={{ borderRadius: "12px", border: "1.5px solid #E5E5E5" }}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-black" style={{ fontFamily: "var(--font-inter), 'Inter', sans-serif", fontSize: "13px", fontWeight: 600 }}>
                      {comment.author}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-[#999]" style={{ fontFamily: "var(--font-inter), 'Inter', sans-serif", fontSize: "11px", fontWeight: 400 }}>
                        {formatDate(comment.createdAt)}
                      </p>
                      {comment.userId === currentUser.id && (
                        <button onClick={() => handleDeleteComment(comment.id)} className="p-1 hover:bg-gray-100 transition-colors" style={{ borderRadius: "6px" }}>
                          <Trash2 size={14} color="#999" strokeWidth={1.5} />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-[#333]" style={{ fontFamily: "var(--font-inter), 'Inter', sans-serif", fontSize: "13px", fontWeight: 400, lineHeight: "1.5" }}>
                    {comment.content}
                  </p>
                </div>
              ))
            )}
          </div>

          <div className="p-4 bg-gray-50" style={{ borderRadius: "16px" }}>
            <textarea
              value={newComment.content}
              onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
              onFocus={() => requireLogin()}
              placeholder={t('sharedLook.commentPlaceholder')}
              rows={3}
              className="w-full px-4 py-3 mb-3 bg-white text-black placeholder-gray-400 resize-none"
              style={{ borderRadius: "12px", border: "1.5px solid #E5E5E5", fontFamily: "var(--font-inter), 'Inter', sans-serif", fontSize: "13px", fontWeight: 400, outline: "none" }}
            />
            <button
              onClick={handleAddComment}
              className="w-full px-5 py-3 text-white hover:opacity-90 transition-opacity"
              style={{ borderRadius: "12px", backgroundColor: "#000", fontFamily: "var(--font-inter), 'Inter', sans-serif", fontSize: "14px", fontWeight: 600 }}
            >
              {t('sharedLook.postComment')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
