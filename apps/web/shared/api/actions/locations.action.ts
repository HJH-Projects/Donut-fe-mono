'use server';

import { updateTag } from 'next/cache';
import { serverKy } from '../server';
import { CACHE_TAGS } from '../cache-tags';
import type { LocationItem, CreateLocationPayload } from '../locations.types';

export async function createLocationAction(payload: CreateLocationPayload) {
  const result = await serverKy.post('locations', { json: payload }).json<LocationItem>();
  updateTag(CACHE_TAGS.LOCATIONS);
  return result;
}

export async function updateLocationAction(
  id: string,
  payload: { alias?: string; isDefault?: boolean }
) {
  const result = await serverKy.patch(`locations/${id}`, { json: payload }).json<LocationItem>();
  updateTag(CACHE_TAGS.LOCATIONS);
  return result;
}

export async function deleteLocationAction(id: string) {
  const result = await serverKy.delete(`locations/${id}`).json<{ id: string; deleted: boolean }>();
  updateTag(CACHE_TAGS.LOCATIONS);
  return result;
}
