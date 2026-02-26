'use client';
import { Toast } from '@base-ui/react/toast';
import { getApiErrorMessage, type ApiError } from '@/shared/api/error';

const TIMEOUT = 4000;

// IDs of toasts being replaced (should exit without animation)
export const pendingInstantCloseIds = new Set<string>();

export function useToast() {
  const manager = Toast.useToastManager();

  const add = (options: { title: string; type: 'success' | 'error' | 'info' }) => {
    manager.toasts.forEach(t => {
      pendingInstantCloseIds.add(t.id);
      manager.close(t.id);
    });
    manager.add({ ...options, timeout: TIMEOUT });
  };

  return {
    success:  (message: string) => add({ title: message, type: 'success' }),
    error:    (message: string) => add({ title: message, type: 'error' }),
    info:     (message: string) => add({ title: message, type: 'info' }),
    apiError: (error: ApiError, fallback?: string) =>
      add({ title: getApiErrorMessage(error, fallback), type: 'error' }),
  };
}
