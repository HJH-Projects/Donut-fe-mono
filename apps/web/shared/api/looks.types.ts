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
      category: string;
      color: string;
      imageUrl: string;
    };
  }>;
  createdAt?: string;
};
