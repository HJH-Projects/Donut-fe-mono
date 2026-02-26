'use client';

import { Heart, Plus, Camera, Upload, X, Edit2, Trash2 } from 'lucide-react';
import { useState, useRef, type ReactNode } from 'react';
import { Dialog } from '@base-ui/react/dialog';
import { ImageWithFallback } from '@/shared/ui/ImageWithFallback';
import { PlusAction } from '@/shared/ui/PlusAction';
import { useTranslation } from 'react-i18next';
import type { ClothesResponseDto } from '@/shared/model/orvalSchemas';
import { uploadToS3 } from '@/shared/model/utils/uploadToS3';
import { useClothes, type ClothingItem } from '../model/useClothes';

// 카테고리 정의
const CATEGORIES = {
  전체: [],
  상의: ['반소매 티셔츠', '긴소매 티셔츠', '셔츠/블라우스', '니트/스웨터', '후드티/맨투맨'],
  하의: ['청바지', '슬랙스', '반바지', '치마', '레깅스'],
  아우터: ['코트', '자켓', '패딩', '가디건', '점퍼'],
  신발: ['스니커즈', '구두', '부츠', '샌들', '슬리퍼'],
  악세사리: ['가방', '모자', '벨트', '스카프', '주얼리'],
};

const SEASONS = ['봄', '여름', '가을', '겨울', '사계절'];
const COLORS = [
  { kr: '블랙', en: 'Black', hex: '#000000' },
  { kr: '화이트', en: 'White', hex: '#FFFFFF' },
  { kr: '그레이', en: 'Gray', hex: '#9CA3AF' },
  { kr: '베이지', en: 'Beige', hex: '#F5E6D3' },
  { kr: '브라운', en: 'Brown', hex: '#8B4513' },
  { kr: '네이비', en: 'Navy', hex: '#001F3F' },
  { kr: '블루', en: 'Blue', hex: '#3B82F6' },
  { kr: '레드', en: 'Red', hex: '#EF4444' },
  { kr: '핑크', en: 'Pink', hex: '#EC4899' },
  { kr: '옐로우', en: 'Yellow', hex: '#FCD34D' },
  { kr: '그린', en: 'Green', hex: '#10B981' },
  { kr: '퍼플', en: 'Purple', hex: '#8B5CF6' },
];

const MATERIALS = [
  '면',
  '폴리에스터',
  '울',
  '데님',
  '나일론',
  '가죽',
  '스웨이드',
  '실크',
  '린넨',
  '혼방',
];

interface ClosetPageProps {
  initialClothes?: ClothesResponseDto[];
  header?: ReactNode;
}

