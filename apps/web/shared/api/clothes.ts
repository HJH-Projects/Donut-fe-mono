import { clientKy } from './client';
import { serverKy } from './server';

export type ClothesItem = {
  id: string;
  title: string;
  category: 'TOP' | 'BOTTOM' | 'OUTER' | 'SHOES' | 'ACCESSORY';
  color: string;
  imageUrl: string;
  createdAt: string;
  isFavorite?: boolean;
};

export type ClothesDetail = ClothesItem & {
  season?: string;
  brand?: string;
  material?: string;
  size?: string;
  memo?: string;
};

const mockClothes: ClothesDetail[] = [
  {
    id: 'clothes-1',
    title: '흰색 반팔 티셔츠',
    category: 'TOP',
    color: '#FFFFFF',
    imageUrl:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80&auto=format&fit=crop',
    createdAt: new Date().toISOString(),
    isFavorite: true,
    season: '여름',
    brand: 'Donut',
    material: '면',
    size: 'M',
    memo: '기본템이라 자주 입음',
  },
  {
    id: 'clothes-2',
    title: '네이비 니트',
    category: 'TOP',
    color: '#1F2A44',
    imageUrl:
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&q=80&auto=format&fit=crop',
    createdAt: new Date().toISOString(),
    isFavorite: false,
    season: '겨울',
    brand: 'Donut',
    material: '울',
    size: 'L',
    memo: '추울 때 따뜻함',
  },
];

export const getClothesServer = async () => {
  try {
    return await serverKy.get('clothes').json<ClothesItem[]>();
  } catch {
    return mockClothes;
  }
};

export const getClothesClient = async () => {
  try {
    return await clientKy.get('clothes').json<ClothesItem[]>();
  } catch {
    return mockClothes;
  }
};

export const createClothesClient = async (payload: {
  title: string;
  category: ClothesItem['category'];
  color: string;
  imageUrl: string;
}) => {
  try {
    return await clientKy.post('clothes', { json: payload }).json<ClothesItem>();
  } catch {
    return {
      id: `mock-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isFavorite: false,
      ...payload,
    };
  }
};

export const getClothesDetailServer = async (id: string) => {
  try {
    return await serverKy.get(`clothes/${id}`).json<ClothesDetail>();
  } catch {
    return mockClothes.find((item) => item.id === id) ?? mockClothes[0];
  }
};

export const updateClothesClient = async (id: string, payload: Partial<ClothesDetail>) => {
  try {
    return await clientKy.patch(`clothes/${id}`, { json: payload }).json<ClothesDetail>();
  } catch {
    return { ...(mockClothes.find((item) => item.id === id) ?? mockClothes[0]), ...payload };
  }
};
