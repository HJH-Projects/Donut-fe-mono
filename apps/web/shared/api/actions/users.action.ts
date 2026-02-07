'use server';

import { updateTag } from 'next/cache';
import { serverKy } from '../server';
import { CACHE_TAGS } from '../cache-tags';
import type { UserProfile, UserSettings } from '../users.types';

export async function updateProfileAction(payload: {
  nickname?: string;
  profileImg?: string;
}) {
  const result = await serverKy.patch('users/profile', { json: payload }).json<UserProfile>();
  updateTag(CACHE_TAGS.USER);
  return result;
}

export async function resetUserAction() {
  await serverKy.post('users/reset');
  updateTag(CACHE_TAGS.USER);
  updateTag(CACHE_TAGS.USER_STATS);
  updateTag(CACHE_TAGS.CLOTHES);
  updateTag(CACHE_TAGS.LOOKS);
}

export async function updateUserSettingsAction(settings: Partial<UserSettings>) {
  const result = await serverKy.patch('users/settings', { json: settings }).json<UserSettings>();
  updateTag(CACHE_TAGS.USER);
  return result;
}
