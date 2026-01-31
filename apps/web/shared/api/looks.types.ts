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
