'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { UserProfileResponseDto } from '@/shared/model/orvalSchemas';
import {
  getUsersMeApi,
  patchUsersProfileApi,
  postUsersResetNicknameApi,
} from '@/shared/api/endpointTags/users';
import { clientKy } from '@/features/api/clientKy';
import { toApiError, type ApiError } from '@/shared/api/error';
import { invalidateProfile } from '@/shared/api/invalidations/profile';
import { useToast } from '@/shared/model/useToast';

interface UseProfileOptions {
  initialProfile?: UserProfileResponseDto | null;
}

export function useProfile({ initialProfile = null }: UseProfileOptions = {}) {
  const router = useRouter();
  const toast = useToast();

  const [profile, setProfile] = useState<UserProfileResponseDto | null>(initialProfile);
  const [nickname, setNickname] = useState(initialProfile?.nickname || '파씨옹');
  const [isBootstrapped, setIsBootstrapped] = useState(!!initialProfile);
  const [isResettingNickname, setIsResettingNickname] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const stats = profile
    ? { closetCount: profile.clothesCount, lookCount: profile.looksCount }
    : null;

  useEffect(() => {
    if (isBootstrapped) return;

    getUsersMeApi(clientKy)
      .then((me) => {
        setProfile(me);
        setNickname(me.nickname);
      })
      .catch(async (e) => {
        const apiError = await toApiError(e);
        setError(apiError);
      })
      .finally(() => setIsBootstrapped(true));
  }, [isBootstrapped]);

  const updateNickname = async (newNickname: string) => {
    const previous = nickname;
    setNickname(newNickname);

    try {
      await patchUsersProfileApi(clientKy, { nickname: newNickname });
      await invalidateProfile();
      router.refresh();
    } catch (e) {
      setNickname(previous);
      toast.apiError(await toApiError(e), '닉네임을 변경하는 데 실패했습니다.');
      throw e;
    }
  };

  const resetNickname = async () => {
    setIsResettingNickname(true);
    try {
      const resetResult = await postUsersResetNicknameApi(clientKy);
      setNickname(resetResult.nickname);
      setProfile((prev) => (prev ? { ...prev, nickname: resetResult.nickname } : prev));
      await invalidateProfile();
      router.refresh();
    } catch (e) {
      toast.apiError(await toApiError(e), '닉네임을 초기화하는 데 실패했습니다.');
      throw e;
    } finally {
      setIsResettingNickname(false);
    }
  };

  return {
    profile,
    stats,
    nickname,
    isBootstrapped,
    isResettingNickname,
    error,
    updateNickname,
    resetNickname,
  };
}
