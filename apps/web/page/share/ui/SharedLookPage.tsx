'use client';

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Share2, Trash2, Link2, Copy, X } from "lucide-react";
import { ImageWithFallback } from "@/shared/ui/ImageWithFallback";
import { useTranslation } from "react-i18next";

type LookItem = {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
};

type Look = {
  id: string;
  name: string;
  tags: string[];
  items: LookItem[];
  isFavorite: boolean;
};

type Comment = {
  id: string;
  userId: string;
  author: string;
  content: string;
  createdAt: Date;
};

type SharedLink = {
  id: string;
  url: string;
  createdAt: Date;
};

export function SharedLookPage() {
  const { t } = useTranslation();
  const params = useParams();
  const lookId = params.lookId as string;
  const [look, setLook] = useState<Look | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState({ content: "" });
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showLinkCreator, setShowLinkCreator] = useState(false);
  const [sharedLinks, setSharedLinks] = useState<SharedLink[]>([]);
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);

  const currentUser = { id: "current-user-id", name: "나" };

  useEffect(() => {
    const mockLooks: { [key: string]: Look } = {
      "1": {
        id: "1",
        name: "겨울 출근룩",
        tags: ["오피스", "포멀", "겨울"],
        items: [
          { id: "c1", name: "회색 코트", category: "아우터", imageUrl: "" },
          { id: "c2", name: "화이트 셔츠", category: "상의", imageUrl: "" },
          { id: "c3", name: "블랙 슬랙스", category: "하의", imageUrl: "" },
          { id: "c4", name: "가죽 구두", category: "신발", imageUrl: "" },
        ],
        isFavorite: true,
      },
      "2": {
        id: "2",
        name: "주말 데이트룩",
        tags: ["캐주얼", "데이트", "봄"],
        items: [
          { id: "c5", name: "데님 자켓", category: "아우터", imageUrl: "" },
          { id: "c6", name: "화이트 티셔츠", category: "상의", imageUrl: "" },
          { id: "c7", name: "청바지", category: "하의", imageUrl: "" },
          { id: "c8", name: "스니커즈", category: "신발", imageUrl: "" },
          { id: "c9", name: "크로스백", category: "악세사리", imageUrl: "" },
        ],
        isFavorite: false,
      },
      "3": {
        id: "3",
        name: "여름 휴가룩",
        tags: ["여행", "편안", "여름"],
        items: [
          { id: "c10", name: "린넨 셔츠", category: "상의", imageUrl: "" },
          { id: "c11", name: "반바지", category: "하의", imageUrl: "" },
          { id: "c12", name: "샌들", category: "신발", imageUrl: "" },
        ],
        isFavorite: true,
      },
    };

    if (lookId && mockLooks[lookId]) {
      setLook(mockLooks[lookId]);
    }

    setComments([
      { id: "1", userId: "user1", author: "패션왕", content: "정말 멋진 룩이네요! 참고할게요 :)", createdAt: new Date("2025-02-01T10:30:00") },
      { id: "2", userId: "user2", author: "스타일리스트", content: "색 조합이 훌륭합니다!", createdAt: new Date("2025-02-02T14:20:00") },
    ]);
  }, [lookId]);

  const handleAddComment = () => {
    if (!newComment.content.trim()) {
      alert(t('sharedLook.commentRequired'));
      return;
    }
    const comment: Comment = {
      id: Date.now().toString(),
      userId: currentUser.id,
      author: currentUser.name,
      content: newComment.content,
      createdAt: new Date(),
    };
    setComments([...comments, comment]);
    setNewComment({ content: "" });
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
    const url = `${window.location.origin}/share/${lookId}?ref=${linkId}`;
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
    alert("카카오톡 공유 기능은 Kakao SDK 연동이 필요합니다.");
  };

  const handleDeleteLink = (linkId: string) => {
    if (confirm("링크를 삭제하시겠습니까?")) {
      setSharedLinks(sharedLinks.filter((link) => link.id !== linkId));
    }
  };

  const handleDeleteComment = (commentId: string) => {
    if (confirm(t('sharedLook.deleteCommentConfirm'))) {
      setComments(comments.filter((c) => c.id !== commentId));
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
