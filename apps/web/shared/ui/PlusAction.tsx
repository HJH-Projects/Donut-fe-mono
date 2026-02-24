'use client';

import { Plus } from 'lucide-react';

export function PlusAction({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-white p-2 hover:opacity-90 transition-opacity"
      style={{
        borderRadius: '12px',
        backgroundColor: '#000',
      }}
    >
      <Plus size={20} color="#fff" strokeWidth={2} />
    </button>
  );
}
