'use client';

import {
  closeGlobalDialog,
  openGlobalDialog,
  useGlobalDialogOpen,
} from '@/shared/model/globalDialogStore';
import type { Language } from '../model/useMyContentData';
import { MyDialogShell } from './MyDialogShell';

type MyLanguageDialogProps = {
  title: string;
  sectionLabel: string;
  koreanLabel: string;
  englishLabel: string;
  confirmLabel: string;
  language: Language;
  onChangeLanguage: (language: Language) => void;
};

export function MyLanguageDialog({
  title,
  sectionLabel,
  koreanLabel,
  englishLabel,
  confirmLabel,
  language,
  onChangeLanguage,
}: MyLanguageDialogProps) {
  const open = useGlobalDialogOpen('my:language');

  return (
    <MyDialogShell
      open={open}
      onOpenChange={(next) =>
        next ? openGlobalDialog('my:language') : closeGlobalDialog('my:language')
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
            onClick={() => onChangeLanguage('ko')}
            className="flex-1 py-4 transition-all"
            style={{
              backgroundColor: language === 'ko' ? '#000' : '#FFFFFF',
              color: language === 'ko' ? '#FFFFFF' : '#000',
              borderRadius: 'var(--radius-pill)',
              border: language === 'ko' ? 'none' : '1.5px solid #E5E5E5',
              fontFamily: "var(--font-inter), 'Inter', sans-serif",
              fontSize: '15px',
              fontWeight: 700,
            }}
          >
            {koreanLabel}
          </button>
          <button
            onClick={() => onChangeLanguage('en')}
            className="flex-1 py-4 transition-all"
            style={{
              backgroundColor: language === 'en' ? '#000' : '#FFFFFF',
              color: language === 'en' ? '#FFFFFF' : '#000',
              borderRadius: 'var(--radius-pill)',
              border: language === 'en' ? 'none' : '1.5px solid #E5E5E5',
              fontFamily: "var(--font-inter), 'Inter', sans-serif",
              fontSize: '15px',
              fontWeight: 700,
            }}
          >
            {englishLabel}
          </button>
        </div>
      </div>

      <button
        onClick={() => closeGlobalDialog('my:language')}
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
