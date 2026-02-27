'use server';

import { cookies } from 'next/headers';
import { GENDER_COOKIE, type Gender } from '@/shared/model/gender';

export async function setGenderAction(gender: Gender) {
  const cookieStore = await cookies();
  cookieStore.set(GENDER_COOKIE, gender, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  });
}
