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
