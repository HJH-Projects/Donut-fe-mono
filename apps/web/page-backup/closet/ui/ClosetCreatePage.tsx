'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ky from 'ky';
import { createPresignedUrl, completeUpload } from '@/shared/api/uploads';
import { createClothesClient } from '@/shared/api/clothes.client';
import { BackButton } from '@/shared/ui/BackButton';

const CATEGORIES = [
  { value: 'TOP', label: '상의' },
  { value: 'BOTTOM', label: '하의' },
  { value: 'OUTER', label: '아우터' },
  { value: 'SHOES', label: '신발' },
  { value: 'ACCESSORY', label: '악세사리' },
] as const;

const COLORS = [
  { value: 'White', label: '화이트', hex: '#FFFFFF' },
  { value: 'Black', label: '블랙', hex: '#000000' },
  { value: 'Gray', label: '그레이', hex: '#808080' },
  { value: 'Navy', label: '네이비', hex: '#000080' },
  { value: 'Blue', label: '블루', hex: '#0000FF' },
  { value: 'Red', label: '레드', hex: '#FF0000' },
  { value: 'Pink', label: '핑크', hex: '#FFC0CB' },
  { value: 'Orange', label: '오렌지', hex: '#FFA500' },
  { value: 'Yellow', label: '옐로우', hex: '#FFFF00' },
  { value: 'Green', label: '그린', hex: '#008000' },
  { value: 'Brown', label: '브라운', hex: '#8B4513' },
  { value: 'Beige', label: '베이지', hex: '#F5F5DC' },
] as const;

export const ClosetCreatePage = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<string>('TOP');
  const [color, setColor] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleSelectFile = (selected: File | null) => {
    if (!selected) return;
    setFile(selected);
    if (!title) {
      setTitle(selected.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleSubmit = async () => {
    setErrorMessage(null);

    if (!file) {
      setErrorMessage('이미지를 선택해주세요.');
      return;
    }
    if (!title.trim()) {
      setErrorMessage('아이템 이름을 입력해주세요.');
      return;
    }
    if (!category) {
      setErrorMessage('카테고리를 선택해주세요.');
      return;
    }
    if (!color) {
      setErrorMessage('색상을 선택해주세요.');
      return;
    }

    try {
      setSaving(true);
      const presign = await createPresignedUrl({
        type: 'clothes',
        contentType: file.type || 'image/jpeg',
        contentLength: file.size,
      });
      await ky.put(presign.uploadUrl, {
        headers: { 'Content-Type': file.type || 'image/jpeg' },
        body: file,
      });
      const completed = await completeUpload({
        filePath: presign.filePath,
        uploadToken: presign.uploadToken,
      });
      await createClothesClient({
        title: title.trim(),
        category: category as 'TOP' | 'BOTTOM' | 'OUTER' | 'SHOES' | 'ACCESSORY',
        color,
        imageUrl: completed.publicUrl,
      });
      router.push('/closet');
      router.refresh();
    } catch (error) {
      console.error(error);
      setErrorMessage('등록에 실패했습니다.');
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <main className="min-h-screen bg-white pb-32">
      <header className="flex items-center justify-between px-6 pt-6 pb-4">
        <BackButton />
        <h1 className="text-base font-semibold text-gray-900">아이템 등록</h1>
        <span className="h-9 w-9" />
      </header>

      <section className="px-6">
        {/* Image Section */}
        <div className="relative w-full aspect-square overflow-hidden rounded-2xl bg-gray-100">
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt="미리보기"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-4">
              <p className="text-sm text-gray-400">이미지를 선택해주세요</p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 rounded-xl bg-gray-200 px-4 py-2 text-sm text-gray-700"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  파일 선택
                </button>
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex items-center gap-2 rounded-xl bg-gray-200 px-4 py-2 text-sm text-gray-700"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  카메라
                </button>
              </div>
            </div>
          )}
          {previewUrl && (
            <button
              type="button"
              onClick={() => {
                setFile(null);
                setPreviewUrl(null);
              }}
              className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleSelectFile(e.target.files?.[0] ?? null)}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => handleSelectFile(e.target.files?.[0] ?? null)}
        />

        {/* Form Fields */}
        <div className="mt-6 space-y-5">
          {/* Title */}
          <div>
            <label className="text-sm font-medium text-gray-700">아이템 이름</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="아이템 이름을 입력하세요"
              className="mt-2 h-12 w-full rounded-xl border border-gray-200 px-4 text-sm"
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-sm font-medium text-gray-700">카테고리</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={`rounded-full px-4 py-2 text-sm transition-colors ${
                    category === cat.value
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="text-sm font-medium text-gray-700">색상</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  className={`flex items-center gap-2 rounded-full px-3 py-2 text-sm transition-colors ${
                    color === c.value
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <span
                    className="h-4 w-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: c.hex }}
                  />
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Action Buttons */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-100 bg-white p-4">
        <div className="mx-auto w-full max-w-[600px]">
          {errorMessage && (
            <div className="mb-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
              {errorMessage}
            </div>
          )}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-medium text-gray-600"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className="flex-1 rounded-xl bg-black py-3 text-sm font-medium text-white disabled:opacity-50"
            >
              {saving ? '등록 중...' : '등록'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};
