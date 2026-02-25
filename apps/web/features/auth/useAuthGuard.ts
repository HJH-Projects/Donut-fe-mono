'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { authGuard } from './authGuard';

export function useAuthGuard() {
  const router = useRouter();

  return useCallback(async (): Promise<boolean> => {
    try {
      const status = await authGuard();
      if (status === 'unauthenticated') {
        router.push('/login');
        return false;
      }
      if (status === 'refresh_needed') {
        const res = await fetch('/api/auth/refresh', {
          method: 'POST',
          credentials: 'include',
        });
        if (!res.ok) {
          router.push('/login');
          return false;
        }
      }
      return true;
    } catch {
      router.push('/login');
      return false;
    }
  }, [router]);
}
