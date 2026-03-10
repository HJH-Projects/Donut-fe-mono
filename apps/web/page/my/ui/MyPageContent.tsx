'use client';

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { UserProfileResponseDto } from '@/shared/model/orvalSchemas';
import type { Gender } from '@/shared/model/gender';
import Spinner from '@/shared/ui/Spinner';
import { openGlobalDialog } from '@/shared/model/globalDialogStore';
import { useMyContentData } from '../model/useMyContentData';
import { MyGenderDialog } from './MyGenderDialog';
import { MyLanguageDialog } from './MyLanguageDialog';
import { MyLogoutConfirmDialog } from './MyLogoutConfirmDialog';
import { MyMenuSection } from './MyMenuSection';
import { MyNicknameDialog } from './MyNicknameDialog';
import { MyProfileCard } from './MyProfileCard';
import { MySettingsDialog } from './MySettingsDialog';

export interface MyPageContentProps {
  initialProfile?: UserProfileResponseDto | null;
  initialGender?: Gender;
}

export function MyPageContent({ initialProfile = null, initialGender = 'MALE' }: MyPageContentProps) {
  const router = useRouter();
  const {
    t,
    userProfile,
    temperatureUnit,
    language,
    gender,
    tempNickname,
    isLoggingOut,
    isSavingNickname,
    isResettingNickname,
    setTempNickname,
    handleOpenNicknameDialog,
    handleSaveNickname,
    handleResetNickname,
    handleLogoutConfirm,
    handleLanguageChange,
    handleTemperatureUnitChange,
    handleGenderChange,
  } = useMyContentData({
    initialProfile,
    initialGender,
  });

  return (
    <div
      className="flex-1 min-h-0 w-full flex flex-col overflow-y-auto pb-24"
      style={{ backgroundColor: '#FFFFFF' }}
    >
      <div className="shrink-0 px-6 pt-12 pb-10">
        <h1 className="text-black text-[42px] font-bold italic leading-[1.1]">Donut</h1>
      </div>

      <MyProfileCard
        nickname={userProfile.nickname}
        email={userProfile.email}
        closetCount={userProfile.closetCount}
        looksCount={userProfile.looksCount}
        closetItemsLabel={t('profile.closetItems')}
        totalLooksLabel={t('profile.totalLooks')}
        onEditNickname={handleOpenNicknameDialog}
      />

      <div className="px-6">
        <MyMenuSection
          title={t('profile.settings')}
          items={[
            {
              label: t('profile.temperatureUnit'),
              onClick: () => openGlobalDialog('my:settings'),
            },
            {
              label: t('profile.language'),
              onClick: () => openGlobalDialog('my:language'),
            },
            {
              label: t('profile.gender'),
              onClick: () => openGlobalDialog('my:gender'),
            },
          ]}
        />

        <MyMenuSection
          title={t('profile.support')}
          items={[
            {
              label: t('profile.announcements'),
              onClick: () => router.push('/announcements'),
            },
            {
              label: t('profile.faq'),
              onClick: () => router.push('/faq'),
            },
            {
              label: t('profile.notifications'),
              onClick: () => router.push('/notifications'),
            },
          ]}
        />

        <button
          onClick={() => openGlobalDialog('my:logoutConfirm')}
          disabled={isLoggingOut}
          className="w-full px-6 py-5 flex items-center justify-center gap-3 transition-all hover:opacity-80 disabled:opacity-60 mt-4"
          style={{
            backgroundColor: '#000000',
            borderRadius: 'var(--radius-pill)',
          }}
        >
          {isLoggingOut ? (
            <Spinner size="sm" className="text-white" />
          ) : (
            <LogOut size={18} color="#FFFFFF" strokeWidth={2} />
          )}
          <span
            className="text-white"
            style={{
              fontFamily: "var(--font-inter), 'Inter', sans-serif",
              fontSize: '16px',
              fontWeight: 700,
            }}
          >
            {t('profile.logout')}
          </span>
        </button>
      </div>

      <MyNicknameDialog
        title={t('profile.editNickname')}
        nicknameLabel={t('profile.nickname')}
        tempNickname={tempNickname}
        setTempNickname={setTempNickname}
        isResettingNickname={isResettingNickname}
        isSavingNickname={isSavingNickname}
        resetLabel={t('profile.resetNickname')}
        applyLabel={t('profile.apply')}
        onReset={handleResetNickname}
        onSave={handleSaveNickname}
      />

      <MySettingsDialog
        title={t('profile.settingsDialog.title')}
        sectionLabel={t('profile.settingsDialog.temperatureUnit')}
        celsiusLabel={t('profile.settingsDialog.celsius')}
        fahrenheitLabel={t('profile.settingsDialog.fahrenheit')}
        confirmLabel={t('profile.confirm')}
        temperatureUnit={temperatureUnit}
        onChangeTemperatureUnit={handleTemperatureUnitChange}
      />

      <MyLanguageDialog
        title={t('profile.languageDialog.title')}
        sectionLabel={t('profile.languageDialog.language')}
        koreanLabel={t('profile.languageDialog.korean')}
        englishLabel={t('profile.languageDialog.english')}
        confirmLabel={t('profile.confirm')}
        language={language}
        onChangeLanguage={handleLanguageChange}
      />

      <MyGenderDialog
        title={t('profile.genderDialog.title')}
        sectionLabel={t('profile.genderDialog.gender')}
        maleLabel={t('profile.genderDialog.male')}
        femaleLabel={t('profile.genderDialog.female')}
        confirmLabel={t('profile.confirm')}
        gender={gender}
        onChangeGender={handleGenderChange}
      />

      <MyLogoutConfirmDialog
        title={t('profile.logout')}
        description={t('profile.logoutConfirm')}
        cancelLabel={t('common.cancel')}
        confirmLabel={t('profile.logout')}
        isLoggingOut={isLoggingOut}
        onConfirm={handleLogoutConfirm}
      />
    </div>
  );
}
