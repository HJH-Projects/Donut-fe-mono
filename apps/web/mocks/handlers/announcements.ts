import { http, HttpResponse } from 'msw';
import { mockAnnouncementList, mockAnnouncementDetails } from '../data/announcements';

export const announcementHandlers = [
  http.get('*/announcements', () => {
    return HttpResponse.json(mockAnnouncementList);
  }),

  http.get('*/announcements/:id', ({ params }) => {
    const { id } = params;
    const detail = mockAnnouncementDetails[id as string];
    if (!detail) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(detail);
  }),
];
