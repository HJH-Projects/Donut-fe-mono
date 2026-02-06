'use client';

import { useEffect, useRef, useState } from 'react';
import ky from 'ky';
import { useRouter } from 'next/navigation';
import { createPresignedUrl, completeUpload } from '@/shared/api/uploads';
import { createClothesClient } from '@/shared/api/clothes.client';

export const FloatingAddButton = () => {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'TOP' | 'BOTTOM' | 'OUTER' | 'SHOES' | 'ACCESSORY'>('TOP');
  const [color, setColor] = useState('#FFFFFF');
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const openFile = () => fileInputRef.current?.click();
  const openCamera = () => cameraInputRef.current?.click();

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleSelectFile = (selected: File | null) => {
    if (!selected) return;
    setFile(selected);
    setTitle(selected.name.replace(/\.[^/.]+$/, ''));
    setOpen(false);
  };

  const resetModal = () => {
    setFile(null);
    setPreviewUrl(null);
    setTitle('');
    setCategory('TOP');
    setColor('#FFFFFF');
    setSaving(false);
  };

  const handleSave = async () => {
    if (!file) return;
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
        title: title || '새 옷',
        category,
        color,
        imageUrl: completed.publicUrl,
      });
      resetModal();
      router.refresh();
    } catch (error) {
      console.error(error);
      alert('업로드에 실패했습니다.');
      setSaving(false);
    }
  };

  return (
    <>
      <div className="fixed inset-x-0 bottom-24 z-40">
        <div className="mx-auto flex w-full max-w-[600px] justify-end px-6">
          <div className="flex flex-col items-end gap-3">
            {open && (
              <div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-lg">
                <button
                  onClick={openFile}
                  className="block w-full rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  파일에서 선택
                </button>
                <button
                  onClick={openCamera}
                  className="mt-2 block w-full rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  카메라로 촬영
                </button>
              </div>
            )}

            <button
              onClick={() => setOpen((prev) => !prev)}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white shadow-lg"
            >
              +
            </button>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => handleSelectFile(event.target.files?.[0] ?? null)}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(event) => handleSelectFile(event.target.files?.[0] ?? null)}
        />
      </div>
      {file && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
          <div className="w-full max-w-md rounded-2xl bg-white p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900">옷 등록</h2>
              <button onClick={resetModal} className="text-sm text-gray-500">
                닫기
              </button>
            </div>
            <div className="mt-4 h-56 w-full overflow-hidden rounded-xl bg-gray-100">
              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={previewUrl} alt="미리보기" className="h-full w-full object-contain" />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-gray-400">
                  미리보기 준비 중
                </div>
              )}
            </div>
            <div className="mt-4 space-y-3 text-sm text-gray-700">
              <div>
                <label className="block text-xs text-gray-500">이름</label>
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="mt-1 h-10 w-full rounded-lg border border-gray-200 px-3"
                  placeholder="옷 이름"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500">카테고리</label>
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value as typeof category)}
                  className="mt-1 h-10 w-full rounded-lg border border-gray-200 px-3"
                >
                  <option value="TOP">상의</option>
                  <option value="BOTTOM">하의</option>
                  <option value="OUTER">아우터</option>
                  <option value="SHOES">신발</option>
                  <option value="ACCESSORY">액세서리</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500">색상</label>
                <input
                  value={color}
                  onChange={(event) => setColor(event.target.value)}
                  className="mt-1 h-10 w-full rounded-lg border border-gray-200 px-3"
                  placeholder="#FFFFFF"
                />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={resetModal}
                className="flex-1 rounded-xl border border-gray-200 py-2 text-sm text-gray-600"
                disabled={saving}
              >
                취소
              </button>
              <button
                onClick={handleSave}
                className="flex-1 rounded-xl bg-black py-2 text-sm text-white"
                disabled={saving}
              >
                {saving ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
