import { unstable_cache } from 'next/cache';
import { createCachedKy, getRequestCookies } from './server';
import type { UserProfile, UserStats } from './users.types';
import { CACHE_TAGS } from './cache-tags';

const getGrade = (total: number) => {
  if (total >= 60) return { grade: 'Platinum', progress: (total - 60) / 40 };
  if (total >= 30) return { grade: 'Gold', progress: (total - 30) / 30 };
  if (total >= 10) return { grade: 'Silver', progress: (total - 10) / 20 };
  return { grade: 'Bronze', progress: total / 10 };
};

export const getMeServer = async () => {
  const cookieString = await getRequestCookies();
  return unstable_cache(
    async () => {
      const ky = createCachedKy(cookieString);
      return await ky.get('users/me').json<UserProfile>();
    },
    ['user-me'],
    { tags: [CACHE_TAGS.USER], revalidate: 300 }
  )();
};

export const getUserStatsServer = async () => {
  const cookieString = await getRequestCookies();
  return unstable_cache(
    async (): Promise<UserStats> => {
      const ky = createCachedKy(cookieString);
      const [clothes, looks] = await Promise.all([
        ky.get('clothes').json<unknown[]>(),
        ky.get('looks').json<unknown[]>(),
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
    },
    ['user-stats'],
    { tags: [CACHE_TAGS.USER_STATS], revalidate: 600 }
  )();
};
