import { http, HttpResponse } from 'msw';
import { mockNotifications } from '../data/notifications';

const notifications = [...mockNotifications];

export const notificationHandlers = [
  http.get('*/notifications', () => {
    return HttpResponse.json(notifications);
  }),

  http.patch('*/notifications/:id/read', ({ params }) => {
    const { id } = params;
    const notification = notifications.find((n) => n.id === id);
    if (!notification) {
      return new HttpResponse(null, { status: 404 });
    }
    notification.isRead = true;
    return HttpResponse.json(notification);
  }),
];
