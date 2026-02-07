import { http, HttpResponse } from 'msw';
import { mockFaqs } from '../data/faqs';

export const faqHandlers = [
  http.get('*/faqs', () => {
    return HttpResponse.json(mockFaqs);
  }),
];
