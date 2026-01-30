import { clientKy } from './client';
import { serverKy } from './server';

export type LookItem = {
  id: string;
  name: string;
  tags: string;
  items: Array<{
    id: string;
    clothesId: string;
    sortOrder: number;
    role: string;
    clothes?: {
      id: string;
      title: string;
      imageUrl: string;
    };
  }>;
  createdAt?: string;
  isFavorite?: boolean;
};

const mockLooks: LookItem[] = [
  {
    id: 'look-1',
    name: '오늘의 룩',
    tags: '캐주얼,봄',
    createdAt: new Date().toISOString(),
    isFavorite: true,
    items: [
      {
        id: 'item-1',
        clothesId: 'clothes-1',
        sortOrder: 1,
        role: 'TOP',
        clothes: {
          id: 'clothes-1',
          title: '흰색 반팔 티셔츠',
          imageUrl:
            'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&q=80&auto=format&fit=crop',
        },
      },
    ],
  },
];

export const getLooksServer = async () => {
  try {
    return await serverKy.get('looks').json<LookItem[]>();
  } catch {
    return mockLooks;
  }
};

export const getLooksClient = async () => {
  try {
    return await clientKy.get('looks').json<LookItem[]>();
  } catch {
    return mockLooks;
  }
};

export const getLookDetailServer = async (id: string) => {
  try {
    return await serverKy.get(`looks/${id}`).json<LookItem>();
  } catch {
    return mockLooks.find((item) => item.id === id) ?? mockLooks[0];
  }
};

export const createLookClient = async (payload: {
  name: string;
  tags: string;
  items: Array<{ clothesId: string; sortOrder: number; role: string }>;
}) => {
  try {
    return await clientKy.post('looks', { json: payload }).json<LookItem>();
  } catch {
    return { ...mockLooks[0], ...payload };
  }
};
