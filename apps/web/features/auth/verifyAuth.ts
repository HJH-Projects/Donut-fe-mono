import { jwtVerify } from 'jose';

export type AuthStatus = 'authenticated' | 'refresh_needed' | 'unauthenticated';

const getSecret = () => {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) throw new Error('JWT_ACCESS_SECRET is not set');
  return new TextEncoder().encode(secret);
};

export async function verifyAuth(
  accessToken?: string,
  refreshToken?: string,
): Promise<AuthStatus> {
  if (accessToken) {
    try {
      await jwtVerify(accessToken, getSecret());
      return 'authenticated';
    } catch {
      // JWT 만료 또는 유효하지 않음 → refresh 필요 여부 확인
    }
  }

  if (refreshToken) {
    return 'refresh_needed';
  }

  return 'unauthenticated';
}
