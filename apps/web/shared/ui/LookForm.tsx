'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { ImageWithFallback } from '@/shared/ui/ImageWithFallback';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/shared/model/useToast';
import Spinner from '@/shared/ui/Spinner';

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

type LookFormProps = {
  mode: 'add' | 'edit';
  initialData?: Look;
  closetItems: LookItem[];
  onSave: (look: Partial<Look>) => void;
  onCancel: () => void;
  isSaving?: boolean;
};

const CATEGORIES = ['상의', '하의', '아우터', '신발', '악세사리'];
const COMMON_TAGS = [
  '캐주얼',
  '포멀',
  '오피스',
  '데이트',
  '여행',
  '홈웨어',
  '운동',
  '파티',
  '봄',
  '여름',
  '가을',
  '겨울',
  '편안',
  '세련',
];

export function LookForm({
  mode,
  initialData,
  closetItems,
  onSave,
  onCancel,
  isSaving = false,
}: LookFormProps) {
  const { t } = useTranslation();
  const toast = useToast();
  const [lookName, setLookName] = useState(initialData?.name || '');
  const [selectedTags, setSelectedTags] = useState<string[]>(initialData?.tags || []);
  const [customTag, setCustomTag] = useState('');
  const [selectedItems, setSelectedItems] = useState<LookItem[]>(initialData?.items || []);
  const [activeCategory, setActiveCategory] = useState<string>('전체');

  const filteredItems =
    activeCategory === '전체'
      ? closetItems
      : closetItems.filter((item) => item.category === activeCategory);

  const handleToggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleAddCustomTag = () => {
    if (customTag.trim() && !selectedTags.includes(customTag.trim())) {
      setSelectedTags([...selectedTags, customTag.trim()]);
      setCustomTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  const handleToggleItem = (item: LookItem) => {
    if (selectedItems.find((i) => i.id === item.id)) {
      setSelectedItems(selectedItems.filter((i) => i.id !== item.id));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    setSelectedItems(selectedItems.filter((i) => i.id !== itemId));
  };

  const handleSave = () => {
    if (!lookName.trim()) {
      toast.info(t('looks.enterLookName'));
      return;
    }
    if (selectedTags.length === 0) {
      toast.info(t('looks.selectTag'));
      return;
    }
    if (selectedItems.length === 0) {
      toast.info('최소 1개 이상의 아이템을 선택해주세요');
      return;
    }

    onSave({
      name: lookName,
      tags: selectedTags,
      items: selectedItems,
    });
  };

  const isFormValid = !!lookName.trim() && selectedTags.length > 0 && selectedItems.length > 0;

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* 헤더 */}
      <div className="shrink-0 p-6 pb-4 bg-white">
        <h2
          className="text-black"
          style={{
            fontFamily: "var(--font-inter), 'Inter', sans-serif",
            fontSize: '18px',
            fontWeight: 600,
          }}
        >
          {mode === 'add' ? t('looks.addLook') : t('looks.editLook')}
        </h2>
      </div>

      {/* 폼 내용 */}
      <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4">
        {/* 룩 이름 입력 */}
        <div className="mb-6">
          <label
            className="block text-black mb-2"
            style={{
              fontFamily: "var(--font-inter), 'Inter', sans-serif",
              fontSize: '13px',
              fontWeight: 600,
            }}
          >
            {t('looks.lookName')}
          </label>
          <input
            type="text"
            value={lookName}
            onChange={(e) => setLookName(e.target.value)}
            placeholder="예: 출근룩, 데이트룩"
            className="w-full px-4 py-3 bg-white text-black placeholder-gray-400"
            style={{
              borderRadius: '12px',
              border: '1.5px solid #E5E5E5',
              fontFamily: "var(--font-inter), 'Inter', sans-serif",
              fontSize: '14px',
              fontWeight: 400,
              outline: 'none',
            }}
          />
        </div>

        {/* 태그 선택 */}
        <div className="mb-6">
          <label
            className="block text-black mb-2"
            style={{
              fontFamily: "var(--font-inter), 'Inter', sans-serif",
              fontSize: '13px',
              fontWeight: 600,
            }}
          >
            {t('looks.tags')}
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {COMMON_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => handleToggleTag(tag)}
                className={`px-3 py-1.5 transition-all ${
                  selectedTags.includes(tag) ? 'text-white' : 'text-black bg-gray-100'
                }`}
                style={{
                  borderRadius: '999px',
                  backgroundColor: selectedTags.includes(tag) ? '#000' : undefined,
                  fontFamily: "var(--font-inter), 'Inter', sans-serif",
                  fontSize: '12px',
                  fontWeight: 500,
                }}
              >
                #{tag}
              </button>
            ))}
          </div>

          {/* 커스텀 태그 입력 */}
          <div className="flex gap-2">
            <input
              type="text"
              value={customTag}
              onChange={(e) => setCustomTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddCustomTag();
                }
              }}
              placeholder={t('closet.enterTagPlaceholder')}
              className="flex-1 px-4 py-2 bg-white text-black placeholder-gray-400"
              style={{
                borderRadius: '12px',
                border: '1.5px solid #E5E5E5',
                fontFamily: "var(--font-inter), 'Inter', sans-serif",
                fontSize: '13px',
                fontWeight: 400,
                outline: 'none',
              }}
            />
            <button
              onClick={handleAddCustomTag}
              className="px-4 py-2 text-white"
              style={{
                borderRadius: '12px',
                backgroundColor: '#000',
                fontFamily: "var(--font-inter), 'Inter', sans-serif",
                fontSize: '13px',
                fontWeight: 600,
              }}
            >
              {t('common.add')}
            </button>
          </div>

          {/* 선택된 태그 표시 */}
          {selectedTags.length > 0 && (
            <div className="mt-3 p-3 bg-gray-50" style={{ borderRadius: '12px' }}>
              <p
                className="text-[#666] mb-2"
                style={{
                  fontFamily: "var(--font-inter), 'Inter', sans-serif",
                  fontSize: '11px',
                  fontWeight: 500,
                }}
              >
                {t('looks.selectedTags')}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {selectedTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-white inline-flex items-center gap-1"
                    style={{
                      borderRadius: '999px',
                      backgroundColor: '#000',
                      fontFamily: "var(--font-inter), 'Inter', sans-serif",
                      fontSize: '11px',
                      fontWeight: 500,
                    }}
                  >
                    #{tag}
                    <button onClick={() => handleRemoveTag(tag)} className="hover:opacity-70">
                      <X size={12} strokeWidth={2} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 선택된 아이템 표시 */}
        {selectedItems.length > 0 && (
          <div className="mb-6">
            <label
              className="block text-black mb-2"
              style={{
                fontFamily: "var(--font-inter), 'Inter', sans-serif",
                fontSize: '13px',
                fontWeight: 600,
              }}
            >
              {t('looks.selectedItemsCount', { count: selectedItems.length })}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {selectedItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 p-2 bg-gray-50"
                  style={{ borderRadius: '10px' }}
                >
                  <div
                    className="w-10 h-10 bg-gray-200 shrink-0 overflow-hidden"
                    style={{ borderRadius: '6px' }}
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
                            fontFamily: "var(--font-inter), 'Inter', sans-serif",
                            fontSize: '8px',
                            fontWeight: 500,
                          }}
                        >
                          {item.category}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-black truncate"
                      style={{
                        fontFamily: "var(--font-inter), 'Inter', sans-serif",
                        fontSize: '12px',
                        fontWeight: 600,
                      }}
                    >
                      {item.name}
                    </p>
                    <p
                      className="text-[#666] truncate"
                      style={{
                        fontFamily: "var(--font-inter), 'Inter', sans-serif",
                        fontSize: '10px',
                        fontWeight: 400,
                      }}
                    >
                      {item.category}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="p-0.5 hover:bg-gray-200 transition-colors shrink-0"
                    style={{ borderRadius: '4px' }}
                  >
                    <X size={14} color="#666" strokeWidth={1.5} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 카테고리별 아이템 선택 */}
        <div className="mb-4">
          <label
            className="block text-black mb-2"
            style={{
              fontFamily: "var(--font-inter), 'Inter', sans-serif",
              fontSize: '13px',
              fontWeight: 600,
            }}
          >
            {t('looks.selectItems')}
          </label>

          {/* 카테고리 탭 */}
          <div className="flex gap-2 mb-3 overflow-x-auto scrollbar-hide pb-2">
            <button
              onClick={() => setActiveCategory('전체')}
              className={`px-4 py-2 shrink-0 transition-all ${
                activeCategory === '전체' ? 'text-white' : 'text-black bg-gray-100'
              }`}
              style={{
                borderRadius: '999px',
                backgroundColor: activeCategory === '전체' ? '#000' : undefined,
                fontFamily: "var(--font-inter), 'Inter', sans-serif",
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              전체
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 shrink-0 transition-all ${
                  activeCategory === cat ? 'text-white' : 'text-black bg-gray-100'
                }`}
                style={{
                  borderRadius: '999px',
                  backgroundColor: activeCategory === cat ? '#000' : undefined,
                  fontFamily: "var(--font-inter), 'Inter', sans-serif",
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* 아이템 그리드 */}
          <div className="grid grid-cols-3 gap-3">
            {filteredItems.map((item) => {
              const isSelected = selectedItems.find((i) => i.id === item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => handleToggleItem(item)}
                  className={`relative aspect-square overflow-hidden transition-all ${
                    isSelected ? 'ring-[3px] ring-black' : ''
                  }`}
                  style={{
                    borderRadius: '12px',
                    border: isSelected ? 'none' : '1.5px solid #E5E5E5',
                  }}
                >
                  <div
                    className={`w-full h-full bg-gray-100 transition-opacity ${
                      isSelected ? 'opacity-75' : ''
                    }`}
                  >
                    {item.imageUrl ? (
                      <ImageWithFallback
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-2">
                        <p
                          className="text-[#000] mb-1"
                          style={{
                            fontFamily: "var(--font-inter), 'Inter', sans-serif",
                            fontSize: '10px',
                            fontWeight: 600,
                          }}
                        >
                          {item.category}
                        </p>
                        <p
                          className="text-[#666] text-center"
                          style={{
                            fontFamily: "var(--font-inter), 'Inter', sans-serif",
                            fontSize: '9px',
                            fontWeight: 400,
                            lineHeight: '1.2',
                          }}
                        >
                          {item.name}
                        </p>
                      </div>
                    )}
                  </div>
                  {isSelected && (
                    <div
                      className="absolute top-2 right-2 w-6 h-6 bg-black flex items-center justify-center shadow-lg"
                      style={{ borderRadius: '50%' }}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M11.6667 3.5L5.25 9.91667L2.33334 7"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {filteredItems.length === 0 && (
            <div className="py-12 text-center">
              <p
                className="text-[#999]"
                style={{
                  fontFamily: "var(--font-inter), 'Inter', sans-serif",
                  fontSize: '13px',
                  fontWeight: 400,
                }}
              >
                {activeCategory}에 해당하는 아이템이 없습니다
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="shrink-0 px-6 pb-6 pt-3 flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 px-5 py-3 hover:bg-gray-50 transition-colors"
          style={{
            borderRadius: '12px',
            border: '1.5px solid #E5E5E5',
            fontFamily: "var(--font-inter), 'Inter', sans-serif",
            fontSize: '14px',
            fontWeight: 600,
            color: '#000',
          }}
        >
          {t('common.cancel')}
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving || !isFormValid}
          className="flex-1 px-5 py-3 text-white hover:opacity-90 transition-opacity disabled:opacity-60 inline-flex items-center justify-center gap-2"
          style={{
            borderRadius: '12px',
            backgroundColor: '#000',
            fontFamily: "var(--font-inter), 'Inter', sans-serif",
            fontSize: '14px',
            fontWeight: 600,
          }}
        >
          {isSaving ? (
            <>
              <Spinner size="sm" className="text-white" />
              {mode === 'add' ? t('looks.createLook') : t('looks.saveLook')}
            </>
          ) : mode === 'add' ? (
            t('looks.createLook')
          ) : (
            t('looks.saveLook')
          )}
        </button>
      </div>
    </div>
  );
}
