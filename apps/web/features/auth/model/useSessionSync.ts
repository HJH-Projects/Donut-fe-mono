'use client';

import { useEffect } from 'react';
import { getMeClient } from '@/shared/api/users';

export const useSessionSync = (onSuccess?: () => void) => {
  useEffect(() => {
    const sync = async () => {
      await getMeClient();
      onSuccess?.();
    };

    sync();
  }, [onSuccess]);
};
