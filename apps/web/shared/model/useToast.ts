'use client';
import { Toast } from '@base-ui/react/toast';

export function useToast() {
  const manager = Toast.useToastManager();
  return {
    success: (message: string) => manager.add({ title: message, type: 'success' }),
    error:   (message: string) => manager.add({ title: message, type: 'error' }),
    info:    (message: string) => manager.add({ title: message, type: 'info' }),
  };
}
