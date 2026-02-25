'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { UserProfileResponseDto } from '@/shared/api/orvalSchema';
import {
  getUsersMeApi,
  patchUsersProfileApi,
  postUsersResetNicknameApi,
} from '@/shared/api/endpointTags/users';
import { getClothesApi } from '@/shared/api/endpointTags/clothes';
import { getLooksApi } from '@/shared/api/endpointTags/looks';
import { clientKy } from '@/features/api/clientKy';
import { toApiError, type ApiError } from '@/shared/api/error';

interface UseProfileOptions {
  initialProfile?: UserProfileResponseDto | null;
  initialStats?: { closetCount: number; lookCount: number } | null;
}

export function useProfile({ initialProfile = null, initialStats = null }: UseProfileOptions = {}) {
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfileResponseDto | null>(initialProfile);
  const [stats, setStats] = useState<{ closetCount: number; lookCount: number } | null>(initialStats);
  const [nickname, setNickname] = useState(initialProfile?.nickname || '패션러버');
  const [isBootstrapped, setIsBootstrapped] = useState(!!(initialProfile && initialStats));
  const [isResettingNickname, setIsResettingNickname] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    if (isBootstrapped) return;

    Promise.all([
      getUsersMeApi(clientKy).catch(() => null),
      getClothesApi(clientKy).catch(() => []),
      getLooksApi(clientKy).catch(() => []),
    ])
      .then(([me, clothes, looks]) => {
        if (me) {
          setProfile(me);
          setNickname(me.nickname);
        }
        setStats({
          closetCount: clothes.length,
          lookCount: looks.length,
        });
      })
      .catch(async (e) => {
        const apiError = await toApiError(e);
        setError(apiError);
      })
      .finally(() => setIsBootstrapped(true));
  }, [isBootstrapped]);

  const updateNickname = async (newNickname: string) => {
    setNickname(newNickname);

    try {
      await patchUsersProfileApi(clientKy, { nickname: newNickname });
      router.refresh();
    } catch {
      /* 오프라인 시 로컬 상태만 업데이트 */
    }
  };

  const resetNickname = async () => {
    setIsResettingNickname(true);
    try {
      const resetResult = await postUsersResetNicknameApi(clientKy);
      setNickname(resetResult.nickname);
      setProfile((prev) => (prev ? { ...prev, nickname: resetResult.nickname } : prev));
      router.refresh();
    } catch {
      /* API 에러 시 무시 */
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
