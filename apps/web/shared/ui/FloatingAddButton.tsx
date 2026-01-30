'use client';

import { useRef, useState } from 'react';

export const FloatingAddButton = () => {
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const openFile = () => fileInputRef.current?.click();
  const openCamera = () => cameraInputRef.current?.click();

  return (
    <div className="fixed bottom-24 right-6 flex flex-col items-end gap-3">
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

      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
      />
    </div>
  );
};
