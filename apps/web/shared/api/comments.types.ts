export type CommentUser = {
  id: string;
  nickname: string;
  profileImg: string | null;
};

export type CommentItem = {
  id: string;
  content: string;
  parentCommentId: string | null;
  createdAt: string;
  user: CommentUser;
  replies?: CommentItem[];
};
