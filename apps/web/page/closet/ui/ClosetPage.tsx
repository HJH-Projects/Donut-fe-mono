'use client';

import { Heart, Plus, Camera, Upload, Edit2, Trash2, RefreshCw } from 'lucide-react';
import { useState, useRef, use, Suspense, type ReactNode } from 'react';
import { Dialog } from '@base-ui/react/dialog';
import { ImageWithFallback } from '@/shared/ui/ImageWithFallback';
import { PlusAction } from '@/shared/ui/PlusAction';
import { useTranslation } from 'react-i18next';
import type {
  ClothesListItemResponseDto,
  ClothesResponseDto,
  EnrichClothesResponseDtoData,
} from '@/shared/model/orvalSchemas';
import {
  getClothesDetailApi,
  postClothesEnrichApi,
  postClothesImagePreviewApi,
} from '@/shared/api/endpointTags/clothes';
import { clientKy } from '@/features/api/clientKy';
import { toApiError } from '@/shared/api/error';
import { useToast } from '@/shared/model/useToast';
import Spinner from '@/shared/ui/Spinner';
import { useClothes, type ClothingItem } from '../model/useClothes';
import { ClosetGridSkeleton } from './ClosetGridSkeleton';

// 카테고리 정의
const CATEGORIES = {
  전체: [],
  상의: ['반소매 티셔츠', '긴소매 티셔츠', '셔츠/블라우스', '니트/스웨터',
         '후드 티셔츠', '맨투맨/스웨트', '민소매 티셔츠', '피케/카라 티셔츠', '기타 상의'],
  하의: ['데님 팬츠', '코튼 팬츠', '슈트 팬츠/슬랙스', '숏 팬츠', '레깅스',
         '트레이닝/조거팬츠', '점프 슈트/오버올', '기타 하의'],
  아우터: ['싱글 코트', '더블 코트', '환절기 코트', '기타 코트', '카디건',
           '슈트/블레이저 재킷', '레더/라이더스 재킷', '블루종/MA-1', '트러커 재킷',
           '스타디움 재킷', '나일론/코치 재킷', '아노락 재킷', '트레이닝 재킷',
           '후드 집업', '숏 패딩', '롱 패딩', '경량 패딩', '플리스', '무스탕/퍼', '기타 아우터'],
  '드레스/스커트': ['미니 원피스', '미디 원피스', '맥시 원피스',
                    '미니 스커트', '미디 스커트', '롱 스커트'],
  신발: ['스니커즈', '구두', '부츠/워커', '샌들/슬리퍼', '스포츠화', '패딩/퍼 신발'],
  악세사리: ['가방', '모자', '벨트', '주얼리', '머플러', '시계',
             '선글라스/안경테', '양말/레그웨어', '프롭스(Props)'],
};

const SEASONS = ['봄', '여름', '가을', '겨울', '사계절'];
const COLORS = [
  { name: '흰색',      hex: '#FFFFFF' },
  { name: '아이보리',  hex: '#FFFFF0' },
  { name: '베이지',    hex: '#F5DEB3' },
  { name: '연회색',    hex: '#D1D5DB' },
  { name: '진회색',    hex: '#6B7280' },
  { name: '검정',      hex: '#000000' },
  { name: '연노랑',    hex: '#FEF9C3' },
  { name: '노랑',      hex: '#FACC15' },
  { name: '황색',      hex: '#EAB308' },
  { name: '주황',      hex: '#F97316' },
  { name: '코랄',      hex: '#F87171' },
  { name: '빨강',      hex: '#EF4444' },
  { name: '분홍',      hex: '#FCA5A5' },
  { name: '진분홍',    hex: '#EC4899' },
  { name: '연두',      hex: '#86EFAC' },
  { name: '초록',      hex: '#22C55E' },
  { name: '올리브',    hex: '#808000' },
  { name: '다크올리브',hex: '#556B2F' },
  { name: '청록',      hex: '#14B8A6' },
  { name: '카키',      hex: '#6B7040' },
  { name: '시안',      hex: '#06B6D4' },
  { name: '하늘색',    hex: '#93C5FD' },
  { name: '파랑',      hex: '#3B82F6' },
  { name: '네이비',    hex: '#1E3A5F' },
  { name: '라벤더',    hex: '#C4B5FD' },
  { name: '보라',      hex: '#8B5CF6' },
  { name: '버건디',    hex: '#7B1F2A' },
  { name: '카멜',      hex: '#C19A6B' },
  { name: '갈색',      hex: '#92400E' },
  { name: '다크브라운',hex: '#451A03' },
  { name: '마젠타',    hex: '#D946EF' },
  { name: '골드',      hex: '#F59E0B' },
  { name: '실버',      hex: '#9CA3AF' },
  { name: '다채색',    hex: null },
] as const;

