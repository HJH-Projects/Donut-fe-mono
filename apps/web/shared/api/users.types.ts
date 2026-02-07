export type UserProfile = {
  id: string;
  nickname: string | null;
  email?: string;
  profileImg: string | null;
  isNewUser: boolean;
  createdAt: string;
};

export type UserStats = {
  closetCount: number;
  lookCount: number;
  grade: string;
  gradeProgress: number;
};

export type UserSettings = {
  temperatureUnit: 'CELSIUS' | 'FAHRENHEIT';
  notificationsEnabled: boolean;
  weatherAlertEnabled: boolean;
  language: string;
};
