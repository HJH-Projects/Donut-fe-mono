'use client';
import { Toast } from '@base-ui/react/toast';
import { getApiErrorMessage, type ApiError } from '@/shared/api/error';

export function useToast() {
  const manager = Toast.useToastManager();
  return {
    success:  (message: string) => manager.add({ title: message, type: 'success' }),
    error:    (message: string) => manager.add({ title: message, type: 'error' }),
    info:     (message: string) => manager.add({ title: message, type: 'info' }),
    apiError: (error: ApiError, fallback?: string) =>
      manager.add({ title: getApiErrorMessage(error, fallback), type: 'error' }),
  };
}
