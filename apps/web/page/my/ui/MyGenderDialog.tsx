'use client';

import type { Gender } from '@/shared/model/gender';
import {
  closeGlobalDialog,
  openGlobalDialog,
  useGlobalDialogOpen,
} from '@/shared/model/globalDialogStore';
import { MyDialogShell } from './MyDialogShell';

type MyGenderDialogProps = {
  title: string;
  sectionLabel: string;
  maleLabel: string;
  femaleLabel: string;
  confirmLabel: string;
  gender: Gender;
  onChangeGender: (gender: Gender) => void;
};

export function MyGenderDialog({
  title,
  sectionLabel,
  maleLabel,
  femaleLabel,
  confirmLabel,
  gender,
  onChangeGender,
}: MyGenderDialogProps) {
  const open = useGlobalDialogOpen('my:gender');

  return (
    <MyDialogShell
      open={open}
      onOpenChange={(next) =>
        next ? openGlobalDialog('my:gender') : closeGlobalDialog('my:gender')
      }
      title={title}
    >
      <div className="mb-8">
        <h3
          className="text-black mb-4"
          style={{
            fontFamily: "var(--font-inter), 'Inter', sans-serif",
            fontSize: '13px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          {sectionLabel}
        </h3>
        <div className="flex gap-3">
          <button
            onClick={() => onChangeGender('MALE')}
            className="flex-1 py-4 transition-all"
            style={{
              backgroundColor: gender === 'MALE' ? '#000' : '#FFFFFF',
              color: gender === 'MALE' ? '#FFFFFF' : '#000',
              borderRadius: 'var(--radius-pill)',
              border: gender === 'MALE' ? 'none' : '1.5px solid #E5E5E5',
              fontFamily: "var(--font-inter), 'Inter', sans-serif",
              fontSize: '15px',
              fontWeight: 700,
            }}
          >
            {maleLabel}
          </button>
          <button
            onClick={() => onChangeGender('FEMALE')}
            className="flex-1 py-4 transition-all"
            style={{
              backgroundColor: gender === 'FEMALE' ? '#000' : '#FFFFFF',
              color: gender === 'FEMALE' ? '#FFFFFF' : '#000',
              borderRadius: 'var(--radius-pill)',
              border: gender === 'FEMALE' ? 'none' : '1.5px solid #E5E5E5',
              fontFamily: "var(--font-inter), 'Inter', sans-serif",
              fontSize: '15px',
              fontWeight: 700,
            }}
          >
            {femaleLabel}
          </button>
        </div>
      </div>

      <button
        onClick={() => closeGlobalDialog('my:gender')}
        className="w-full py-4 text-white transition-all hover:opacity-90"
        style={{
          backgroundColor: '#000',
          borderRadius: 'var(--radius-pill)',
          fontFamily: "var(--font-inter), 'Inter', sans-serif",
          fontSize: '16px',
          fontWeight: 700,
        }}
      >
        {confirmLabel}
      </button>
    </MyDialogShell>
  );
}
