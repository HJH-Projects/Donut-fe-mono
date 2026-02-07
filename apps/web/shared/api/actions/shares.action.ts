'use server';

import { updateTag } from 'next/cache';
import { serverKy } from '../server';
import { CACHE_TAGS } from '../cache-tags';
import type { ShareLink } from '../shares.types';

export async function createShareLinkAction(lookId: string, expiresAt?: string) {
  const result = await serverKy.post('shares', {
    json: { lookId, ...(expiresAt && { expiresAt }) },
  }).json<ShareLink>();
  updateTag(CACHE_TAGS.SHARES);
  return result;
}

export async function updateShareLinkAction(shareId: string, payload: {
  isActive?: boolean;
  expiresAt?: string;
}) {
  const result = await serverKy.patch(`shares/${shareId}`, { json: payload }).json<{
    id: string;
    isActive: boolean;
    expiresAt: string | null;
  }>();
  updateTag(CACHE_TAGS.SHARES);
  return result;
}

export async function deleteShareLinkAction(shareId: string) {
  const result = await serverKy.delete(`shares/${shareId}`).json<{ id: string; deleted: boolean }>();
  updateTag(CACHE_TAGS.SHARES);
  return result;
}
