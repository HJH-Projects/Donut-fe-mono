export type AnnouncementListItem = {
  id: string;
  title: string;
  date: string;
};

export type AnnouncementDetail = {
  id: string;
  title: string;
  content: string;
  date: string;
};

export type FAQItem = {
  id: string;
  question: string;
  answer: string;
};

export type NotificationItem = {
  id: string;
  title: string;
  message: string;
  date: string;
  isRead: boolean;
  detail?: string;
  imageUrl?: string;
};

export type CommentItem = {
  id: string;
  content: string;
  parentCommentId: string | null;
  createdAt: string;
  user: {
    id: string;
    nickname: string;
    profileImg: string | null;
  };
};
