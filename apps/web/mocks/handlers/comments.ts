import { http, HttpResponse } from 'msw';
import { mockComments } from '../data/comments';
import type { CommentItem } from '../types';

const comments: CommentItem[] = [...mockComments];
let nextId = 100;

export const commentHandlers = [
  http.get('*/shares/:path/comments', () => {
    return HttpResponse.json(comments);
  }),

  http.post('*/shares/:path/comments', async ({ request }) => {
    const body = (await request.json()) as { content: string; parentCommentId?: string };
    const newComment: CommentItem = {
      id: String(nextId++),
      content: body.content,
      parentCommentId: body.parentCommentId || null,
      createdAt: new Date().toISOString(),
      user: { id: 'current-user-id', nickname: '나', profileImg: null },
    };
    comments.push(newComment);
    return HttpResponse.json(newComment, { status: 201 });
  }),

  http.delete('*/shares/:path/comments/:commentId', ({ params }) => {
    const { commentId } = params;
    const index = comments.findIndex((c) => c.id === commentId);
    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    comments.splice(index, 1);
    return HttpResponse.json({ id: commentId, deletedAt: new Date().toISOString() });
  }),
];
