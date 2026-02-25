'use client';

import { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from './config';

const LANGUAGE_KEY = 'language';

function detectLanguage(): 'ko' | 'en' {
  const browserLang = navigator.language.toLowerCase();
  return browserLang.startsWith('ko') ? 'ko' : 'en';
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const savedLanguage = localStorage.getItem(LANGUAGE_KEY);
    if (savedLanguage === 'ko' || savedLanguage === 'en') {
      if (i18n.language !== savedLanguage) {
        i18n.changeLanguage(savedLanguage);
      }
      return;
    }

    const detected = detectLanguage();
    localStorage.setItem(LANGUAGE_KEY, detected);
    if (i18n.language !== detected) {
      i18n.changeLanguage(detected);
    }
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
