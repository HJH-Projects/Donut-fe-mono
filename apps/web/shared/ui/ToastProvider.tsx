'use client';
import { useEffect } from 'react';
import { Toast } from '@base-ui/react/toast';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { pendingInstantCloseIds } from '@/shared/model/useToast';

type ToastType = 'success' | 'error' | 'info';

const FONT = "var(--font-inter), 'Inter', sans-serif";

const CONFIG: Record<ToastType, { Icon: typeof CheckCircle2 }> = {
  success: { Icon: CheckCircle2 },
  error:   { Icon: AlertCircle },
  info:    { Icon: Info },
};

function ToastList() {
  const { toasts } = Toast.useToastManager();

  useEffect(() => {
    const currentIds = new Set(toasts.map((t) => t.id));
    for (const id of pendingInstantCloseIds) {
      if (!currentIds.has(id)) pendingInstantCloseIds.delete(id);
    }
  }, [toasts]);

  return toasts.map((toast) => {
    const type = (toast.type as ToastType) ?? 'info';
    const { Icon } = CONFIG[type];
    const isInstant = pendingInstantCloseIds.has(toast.id);
    return (
      <Toast.Root
        key={toast.id}
        toast={toast}
        swipeDirection="up"
        className={isInstant ? 'ootd-toast ootd-toast--instant' : 'ootd-toast'}
      >
        <Toast.Content className="ootd-toast-content">
          <span style={{ display: 'flex', flexShrink: 0 }}>
            <Icon size={17} color="rgba(255,255,255,0.7)" strokeWidth={2} />
          </span>
          <Toast.Title
            style={{
              flex: 1,
              color: '#ffffff',
              fontSize: '15px',
              fontWeight: 500,
              lineHeight: '1.4',
              letterSpacing: '-0.01em',
              fontFamily: FONT,
            }}
          />
        </Toast.Content>
        <Toast.Close className="ootd-toast-close">
          <X size={14} color="rgba(255,255,255,0.45)" strokeWidth={2.5} />
        </Toast.Close>
      </Toast.Root>
    );
  });
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <Toast.Provider limit={1} timeout={4000}>
      {children}
      <Toast.Portal>
        <Toast.Viewport className="ootd-toast-viewport">
          <ToastList />
        </Toast.Viewport>
      </Toast.Portal>
    </Toast.Provider>
  );
}
