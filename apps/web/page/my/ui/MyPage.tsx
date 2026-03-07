'use client';

import type { UserProfileResponseDto } from '@/shared/model/orvalSchemas';
import type { Gender } from '@/shared/model/gender';
import { MyPageContent } from './MyPageContent';

interface MyPageProps {
  initialProfile?: UserProfileResponseDto | null;
  initialGender?: Gender;
}

export function MyPage({ initialProfile = null, initialGender = 'MALE' }: MyPageProps) {
  return <MyPageContent initialProfile={initialProfile} initialGender={initialGender} />;
}
