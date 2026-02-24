'use client';

import { useEffect, useState, type ReactNode } from 'react';

export function MSWProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_ENABLE_MSW !== 'true') {
      setReady(true);
      return;
    }

    import('@/mocks/browser').then(({ worker }) => {
      worker.start({ onUnhandledRequest: 'bypass' }).then(() => {
        setReady(true);
      });
    });
  }, []);

  if (!ready) return null;

  return <>{children}</>;
}
