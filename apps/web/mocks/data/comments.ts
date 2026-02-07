import type { CommentItem } from '@/shared/api/comments.types';

export const mockComments: CommentItem[] = [
  {
    id: '1',
    content: '정말 멋진 룩이네요! 참고할게요 :)',
    parentCommentId: null,
    createdAt: '2025-02-01T10:30:00Z',
    user: { id: 'user1', nickname: '패션왕', profileImg: null },
  },
  {
    id: '2',
    content: '색 조합이 훌륭합니다!',
    parentCommentId: null,
    createdAt: '2025-02-02T14:20:00Z',
    user: { id: 'user2', nickname: '스타일리스트', profileImg: null },
  },
];
