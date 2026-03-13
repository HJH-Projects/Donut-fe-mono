'use client';

import { useState, useEffect } from 'react';
import type { CommentResponseDto, ShareLinkDetailResponseDto } from '@/shared/model/orvalSchemas';
import {
  postShareCommentsApi,
  getShareCommentsApi,
  deleteShareCommentApi,
  postShareCommentLikeToggleApi,
} from '@/shared/api/endpointTags/comments';
import { getSharesDetailApi } from '@/shared/api/endpointTags/shares';
import { clientKy } from '@/features/api/clientKy';
import { toApiError, type ApiError } from '@/shared/api/error';

type LookItem = {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
};

type Look = {
  id: string;
  name: string;
  tags: string[];
  items: LookItem[];
  user: { id: string; nickname: string; profileImg: string | null } | null;
};

export type Comment = {
  id: string;
  userId: string;
  author: string;
  content: string;
  createdAt: Date;
  likeCount: number;
  isLiked: boolean;
};

function mapShareDetailToLocal(detail: ShareLinkDetailResponseDto): Look {
  return {
    id: detail.look.id,
    name: detail.look.name,
    tags: [],
    items: (detail.look.items || []).map((item) => ({
      id: item.clothes?.id ?? item.clothesId ?? item.id,
      name: item.clothes?.title ?? '',
      category: item.clothes?.category ?? item.role ?? '',
      imageUrl: item.images?.cardWebpUrl ?? item.images?.cardJpegUrl ?? '',
    })),
    user: detail.look.user ?? null,
  };
}

function mapApiCommentToLocal(c: CommentResponseDto): Comment {
  return {
    id: c.id,
    userId: c.user?.id ?? '',
    author: c.user?.nickname ?? '익명',
    content: c.content,
    createdAt: new Date(c.createdAt || Date.now()),
    likeCount: c.likeCount ?? 0,
    isLiked: c.isLiked ?? false,
  };
}

interface UseShareDetailOptions {
  sharePath: string;
  initialShareDetail?: ShareLinkDetailResponseDto | null;
  initialComments?: CommentResponseDto[];
}

export function useShareDetail({
  sharePath,
  initialShareDetail = null,
  initialComments = [],
}: UseShareDetailOptions) {
  const [look, setLook] = useState<Look | null>(
    initialShareDetail ? mapShareDetailToLocal(initialShareDetail) : null,
  );
  const [comments, setComments] = useState<Comment[]>(() =>
    initialComments.map(mapApiCommentToLocal),
  );
  const [isBootstrapped, setIsBootstrapped] = useState(
    !!initialShareDetail || initialComments.length > 0,
  );
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    if (isBootstrapped) return;

    Promise.all([
      getSharesDetailApi(clientKy, sharePath).catch(() => null),
      getShareCommentsApi(clientKy, sharePath).catch(() => []),
    ])
      .then(([detail, nextComments]) => {
        if (detail) setLook(mapShareDetailToLocal(detail));
        setComments(nextComments.map(mapApiCommentToLocal));
      })
      .catch(async (e) => {
        const apiError = await toApiError(e);
        setError(apiError);
      })
      .finally(() => setIsBootstrapped(true));
  }, [isBootstrapped, sharePath]);

  const addComment = async (content: string) => {
    const comment: Comment = {
      id: Date.now().toString(),
      userId: 'current-user-id',
      author: '나',
      content,
      createdAt: new Date(),
      likeCount: 0,
      isLiked: false,
    };
    setComments((prev) => [...prev, comment]);

    try {
      await postShareCommentsApi(clientKy, sharePath, { content });
    } catch {
      /* 오프라인 시 로컬 상태만 업데이트 */
    }
  };

  const deleteComment = async (commentId: string) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId));

    try {
      await deleteShareCommentApi(clientKy, sharePath, commentId);
    } catch {
      /* 오프라인 시 로컬 상태만 업데이트 */
    }
  };

  const toggleCommentLike = async (commentId: string) => {
    const current = comments.find((c) => c.id === commentId);
    if (!current) return;

    const optimisticLiked = !current.isLiked;
    const optimisticCount = Math.max(0, current.likeCount + (optimisticLiked ? 1 : -1));

    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId ? { ...c, isLiked: optimisticLiked, likeCount: optimisticCount } : c,
      ),
    );

    try {
      const result = await postShareCommentLikeToggleApi(clientKy, sharePath, commentId);
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId
            ? { ...c, isLiked: result.isLiked, likeCount: result.likeCount }
            : c,
        ),
      );
    } catch {
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId
            ? { ...c, isLiked: current.isLiked, likeCount: current.likeCount }
            : c,
        ),
      );
    }
  };

  return {
    look,
    comments,
    isBootstrapped,
    error,
    addComment,
    deleteComment,
    toggleCommentLike,
  };
}
