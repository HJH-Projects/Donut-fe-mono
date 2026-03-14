'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ClothesListItemResponseDto, LookResponseDto } from '@/shared/model/orvalSchemas';
import { useToast } from '@/shared/model/useToast';
import { deleteSharesApi, getSharesApi, postSharesApi } from '@/shared/api/endpointTags/shares';
import { toApiError } from '@/shared/api/error';
import { clientKy } from '@/features/api/clientKy';
import { useLooks, type Look, type LookItem } from './useLooks';
import type { SharedLink } from '../ui/lookShare.types';
import {
  closeGlobalDialog,
  openGlobalDialog,
  replaceGlobalDialog,
  useGlobalDialogOpen,
} from '@/shared/model/globalDialogStore';

declare global {
  interface Window {
    Kakao?: {
      init: (appKey: string) => void;
      isInitialized: () => boolean;
      Share?: {
        sendDefault: (
          payload:
            | {
                objectType: 'text';
                text: string;
                link: { mobileWebUrl: string; webUrl: string };
                buttonTitle?: string;
              }
            | {
                objectType: 'feed';
                content: {
                  title: string;
                  description?: string;
                  imageUrl: string;
                  link: { mobileWebUrl: string; webUrl: string };
                };
                buttons?: Array<{
                  title: string;
                  link: { mobileWebUrl: string; webUrl: string };
                }>;
              },
        ) => void;
      };
    };
  }
}

type UseLookContentDataOptions = {
  initialLooks: LookResponseDto[];
  initialClothes: ClothesListItemResponseDto[];
  showFavoriteOnly: boolean;
  searchQuery: string;
};

