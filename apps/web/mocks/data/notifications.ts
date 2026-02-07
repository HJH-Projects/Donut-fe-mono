import type { NotificationItem } from '@/shared/api/notifications.types';

export const mockNotifications: NotificationItem[] = [
  {
    id: '1',
    title: '날씨 알림',
    message: '오늘은 추운 날씨가 예상됩니다.',
    date: '2026-02-04',
    isRead: false,
    detail: '오늘 최저 기온은 -5도, 최고 기온은 3도로 예상됩니다. 두꺼운 코트와 목도리를 착용하시는 것을 추천드립니다. 바람이 강하게 불 예정이니 외출 시 유의하세요.',
    imageUrl: 'https://images.unsplash.com/photo-1564939558297-fc396f18e5c7?w=400&h=200&fit=crop',
  },
  {
    id: '2',
    title: '룩 추천',
    message: '새로운 룩 조합을 확인해보세요.',
    date: '2026-02-03',
    isRead: true,
  },
  {
    id: '3',
    title: '시스템 알림',
    message: '앱이 업데이트되었습니다.',
    date: '2026-02-02',
    isRead: true,
    detail: 'Donut 앱이 v2.1.0으로 업데이트되었습니다. 새로운 기능으로 룩 공유 기능이 추가되었으며, 성능이 개선되었습니다. 지금 바로 사용해보세요!',
  },
  {
    id: '4',
    title: '옷장 알림',
    message: '새로운 아이템이 추가되었습니다.',
    date: '2026-02-01',
    isRead: true,
  },
  {
    id: '5',
    title: '룩 추천',
    message: '오늘 날씨에 어울리는 룩을 확인하세요.',
    date: '2026-01-31',
    isRead: true,
  },
];
