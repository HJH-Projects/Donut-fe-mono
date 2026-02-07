'use server';

import { updateTag } from 'next/cache';
import { serverKy } from '../server';
import { CACHE_TAGS } from '../cache-tags';
import type { CommentItem } from '../comments.types';

export async function createCommentAction(sharePath: string, payload: {
  content: string;
  parentCommentId?: string;
}) {
  const result = await serverKy.post(`shares/${sharePath}/comments`, { json: payload }).json<CommentItem>();
  updateTag(CACHE_TAGS.COMMENTS);
  return result;
}

export async function deleteCommentAction(sharePath: string, commentId: string) {
  const result = await serverKy.delete(`shares/${sharePath}/comments/${commentId}`).json<{ id: string; deletedAt: string }>();
  updateTag(CACHE_TAGS.COMMENTS);
  return result;
}
