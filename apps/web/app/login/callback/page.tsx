import { Suspense } from 'react';
import { LoginCallbackPage } from '@/page/login/ui/callback/LoginCallbackPage';

export default function Page() {
  return (
    <Suspense>
      <LoginCallbackPage />
    </Suspense>
  );
}
