export type ShareLink = {
  id: string;
  lookId: string;
  path: string;
  isActive: boolean;
  expiresAt: string | null;
};

export type ShareLookItem = {
  id: string;
  clothesId: string;
  sortOrder: number;
  role: string;
};

export type ShareUser = {
  id: string;
  nickname: string;
  profileImg: string | null;
};

export type ShareLook = {
  id: string;
  name: string;
  items: ShareLookItem[];
  user: ShareUser;
};

export type ShareLinkDetail = {
  id: string;
  path: string;
  isActive: boolean;
  look: ShareLook;
};
