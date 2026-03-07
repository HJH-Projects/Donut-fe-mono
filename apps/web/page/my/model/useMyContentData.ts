'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { setGenderAction } from '@/shared/api/actions/setGender';
import type { Gender } from '@/shared/model/gender';
import {
  closeGlobalDialog,
  openGlobalDialog,
  useGlobalDialogOpen,
} from '@/shared/model/globalDialogStore';
import type { UserProfileResponseDto } from '@/shared/model/orvalSchemas';
import { useToast } from '@/shared/model/useToast';
import { useProfile } from './useProfile';

export type TemperatureUnit = 'celsius' | 'fahrenheit';
export type Language = 'ko' | 'en';

const TEMPERATURE_UNIT_KEY = 'temperatureUnit';
const LANGUAGE_KEY = 'language';

function normalizeLanguage(value: string): Language {
  return value.toLowerCase().startsWith('ko') ? 'ko' : 'en';
}

type UseMyContentDataOptions = {
  initialProfile?: UserProfileResponseDto | null;
  initialGender?: Gender;
};

export function useMyContentData({
  initialProfile = null,
  initialGender = 'MALE',
}: UseMyContentDataOptions) {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const toast = useToast();

  const showSettingsDialog = useGlobalDialogOpen('my:settings');
  const showLanguageDialog = useGlobalDialogOpen('my:language');
  const showGenderDialog = useGlobalDialogOpen('my:gender');
  const showNicknameDialog = useGlobalDialogOpen('my:nickname');

  const [temperatureUnit, setTemperatureUnit] = useState<TemperatureUnit>('celsius');
  const [language, setLanguage] = useState<Language>(normalizeLanguage(i18n.language));
  const [gender, setGender] = useState<Gender>(initialGender);
  const [tempNickname, setTempNickname] = useState('');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isSavingNickname, setIsSavingNickname] = useState(false);

  const { profile, stats, nickname, isResettingNickname, updateNickname, resetNickname } =
    useProfile({
      initialProfile,
    });

  const userProfile = useMemo(
    () => ({
      nickname,
      email: profile?.email ?? '',
      closetCount: stats?.closetCount ?? 0,
      looksCount: stats?.lookCount ?? 0,
    }),
    [nickname, profile?.email, stats?.closetCount, stats?.lookCount],
  );

  const handleOpenNicknameDialog = useCallback(() => {
    setTempNickname(nickname);
    openGlobalDialog('my:nickname');
  }, [nickname]);

  const handleSaveNickname = useCallback(async () => {
    if (!tempNickname.trim()) {
      toast.info(t('profile.enterNickname'));
      return;
    }

    setIsSavingNickname(true);
    try {
      await updateNickname(tempNickname.trim());
      closeGlobalDialog('my:nickname');
    } catch {
      // useProfile에서 이미 toast 처리
    } finally {
      setIsSavingNickname(false);
    }
  }, [t, tempNickname, toast, updateNickname]);

  const handleResetNickname = useCallback(async () => {
    try {
      await resetNickname();
      closeGlobalDialog('my:nickname');
    } catch {
      // useProfile에서 이미 toast 처리
    }
  }, [resetNickname]);

  const handleLogout = useCallback(async () => {
    if (!confirm(t('profile.logoutConfirm'))) return;

    setIsLoggingOut(true);
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      router.push('/');
    } catch {
      toast.error(t('profile.logoutFailed') || '로그아웃에 실패했습니다.');
      setIsLoggingOut(false);
    }
  }, [router, t, toast]);

  const handleLanguageChange = useCallback(
    (newLanguage: Language) => {
      setLanguage(newLanguage);
      localStorage.setItem(LANGUAGE_KEY, newLanguage);
      i18n.changeLanguage(newLanguage);
    },
    [i18n],
  );

  const handleTemperatureUnitChange = useCallback((unit: TemperatureUnit) => {
    setTemperatureUnit(unit);
    localStorage.setItem(TEMPERATURE_UNIT_KEY, unit);
  }, []);

  const handleGenderChange = useCallback(
    async (newGender: Gender) => {
      const previous = gender;
      setGender(newGender);
      try {
        await setGenderAction(newGender);
        router.refresh();
      } catch {
        setGender(previous);
        toast.error('성별 설정에 실패했습니다.');
      }
    },
    [gender, router, toast],
  );

  useEffect(() => {
    const savedUnit = localStorage.getItem(TEMPERATURE_UNIT_KEY);
    if (savedUnit === 'celsius' || savedUnit === 'fahrenheit') {
      setTemperatureUnit(savedUnit);
    }
  }, []);

  useEffect(() => {
    setLanguage(normalizeLanguage(i18n.language));
  }, [i18n.language]);

  return {
    t,
    userProfile,
    temperatureUnit,
    language,
    gender,
    tempNickname,
    isLoggingOut,
    isSavingNickname,
    isResettingNickname,
    showSettingsDialog,
    showLanguageDialog,
    showGenderDialog,
    showNicknameDialog,
    setTempNickname,
    handleOpenNicknameDialog,
    handleSaveNickname,
    handleResetNickname,
    handleLogout,
    handleLanguageChange,
    handleTemperatureUnitChange,
    handleGenderChange,
  };
}
