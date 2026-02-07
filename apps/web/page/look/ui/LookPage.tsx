'use client';

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Dialog } from "@base-ui/react/dialog";
import { ImageWithFallback } from "@/shared/ui/ImageWithFallback";
import { LookForm } from "@/shared/ui/LookForm";
import { useTranslation } from "react-i18next";
import { Plus, Heart, Search, ArrowLeft, ArrowRight, Share2, X, Trash2, Edit2, Link2, Check, Copy } from "lucide-react";
import type { ClothesItem as ApiClothesItem } from '@/shared/api/clothes.types';
import type { LookItem as ApiLookItem } from '@/shared/api/looks.types';
import { createLookAction, updateLookAction, deleteLookAction } from '@/shared/api/actions/looks.action';

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

type SharedLink = {
  id: string;
  name: string;
  url: string;
  createdAt: Date;
};

interface LookPageProps {
  initialLooks?: ApiLookItem[];
  initialClothes?: ApiClothesItem[];
}

export function LookPage({ initialLooks = [], initialClothes = [] }: LookPageProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [showFavoriteOnly, setShowFavoriteOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showCreateLinkDialog, setShowCreateLinkDialog] = useState(false);
  const [selectedLook, setSelectedLook] = useState<Look | null>(null);
  const [sharedLinks, setSharedLinks] = useState<SharedLink[]>([]);
  const [selectedLink, setSelectedLink] = useState<SharedLink | null>(null);
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);
  const [linkName, setLinkName] = useState("");
  const tagScrollRef = useRef<HTMLDivElement>(null);

  // 옷장 아이템 데이터 (API)
  const [closetItems] = useState<LookItem[]>(() => {
    const categoryMap: Record<string, string> = { TOP: '상의', BOTTOM: '하의', OUTER: '아우터', SHOES: '신발', ACCESSORY: '악세사리' };
    return initialClothes.map(item => ({
      id: item.id,
      name: item.title,
      category: categoryMap[item.category] || item.category,
      imageUrl: item.imageUrl,
    }));
  });

  // 룩 데이터 (API)
  const [looks, setLooks] = useState<Look[]>(() => {
    return initialLooks.map(look => ({
      id: look.id,
      name: look.name,
      tags: look.tags ? look.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      items: (look.items || []).map(item => ({
        id: item.clothes?.id || item.clothesId,
        name: item.clothes?.title || '',
        category: item.clothes?.category || '',
        imageUrl: item.clothes?.imageUrl || '',
      })),
      isFavorite: false,
    }));
  });

  const [newLook, setNewLook] = useState<Partial<Look>>({
    name: "",
    tags: [],
    items: [],
    isFavorite: false,
  });

  // 모든 룩에서 사용 가능한 태그 추출
  const allTags = Array.from(
    new Set(looks.flatMap((look) => look.tags))
  ).sort();

  // 필터링된 룩 목록
  const filteredLooks = looks.filter((look) => {
    // 찜 필터
    if (showFavoriteOnly && !look.isFavorite) return false;
    // 검색 필터 (룩 이름 또는 태그명으로 검색)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesName = look.name.toLowerCase().includes(query);
      const matchesTags = look.tags.some(tag => tag.toLowerCase().includes(query));
      if (!matchesName && !matchesTags) return false;
    }
    return true;
  });

  const handleToggleFavorite = (id: string) => {
    setLooks(
      looks.map((look) =>
        look.id === id
          ? { ...look, isFavorite: !look.isFavorite }
          : look,
      ),
    );
  };

  const handleLookClick = (look: Look) => {
    setSelectedLook(look);
    setShowDetailDialog(true);
  };

  const handleCardClick = (e: React.MouseEvent, look: Look) => {
    // 화살표 버튼이나 그 컨테이너를 클릭한 경우 무시
    const target = e.target as HTMLElement;
    if (
      target.closest('[data-navigation-buttons]') ||
      target.closest('button[data-scroll-button]')
    ) {
      return;
    }
    handleLookClick(look);
  };

  const handleCardPointerDown = (e: React.PointerEvent, lookId: string) => {
    // 화살표 영역 클릭 시 active 효과 적용 안 함
    const target = e.target as HTMLElement;
    if (
      target.closest('[data-navigation-buttons]') ||
      target.closest('button[data-scroll-button]') ||
      target.closest('button')
    ) {
      e.currentTarget.classList.remove('card-active');
      return;
    }
    e.currentTarget.classList.add('card-active');
  };

  const handleCardPointerUp = (e: React.PointerEvent) => {
    e.currentTarget.classList.remove('card-active');
  };

  const handleCardPointerLeave = (e: React.PointerEvent) => {
    e.currentTarget.classList.remove('card-active');
  };

  const handleDeleteLook = async () => {
    if (!selectedLook) return;
    const lookId = selectedLook.id;
    setLooks(
      looks.filter((look) => look.id !== lookId),
    );
    setShowDetailDialog(false);
    setSelectedLook(null);
    try {
      await deleteLookAction(lookId);
      router.refresh();
    } catch {}
  };

  const handleAddLook = async (lookData: Partial<Look>) => {
    const newId = (looks.length + 1).toString();
    const newLook: Look = {
      id: newId,
      name: lookData.name || "",
      tags: lookData.tags || [],
      items: lookData.items || [],
      isFavorite: false,
    };
    setLooks([...looks, newLook]);
    setShowAddDialog(false);
    try {
      await createLookAction({
        name: newLook.name,
        tags: newLook.tags.join(','),
        items: newLook.items.map((item, i) => ({ clothesId: item.id, sortOrder: i, role: 'ITEM' })),
      });
      router.refresh();
    } catch {}
  };

  const handleEditLook = async (lookData: Partial<Look>) => {
    if (!selectedLook) return;
    const lookId = selectedLook.id;
    const updatedLook = {
      name: lookData.name || selectedLook.name,
      tags: lookData.tags || selectedLook.tags,
      items: lookData.items || selectedLook.items,
    };
    setLooks(
      looks.map((look) =>
        look.id === lookId
          ? {
              ...look,
              name: updatedLook.name,
              tags: updatedLook.tags,
              items: updatedLook.items,
            }
          : look
      )
    );
    setShowEditDialog(false);
    setShowDetailDialog(false);
    setSelectedLook(null);
    try {
      await updateLookAction(lookId, {
        name: updatedLook.name,
        tags: updatedLook.tags.join(','),
        items: updatedLook.items.map((item, i) => ({ clothesId: item.id, sortOrder: i, role: 'ITEM' })),
      });
      router.refresh();
    } catch {}
  };

  const handleShareLook = () => {
    if (!selectedLook) return;

    // 실제로는 서버에서 공유 링크를 생성받지만, 여기서는 클라이언트에서 생성
    const shareUrl = `${window.location.origin}/share/${selectedLook.id}`;

    // 클립보드에 복사
    navigator.clipboard.writeText(shareUrl).then(
      () => {
        alert("공유 링크가 클립보드에 복사되었습니다!");
      },
      () => {
        alert("링크 복사에 실패했습니다. 다시 시도해주세요.");
      }
    );
  };

  const handleCreateLink = () => {
    if (!selectedLook) return;

    const linkId = Date.now().toString();
    const url = `${window.location.origin}/share/${selectedLook.id}?ref=${linkId}`;
    const newLink: SharedLink = {
      id: linkId,
      name: linkName || "새 링크",
      url: url,
      createdAt: new Date(),
    };
    setSharedLinks([newLink, ...sharedLinks]);
    setLinkName("");
    setShowCreateLinkDialog(false);
  };

  const handleCopyLink = (url: string, linkId: string) => {
    // Try to copy to clipboard with fallback
    try {
      navigator.clipboard.writeText(url).then(() => {
        setCopiedLinkId(linkId);
        setTimeout(() => setCopiedLinkId(null), 2000);
      }).catch(() => {
        // Fallback method
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
    } catch (err) {
      // Fallback method for older browsers or permission issues
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
    // 임시: 공유 페이지로 이동
    if (selectedLook) {
      router.push(`/share/${selectedLook.id}`);
      setShowShareDialog(false);
      setShowCreateLinkDialog(false);
    }
  };

  const handleDeleteLink = (linkId: string) => {
    if (confirm("링크를 삭제하시겠습니까?")) {
      setSharedLinks(sharedLinks.filter((link) => link.id !== linkId));
    }
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

    // yyyy-MM-dd 형식으로 변경
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 스크롤 가능한 이미지 갤러리 컴포넌트
  const ScrollableImageGallery = ({
    items,
    lookId,
  }: {
    items: LookItem[];
    lookId: string;
  }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const [needsScroll, setNeedsScroll] = useState(false);

    const checkScrollButtons = () => {
      if (!scrollRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

      // 스크롤이 필요한지 체크
      const hasScroll = scrollWidth > clientWidth;
      setNeedsScroll(hasScroll);

      // 스크롤 위치에 따른 버튼 상태
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    };

    // 초기 마운트 시 스크롤 체크
    useEffect(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollLeft = 0;
        setTimeout(checkScrollButtons, 50);
      }
    }, [lookId, items.length]);

    // 윈도우 리사이즈 시 스크롤 체크
    useEffect(() => {
      const handleResize = () => {
        checkScrollButtons();
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    const scrollLeft = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollBy({ left: -150, behavior: 'smooth' });
      }
    };

    const scrollRight = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollBy({ left: 150, behavior: 'smooth' });
      }
    };

    if (items.length === 0) return null;

    return (
      <div className="py-3 relative pb-2">
        {/* 스크롤 가능한 이미지 목록 */}
        <div
          ref={scrollRef}
          onScroll={checkScrollButtons}
          className="overflow-x-auto overflow-y-hidden scrollbar-hide"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <div
            className="flex items-center"
            style={{
              gap: "8px",
              paddingLeft: "16px",
              paddingRight: "16px",
            }}
          >
            {items.map((item) => (
              <div
                key={item.id}
                className="flex-shrink-0"
              >
                <div
                  className="w-[64px] h-[64px] bg-gray-100 overflow-hidden shadow-sm"
                  style={{
                    borderRadius: "100px",
                  }}
                >
                  {item.imageUrl ? (
                    <ImageWithFallback
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                      <p
                        className="text-[#000] mb-1"
                        style={{
                          fontFamily: "var(--font-inter), 'Inter', sans-serif",
                          fontSize: "11px",
                          fontWeight: 600,
                        }}
                      >
                        {item.category}
                      </p>
                      <p
                        className="text-[#666] text-center px-2"
                        style={{
                          fontFamily: "var(--font-inter), 'Inter', sans-serif",
                          fontSize: "9px",
                          fontWeight: 400,
                        }}
                      >
                        {item.name}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 네비게이션 버튼 - 스크롤이 실제로 필요한 경우에만 표시 */}
        {needsScroll && (
          <div
            data-navigation-buttons
            className="absolute flex items-center gap-0.5"
            style={{
              bottom: "-32px",
              right: "12px",
              zIndex: 10,
            }}
            onPointerDown={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              data-scroll-button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                scrollLeft();
              }}
              onPointerDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onTouchStart={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              disabled={!canScrollLeft}
              className="transition-all disabled:opacity-20 flex items-center justify-center active:bg-gray-200"
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
              }}
            >
              <ArrowLeft
                size={14}
                color="#000"
                strokeWidth={2}
              />
            </button>
            <div
              style={{
                width: "1px",
                height: "10px",
                backgroundColor: "#D9D9D9",
              }}
            />
            <button
              data-scroll-button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                scrollRight();
              }}
              onPointerDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onTouchStart={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              disabled={!canScrollRight}
              className="transition-all disabled:opacity-20 flex items-center justify-center active:bg-gray-200"
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
              }}
            >
              <ArrowRight
                size={14}
                color="#000"
                strokeWidth={2}
              />
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-screen w-full max-w-[500px] mx-auto flex flex-col overflow-hidden" style={{ backgroundColor: "#FFFFFF" }}>
      {/* 상단 타이틀 + 추가 버튼 */}
      <div className="flex-shrink-0 px-6 pt-6 pb-6 flex items-center justify-center relative">
        <h1
          className="text-black text-center"
          style={{
            fontFamily: "var(--font-inter), 'Inter', sans-serif",
            fontSize: "24px",
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}
        >
          Looks
        </h1>
        <button
          onClick={() => setShowAddDialog(true)}
          className="absolute right-6 text-white p-2 hover:opacity-90 transition-opacity"
          style={{
            borderRadius: "12px",
            backgroundColor: "#000",
          }}
        >
          <Plus size={20} color="#fff" strokeWidth={2} />
        </button>
      </div>

      {/* 필터 토글 + 검색 + 룩 개수 표시 */}
      <div className="flex-shrink-0 px-6 pb-4 pt-4 flex items-center justify-between">
        {/* 왼쪽: 필터 토글 + 검색창 */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFavoriteOnly(false)}
            className="transition-all"
            style={{
              fontFamily: "var(--font-inter), 'Inter', sans-serif",
              fontSize: "12px",
              fontWeight: !showFavoriteOnly ? 600 : 500,
              color: !showFavoriteOnly ? "#000" : "#999",
              background: "none",
              border: "none",
              padding: 0,
            }}
          >
            {t('looks.all')}
          </button>
          <div
            style={{
              width: "1px",
              height: "12px",
              backgroundColor: "#D9D9D9",
            }}
          />
          <button
            onClick={() => setShowFavoriteOnly(true)}
            className="transition-all flex items-center gap-1"
            style={{
              fontFamily: "var(--font-inter), 'Inter', sans-serif",
              fontSize: "12px",
              fontWeight: showFavoriteOnly ? 600 : 500,
              color: showFavoriteOnly ? "#000" : "#999",
              background: "none",
              border: "none",
              padding: 0,
            }}
          >
            <Heart
              size={12}
              color={showFavoriteOnly ? "#000" : "#999"}
              fill={showFavoriteOnly ? "#000" : "none"}
              strokeWidth={2}
            />
            {t('looks.favorite')}
          </button>

          <div
            style={{
              width: "1px",
              height: "12px",
              backgroundColor: "#D9D9D9",
            }}
          />

          {/* 작은 검색창 */}
          <div className="relative">
            <Search
              size={12}
              color="#999"
              strokeWidth={2}
              className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('looks.searchPlaceholder')}
              className="pl-7 pr-2 py-1 transition-all"
              style={{
                width: "85px",
                borderRadius: "999px",
                backgroundColor: "#F5F5F5",
                border: "1px solid transparent",
                fontFamily: "var(--font-inter), 'Inter', sans-serif",
                fontSize: "12px",
                fontWeight: 400,
                color: "#000",
                outline: "none",
              }}
              onFocus={(e) => {
                e.target.style.backgroundColor = "#FFF";
                e.target.style.borderColor = "#E5E5E5";
              }}
              onBlur={(e) => {
                if (!searchQuery) {
                  e.target.style.backgroundColor = "#F5F5F5";
                  e.target.style.borderColor = "transparent";
                }
              }}
            />
          </div>
        </div>

        {/* 오른쪽: 개수 표시 */}
        <p
          className="text-[#555555] flex-shrink-0"
          style={{
            fontFamily: "var(--font-inter), 'Inter', sans-serif",
            fontSize: "12px",
            fontWeight: 500,
          }}
        >
          {filteredLooks.length}{t('looks.items')}
        </p>
      </div>

      {/* 룩 목록 */}
      <div className="flex-1 overflow-y-auto pb-24">
        {filteredLooks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full px-6">
            <div
              className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4"
            >
              <Plus size={28} color="#999" strokeWidth={1.5} />
            </div>
            <p
              className="text-black mb-1"
              style={{
                fontFamily: "var(--font-inter), 'Inter', sans-serif",
                fontSize: "16px",
                fontWeight: 600,
              }}
            >
              {looks.length === 0 ? t('looks.emptyTitle') : t('looks.noResults')}
            </p>
            <p
              className="text-[#999] text-center mb-6"
              style={{
                fontFamily: "var(--font-inter), 'Inter', sans-serif",
                fontSize: "13px",
                fontWeight: 400,
              }}
            >
              {looks.length === 0 ? t('looks.emptyDescription') : t('looks.noResultsDescription')}
            </p>
            {looks.length === 0 && (
              <button
                onClick={() => setShowAddDialog(true)}
                className="px-6 py-3 text-white hover:opacity-90 transition-opacity flex items-center gap-2"
                style={{
                  borderRadius: "12px",
                  backgroundColor: "#000",
                  fontFamily: "var(--font-inter), 'Inter', sans-serif",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                <Plus size={18} color="#fff" strokeWidth={2} />
                {t('looks.createFirst')}
              </button>
            )}
          </div>
        ) : (
        <div className="px-6" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {filteredLooks.map((look, index) => (
            <div
              key={look.id}
              onClick={(e) => handleCardClick(e, look)}
              onPointerDown={(e) => handleCardPointerDown(e, look.id)}
              onPointerUp={handleCardPointerUp}
              onPointerLeave={handleCardPointerLeave}
              className="cursor-pointer transition-all relative rounded-md"
              style={{
                padding: "16px",
                backgroundColor: "#FFFFFF",
                borderRadius: "16px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.06)",
              }}
            >
              {/* 하단 우측: 하트/공유 버튼 (absolute) */}
              <div className="absolute bottom-4 right-4 flex items-center gap-1 z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleFavorite(look.id);
                  }}
                  className="p-1.5 hover:bg-gray-50 transition-all"
                  style={{ borderRadius: "8px" }}
                >
                  <Heart
                    size={18}
                    color={look.isFavorite ? "#000" : "#999"}
                    fill={look.isFavorite ? "#000" : "none"}
                    strokeWidth={1.5}
                  />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedLook(look);
                    setShowShareDialog(true);
                  }}
                  className="p-1.5 hover:bg-gray-50 transition-all"
                  style={{ borderRadius: "8px" }}
                >
                  <Share2
                    size={18}
                    color="#000"
                    strokeWidth={1.5}
                  />
                </button>
              </div>

              {/* 상단: 이미지 갤러리 */}
              <ScrollableImageGallery
                items={look.items}
                lookId={look.id}
              />

              {/* 중앙: 룩 이름 */}
              <div className="px-4 pt-2 mb-2">
                <h3
                  className="text-black"
                  style={{
                    fontFamily: "var(--font-inter), 'Inter', sans-serif",
                    fontSize: "18px",
                    fontWeight: 700,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {look.name}
                </h3>
              </div>

              {/* 하단: 태그 + 아이템 개수 */}
              <div className="px-4">
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {look.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-white"
                      style={{
                        borderRadius: "999px",
                        backgroundColor: "#000",
                        fontFamily: "var(--font-inter), 'Inter', sans-serif",
                        fontSize: "11px",
                        fontWeight: 500,
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <p
                  className="text-[#999]"
                  style={{
                    fontFamily: "var(--font-inter), 'Inter', sans-serif",
                    fontSize: "11px",
                    fontWeight: 400,
                  }}
                >
                  아이템 {look.items.length}개
                </p>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>

      {/* 룩 상세보기 다이얼로그 */}
      <Dialog.Root
        open={showDetailDialog}
        onOpenChange={setShowDetailDialog}
      >
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 bg-black/30 z-50" />
          <Dialog.Popup
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white z-50 w-[90%] max-w-[400px] max-h-[85vh] flex flex-col"
            style={{
              borderRadius: "24px",
            }}
            aria-describedby={undefined}
          >
            {selectedLook && (
              <>
                {/* 헤더 */}
                <div className="flex-shrink-0 p-6 pb-4 flex items-start justify-between">
                  <div className="flex-1">
                    <h2
                      className="text-black mb-2"
                      style={{
                        fontFamily: "var(--font-inter), 'Inter', sans-serif",
                        fontSize: "20px",
                        fontWeight: 600,
                      }}
                    >
                      {selectedLook.name}
                    </h2>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedLook.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 text-white"
                          style={{
                            borderRadius: "999px",
                            backgroundColor: "#000",
                            fontFamily: "var(--font-inter), 'Inter', sans-serif",
                            fontSize: "11px",
                            fontWeight: 500,
                          }}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => setShowDetailDialog(false)}
                    className="p-1.5 hover:bg-gray-100 transition-colors"
                    style={{ borderRadius: "8px" }}
                  >
                    <X
                      size={20}
                      color="#000"
                      strokeWidth={1.5}
                    />
                  </button>
                </div>

                {/* 아이템 목록 */}
                <div className="flex-1 overflow-y-auto px-6">
                  <h4
                    className="text-black mb-3"
                    style={{
                      fontFamily: "var(--font-inter), 'Inter', sans-serif",
                      fontSize: "14px",
                      fontWeight: 600,
                    }}
                  >
                    {t('looks.includedItemsCount', { count: selectedLook.items.length })}
                  </h4>
                  <div className="grid grid-cols-2 gap-3 pb-4">
                    {selectedLook.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col gap-2"
                      >
                        <div
                          className="w-full aspect-square bg-gray-200 overflow-hidden"
                          style={{ borderRadius: "10px" }}
                        >
                          {item.imageUrl ? (
                            <ImageWithFallback
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span
                                className="text-[#999]"
                                style={{
                                  fontFamily:
                                    "var(--font-inter), 'Inter', sans-serif",
                                  fontSize: "9px",
                                  fontWeight: 500,
                                }}
                              >
                                이미지
                              </span>
                            </div>
                          )}
                        </div>
                        <div>
                          <p
                            className="text-black mb-0.5"
                            style={{
                              fontFamily: "var(--font-inter), 'Inter', sans-serif",
                              fontSize: "13px",
                              fontWeight: 600,
                            }}
                          >
                            {item.name}
                          </p>
                          <p
                            className="text-[#666]"
                            style={{
                              fontFamily: "var(--font-inter), 'Inter', sans-serif",
                              fontSize: "11px",
                              fontWeight: 400,
                            }}
                          >
                            {item.category}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 하단 버튼 */}
                <div className="flex-shrink-0 p-6 pt-4 flex gap-3">
                  <button
                    onClick={handleDeleteLook}
                    className="flex-1 px-5 py-3 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
                    style={{
                      borderRadius: "12px",
                      border: "1.5px solid #E5E5E5",
                      fontFamily: "var(--font-inter), 'Inter', sans-serif",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#000",
                    }}
                  >
                    <Trash2 size={16} strokeWidth={1.5} />
                    {t('looks.delete')}
                  </button>
                  <button
                    onClick={() => {
                      setShowDetailDialog(false);
                      setShowEditDialog(true);
                    }}
                    className="flex-1 px-5 py-3 flex items-center justify-center gap-2 text-white hover:opacity-90 transition-opacity"
                    style={{
                      borderRadius: "12px",
                      backgroundColor: "#000",
                      fontFamily: "var(--font-inter), 'Inter', sans-serif",
                      fontSize: "14px",
                      fontWeight: 600,
                    }}
                  >
                    <Edit2 size={16} strokeWidth={1.5} />
                    {t('looks.edit')}
                  </button>
                </div>
              </>
            )}
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>

      {/* 룩 추가 다이얼로그 */}
      <Dialog.Root
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
      >
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 bg-black/30 z-50" />
          <Dialog.Popup
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white z-50 w-[90%] max-w-[400px]"
            style={{
              borderRadius: "24px",
            }}
            aria-describedby={undefined}
          >
            <LookForm
              mode="add"
              closetItems={closetItems}
              onSave={handleAddLook}
              onCancel={() => setShowAddDialog(false)}
            />
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>

      {/* 룩 수정 다이얼로그 */}
      <Dialog.Root
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
      >
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 bg-black/30 z-50" />
          <Dialog.Popup
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white z-50 w-[90%] max-w-[400px]"
            style={{
              borderRadius: "24px",
            }}
            aria-describedby={undefined}
          >
            {selectedLook && (
              <LookForm
                mode="edit"
                initialData={selectedLook}
                closetItems={closetItems}
                onSave={handleEditLook}
                onCancel={() => {
                  setShowEditDialog(false);
                  setSelectedLook(null);
                }}
              />
            )}
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>

      {/* 공유 링크 생성 다이얼로그 */}
      <Dialog.Root
        open={showCreateLinkDialog}
        onOpenChange={setShowCreateLinkDialog}
      >
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 bg-black/30 z-50" />
          <Dialog.Popup
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white z-50 w-[90%] max-w-[400px]"
            style={{
              borderRadius: "24px",
            }}
            aria-describedby={undefined}
          >
            {selectedLook && (
              <>
                {/* 헤더 */}
                <div className="flex-shrink-0 p-6 pb-4 flex items-start justify-between">
                  <h2
                    className="text-black"
                    style={{
                      fontFamily: "var(--font-inter), 'Inter', sans-serif",
                      fontSize: "20px",
                      fontWeight: 600,
                    }}
                  >
                    {selectedLook.name}
                  </h2>
                  <button
                    onClick={() => setShowCreateLinkDialog(false)}
                    className="p-1.5 hover:bg-gray-100 transition-colors"
                    style={{ borderRadius: "8px" }}
                  >
                    <X
                      size={20}
                      color="#000"
                      strokeWidth={1.5}
                    />
                  </button>
                </div>

                {/* 공유 링크 생성 */}
                <div className="flex-1 overflow-y-auto px-6 pb-4">
                  <h4
                    className="text-black mb-3"
                    style={{
                      fontFamily: "var(--font-inter), 'Inter', sans-serif",
                      fontSize: "13px",
                      fontWeight: 600,
                    }}
                  >
                    {t('looks.shareDialog.createNewLink')}
                  </h4>
                  <input
                    type="text"
                    value={linkName}
                    onChange={(e) => setLinkName(e.target.value)}
                    className="w-full px-4 py-3 text-black mb-4"
                    style={{
                      borderRadius: "12px",
                      backgroundColor: "#F5F5F5",
                      fontFamily: "var(--font-inter), 'Inter', sans-serif",
                      fontSize: "14px",
                      fontWeight: 400,
                      border: "1px solid #E5E5E5",
                    }}
                    placeholder={t('looks.shareDialog.enterLinkName')}
                  />
                </div>

                {/* 하단 버튼 */}
                <div className="flex-shrink-0 p-6 pt-4 flex gap-3">
                  <button
                    onClick={() => setShowCreateLinkDialog(false)}
                    className="flex-1 px-5 py-3 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
                    style={{
                      borderRadius: "12px",
                      border: "1.5px solid #E5E5E5",
                      fontFamily: "var(--font-inter), 'Inter', sans-serif",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#000",
                    }}
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    onClick={handleCreateLink}
                    className="flex-1 px-5 py-3 flex items-center justify-center gap-2 text-white hover:opacity-90 transition-opacity"
                    style={{
                      borderRadius: "12px",
                      backgroundColor: "#000",
                      fontFamily: "var(--font-inter), 'Inter', sans-serif",
                      fontSize: "14px",
                      fontWeight: 600,
                    }}
                  >
                    <Link2 size={16} strokeWidth={2} />
                    {t('profile.confirm')}
                  </button>
                </div>
              </>
            )}
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>

      {/* 공유 링크 목록 다이얼로그 */}
      <Dialog.Root
        open={showShareDialog}
        onOpenChange={(open) => {
          setShowShareDialog(open);
          if (!open) setShowCreateLinkDialog(false);
        }}
      >
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 bg-black/30 z-50" />
          <Dialog.Popup
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white z-50 w-[90%] max-w-[400px] max-h-[80vh] flex flex-col"
            style={{
              borderRadius: "24px",
            }}
            aria-describedby={undefined}
          >
            {selectedLook && (
              <>
                {/* 헤더 */}
                <div className="flex items-center justify-between mb-4 p-6 pb-4">
                  <h2
                    className="text-black"
                    style={{
                      fontFamily: "var(--font-inter), 'Inter', sans-serif",
                      fontSize: "18px",
                      fontWeight: 600,
                    }}
                  >
                    {t('looks.shareDialog.title')}
                  </h2>
                  <button
                    onClick={() => setShowShareDialog(false)}
                    className="p-1 hover:bg-gray-100 transition-colors"
                    style={{ borderRadius: "6px" }}
                  >
                    <X size={20} color="#000" strokeWidth={2} />
                  </button>
                </div>

                {/* 링크 리스트 */}
                {sharedLinks.length > 0 && (
                  <div className="mb-4 px-6">
                    <p
                      className="text-[#666] mb-3"
                      style={{
                        fontFamily: "var(--font-inter), 'Inter', sans-serif",
                        fontSize: "13px",
                        fontWeight: 500,
                      }}
                    >
                      {t('looks.shareDialog.generatedLinks')} ({sharedLinks.length})
                    </p>
                    <div className="max-h-[300px] overflow-y-auto" style={{ paddingTop: "8px" }}>
                      <div className="space-y-3">
                        {sharedLinks.map((link) => (
                          <div
                            key={link.id}
                            className="relative"
                          >
                            {/* 체크 아이콘 - 카드 위쪽 우측에 표시 */}
                            {selectedLink?.id === link.id && (
                              <div className="absolute -top-2 right-2 z-50">
                                <div
                                  className="w-6 h-6 flex items-center justify-center"
                                  style={{
                                    backgroundColor: "#000",
                                    borderRadius: "var(--radius-sm)",
                                  }}
                                >
                                  <Check size={14} color="#FFFFFF" strokeWidth={2.5} />
                                </div>
                              </div>
                            )}

                            <div
                              onClick={() => setSelectedLink(selectedLink?.id === link.id ? null : link)}
                              className="p-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                              style={{
                                borderRadius: "12px",
                                border: selectedLink?.id === link.id ? "2px solid #000" : "1px solid #E5E5E5",
                              }}
                            >
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <div className="flex-1 min-w-0">
                                  <p
                                    className="text-[#000] mb-1"
                                    style={{
                                      fontFamily: "var(--font-inter), 'Inter', sans-serif",
                                      fontSize: "14px",
                                      fontWeight: 600,
                                    }}
                                  >
                                    {link.name}
                                  </p>
                                  <p
                                    className="text-[#666] truncate"
                                    style={{
                                      fontFamily: "var(--font-inter), 'Inter', sans-serif",
                                      fontSize: "11px",
                                      fontWeight: 400,
                                    }}
                                    title={link.url}
                                  >
                                    {link.url}
                                  </p>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteLink(link.id);
                                    if (selectedLink?.id === link.id) {
                                      setSelectedLink(null);
                                    }
                                  }}
                                  className="p-1.5 hover:bg-gray-200 transition-colors flex-shrink-0"
                                  style={{ borderRadius: "6px" }}
                                  title="링크 삭제"
                                >
                                  <Trash2 size={14} color="#666" strokeWidth={1.5} />
                                </button>
                              </div>
                              <p
                                className="text-[#999]"
                                style={{
                                  fontFamily: "var(--font-inter), 'Inter', sans-serif",
                                  fontSize: "11px",
                                  fontWeight: 400,
                                }}
                              >
                                {formatDate(link.createdAt)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 하단 버튼 영역 */}
                <div className="px-6 pb-6">
                  {/* 선택된 링크가 있으면 공유 옵션 표시 */}
                  {selectedLink ? (
                    <div className="space-y-3">
                      {/* 링크 복사 버튼 */}
                      <button
                        onClick={() => handleCopyLink(selectedLink.url, selectedLink.id)}
                        className="w-full px-5 py-3 text-black hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                        style={{
                          borderRadius: "12px",
                          backgroundColor: "#F5F5F5",
                          fontFamily: "var(--font-inter), 'Inter', sans-serif",
                          fontSize: "14px",
                          fontWeight: 600,
                        }}
                      >
                        <Copy size={16} color="#000" strokeWidth={2} />
                        {copiedLinkId === selectedLink.id ? t('looks.shareDialog.copied') : t('looks.shareDialog.copyLink')}
                      </button>

                      {/* 카카오톡 공유 버튼 */}
                      <button
                        onClick={handleKakaoShare}
                        className="w-full px-5 py-3 text-[#3C1E1E] hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                        style={{
                          borderRadius: "12px",
                          backgroundColor: "#FEE500",
                          fontFamily: "var(--font-inter), 'Inter', sans-serif",
                          fontSize: "14px",
                          fontWeight: 600,
                        }}
                      >
                        <Share2 size={16} color="#3C1E1E" strokeWidth={2} />
                        {t('looks.shareDialog.kakaoShare')}
                      </button>
                    </div>
                  ) : (
                      /* 새 링크 생성 버튼 */
                      <button
                        onClick={() => setShowCreateLinkDialog(true)}
                        className="w-full px-5 py-3 text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                        style={{
                          borderRadius: "12px",
                          backgroundColor: "#000",
                          fontFamily: "var(--font-inter), 'Inter', sans-serif",
                          fontSize: "14px",
                          fontWeight: 600,
                        }}
                      >
                        <Link2 size={16} color="#fff" strokeWidth={2} />
                        {t('looks.shareDialog.createLink')}
                      </button>
                    )}
                </div>
              </>
            )}
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
