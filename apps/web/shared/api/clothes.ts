import { clientKy } from './client';
import { serverKy } from './server';

export type ClothesItem = {
  id: string;
  title: string;
  category: 'TOP' | 'BOTTOM' | 'OUTER' | 'SHOES' | 'ACCESSORY';
  color: string;
  imageUrl: string;
  createdAt: string;
};

const mockClothes: ClothesItem[] = [
  {
    id: 'clothes-1',
    title: '흰색 반팔 티셔츠',
    category: 'TOP',
    color: '#FFFFFF',
    imageUrl:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80&auto=format&fit=crop',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'clothes-2',
    title: '네이비 니트',
    category: 'TOP',
    color: '#1F2A44',
    imageUrl:
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&q=80&auto=format&fit=crop',
    createdAt: new Date().toISOString(),
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