export function useLookContentData({
  initialLooks,
  initialClothes,
  showFavoriteOnly,
  searchQuery,
}: UseLookContentDataOptions) {
  const toast = useToast();

  const showEditDialog = useGlobalDialogOpen('look:edit');
  const showDetailDialog = useGlobalDialogOpen('look:detail');
  const showShareDialog = useGlobalDialogOpen('look:share');
  const showDeleteConfirmDialog = useGlobalDialogOpen('look:deleteConfirm');
  const showCreateLinkDialog = useGlobalDialogOpen('look:createLink');
  const [isSavingLook, setIsSavingLook] = useState(false);
  const [isDeletingLook, setIsDeletingLook] = useState(false);
  const [isCreatingShareLink, setIsCreatingShareLink] = useState(false);
  const [isLoadingSharedLinks, setIsLoadingSharedLinks] = useState(false);
  const [loadedShareLookId, setLoadedShareLookId] = useState<string | null>(null);

  const [selectedLook, setSelectedLook] = useState<Look | null>(null);
  const [sharedLinks, setSharedLinks] = useState<SharedLink[]>([]);
  const [selectedLink, setSelectedLink] = useState<SharedLink | null>(null);
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);
  const [linkName, setLinkName] = useState('');

  const {
    looks,
    addLook: hookAddLook,
    editLook: hookEditLook,
    removeLook: hookRemoveLook,
    toggleFavorite,
  } = useLooks({ initialLooks });

  const clothesData: Array<{
    id: string;
    name: string;
    category1: string;
    imageUrl: string;
  }> = useMemo(
    () =>
      initialClothes.map((item) => ({
        id: item.id,
        name: item.alias,
        category1: item.category,
        imageUrl: item.cardImage?.webpUrl ?? '',
      })),
    [initialClothes],
  );

  const closetItems: LookItem[] = useMemo(
    () =>
      clothesData.map((c) => ({
        id: c.id,
        name: c.name,
        category: c.category1,
        imageUrl: c.imageUrl,
      })),
    [clothesData],
  );

  const clothesImageMap = useMemo(
    () => new Map<string, string>(clothesData.map((c) => [c.id, c.imageUrl])),
    [clothesData],
  );

  const filteredLooks = useMemo(
    () =>
      looks.filter((look) => {
        if (showFavoriteOnly && !look.isFavorite) return false;
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          const matchesName = look.name.toLowerCase().includes(query);
          const matchesTags = look.tags.some((tag) => tag.toLowerCase().includes(query));
          if (!matchesName && !matchesTags) return false;
        }
        return true;
      }),
    [looks, showFavoriteOnly, searchQuery],
  );

  const getShareBaseUrl = useCallback(() => {
    const configured = process.env.NEXT_PUBLIC_WEB_URL?.trim();
    if (configured) return configured.replace(/\/+$/, '');
    return 'https://doknot.xyz';
  }, []);

  const loadKakaoSdk = useCallback(
    () =>
      new Promise<void>((resolve, reject) => {
        if (window.Kakao) {
          resolve();
          return;
        }

        const existing = document.querySelector<HTMLScriptElement>('script[data-kakao-sdk="true"]');
        if (existing) {
          existing.addEventListener('load', () => resolve(), { once: true });
          existing.addEventListener('error', () => reject(new Error('kakao sdk load failed')), {
            once: true,
          });
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.6/kakao.min.js';
        script.async = true;
        script.dataset.kakaoSdk = 'true';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('kakao sdk load failed'));
        document.head.appendChild(script);
      }),
    [],
  );

  const shareViaKakao = useCallback(
    async (shareUrl: string, lookName: string, imageUrl?: string) => {
      const appKey = process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY?.trim();
      if (!appKey) return false;

      try {
        await loadKakaoSdk();
        if (window.Kakao) {
          if (!window.Kakao.isInitialized()) {
            window.Kakao.init(appKey);
          }

          if (imageUrl) {
            window.Kakao.Share?.sendDefault({
              objectType: 'feed',
              content: {
                title: lookName,
                description: '친구가 공유한 룩이 도착했어요. 지금 확인해보세요.',
                imageUrl,
                link: {
                  mobileWebUrl: shareUrl,
                  webUrl: shareUrl,
                },
              },
              buttons: [
                {
                  title: '룩 보러가기',
                  link: {
                    mobileWebUrl: shareUrl,
                    webUrl: shareUrl,
                  },
                },
              ],
            });
          } else {
            window.Kakao.Share?.sendDefault({
              objectType: 'text',
              text: `${lookName}\n친구가 공유한 룩이 도착했어요. 지금 확인해보세요.\n${shareUrl}`,
              link: {
                mobileWebUrl: shareUrl,
                webUrl: shareUrl,
              },
              buttonTitle: '룩 보러가기',
            });
          }
          return true;
        }
      } catch {
        return false;
      }
      return false;
    },
    [loadKakaoSdk],
  );

  const loadSharedLinks = useCallback(
    async (lookId: string, lookName?: string) => {
      setIsLoadingSharedLinks(true);
      try {
        const list = await getSharesApi(clientKy);
        const normalizedLookId = String(lookId);
        const byLookId = list.filter((link) => {
          const candidate =
            (link as { lookId?: string }).lookId ?? (link as { look?: { id?: string } }).look?.id;
          return candidate ? String(candidate) === normalizedLookId : false;
        });
        const byLookName =
          byLookId.length === 0 && lookName
            ? list.filter((link) => link.lookName === lookName)
            : [];
        const source = byLookId.length > 0 ? byLookId : byLookName.length > 0 ? byLookName : list;

        const mapped = source
          .map((link) => ({
            id: link.id,
            name: link.alias || link.lookName || '공유 링크',
            url: `${getShareBaseUrl()}/share/${link.path}`,
            createdAt: new Date(link.createdAt),
            isExpired: Boolean(link.isExpired),
          }))
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        setSharedLinks(mapped);
      } finally {
        setIsLoadingSharedLinks(false);
      }
    },
    [getShareBaseUrl],
  );

  useEffect(() => {
    if (!showShareDialog) {
      setIsLoadingSharedLinks(false);
      setLoadedShareLookId(null);
      return;
    }
    const lookId = selectedLook?.id;
    if (!lookId) return;
    if (loadedShareLookId === lookId) return;

    setLoadedShareLookId(lookId);
    loadSharedLinks(lookId, selectedLook.name).catch(() => {
      toast.error('공유 링크 목록을 불러오지 못했습니다.');
    });
  }, [
    showShareDialog,
    selectedLook?.id,
    selectedLook?.name,
    loadedShareLookId,
    loadSharedLinks,
    toast,
  ]);

  const handleToggleFavorite = (id: string) => {
    setSelectedLook((prev) =>
      prev && prev.id === id ? { ...prev, isFavorite: !prev.isFavorite } : prev,
    );
    toggleFavorite(id);
  };

  const handleLookClick = (look: Look) => {
    setSelectedLook({
      ...look,
      items: look.items.map((item) => ({
        ...item,
        imageUrl: item.imageUrl || clothesImageMap.get(item.id) || '',
      })),
    });
    openGlobalDialog('look:detail');
  };

  const handleCardClick = (e: React.MouseEvent, look: Look) => {
    const target = e.target as HTMLElement;
    if (
      target.closest('[data-navigation-buttons]') ||
      target.closest('button[data-scroll-button]')
    ) {
      return;
    }
    handleLookClick(look);
  };

  const handleCardPointerDown = (e: React.PointerEvent) => {
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

  const handleDeleteClick = () => openGlobalDialog('look:deleteConfirm');

  const handleDeleteConfirm = async () => {
    if (!selectedLook) return;
    const lookId = selectedLook.id;
    setIsDeletingLook(true);
    try {
      await hookRemoveLook(lookId);
      closeGlobalDialog('look:deleteConfirm');
      setSelectedLook(null);
    } catch {
      // handled in useLooks
    } finally {
      setIsDeletingLook(false);
    }
  };

  const handleAddLook = async (lookData: Partial<Look>) => {
    setIsSavingLook(true);
    try {
      await hookAddLook(lookData);
      closeGlobalDialog('look:add');
    } catch {
      // handled in useLooks
    } finally {
      setIsSavingLook(false);
    }
  };

  const handleEditLook = async (lookData: Partial<Look>) => {
    if (!selectedLook) return;
    const lookId = selectedLook.id;
    setIsSavingLook(true);
    try {
      await hookEditLook(lookId, {
        name: lookData.name || selectedLook.name,
        tags: lookData.tags || selectedLook.tags,
        items: lookData.items || selectedLook.items,
      });
      closeGlobalDialog('look:edit');
      setSelectedLook(null);
    } catch {
      // handled in useLooks
    } finally {
      setIsSavingLook(false);
    }
  };

  const handleCreateLink = async () => {
    if (!selectedLook) return;

    setIsCreatingShareLink(true);
    try {
      const alias = linkName.trim() || `${selectedLook.name} 링크`;
      const created = await postSharesApi(clientKy, {
        lookId: selectedLook.id,
        alias,
      });

      const createdLink: SharedLink = {
        id: created.id,
        name: created.alias || alias,
        url: `${getShareBaseUrl()}/share/${created.path}`,
        createdAt: new Date(),
        isExpired: false,
      };
      setSharedLinks((prev) => [createdLink, ...prev.filter((item) => item.id !== createdLink.id)]);

      setLinkName('');
      replaceGlobalDialog('look:share');

      loadSharedLinks(selectedLook.id, selectedLook.name).catch(() => {
        // 생성은 성공했으므로 목록 재조회 실패는 조용히 무시
      });
    } catch (e) {
      toast.apiError(await toApiError(e), '공유 링크 생성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsCreatingShareLink(false);
    }
  };

  const handleKakaoShare = async () => {
    if (!selectedLook || !selectedLink) {
      toast.error('공유할 링크를 먼저 선택해주세요.');
      return;
    }

    try {
      const shareUrl = selectedLink.url;
      if (shareUrl.includes('://localhost') || shareUrl.includes('://127.0.0.1')) {
        toast.info('현재 localhost 링크입니다. 다른 기기에서는 열리지 않을 수 있습니다.');
      }
      const firstImageUrl =
        selectedLook.items.find((item) => item.imageUrl || clothesImageMap.get(item.id))
          ?.imageUrl ||
        selectedLook.items.map((item) => clothesImageMap.get(item.id)).find(Boolean);
      const didShare = await shareViaKakao(shareUrl, selectedLook.name, firstImageUrl);

      if (!didShare) {
        toast.error(
          '카카오 공유 설정이 필요합니다. NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY와 카카오 도메인 등록을 확인해주세요.',
        );
        return;
      }

      closeGlobalDialog('look:share');
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') return;
      toast.error('카카오톡 공유에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleDeleteLink = async (linkId: string) => {
    if (!selectedLook) return;

    const previousLinks = sharedLinks;
    setSharedLinks((prev) => prev.filter((link) => link.id !== linkId));
    if (selectedLink?.id === linkId) {
      setSelectedLink(null);
    }

    try {
      await deleteSharesApi(clientKy, linkId);
      loadSharedLinks(selectedLook.id, selectedLook.name).catch(() => {
        // 삭제는 성공했으므로 백그라운드 동기화 실패는 조용히 무시
      });
    } catch {
      setSharedLinks(previousLinks);
      toast.error('링크 삭제에 실패했습니다. 다시 시도해주세요.');
    }
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

  const setShareDialogOpen = (open: boolean) => {
    if (open) {
      setSelectedLink(null);
      setCopiedLinkId(null);
      openGlobalDialog('look:share');
      return;
    }
    closeGlobalDialog('look:share');
    setSelectedLink(null);
    setCopiedLinkId(null);
  };

  return {
    looks,
    filteredLooks,
    closetItems,
    clothesImageMap,

    selectedLook,
    setSelectedLook,
    showEditDialog,
    setShowEditDialog: (open: boolean) =>
      open ? openGlobalDialog('look:edit') : closeGlobalDialog('look:edit'),
    showDetailDialog,
    setShowDetailDialog: (open: boolean) =>
      open ? openGlobalDialog('look:detail') : closeGlobalDialog('look:detail'),
    showShareDialog,
    setShowShareDialog: setShareDialogOpen,
    showDeleteConfirmDialog,
    setShowDeleteConfirmDialog: (open: boolean) =>
      open ? openGlobalDialog('look:deleteConfirm') : closeGlobalDialog('look:deleteConfirm'),
    showCreateLinkDialog,
    setShowCreateLinkDialog: (open: boolean) =>
      open ? openGlobalDialog('look:createLink') : closeGlobalDialog('look:createLink'),
    isSavingLook,
    isDeletingLook,

    sharedLinks,
    selectedLink,
    setSelectedLink,
    copiedLinkId,
    linkName,
    setLinkName,
    isCreatingShareLink,
    isLoadingSharedLinks,

    handleToggleFavorite,
    handleCardClick,
    handleCardPointerDown,
    handleCardPointerUp,
    handleCardPointerLeave,
    handleDeleteClick,
    handleDeleteConfirm,
    handleAddLook,
    handleEditLook,
    handleCreateLink,
    handleKakaoShare,
    handleDeleteLink,
    handleCopyLink,
    formatDate,
  };
}
