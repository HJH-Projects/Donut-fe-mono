import { notificationHandlers } from './notifications';
import { announcementHandlers } from './announcements';
import { faqHandlers } from './faqs';
import { commentHandlers } from './comments';

export const handlers = [
  ...notificationHandlers,
  ...announcementHandlers,
  ...faqHandlers,
  ...commentHandlers,
];
