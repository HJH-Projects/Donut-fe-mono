'use server';
import { cookies } from 'next/headers';

const ACCESS_TOKEN_COOKIE = 'accessToken';

const decodeBase64Url = (value: string): string => {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  return atob(base64 + padding);
};

export const getAccessTokenUserId = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  if (!token) return null;

  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    return JSON.parse(decodeBase64Url(payload)).sub ?? null;
  } catch {
    return null;
  }
};