const MATERIALS = [
  '면', '폴리에스터', '나일론', '울', '캐시미어', '모헤어', '알파카', '앙고라',
  '데님', '레더', '스웨이드', '실크', '린넨', '라이오셀', '레이온', '비스코스',
  '큐프라', '쉬폰', '레이스', '벨벳', '코듀로이', '트위드', '스판덱스',
  '다운 페더', '퍼', '메탈', '아크릴', '기타',
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', 'FREE'];
const CATEGORY_FROM_API: Record<string, string> = {
  TOP: '상의',
  BOTTOM: '하의',
  OUTER: '아우터',
  DRESS_SKIRT: '드레스/스커트',
  SHOES: '신발',
  ACCESSORY: '악세사리',
};

const CATEGORY_ALIASES: Record<string, string> = {
  TOP: '상의',
  BOTTOM: '하의',
  OUTER: '아우터',
  DRESS_SKIRT: '드레스/스커트',
  SHOES: '신발',
  ACCESSORY: '악세사리',
  상의: '상의',
  하의: '하의',
  아우터: '아우터',
  드레스: '드레스/스커트',
  스커트: '드레스/스커트',
  '드레스/스커트': '드레스/스커트',
  신발: '신발',
  악세사리: '악세사리',
  액세서리: '악세사리',
};

function toArray(value?: string[] | string): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function mapEnrichToForm(enrich: EnrichClothesResponseDtoData, prev: Partial<ClothingItem>) {
  const mappedCategory = CATEGORY_ALIASES[enrich.mainCategory] ?? prev.category1 ?? '상의';
  const allowedSubCategories = (CATEGORIES[mappedCategory as keyof typeof CATEGORIES] ?? []) as string[];
  const mappedSubCategory = toArray(enrich.subCategory).find((sub) =>
    allowedSubCategories.includes(sub),
  );
  const mappedColors = toArray(enrich.color).filter((color) =>
    COLORS.some((option) => option.name === color),
  );
  const mappedSeasons = toArray(enrich.season).filter((season) => SEASONS.includes(season));
  const mappedMaterial = toArray(enrich.material).find((material) => MATERIALS.includes(material));

  return {
    ...prev,
    category1: mappedCategory,
    category2: mappedSubCategory ?? '',
    color: mappedColors,
    season: mappedSeasons,
    material: mappedMaterial ?? '',
  };
}

function mapDetailToClothingItem(detail: ClothesResponseDto, fallback: ClothingItem): ClothingItem {
  return {
    ...fallback,
    name: detail.title,
    category1: CATEGORY_FROM_API[detail.category] ?? fallback.category1,
    category2: detail.subCategory ?? '',
    season: (detail.season ?? []) as string[],
    color: (detail.color ?? []) as string[],
    brand: detail.brand ?? '',
    material: (detail.material?.[0] ?? '') as string,
    size: (detail.size ?? '') as string,
    memo: detail.memo ?? '',
    imageUrl:
      detail.imageVariants?.detail?.webpUrl ??
      detail.imageVariants?.detail?.jpegUrl ??
      detail.imageVariants?.card?.webpUrl ??
      detail.imageVariants?.card?.jpegUrl ??
      fallback.imageUrl,
  };
}

interface ClosetContentProps {
  clothesPromise: Promise<ClothesListItemResponseDto[]>;
  selectedCategory: string;
  showFavoriteOnly: boolean;
  showAddDialog: boolean;
  onShowAddDialogChange: (open: boolean) => void;
}

function ClosetContent({
  clothesPromise,
  selectedCategory,
  showFavoriteOnly,
  showAddDialog,
  onShowAddDialogChange,
}: ClosetContentProps) {
  const initialClothes = use(clothesPromise);
  const { t } = useTranslation();
  const toast = useToast();

  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [addStep, setAddStep] = useState<'method' | 'form'>('method');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [isSavingClothing, setIsSavingClothing] = useState(false);
  const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState(false);
  const [isDeletingClothing, setIsDeletingClothing] = useState(false);
  const { clothes, addClothing, updateClothing, removeClothing, toggleFavorite } = useClothes({
    initialClothes,
  });

  const [newClothing, setNewClothing] = useState<Partial<ClothingItem>>({
    name: '',
    category1: '상의',
    category2: '',
    season: [],
    color: [],
    brand: '',
    material: '',
    size: '',
    memo: '',
    imageUrl: '',
    isFavorite: false,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const pendingUploadFileRef = useRef<File | null>(null);
  const [hasPendingFile, setHasPendingFile] = useState(false);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [bgPreviewUrl, setBgPreviewUrl] = useState<string | null>(null);

  const handleToggleFavorite = (id: string) => {
    toggleFavorite(id);
  };

  const handleItemClick = async (item: ClothingItem) => {
    setSelectedItem(item);
    setShowDetailDialog(true);
    setEditMode(false);
    setIsEditingImage(false);
    setIsDetailLoading(true);
    try {
      const detail = await getClothesDetailApi(clientKy, item.id);
      setSelectedItem((prev) => {
        if (!prev || prev.id !== item.id) return prev;
        return mapDetailToClothingItem(detail, prev);
      });
    } catch {
      // 상세 조회 실패 시 목록 카드 데이터 유지
    } finally {
      setIsDetailLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const blobUrl = URL.createObjectURL(file);
    pendingUploadFileRef.current = file;
    setHasPendingFile(true);
    setDraftId(null);
    setBgPreviewUrl(null);

    if (isEditingImage && selectedItem) {
      // 수정 모드: preview API 호출 후 selectedItem 이미지 갱신 (UI only)
      setIsProcessing(true);
      setSelectedItem((prev) => (prev ? { ...prev, imageUrl: blobUrl } : prev));

      postClothesImagePreviewApi(clientKy, file)
        .then(({ previewUrl }) => {
          URL.revokeObjectURL(blobUrl);
          setSelectedItem((prev) => (prev ? { ...prev, imageUrl: previewUrl } : prev));
        })
        .catch(() => {
          // blob URL 유지
        })
        .finally(() => {
          setIsProcessing(false);
          onShowAddDialogChange(false);
          setAddStep('method');
          setIsEditingImage(false);
          setNewClothing({
            name: '',
            category1: '상의',
            category2: '',
            season: [],
            color: [],
            brand: '',
            material: '',
            size: '',
            memo: '',
            imageUrl: '',
            isFavorite: false,
          });
        });
    } else {
      // 추가 모드: blob 즉시 미리보기 → preview API 호출
      setNewClothing((prev) => ({ ...prev, imageUrl: blobUrl }));
      setAddStep('form');
      setIsProcessing(true);

      postClothesImagePreviewApi(clientKy, file)
        .then(({ draftId: newDraftId, previewUrl }) => {
          URL.revokeObjectURL(blobUrl);
          setDraftId(newDraftId);
          setBgPreviewUrl(previewUrl);
          setNewClothing((prev) => ({ ...prev, imageUrl: previewUrl }));
          postClothesEnrichApi(clientKy, { imageUrl: previewUrl })
            .then((result) => {
              if (!result.success || !result.data) return;
              setNewClothing((prev) => mapEnrichToForm(result.data, prev));
            })
            .catch(() => {});
        })
        .catch(async (e) => {
          toast.apiError(await toApiError(e), '배경 제거에 실패했습니다. 다시 시도해주세요.');
        })
        .finally(() => {
          setIsProcessing(false);
        });
    }
  };

  const handleRefreshBgRemoval = () => {
    const file = pendingUploadFileRef.current;
    if (!file) return;

    setIsProcessing(true);
    setDraftId(null);

    postClothesImagePreviewApi(clientKy, file)
      .then(({ draftId: newDraftId, previewUrl }) => {
        setDraftId(newDraftId);
        setBgPreviewUrl(previewUrl);
        setNewClothing((prev) => ({ ...prev, imageUrl: previewUrl }));
        postClothesEnrichApi(clientKy, { imageUrl: previewUrl })
          .then((result) => {
            if (!result.success || !result.data) return;
            setNewClothing((prev) => mapEnrichToForm(result.data, prev));
          })
          .catch(() => {});
      })
      .catch(async (e) => {
        toast.apiError(await toApiError(e), '배경 제거에 실패했습니다. 다시 시도해주세요.');
      })
      .finally(() => {
        setIsProcessing(false);
      });
  };

  const handleAddClothing = async () => {
    if (!newClothing.name || !newClothing.category1 || !draftId) return;

    const newItem: ClothingItem = {
      id: Date.now().toString(),
      name: newClothing.name || '',
      category1: newClothing.category1 || '상의',
      category2: newClothing.category2 || '',
      season: newClothing.season || [],
      color: newClothing.color || [],
      brand: newClothing.brand || '',
      material: newClothing.material || '',
      size: newClothing.size || '',
      memo: newClothing.memo || '',
      imageUrl: bgPreviewUrl || newClothing.imageUrl || '',
      isFavorite: false,
    };

    setIsSavingClothing(true);
    try {
      await addClothing(newItem, draftId);
      onShowAddDialogChange(false);
      setAddStep('method');
      setNewClothing({
        name: '',
        category1: '상의',
        category2: '',
        season: [],
        color: [],
        brand: '',
        material: '',
        size: '',
        memo: '',
        imageUrl: '',
        isFavorite: false,
      });
      pendingUploadFileRef.current = null;
      setHasPendingFile(false);
      setDraftId(null);
      setBgPreviewUrl(null);
    } catch {
      // useClothes에서 이미 toast 처리
    } finally {
      setIsSavingClothing(false);
    }
  };

  const handleUpdateClothing = async () => {
    if (!selectedItem) return;

    setIsSavingClothing(true);
    try {
      await updateClothing(selectedItem);
      setShowDetailDialog(false);
      setSelectedItem(null);
      setEditMode(false);
    } catch {
      // useClothes에서 이미 toast 처리
    } finally {
      setIsSavingClothing(false);
    }
  };

  const handleDeleteClick = () => setShowDeleteConfirmDialog(true);

  const handleDeleteConfirm = async () => {
    if (!selectedItem) return;
    const deletedId = selectedItem.id;
    setIsDeletingClothing(true);
    try {
      await removeClothing(deletedId);
      setShowDeleteConfirmDialog(false);
      setShowDetailDialog(false);
      setSelectedItem(null);
    } catch {
      // useClothes에서 이미 toast 처리
    } finally {
      setIsDeletingClothing(false);
    }
  };

  const handleCancelAdd = () => {
    onShowAddDialogChange(false);
    setAddStep('method');
    setIsProcessing(false);
    setIsEditingImage(false);
    pendingUploadFileRef.current = null;
    setHasPendingFile(false);
    setDraftId(null);
    setBgPreviewUrl(null);
    setNewClothing({
      name: '',
      category1: '상의',
      category2: '',
      season: [],
      color: [],
      brand: '',
      material: '',
      size: '',
      memo: '',
      imageUrl: '',
      isFavorite: false,
    });
  };

  const handleCancelDetail = () => {
    setShowDetailDialog(false);
    setSelectedItem(null);
    setEditMode(false);
    setIsEditingImage(false);
    setIsDetailLoading(false);
  };

  const toggleArrayValue = (array: string[], value: string) => {
    if (array.includes(value)) {
      return array.filter((v) => v !== value);
    } else {
      return [...array, value];
    }
  };

  const filteredClothes =
    selectedCategory === '전체'
      ? clothes
      : clothes.filter((item) => item.category1 === selectedCategory);

  // 찜 필터 적용
  const displayedClothes = showFavoriteOnly
    ? filteredClothes.filter((item) => item.isFavorite)
    : filteredClothes;

  return (
    <>
      {/* 아이템 개수 표시 */}
      <div className="flex-shrink-0 px-6 pb-2 pt-1 flex justify-end">
        <p
          className="text-[#555555] flex-shrink-0"
          style={{
            fontFamily: "var(--font-inter), 'Inter', sans-serif",
            fontSize: '12px',
            fontWeight: 500,
          }}
        >
          {displayedClothes.length}
          {t('closet.items')}
        </p>
      </div>

      {/* 옷 목록 그리드 */}
      <div className="flex-1 overflow-y-auto px-6 pb-24">
        {displayedClothes.length === 0 ? (
          <div className="fixed left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-48px)] max-w-[320px] flex flex-col items-center justify-center">
            <button
              type="button"
              onClick={() => onShowAddDialogChange(true)}
              aria-label={t('closet.addFirst')}
              className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4 hover:bg-gray-200 transition-colors"
            >
              <Plus size={28} color="#999" strokeWidth={1.5} />
            </button>
            <p
              className="text-black mb-1"
              style={{
                fontFamily: "var(--font-inter), 'Inter', sans-serif",
                fontSize: '16px',
                fontWeight: 600,
              }}
            >
              {clothes.length === 0 ? t('closet.emptyTitle') : t('closet.noResults')}
            </p>
            <p
              className="text-[#999] text-center mb-6"
              style={{
                fontFamily: "var(--font-inter), 'Inter', sans-serif",
                fontSize: '13px',
                fontWeight: 400,
              }}
            >
              {clothes.length === 0
                ? t('closet.emptyDescription')
                : t('closet.noResultsDescription')}
            </p>
            {clothes.length === 0 && (
              <button
                onClick={() => onShowAddDialogChange(true)}
                className="px-6 py-3 text-white hover:opacity-90 transition-opacity flex items-center gap-2"
                style={{
                  borderRadius: '12px',
                  backgroundColor: '#000',
                  fontFamily: "var(--font-inter), 'Inter', sans-serif",
                  fontSize: '14px',
                  fontWeight: 600,
                }}
              >
                <Plus size={18} color="#fff" strokeWidth={2} />
                {t('closet.addFirst')}
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {displayedClothes.map((item) => (
              <div key={item.id} className="relative">
                <div
                  onClick={() => handleItemClick(item)}
                  className="aspect-square bg-gray-100 overflow-hidden relative cursor-pointer"
                  style={{ borderRadius: '16px' }}
                >
                  {item.imageUrl ? (
                    <ImageWithFallback
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <p
                        className="text-[#999]"
                        style={{
                          fontFamily: "var(--font-inter), 'Inter', sans-serif",
                          fontSize: '11px',
                          fontWeight: 500,
                        }}
                      >
                        {t('closet.noImage')}
                      </p>
                    </div>
                  )}

                  {/* 즐겨찾기 버튼 */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFavorite(item.id);
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm hover:bg-white transition-all"
                    style={{ borderRadius: '12px' }}
                  >
                    <Heart
                      size={16}
                      color={item.isFavorite ? '#000' : '#999'}
                      fill={item.isFavorite ? '#000' : 'none'}
                      strokeWidth={1.5}
                    />
                  </button>
                </div>

                {/* 옷 정보 */}
                <div className="mt-2">
                  <p
                    className="text-black truncate"
                    style={{
                      fontFamily: "var(--font-inter), 'Inter', sans-serif",
                      fontSize: '13px',
                      fontWeight: 600,
                    }}
                  >
                    {item.name}
                  </p>
                  <p
                    className="text-[#555555] text-sm truncate"
                    style={{
                      fontFamily: "var(--font-inter), 'Inter', sans-serif",
                      fontSize: '11px',
                      fontWeight: 400,
                    }}
                  >
                    {item.category2 || item.category1}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 옷 추가 다이얼로그 */}
      <Dialog.Root open={showAddDialog} onOpenChange={onShowAddDialogChange}>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 bg-black/30 z-50" />
          <Dialog.Popup
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white z-50 w-[90%] max-w-[400px] max-h-[85vh] flex flex-col"
            style={{
              borderRadius: '24px',
            }}
          >
            {addStep === 'method' ? (
              <div className="p-6">
                {/* 이미지 추가 방법 선택 */}
                <h2
                  className="text-black mb-4"
                  style={{
                    fontFamily: "var(--font-inter), 'Inter', sans-serif",
                    fontSize: '18px',
                    fontWeight: 600,
                  }}
                >
                  {t('closet.addItemTitle')}
                </h2>
                <p
                  className="text-[#555555] mb-6"
                  style={{
                    fontFamily: "var(--font-inter), 'Inter', sans-serif",
                    fontSize: '13px',
                    fontWeight: 400,
                    lineHeight: '1.5',
                  }}
                >
                  {t('closet.selectImageMethod')}
                </p>

                <div className="space-y-3">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors"
                    style={{
                      borderRadius: '16px',
                      border: '1.5px solid #E5E5E5',
                    }}
                  >
                    <Upload size={20} color="#000" strokeWidth={1.5} />
                    <span
                      className="text-black"
                      style={{
                        fontFamily: "var(--font-inter), 'Inter', sans-serif",
                        fontSize: '14px',
                        fontWeight: 500,
                      }}
                    >
                      {t('closet.chooseFromFile')}
                    </span>
                  </button>

                  <button
                    onClick={() => cameraInputRef.current?.click()}
                    className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors"
                    style={{
                      borderRadius: '16px',
                      border: '1.5px solid #E5E5E5',
                    }}
                  >
                    <Camera size={20} color="#000" strokeWidth={1.5} />
                    <span
                      className="text-black"
                      style={{
                        fontFamily: "var(--font-inter), 'Inter', sans-serif",
                        fontSize: '14px',
                        fontWeight: 500,
                      }}
                    >
                      {t('closet.takePhoto')}
                    </span>
                  </button>

                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
            ) : (
              <>
                {/* 고정 헤더 */}
                <div
                  className="flex-shrink-0 p-6 pb-4 bg-white"
                  style={{ borderRadius: '24px 24px 0 0' }}
                >
                  <h2
                    className="text-black"
                    style={{
                      fontFamily: "var(--font-inter), 'Inter', sans-serif",
                      fontSize: '18px',
                      fontWeight: 600,
                    }}
                  >
                    {t('closet.enterItemInfo')}
                  </h2>
                </div>

                {/* 스크롤 가능한 폼 */}
                <div className="flex-1 overflow-y-auto px-6 pb-2">
                  <div className="space-y-4">
                    {/* 이미지 미리보기 */}
                    {newClothing.imageUrl && (
                      <div>
                        <div
                          className="w-full aspect-square bg-gray-100 overflow-hidden relative"
                          style={{ borderRadius: '16px' }}
                        >
                          <img
                            src={newClothing.imageUrl}
                            alt="preview"
                            className="w-full h-full object-cover"
                          />
                          {isProcessing && (
                            // 배경 제거중 반투명 오버레이
                            <div
                              className="absolute inset-0 flex flex-col items-center justify-center"
                              style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                zIndex: 10,
                                backdropFilter: 'blur(2px)',
                              }}
                            >
                              <div
                                className="w-20 h-20 rounded-full mb-3 skeleton-shimmer"
                                style={{
                                  backgroundColor: '#F0F0F0',
                                }}
                              />
                              <p
                                style={{
                                  fontFamily: "var(--font-inter), 'Inter', sans-serif",
                                  fontSize: '14px',
                                  fontWeight: 600,
                                  color: '#000000',
                                }}
                              >
                                {t('closet.removingBackground')}
                              </p>
                            </div>
                          )}
                        </div>
                        {!isProcessing && hasPendingFile && (
                          <button
                            type="button"
                            onClick={handleRefreshBgRemoval}
                            className="mt-2 flex items-center gap-1.5 px-3 py-1.5 hover:bg-gray-50 transition-colors"
                            style={{
                              borderRadius: '12px',
                              border: '1.5px solid #E5E5E5',
                              fontFamily: "var(--font-inter), 'Inter', sans-serif",
                              fontSize: '12px',
                              fontWeight: 500,
                            }}
                          >
                            <RefreshCw size={14} strokeWidth={1.5} />
                            배경 제거 갱신
                          </button>
                        )}
                      </div>
                    )}

                    {/* 별칭 */}
                    <div>
                      <label
                        className="text-black mb-1.5 block"
                        style={{
                          fontFamily: "var(--font-inter), 'Inter', sans-serif",
                          fontSize: '12px',
                          fontWeight: 600,
                        }}
                      >
                        {t('closet.alias')} *
                      </label>
                      <input
                        type="text"
                        value={newClothing.name}
                        onChange={(e) =>
                          setNewClothing({
                            ...newClothing,
                            name: e.target.value,
                          })
                        }
                        placeholder={t('closet.aliasPlaceholder')}
                        className="w-full px-4 py-2.5 outline-none"
                        style={{
                          borderRadius: '12px',
                          border: '1.5px solid #E5E5E5',
                          fontFamily: "var(--font-inter), 'Inter', sans-serif",
                          fontSize: '13px',
                          fontWeight: 400,
                        }}
                      />
                    </div>

                    {/* 1차 카테고리 */}
                    <div>
                      <label
                        className="text-black mb-1.5 block"
                        style={{
                          fontFamily: "var(--font-inter), 'Inter', sans-serif",
                          fontSize: '12px',
                          fontWeight: 600,
                        }}
                      >
                        {t('closet.category')} *
                      </label>
                      {isProcessing ? (
                        // 카테고리 스켈레톤
                        <div className="flex flex-wrap gap-2">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <div
                              key={i}
                              className="skeleton-shimmer"
                              style={{
                                width: `${60 + i * 10}px`,
                                height: '32px',
                                borderRadius: '16px',
                                backgroundColor: '#F5F5F5',
                              }}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {Object.keys(CATEGORIES)
                            .filter((cat) => cat !== '전체')
                            .map((cat) => (
                              <button
                                key={cat}
                                type="button"
                                onClick={() =>
                                  setNewClothing({
                                    ...newClothing,
                                    category1: cat,
                                    category2: '',
                                  })
                                }
                                className="px-3 py-1.5 transition-all"
                                style={{
                                  borderRadius: '16px',
                                  backgroundColor: newClothing.category1 === cat ? '#000' : '#fff',
                                  border: '1.5px solid #E5E5E5',
                                  fontFamily: "var(--font-inter), 'Inter', sans-serif",
                                  fontSize: '12px',
                                  fontWeight: 500,
                                  color: newClothing.category1 === cat ? '#fff' : '#000',
                                }}
                              >
                                {cat}
                              </button>
                            ))}
                        </div>
                      )}
                    </div>

                    {/* 2차 카테고리 */}
                    {newClothing.category1 &&
                      CATEGORIES[newClothing.category1 as keyof typeof CATEGORIES].length > 0 && (
                        <div>
                          <label
                            className="text-black mb-1.5 block"
                            style={{
                              fontFamily: "var(--font-inter), 'Inter', sans-serif",
                              fontSize: '12px',
                              fontWeight: 600,
                            }}
                          >
                            {t('closet.subcategory')}
                          </label>
                          {isProcessing ? (
                            // 세부 카테고리 스켈레톤
                            <div className="flex flex-wrap gap-2">
                              {[1, 2, 3, 4, 5].map((i) => (
                                <div
                                  key={i}
                                  className="skeleton-shimmer"
                                  style={{
                                    width: `${70 + i * 8}px`,
                                    height: '32px',
                                    borderRadius: '16px',
                                    backgroundColor: '#F5F5F5',
                                  }}
                                />
                              ))}
                            </div>
                          ) : (
                            <div className="flex flex-wrap gap-2">
                              {CATEGORIES[newClothing.category1 as keyof typeof CATEGORIES].map(
                                (subCat) => (
                                  <button
                                    key={subCat}
                                    type="button"
                                    onClick={() =>
                                      setNewClothing({
                                        ...newClothing,
                                        category2: newClothing.category2 === subCat ? '' : subCat,
                                      })
                                    }
                                    className="px-3 py-1.5 transition-all"
                                    style={{
                                      borderRadius: '16px',
                                      backgroundColor:
                                        newClothing.category2 === subCat ? '#000' : '#fff',
                                      border: '1.5px solid #E5E5E5',
                                      fontFamily: "var(--font-inter), 'Inter', sans-serif",
                                      fontSize: '12px',
                                      fontWeight: 500,
                                      color: newClothing.category2 === subCat ? '#fff' : '#000',
                                    }}
                                  >
                                    {subCat}
                                  </button>
                                ),
                              )}
                            </div>
                          )}
                        </div>
                      )}

                    {/* 시즌 */}
                    <div>
                      <label
                        className="text-black mb-1.5 block"
                        style={{
                          fontFamily: "var(--font-inter), 'Inter', sans-serif",
                          fontSize: '12px',
                          fontWeight: 600,
                        }}
                      >
                        {t('closet.season')}
                      </label>
                      {isProcessing ? (
                        <div className="flex flex-wrap gap-2">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <div
                              key={i}
                              className="skeleton-shimmer"
                              style={{
                                width: `${60 + i * 10}px`,
                                height: '32px',
                                borderRadius: '16px',
                                backgroundColor: '#F5F5F5',
                              }}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {SEASONS.map((season) => (
                            <button
                              key={season}
                              type="button"
                              onClick={() =>
                                setNewClothing({
                                  ...newClothing,
                                  season: toggleArrayValue(newClothing.season || [], season),
                                })
                              }
                              className="px-3 py-1.5 transition-all"
                              style={{
                                borderRadius: '16px',
                                backgroundColor: newClothing.season?.includes(season)
                                  ? '#000'
                                  : '#fff',
                                border: '1.5px solid #E5E5E5',
                                fontFamily: "var(--font-inter), 'Inter', sans-serif",
                                fontSize: '12px',
                                fontWeight: 500,
                                color: newClothing.season?.includes(season) ? '#fff' : '#000',
                              }}
                            >
                              {season}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* 색상 */}
                    <div>
                      <label
                        className="text-black mb-1.5 block"
                        style={{
                          fontFamily: "var(--font-inter), 'Inter', sans-serif",
                          fontSize: '12px',
                          fontWeight: 600,
                        }}
                      >
                        {t('closet.color')}
                      </label>
                      {isProcessing ? (
                        // 색상 스켈레톤
                        <div className="flex flex-wrap gap-2">
                          {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div
                              key={i}
                              className="skeleton-shimmer"
                              style={{
                                width: `${65 + i * 5}px`,
                                height: '32px',
                                borderRadius: '16px',
                                backgroundColor: '#F5F5F5',
                              }}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {COLORS.map((color) => (
                            <button
                              key={color.name}
                              type="button"
                              onClick={() =>
                                setNewClothing({
                                  ...newClothing,
                                  color: toggleArrayValue(newClothing.color || [], color.name),
                                })
                              }
                              className="flex items-center gap-1.5 px-2.5 py-1.5 transition-all"
                              style={{
                                borderRadius: '16px',
                                backgroundColor: newClothing.color?.includes(color.name)
                                  ? '#000'
                                  : '#fff',
                                border: '1.5px solid #E5E5E5',
                              }}
                            >
                              <div
                                className="flex-shrink-0"
                                style={{
                                  width: '14px',
                                  height: '14px',
                                  borderRadius: '3px',
                                  ...(color.hex === null
                                    ? { background: 'linear-gradient(135deg, #f87171, #facc15, #4ade80, #60a5fa, #c084fc)' }
                                    : {
                                        backgroundColor: color.hex,
                                        border: color.hex === '#FFFFFF' ? '1px solid #E5E5E5' : 'none',
                                      }),
                                }}
                              />
                              <span
                                style={{
                                  fontFamily: "var(--font-inter), 'Inter', sans-serif",
                                  fontSize: '11px',
                                  fontWeight: 500,
                                  color: newClothing.color?.includes(color.name) ? '#fff' : '#000',
                                }}
                              >
                                {color.name}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* 소재 */}
                    <div>
                      <label
                        className="text-black mb-1.5 block"
                        style={{
                          fontFamily: "var(--font-inter), 'Inter', sans-serif",
                          fontSize: '12px',
                          fontWeight: 600,
                        }}
                      >
                        {t('closet.material')}
                      </label>
                      {isProcessing ? (
                        <div className="flex flex-wrap gap-2">
                          {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div
                              key={i}
                              className="skeleton-shimmer"
                              style={{
                                width: `${58 + i * 8}px`,
                                height: '32px',
                                borderRadius: '16px',
                                backgroundColor: '#F5F5F5',
                              }}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {MATERIALS.map((material) => (
                            <button
                              key={material}
                              type="button"
                              onClick={() =>
                                setNewClothing({
                                  ...newClothing,
                                  material: newClothing.material === material ? '' : material,
                                })
                              }
                              className="px-3 py-1.5 transition-all"
                              style={{
                                borderRadius: '16px',
                                backgroundColor: newClothing.material === material ? '#000' : '#fff',
                                border: '1.5px solid #E5E5E5',
                                fontFamily: "var(--font-inter), 'Inter', sans-serif",
                                fontSize: '12px',
                                fontWeight: 500,
                                color: newClothing.material === material ? '#fff' : '#000',
                              }}
                            >
                              {material}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* 브랜드 */}
                    <div>
                      <label
                        className="text-black mb-1.5 block"
                        style={{
                          fontFamily: "var(--font-inter), 'Inter', sans-serif",
                          fontSize: '12px',
                          fontWeight: 600,
                        }}
                      >
                        {t('closet.brand')}
                      </label>
                      <input
                        type="text"
                        value={newClothing.brand}
                        onChange={(e) =>
                          setNewClothing({
                            ...newClothing,
                            brand: e.target.value,
                          })
                        }
                        placeholder={t('closet.brandPlaceholder')}
                        className="w-full px-4 py-2.5 outline-none"
                        style={{
                          borderRadius: '12px',
                          border: '1.5px solid #E5E5E5',
                          fontFamily: "var(--font-inter), 'Inter', sans-serif",
                          fontSize: '13px',
                          fontWeight: 400,
                        }}
                      />
                    </div>

                    {/* 사이즈 */}
                    <div>
                      <label
                        className="text-black mb-1.5 block"
                        style={{
                          fontFamily: "var(--font-inter), 'Inter', sans-serif",
                          fontSize: '12px',
                          fontWeight: 600,
                        }}
                      >
                        {t('closet.size')}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {SIZES.map((size) => (
                          <button
                            key={size}
                            type="button"
                            onClick={() =>
                              setNewClothing({
                                ...newClothing,
                                size: newClothing.size === size ? '' : size,
                              })
                            }
                            className="px-3 py-1.5 transition-all"
                            style={{
                              borderRadius: '16px',
                              backgroundColor: newClothing.size === size ? '#000' : '#fff',
                              border: '1.5px solid #E5E5E5',
                              fontFamily: "var(--font-inter), 'Inter', sans-serif",
                              fontSize: '12px',
                              fontWeight: 500,
                              color: newClothing.size === size ? '#fff' : '#000',
                            }}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 메모 */}
                    <div>
                      <label
                        className="text-black mb-1.5 block"
                        style={{
                          fontFamily: "var(--font-inter), 'Inter', sans-serif",
                          fontSize: '12px',
                          fontWeight: 600,
                        }}
                      >
                        {t('closet.memo')}
                      </label>
                      <textarea
                        value={newClothing.memo}
                        onChange={(e) =>
                          setNewClothing({
                            ...newClothing,
                            memo: e.target.value,
                          })
                        }
                        placeholder={t('closet.enterMemo')}
                        rows={3}
                        className="w-full px-4 py-2.5 outline-none resize-none"
                        style={{
                          borderRadius: '12px',
                          border: '1.5px solid #E5E5E5',
                          fontFamily: "var(--font-inter), 'Inter', sans-serif",
                          fontSize: '13px',
                          fontWeight: 400,
                        }}
                      />
                    </div>

                  </div>
                </div>

                {/* 고정 푸터 버튼 */}
                <div
                  className="flex-shrink-0 flex gap-2 px-6 pb-6 pt-3 bg-white"
                  style={{ borderRadius: '0 0 24px 24px' }}
                >
                  <button
                    onClick={handleCancelAdd}
                    className="flex-1 px-4 py-3 hover:bg-gray-50 transition-colors"
                    style={{
                      borderRadius: '24px',
                      border: '1.5px solid #E5E5E5',
                      fontFamily: "var(--font-inter), 'Inter', sans-serif",
                      fontSize: '14px',
                      fontWeight: 600,
                    }}
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    onClick={handleAddClothing}
                    disabled={isSavingClothing || isProcessing || !draftId || !newClothing.name || !newClothing.category1}
                    className="flex-1 text-white px-4 py-3 hover:opacity-90 transition-opacity disabled:opacity-50 inline-flex items-center justify-center gap-2"
                    style={{
                      borderRadius: '24px',
                      backgroundColor: '#000',
                      fontFamily: "var(--font-inter), 'Inter', sans-serif",
                      fontSize: '14px',
                      fontWeight: 600,
                    }}
                  >
                    {isSavingClothing ? <><Spinner size="sm" className="text-white" />{t('closet.register')}</> : t('closet.register')}
                  </button>
                </div>
              </>
            )}

            <Dialog.Close
              className="absolute top-4 right-4 text-[#555555] hover:opacity-70 transition-opacity"
              aria-label="닫기"
              onClick={handleCancelAdd}
              style={{
                fontFamily: "var(--font-inter), 'Inter', sans-serif",
                fontSize: '24px',
              }}
            >
              ×
            </Dialog.Close>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>

      {/* 옷 상세보기/수정 다이얼로그 */}
      <Dialog.Root open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 bg-black/30 z-50" />
          <Dialog.Popup
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white z-50 w-[90%] max-w-[400px] max-h-[85vh] flex flex-col"
            style={{
              borderRadius: '24px',
            }}
          >
            {selectedItem && (
              <>
                {/* 고정 헤더 */}
                <div
                  className="flex-shrink-0 p-6 pb-4 bg-white"
                  style={{ borderRadius: '24px 24px 0 0' }}
                >
                  <h2
                    className="text-black"
                    style={{
                      fontFamily: "var(--font-inter), 'Inter', sans-serif",
                      fontSize: '18px',
                      fontWeight: 600,
                    }}
                  >
                    {editMode ? t('closet.editItemInfo') : t('closet.itemInfo')}
                  </h2>
                </div>

                {/* 스크롤 가능한 내용 */}
                <div className="flex-1 overflow-y-auto px-6 pb-2">
                  <div className="space-y-4">
                    {/* 이미지 */}
                    <div className="relative">
                      <div
                        className="w-full aspect-square bg-gray-100 overflow-hidden"
                        style={{ borderRadius: '16px' }}
                      >
                        {selectedItem.imageUrl ? (
                          <img
                            src={selectedItem.imageUrl}
                            alt={selectedItem.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <p
                              className="text-[#999]"
                              style={{
                                fontFamily: "var(--font-inter), 'Inter', sans-serif",
                                fontSize: '11px',
                                fontWeight: 500,
                              }}
                            >
                              {t('closet.noImage')}
                            </p>
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          handleToggleFavorite(selectedItem.id);
                          setSelectedItem((prev) =>
                            prev ? { ...prev, isFavorite: !prev.isFavorite } : prev,
                          );
                        }}
                        className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm hover:bg-white transition-all"
                        style={{ borderRadius: '12px' }}
                      >
                        <Heart
                          size={18}
                          color={selectedItem.isFavorite ? '#000' : '#999'}
                          fill={selectedItem.isFavorite ? '#000' : 'none'}
                          strokeWidth={1.5}
                        />
                      </button>
                      {editMode && (
                        <div className="mt-3 flex gap-2">
                          <button
                            onClick={() => {
                              setIsEditingImage(true);
                              // selectedItem의 데이터를 newClothing에 복사
                              setNewClothing({
                                name: selectedItem.name,
                                category1: selectedItem.category1,
                                category2: selectedItem.category2,
                                season: selectedItem.season,
                                color: selectedItem.color,
                                brand: selectedItem.brand,
                                material: selectedItem.material,
                                size: selectedItem.size,
                                memo: selectedItem.memo,
                                imageUrl: '',
                                isFavorite: selectedItem.isFavorite,
                              });
                              onShowAddDialogChange(true);
                              setAddStep('method');
                            }}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                            style={{
                              borderRadius: '12px',
                              border: '1.5px solid #E5E5E5',
                              fontFamily: "var(--font-inter), 'Inter', sans-serif",
                              fontSize: '13px',
                              fontWeight: 500,
                            }}
                          >
                            <Upload size={16} strokeWidth={1.5} />
                            {t('closet.changeImage')}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* 별칭 */}
                    <div>
                      <label
                        className="text-black mb-1.5 block"
                        style={{
                          fontFamily: "var(--font-inter), 'Inter', sans-serif",
                          fontSize: '12px',
                          fontWeight: 600,
                        }}
                      >
                        {t('closet.alias')} {editMode && '*'}
                      </label>
                      {editMode ? (
                        <input
                          type="text"
                          value={selectedItem.name}
                          onChange={(e) =>
                            setSelectedItem({
                              ...selectedItem,
                              name: e.target.value,
                            })
                          }
                          placeholder="예: 기본 화이트 티셔츠"
                          className="w-full px-4 py-2.5 outline-none"
                          style={{
                            borderRadius: '12px',
                            border: '1.5px solid #E5E5E5',
                            fontFamily: "var(--font-inter), 'Inter', sans-serif",
                            fontSize: '13px',
                            fontWeight: 400,
                          }}
                        />
                      ) : (
                        <p
                          style={{
                            fontFamily: "var(--font-inter), 'Inter', sans-serif",
                            fontSize: '14px',
                            fontWeight: 400,
                          }}
                        >
                          {selectedItem.name}
                        </p>
                      )}
                    </div>

                    {/* 카테고리 */}
                    <div>
                      <label
                        className="text-black mb-1.5 block"
                        style={{
                          fontFamily: "var(--font-inter), 'Inter', sans-serif",
                          fontSize: '12px',
                          fontWeight: 600,
                        }}
                      >
                        {t('closet.category')} {editMode && '*'}
                      </label>
                      {editMode ? (
                        <>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {Object.keys(CATEGORIES)
                              .filter((cat) => cat !== '전체')
                              .map((cat) => (
                                <button
                                  key={cat}
                                  type="button"
                                  onClick={() =>
                                    setSelectedItem({
                                      ...selectedItem,
                                      category1: cat,
                                      category2: '',
                                    })
                                  }
                                  className="px-3 py-1.5 transition-all"
                                  style={{
                                    borderRadius: '16px',
                                    backgroundColor:
                                      selectedItem.category1 === cat ? '#000' : '#fff',
                                    border: '1.5px solid #E5E5E5',
                                    fontFamily: "var(--font-inter), 'Inter', sans-serif",
                                    fontSize: '12px',
                                    fontWeight: 500,
                                    color: selectedItem.category1 === cat ? '#fff' : '#000',
                                  }}
                                >
                                  {cat}
                                </button>
                              ))}
                          </div>
                          {selectedItem.category1 &&
                            CATEGORIES[selectedItem.category1 as keyof typeof CATEGORIES].length >
                              0 && (
                              <div>
                                <label
                                  className="text-black mb-1.5 block"
                                  style={{
                                    fontFamily: "var(--font-inter), 'Inter', sans-serif",
                                    fontSize: '12px',
                                    fontWeight: 600,
                                  }}
                                >
                                  {t('closet.subcategory')}
                                </label>
                                <div className="flex flex-wrap gap-2">
                                  {CATEGORIES[
                                    selectedItem.category1 as keyof typeof CATEGORIES
                                  ].map((subCat) => (
                                    <button
                                      key={subCat}
                                      type="button"
                                      onClick={() =>
                                        setSelectedItem({
                                          ...selectedItem,
                                          category2:
                                            selectedItem.category2 === subCat ? '' : subCat,
                                        })
                                      }
                                      className="px-3 py-1.5 transition-all"
                                      style={{
                                        borderRadius: '16px',
                                        backgroundColor:
                                          selectedItem.category2 === subCat ? '#000' : '#fff',
                                        border: '1.5px solid #E5E5E5',
                                        fontFamily: "var(--font-inter), 'Inter', sans-serif",
                                        fontSize: '12px',
                                        fontWeight: 500,
                                        color: selectedItem.category2 === subCat ? '#fff' : '#000',
                                      }}
                                    >
                                      {subCat}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                        </>
                      ) : (
                        <>
                          <p
                            style={{
                              fontFamily: "var(--font-inter), 'Inter', sans-serif",
                              fontSize: '14px',
                              fontWeight: 400,
                            }}
                          >
                            {selectedItem.category1}
                          </p>
                          {isDetailLoading ? (
                            <div
                              className="skeleton-shimmer mt-1"
                              style={{
                                width: '120px',
                                height: '18px',
                                borderRadius: '8px',
                                backgroundColor: '#F5F5F5',
                              }}
                            />
                          ) : selectedItem.category2 ? (
                            <p
                              className="text-[#666] mt-1"
                              style={{
                                fontFamily: "var(--font-inter), 'Inter', sans-serif",
                                fontSize: '13px',
                                fontWeight: 400,
                              }}
                            >
                              {selectedItem.category2}
                            </p>
                          ) : null}
                        </>
                      )}
                    </div>

                    {/* 시즌 */}
                    <div>
                      <label
                        className="text-black mb-1.5 block"
                        style={{
                          fontFamily: "var(--font-inter), 'Inter', sans-serif",
                          fontSize: '12px',
                          fontWeight: 600,
                        }}
                      >
                        {t('closet.season')}
                      </label>
                      {editMode ? (
                        <div className="flex flex-wrap gap-2">
                          {SEASONS.map((season) => (
                            <button
                              key={season}
                              type="button"
                              onClick={() =>
                                setSelectedItem({
                                  ...selectedItem,
                                  season: toggleArrayValue(selectedItem.season || [], season),
                                })
                              }
                              className="px-3 py-1.5 transition-all"
                              style={{
                                borderRadius: '16px',
                                backgroundColor: selectedItem.season?.includes(season)
                                  ? '#000'
                                  : '#fff',
                                border: '1.5px solid #E5E5E5',
                                fontFamily: "var(--font-inter), 'Inter', sans-serif",
                                fontSize: '12px',
                                fontWeight: 500,
                                color: selectedItem.season?.includes(season) ? '#fff' : '#000',
                              }}
                            >
                              {season}
                            </button>
                          ))}
                        </div>
                      ) : isDetailLoading ? (
                        <div className="flex flex-wrap gap-2">
                          {[1, 2, 3].map((i) => (
                            <div
                              key={i}
                              className="skeleton-shimmer"
                              style={{
                                width: `${52 + i * 14}px`,
                                height: '30px',
                                borderRadius: '16px',
                                backgroundColor: '#F5F5F5',
                              }}
                            />
                          ))}
                        </div>
                      ) : selectedItem.season.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {selectedItem.season.map((s) => (
                            <span
                              key={s}
                              className="px-3 py-1"
                              style={{
                                borderRadius: '16px',
                                backgroundColor: '#F3F3F3',
                                fontFamily: "var(--font-inter), 'Inter', sans-serif",
                                fontSize: '12px',
                                fontWeight: 500,
                              }}
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p
                          className="text-[#999]"
                          style={{
                            fontFamily: "var(--font-inter), 'Inter', sans-serif",
                            fontSize: '13px',
                            fontWeight: 400,
                          }}
                        >
                          미설정
                        </p>
                      )}
                    </div>

                    {/* 색상 */}
                    <div>
                      <label
                        className="text-black mb-1.5 block"
                        style={{
                          fontFamily: "var(--font-inter), 'Inter', sans-serif",
                          fontSize: '12px',
                          fontWeight: 600,
                        }}
                      >
                        {t('closet.color')}
                      </label>
                      {editMode ? (
                        <div className="flex flex-wrap gap-2">
                          {COLORS.map((color) => (
                            <button
                              key={color.name}
                              type="button"
                              onClick={() =>
                                setSelectedItem({
                                  ...selectedItem,
                                  color: toggleArrayValue(selectedItem.color || [], color.name),
                                })
                              }
                              className="flex items-center gap-1.5 px-2.5 py-1.5 transition-all"
                              style={{
                                borderRadius: '16px',
                                backgroundColor: selectedItem.color?.includes(color.name)
                                  ? '#000'
                                  : '#fff',
                                border: '1.5px solid #E5E5E5',
                              }}
                            >
                              <div
                                className="flex-shrink-0"
                                style={{
                                  width: '14px',
                                  height: '14px',
                                  borderRadius: '3px',
                                  ...(color.hex === null
                                    ? { background: 'linear-gradient(135deg, #f87171, #facc15, #4ade80, #60a5fa, #c084fc)' }
                                    : {
                                        backgroundColor: color.hex,
                                        border: color.hex === '#FFFFFF' ? '1px solid #E5E5E5' : 'none',
                                      }),
                                }}
                              />
                              <span
                                style={{
                                  fontFamily: "var(--font-inter), 'Inter', sans-serif",
                                  fontSize: '11px',
                                  fontWeight: 500,
                                  color: selectedItem.color?.includes(color.name) ? '#fff' : '#000',
                                }}
                              >
                                {color.name}
                              </span>
                            </button>
                          ))}
                        </div>
                      ) : isDetailLoading ? (
                        <div className="flex flex-wrap gap-2">
                          {[1, 2, 3, 4].map((i) => (
                            <div
                              key={i}
                              className="skeleton-shimmer"
                              style={{
                                width: `${58 + i * 10}px`,
                                height: '30px',
                                borderRadius: '16px',
                                backgroundColor: '#F5F5F5',
                              }}
                            />
                          ))}
                        </div>
                      ) : selectedItem.color.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {selectedItem.color.map((c) => {
                            const colorData = COLORS.find((col) => col.name === c);
                            return (
                              <div
                                key={c}
                                className="flex items-center gap-1.5 px-2.5 py-1.5"
                                style={{
                                  borderRadius: '16px',
                                  backgroundColor: '#F3F3F3',
                                }}
                              >
                                {colorData && (
                                  <div
                                    style={{
                                      width: '14px',
                                      height: '14px',
                                      borderRadius: '3px',
                                      ...(colorData.hex === null
                                        ? { background: 'linear-gradient(135deg, #f87171, #facc15, #4ade80, #60a5fa, #c084fc)' }
                                        : {
                                            backgroundColor: colorData.hex,
                                            border: colorData.hex === '#FFFFFF' ? '1px solid #E5E5E5' : 'none',
                                          }),
                                    }}
                                  />
                                )}
                                <span
                                  style={{
                                    fontFamily: "var(--font-inter), 'Inter', sans-serif",
                                    fontSize: '11px',
                                    fontWeight: 500,
                                  }}
                                >
                                  {c}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p
                          className="text-[#999]"
                          style={{
                            fontFamily: "var(--font-inter), 'Inter', sans-serif",
                            fontSize: '13px',
                            fontWeight: 400,
                          }}
                        >
                          미설정
                        </p>
                      )}
                    </div>

                    {/* 소재 */}
                    <div>
                      <label
                        className="text-black mb-1.5 block"
                        style={{
                          fontFamily: "var(--font-inter), 'Inter', sans-serif",
                          fontSize: '12px',
                          fontWeight: 600,
                        }}
                      >
                        {t('closet.material')}
                      </label>
                      {editMode ? (
                        <div className="flex flex-wrap gap-2">
                          {MATERIALS.map((material) => (
                            <button
                              key={material}
                              type="button"
                              onClick={() =>
                                setSelectedItem({
                                  ...selectedItem,
                                  material: selectedItem.material === material ? '' : material,
                                })
                              }
                              className="px-3 py-1.5 transition-all"
                              style={{
                                borderRadius: '16px',
                                backgroundColor:
                                  selectedItem.material === material ? '#000' : '#fff',
                                border: '1.5px solid #E5E5E5',
                                fontFamily: "var(--font-inter), 'Inter', sans-serif",
                                fontSize: '12px',
                                fontWeight: 500,
                                color: selectedItem.material === material ? '#fff' : '#000',
                              }}
                            >
                              {material}
                            </button>
                          ))}
                        </div>
                      ) : isDetailLoading ? (
                        <div
                          className="skeleton-shimmer"
                          style={{
                            width: '100px',
                            height: '20px',
                            borderRadius: '8px',
                            backgroundColor: '#F5F5F5',
                          }}
                        />
                      ) : selectedItem.material ? (
                        <p
                          style={{
                            fontFamily: "var(--font-inter), 'Inter', sans-serif",
                            fontSize: '14px',
                            fontWeight: 400,
                          }}
                        >
                          {selectedItem.material}
                        </p>
                      ) : (
                        <p
                          className="text-[#999]"
                          style={{
                            fontFamily: "var(--font-inter), 'Inter', sans-serif",
                            fontSize: '13px',
                            fontWeight: 400,
                          }}
                        >
                          미설정
                        </p>
                      )}
                    </div>

                    {/* 브랜드 */}
                    <div>
                      <label
                        className="text-black mb-1.5 block"
                        style={{
                          fontFamily: "var(--font-inter), 'Inter', sans-serif",
                          fontSize: '12px',
                          fontWeight: 600,
                        }}
                      >
                        {t('closet.brand')}
                      </label>
                      {editMode ? (
                        <input
                          type="text"
                          value={selectedItem.brand}
                          onChange={(e) =>
                            setSelectedItem({
                              ...selectedItem,
                              brand: e.target.value,
                            })
                          }
                          placeholder="예: 유니클로"
                          className="w-full px-4 py-2.5 outline-none"
                          style={{
                            borderRadius: '12px',
                            border: '1.5px solid #E5E5E5',
                            fontFamily: "var(--font-inter), 'Inter', sans-serif",
                            fontSize: '13px',
                            fontWeight: 400,
                          }}
                        />
                      ) : isDetailLoading ? (
                        <div
                          className="skeleton-shimmer"
                          style={{
                            width: '120px',
                            height: '20px',
                            borderRadius: '8px',
                            backgroundColor: '#F5F5F5',
                          }}
                        />
                      ) : selectedItem.brand ? (
                        <p
                          style={{
                            fontFamily: "var(--font-inter), 'Inter', sans-serif",
                            fontSize: '14px',
                            fontWeight: 400,
                          }}
                        >
                          {selectedItem.brand}
                        </p>
                      ) : (
                        <p
                          className="text-[#999]"
                          style={{
                            fontFamily: "var(--font-inter), 'Inter', sans-serif",
                            fontSize: '13px',
                            fontWeight: 400,
                          }}
                        >
                          미설정
                        </p>
                      )}
                    </div>

                    {/* 사이즈 */}
                    <div>
                      <label
                        className="text-black mb-1.5 block"
                        style={{
                          fontFamily: "var(--font-inter), 'Inter', sans-serif",
                          fontSize: '12px',
                          fontWeight: 600,
                        }}
                      >
                        {t('closet.size')}
                      </label>
                      {editMode ? (
                        <div className="flex flex-wrap gap-2">
                          {SIZES.map((size) => (
                            <button
                              key={size}
                              type="button"
                              onClick={() =>
                                setSelectedItem({
                                  ...selectedItem,
                                  size: selectedItem.size === size ? '' : size,
                                })
                              }
                              className="px-3 py-1.5 transition-all"
                              style={{
                                borderRadius: '16px',
                                backgroundColor: selectedItem.size === size ? '#000' : '#fff',
                                border: '1.5px solid #E5E5E5',
                                fontFamily: "var(--font-inter), 'Inter', sans-serif",
                                fontSize: '12px',
                                fontWeight: 500,
                                color: selectedItem.size === size ? '#fff' : '#000',
                              }}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      ) : isDetailLoading ? (
                        <div
                          className="skeleton-shimmer"
                          style={{
                            width: '64px',
                            height: '20px',
                            borderRadius: '8px',
                            backgroundColor: '#F5F5F5',
                          }}
                        />
                      ) : selectedItem.size ? (
                        <p
                          style={{
                            fontFamily: "var(--font-inter), 'Inter', sans-serif",
                            fontSize: '14px',
                            fontWeight: 400,
                          }}
                        >
                          {selectedItem.size}
                        </p>
                      ) : (
                        <p
                          className="text-[#999]"
                          style={{
                            fontFamily: "var(--font-inter), 'Inter', sans-serif",
                            fontSize: '13px',
                            fontWeight: 400,
                          }}
                        >
                          미설정
                        </p>
                      )}
                    </div>

                    {/* 메모 */}
                    <div>
                      <label
                        className="text-black mb-1.5 block"
                        style={{
                          fontFamily: "var(--font-inter), 'Inter', sans-serif",
                          fontSize: '12px',
                          fontWeight: 600,
                        }}
                      >
                        {t('closet.memo')}
                      </label>
                      {editMode ? (
                        <textarea
                          value={selectedItem.memo}
                          onChange={(e) =>
                            setSelectedItem({
                              ...selectedItem,
                              memo: e.target.value,
                            })
                          }
                          placeholder="예: 데일리로 자주 입는 기본템"
                          rows={3}
                          className="w-full px-4 py-2.5 outline-none resize-none"
                          style={{
                            borderRadius: '12px',
                            border: '1.5px solid #E5E5E5',
                            fontFamily: "var(--font-inter), 'Inter', sans-serif",
                            fontSize: '13px',
                            fontWeight: 400,
                          }}
                        />
                      ) : isDetailLoading ? (
                        <div className="space-y-2">
                          <div
                            className="skeleton-shimmer"
                            style={{
                              width: '100%',
                              height: '14px',
                              borderRadius: '8px',
                              backgroundColor: '#F5F5F5',
                            }}
                          />
                          <div
                            className="skeleton-shimmer"
                            style={{
                              width: '72%',
                              height: '14px',
                              borderRadius: '8px',
                              backgroundColor: '#F5F5F5',
                            }}
                          />
                        </div>
                      ) : selectedItem.memo ? (
                        <p
                          style={{
                            fontFamily: "var(--font-inter), 'Inter', sans-serif",
                            fontSize: '14px',
                            fontWeight: 400,
                            lineHeight: '1.6',
                          }}
                        >
                          {selectedItem.memo}
                        </p>
                      ) : (
                        <p
                          className="text-[#999]"
                          style={{
                            fontFamily: "var(--font-inter), 'Inter', sans-serif",
                            fontSize: '13px',
                            fontWeight: 400,
                          }}
                        >
                          미설정
                        </p>
                      )}
                    </div>

                  </div>
                </div>

                {/* 고정 푸터 버튼 */}
                <div
                  className="flex-shrink-0 flex gap-2 px-6 pb-6 pt-3 bg-white"
                  style={{ borderRadius: '0 0 24px 24px' }}
                >
                  {!editMode ? (
                    <>
                      <button
                        onClick={() => setEditMode(true)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 hover:bg-gray-50 transition-colors"
                        style={{
                          borderRadius: '24px',
                          border: '1.5px solid #E5E5E5',
                          fontFamily: "var(--font-inter), 'Inter', sans-serif",
                          fontSize: '14px',
                          fontWeight: 600,
                        }}
                      >
                        <Edit2 size={16} strokeWidth={2} />
                        {t('common.edit')}
                      </button>
                      <button
                        onClick={handleDeleteClick}
                        className="flex-1 flex items-center justify-center gap-2 text-white px-4 py-3 hover:opacity-90 transition-opacity"
                        style={{
                          borderRadius: '24px',
                          backgroundColor: '#000',
                          fontFamily: "var(--font-inter), 'Inter', sans-serif",
                          fontSize: '14px',
                          fontWeight: 600,
                        }}
                      >
                        <Trash2 size={16} strokeWidth={2} />
                        {t('common.delete')}
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleCancelDetail}
                        className="flex-1 px-4 py-3 hover:bg-gray-50 transition-colors"
                        style={{
                          borderRadius: '24px',
                          border: '1.5px solid #E5E5E5',
                          fontFamily: "var(--font-inter), 'Inter', sans-serif",
                          fontSize: '14px',
                          fontWeight: 600,
                        }}
                      >
                        {t('common.cancel')}
                      </button>
                      <button
                        onClick={handleUpdateClothing}
                        disabled={isSavingClothing || !selectedItem.name || !selectedItem.category1}
                        className="flex-1 text-white px-4 py-3 hover:opacity-90 transition-opacity disabled:opacity-50 inline-flex items-center justify-center gap-2"
                        style={{
                          borderRadius: '24px',
                          backgroundColor: '#000',
                          fontFamily: "var(--font-inter), 'Inter', sans-serif",
                          fontSize: '14px',
                          fontWeight: 600,
                        }}
                      >
                        {isSavingClothing ? <><Spinner size="sm" className="text-white" />{t('closet.save')}</> : t('closet.save')}
                      </button>
                    </>
                  )}
                </div>
              </>
            )}

            <Dialog.Close
              className="absolute top-4 right-4 text-[#555555] hover:opacity-70 transition-opacity"
              aria-label="닫기"
              onClick={handleCancelDetail}
              style={{
                fontFamily: "var(--font-inter), 'Inter', sans-serif",
                fontSize: '24px',
              }}
            >
              ×
            </Dialog.Close>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>

      {/* 옷 삭제 확인 다이얼로그 */}
      <Dialog.Root open={showDeleteConfirmDialog} onOpenChange={setShowDeleteConfirmDialog}>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 bg-black/40 z-[60]" />
          <Dialog.Popup
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white z-[60] w-[90%] max-w-[340px] p-8"
            style={{ borderRadius: 'var(--radius-xl)' }}
            aria-describedby={undefined}
          >
            <h2
              className="text-black mb-3"
              style={{
                fontFamily: "var(--font-inter), 'Inter', sans-serif",
                fontSize: '20px',
                fontWeight: 700,
              }}
            >
              옷을 삭제할까요?
            </h2>
            <p
              className="text-gray-500 mb-8"
              style={{
                fontFamily: "var(--font-inter), 'Inter', sans-serif",
                fontSize: '14px',
                fontWeight: 400,
              }}
            >
              삭제된 옷은 복구할 수 없습니다.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirmDialog(false)}
                disabled={isDeletingClothing}
                className="flex-1 py-4 disabled:opacity-60"
                style={{
                  border: '1.5px solid #E5E5E5',
                  borderRadius: 'var(--radius-pill)',
                  fontFamily: "var(--font-inter), 'Inter', sans-serif",
                  fontSize: '14px',
                  fontWeight: 600,
                }}
              >
                취소
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeletingClothing}
                className="flex-1 py-4 text-white inline-flex items-center justify-center gap-2 disabled:opacity-60"
                style={{
                  backgroundColor: '#000',
                  borderRadius: 'var(--radius-pill)',
                  fontFamily: "var(--font-inter), 'Inter', sans-serif",
                  fontSize: '14px',
                  fontWeight: 600,
                }}
              >
                {isDeletingClothing ? <><Spinner size="sm" className="text-white" />삭제 중...</> : '삭제'}
              </button>
            </div>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

interface ClosetPageProps {
  clothesPromise?: Promise<ClothesListItemResponseDto[]>;
  initialClothes?: ClothesListItemResponseDto[];
  header?: ReactNode;
}

export function ClosetPage({ clothesPromise, initialClothes = [], header }: ClosetPageProps) {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [showFavoriteOnly, setShowFavoriteOnly] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const effectiveClothesPromise = clothesPromise ?? Promise.resolve(initialClothes);
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const handleCategoryWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const container = categoryScrollRef.current;
    if (!container) return;
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
    e.preventDefault();
    container.scrollBy({ left: e.deltaY, behavior: 'smooth' });
  };

  return (
    <div className="flex-1 min-h-0 w-full bg-white flex flex-col overflow-hidden">
      <div className="flex-shrink-0 relative">
        {header}
        <div className="absolute right-6 top-1/2 -translate-y-1/2">
          <PlusAction onClick={() => setShowAddDialog(true)} />
        </div>
      </div>

      {/* 카테고리 슬라이드 */}
      <div className="flex-shrink-0 px-6 pb-3">
        <div
          ref={categoryScrollRef}
          onWheel={handleCategoryWheel}
          className="flex gap-2 overflow-x-auto scrollbar-hide items-center scroll-smooth"
        >
          {/* 찜 아이콘 토글 */}
          <button
            onClick={() => {
              setShowFavoriteOnly(!showFavoriteOnly);
            }}
            className="flex-shrink-0 p-2 transition-all flex items-center justify-center"
            style={{
              borderRadius: '50%',
              backgroundColor: showFavoriteOnly ? '#000' : 'transparent',
            }}
          >
            <Heart
              size={18}
              color={showFavoriteOnly ? '#fff' : '#000'}
              fill={showFavoriteOnly ? '#fff' : 'none'}
              strokeWidth={2}
            />
          </button>

          {/* 구분선 */}
          <div
            style={{
              width: '1px',
              height: '20px',
              backgroundColor: '#D9D9D9',
              flexShrink: 0,
            }}
          />

          {Object.keys(CATEGORIES).map((category) => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category);
              }}
              className="flex-shrink-0 px-5 py-1.5 transition-all"
              style={{
                borderRadius: '999px',
                backgroundColor: selectedCategory === category ? '#000' : '#fff',
                border: '2px solid #000',
                fontFamily: "var(--font-inter), 'Inter', sans-serif",
                fontSize: '14px',
                fontWeight: 600,
                color: selectedCategory === category ? '#fff' : '#000',
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <Suspense fallback={<ClosetGridSkeleton />}>
        <ClosetContent
          clothesPromise={effectiveClothesPromise}
          selectedCategory={selectedCategory}
          showFavoriteOnly={showFavoriteOnly}
          showAddDialog={showAddDialog}
          onShowAddDialogChange={setShowAddDialog}
        />
      </Suspense>
    </div>
  );
}
