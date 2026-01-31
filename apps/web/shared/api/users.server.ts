import { serverKy } from './server';
import type { UserProfile, UserStats } from './users.types';

const getGrade = (total: number) => {
  if (total >= 60) return { grade: 'Platinum', progress: (total - 60) / 40 };
  if (total >= 30) return { grade: 'Gold', progress: (total - 30) / 30 };
  if (total >= 10) return { grade: 'Silver', progress: (total - 10) / 20 };
  return { grade: 'Bronze', progress: total / 10 };
};

export const getMeServer = async () => {
  return await serverKy.get('users/me').json<UserProfile>();
};

export const getUserStatsServer = async (): Promise<UserStats> => {
  const [clothes, looks] = await Promise.all([
    serverKy.get('clothes').json<unknown[]>(),
    serverKy.get('looks').json<unknown[]>(),
  ]);

  const closetCount = Array.isArray(clothes) ? clothes.length : 0;
  const lookCount = Array.isArray(looks) ? looks.length : 0;
  const total = closetCount + lookCount;
  const gradeInfo = getGrade(total);

  return {
    closetCount,
    lookCount,
    grade: gradeInfo.grade,
    gradeProgress: Math.min(Math.max(gradeInfo.progress, 0), 1),
  };
};
