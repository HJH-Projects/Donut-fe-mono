export type ClothesItem = {
  id: string;
  title: string;
  category: 'TOP' | 'BOTTOM' | 'OUTER' | 'SHOES' | 'ACCESSORY';
  color: string;
  imageUrl: string;
  createdAt: string;
};

export type ClothesDetail = ClothesItem & {
  updatedAt?: string;
};