export function ClosetPage({ initialClothes = [], header }: ClosetPageProps) {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [showFavoriteOnly, setShowFavoriteOnly] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [addStep, setAddStep] = useState<'method' | 'form'>('method');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEditingImage, setIsEditingImage] = useState(false);
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
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const pendingUploadFileRef = useRef<File | null>(null);
  const [uploadedPublicUrl, setUploadedPublicUrl] = useState<string | null>(null);

  const handleToggleFavorite = (id: string) => {
    toggleFavorite(id);
  };

  const handleItemClick = (item: ClothingItem) => {
    setSelectedItem(item);
    setShowDetailDialog(true);
    setEditMode(false);
    setIsEditingImage(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      pendingUploadFileRef.current = file;
      setUploadedPublicUrl(null);

      // Background S3 upload
      uploadToS3(file, 'clothes')
        .then(({ publicUrl }) => {
          setUploadedPublicUrl(publicUrl);
          URL.revokeObjectURL(imageUrl);
        })
        .catch(() => {
          // S3 업로드 실패 시 blob URL 유지 (graceful degradation)
        });

      if (isEditingImage && selectedItem) {
        // 수정 모드에서 이미지 변경할 때
        setNewClothing({ ...newClothing, imageUrl });
        setIsProcessing(true);
        setAddStep('form');

        // Mock AI 처리: 2초 후 배경 제거 완료
        setTimeout(() => {
          setSelectedItem({ ...selectedItem, imageUrl });
          setIsProcessing(false);
          setShowAddDialog(false);
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
        }, 2000);
      } else {
        // 추가 모드일 때
        setNewClothing({ ...newClothing, imageUrl });
        setAddStep('form');
        setIsProcessing(true);

        // Mock AI 처리: 2초 후 배경 제거 및 AI 분석 완료
        setTimeout(() => {
          // AI가 추천한 값들 설정
          setNewClothing((prev) => ({
            ...prev,
            category1: '상의',
            category2: '반소매 티셔츠',
            color: ['화이트'],
          }));
          setIsProcessing(false);
        }, 2000);
      }
    }
  };

  const handleAddClothing = async () => {
    if (!newClothing.name || !newClothing.category1) return;

    // S3 업로드가 완료되었으면 publicUrl 사용, 아니면 blob URL 유지
    const finalImageUrl = uploadedPublicUrl || newClothing.imageUrl || '';

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
      imageUrl: finalImageUrl,
      isFavorite: false,
    };

    setShowAddDialog(false);
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
    setUploadedPublicUrl(null);

    await addClothing(newItem, finalImageUrl);
  };

  const handleUpdateClothing = async () => {
    if (!selectedItem) return;

    setShowDetailDialog(false);
    setSelectedItem(null);
    setEditMode(false);

    await updateClothing(selectedItem);
  };

  const handleDeleteClothing = async () => {
    if (!selectedItem) return;

    const deletedId = selectedItem.id;
    setShowDetailDialog(false);
    setSelectedItem(null);

    await removeClothing(deletedId);
  };

  const handleCancelAdd = () => {
    setShowAddDialog(false);
    setAddStep('method');
    setIsProcessing(false);
    setIsEditingImage(false);
    pendingUploadFileRef.current = null;
    setUploadedPublicUrl(null);
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
          className="flex gap-2 overflow-x-auto scrollbar-hide items-center"
        >
          {/* 찜 아이콘 토글 */}
          <button
            onClick={() => {
              setShowFavoriteOnly(!showFavoriteOnly);
              if (!showFavoriteOnly) {
                setSelectedCategory('전체');
              }
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
                setShowFavoriteOnly(false);
              }}
              className="flex-shrink-0 px-5 py-1.5 transition-all"
              style={{
                borderRadius: '999px',
                backgroundColor:
                  selectedCategory === category && !showFavoriteOnly ? '#000' : '#fff',
                border: '2px solid #000',
                fontFamily: "var(--font-inter), 'Inter', sans-serif",
                fontSize: '14px',
                fontWeight: 600,
                color: selectedCategory === category && !showFavoriteOnly ? '#fff' : '#000',
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* 아이템 개수 표시 */}
      <div className="flex-shrink-0 px-6 pb-4">
        <p
          className="text-[#555555]"
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
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Plus size={28} color="#999" strokeWidth={1.5} />
            </div>
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
                onClick={() => setShowAddDialog(true)}
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
      <Dialog.Root open={showAddDialog} onOpenChange={setShowAddDialog}>
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
                              key={color.kr}
                              type="button"
                              onClick={() =>
                                setNewClothing({
                                  ...newClothing,
                                  color: toggleArrayValue(newClothing.color || [], color.kr),
                                })
                              }
                              className="flex items-center gap-1.5 px-2.5 py-1.5 transition-all"
                              style={{
                                borderRadius: '16px',
                                backgroundColor: newClothing.color?.includes(color.kr)
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
                                  backgroundColor: color.hex,
                                  border: color.hex === '#FFFFFF' ? '1px solid #E5E5E5' : 'none',
                                }}
                              />
                              <span
                                style={{
                                  fontFamily: "var(--font-inter), 'Inter', sans-serif",
                                  fontSize: '11px',
                                  fontWeight: 500,
                                  color: newClothing.color?.includes(color.kr) ? '#fff' : '#000',
                                }}
                              >
                                {color.en}
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
                      <input
                        type="text"
                        value={newClothing.size}
                        onChange={(e) =>
                          setNewClothing({
                            ...newClothing,
                            size: e.target.value,
                          })
                        }
                        placeholder={t('closet.enterSize')}
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
                    disabled={!newClothing.name || !newClothing.category1}
                    className="flex-1 text-white px-4 py-3 hover:opacity-90 transition-opacity disabled:opacity-50"
                    style={{
                      borderRadius: '24px',
                      backgroundColor: '#000',
                      fontFamily: "var(--font-inter), 'Inter', sans-serif",
                      fontSize: '14px',
                      fontWeight: 600,
                    }}
                  >
                    {t('closet.register')}
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
                              setShowAddDialog(true);
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
                        <p
                          style={{
                            fontFamily: "var(--font-inter), 'Inter', sans-serif",
                            fontSize: '14px',
                            fontWeight: 400,
                          }}
                        >
                          {selectedItem.category1}
                          {selectedItem.category2 && ` > ${selectedItem.category2}`}
                        </p>
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
                              key={color.kr}
                              type="button"
                              onClick={() =>
                                setSelectedItem({
                                  ...selectedItem,
                                  color: toggleArrayValue(selectedItem.color || [], color.kr),
                                })
                              }
                              className="flex items-center gap-1.5 px-2.5 py-1.5 transition-all"
                              style={{
                                borderRadius: '16px',
                                backgroundColor: selectedItem.color?.includes(color.kr)
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
                                  backgroundColor: color.hex,
                                  border: color.hex === '#FFFFFF' ? '1px solid #E5E5E5' : 'none',
                                }}
                              />
                              <span
                                style={{
                                  fontFamily: "var(--font-inter), 'Inter', sans-serif",
                                  fontSize: '11px',
                                  fontWeight: 500,
                                  color: selectedItem.color?.includes(color.kr) ? '#fff' : '#000',
                                }}
                              >
                                {color.en}
                              </span>
                            </button>
                          ))}
                        </div>
                      ) : selectedItem.color.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {selectedItem.color.map((c) => {
                            const colorData = COLORS.find((col) => col.kr === c);
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
                                      backgroundColor: colorData.hex,
                                      border:
                                        colorData.hex === '#FFFFFF' ? '1px solid #E5E5E5' : 'none',
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
                                  {colorData?.en || c}
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
                        <input
                          type="text"
                          value={selectedItem.size}
                          onChange={(e) =>
                            setSelectedItem({
                              ...selectedItem,
                              size: e.target.value,
                            })
                          }
                          placeholder="예: M, 95"
                          className="w-full px-4 py-2.5 outline-none"
                          style={{
                            borderRadius: '12px',
                            border: '1.5px solid #E5E5E5',
                            fontFamily: "var(--font-inter), 'Inter', sans-serif",
                            fontSize: '13px',
                            fontWeight: 400,
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
                        onClick={handleDeleteClothing}
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
                        disabled={!selectedItem.name || !selectedItem.category1}
                        className="flex-1 text-white px-4 py-3 hover:opacity-90 transition-opacity disabled:opacity-50"
                        style={{
                          borderRadius: '24px',
                          backgroundColor: '#000',
                          fontFamily: "var(--font-inter), 'Inter', sans-serif",
                          fontSize: '14px',
                          fontWeight: 600,
                        }}
                      >
                        {t('closet.save')}
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
    </div>
  );
}
