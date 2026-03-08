'use server';

import { cookies } from 'next/headers';
import { verifyAuth } from './verifyAuth';

export type { AuthStatus } from './verifyAuth';

export async function authGuard() {
  const cookieStore = await cookies();
  return verifyAuth(cookieStore.get('accessToken')?.value, cookieStore.get('refreshToken')?.value);
}
