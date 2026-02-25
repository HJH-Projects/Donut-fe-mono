'use client';

import { ChevronRight, LogOut, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { useTranslation } from "react-i18next";
import type { UserProfileResponseDto } from "@/shared/api/orvalSchema";
import Spinner from "@/shared/ui/Spinner";
import { useProfile } from "../model/useProfile";

type TemperatureUnit = "celsius" | "fahrenheit";
type Language = "ko" | "en";

interface MyPageProps {
  initialProfile?: UserProfileResponseDto | null;
  initialStats?: { closetCount: number; lookCount: number } | null;
}

export function MyPage({ initialProfile = null, initialStats = null }: MyPageProps) {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const [showSettingsDialog, setShowSettingsDialog] =
    useState(false);
  const [showLanguageDialog, setShowLanguageDialog] =
    useState(false);
  const [showNicknameDialog, setShowNicknameDialog] =
    useState(false);
  const [temperatureUnit, setTemperatureUnit] =
    useState<TemperatureUnit>("celsius");
  const [language, setLanguage] = useState<Language>(i18n.language as Language);
  const [tempNickname, setTempNickname] = useState("");

  const {
    stats,
    nickname,
    isResettingNickname,
    updateNickname,
    resetNickname,
  } = useProfile({ initialProfile, initialStats });

  const userProfile = {
    nickname,
    email: "fashion@example.com",
    closetCount: stats?.closetCount ?? 15,
    closetFavoriteCount: 0,
    looksCount: stats?.lookCount ?? 3,
    looksFavoriteCount: 0,
  };

  const handleLogout = async () => {
    if (confirm(t('profile.logoutConfirm'))) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          credentials: 'include',
        });
        router.push('/');
      } catch {
        alert(t('profile.logoutSuccess'));
      }
    }
  };

  const handleOpenNicknameDialog = () => {
    setTempNickname(nickname);
    setShowNicknameDialog(true);
  };

  const handleSaveNickname = async () => {
    if (!tempNickname.trim()) {
      alert(t('profile.enterNickname'));
      return;
    }
    const newNickname = tempNickname.trim();
    setShowNicknameDialog(false);
    await updateNickname(newNickname);
  };

  const handleResetNickname = async () => {
    setShowNicknameDialog(false);
    await resetNickname();
  };

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    i18n.changeLanguage(newLang);
  };

  return (
    <div
      className="flex-1 min-h-0 w-full flex flex-col overflow-y-auto pb-24"
      style={{ backgroundColor: "#FFFFFF" }}
    >
      {/* 상단 타이틀 - Playfair Display */}
      <div className="flex-shrink-0 px-6 pt-12 pb-10">
        <h1
          className="text-black"
          style={{
            fontFamily: "var(--font-playfair), 'Playfair Display', serif",
            fontSize: "42px",
            fontWeight: 700,
            fontStyle: "italic",
            lineHeight: "1.1",
          }}
        >
          {'Donut'}
        </h1>
      </div>

      {/* 프로필 정보 카드 */}
      <div className="px-6 mb-8">
        <div
          className="p-8"
          style={{
            backgroundColor: "#000000",
            borderRadius: "var(--radius-xl)",
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <h2
              className=""
              style={{
                fontFamily: "var(--font-inter), 'Inter', sans-serif",
                color: "rgba(255, 255, 255, 1)",
                fontSize: "24px",
                fontWeight: 700,
                letterSpacing: "-0.02em",
              }}
            >
              {userProfile.nickname}
            </h2>
            <button
              onClick={handleOpenNicknameDialog}
              className="p-1.5 hover:bg-white/10 transition-colors"
              style={{ borderRadius: "6px" }}
            >
              <Pencil size={18} color="rgba(255, 255, 255, 0.7)" strokeWidth={2} />
            </button>
          </div>
          <p
            className="mb-6"
            style={{
              color: "rgba(255, 255, 255, 0.7)",
              fontFamily: "var(--font-inter), 'Inter', sans-serif",
              fontSize: "15px",
              fontWeight: 400,
            }}
          >
            {userProfile.email}
          </p>

          {/* 통계 */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p
                className="text-white mb-1"
                style={{
                  fontFamily: "var(--font-inter), 'Inter', sans-serif",
                  fontSize: "28px",
                  fontWeight: 700,
                  lineHeight: "1",
                }}
              >
                {userProfile.closetCount}
              </p>
              <p
                style={{
                  color: "rgba(255, 255, 255, 0.5)",
                  fontFamily: "var(--font-inter), 'Inter', sans-serif",
                  fontSize: "13px",
                  fontWeight: 500,
                  letterSpacing: "0.02em",
                }}
              >
                {t('profile.closetItems')}
              </p>
            </div>

            <div>
              <p
                className="text-white mb-1"
                style={{
                  fontFamily: "var(--font-inter), 'Inter', sans-serif",
                  fontSize: "28px",
                  fontWeight: 700,
                  lineHeight: "1",
                }}
              >
                {userProfile.looksCount}
              </p>
              <p
                style={{
                  color: "rgba(255, 255, 255, 0.5)",
                  fontFamily: "var(--font-inter), 'Inter', sans-serif",
                  fontSize: "13px",
                  fontWeight: 500,
                  letterSpacing: "0.02em",
                }}
              >
                {t('profile.totalLooks')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 메뉴 섹션 */}
      <div className="px-6">
        {/* 환경설정 섹션 */}
        <h3
          className="mb-4"
          style={{
            fontFamily: "var(--font-inter), 'Inter', sans-serif",
            fontSize: "13px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "#737373",
          }}
        >
          {t('profile.settings')}
        </h3>

        <div className="space-y-2 mb-8">
          <button
            onClick={() => setShowSettingsDialog(true)}
            className="w-full px-6 py-5 flex items-center justify-between transition-all hover:bg-gray-50"
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E5E5E5",
              borderRadius: "var(--radius-lg)",
            }}
          >
            <span
              className="text-black"
              style={{
                fontFamily: "var(--font-inter), 'Inter', sans-serif",
                fontSize: "16px",
                fontWeight: 600,
              }}
            >
              {t('profile.temperatureUnit')}
            </span>
            <ChevronRight size={20} color="#A3A3A3" strokeWidth={2} />
          </button>

          <button
            onClick={() => setShowLanguageDialog(true)}
            className="w-full px-6 py-5 flex items-center justify-between transition-all hover:bg-gray-50"
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E5E5E5",
              borderRadius: "var(--radius-lg)",
            }}
          >
            <span
              className="text-black"
              style={{
                fontFamily: "var(--font-inter), 'Inter', sans-serif",
                fontSize: "16px",
                fontWeight: 600,
              }}
            >
              {t('profile.language')}
            </span>
            <ChevronRight size={20} color="#A3A3A3" strokeWidth={2} />
          </button>
        </div>

        {/* 고객지원 섹션 */}
        <h3
          className="mb-4"
          style={{
            fontFamily: "var(--font-inter), 'Inter', sans-serif",
            fontSize: "13px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "#737373",
          }}
        >
          {t('profile.support')}
        </h3>

        <div className="space-y-2 mb-8">
          <button
            onClick={() => router.push("/announcements")}
            className="w-full px-6 py-5 flex items-center justify-between transition-all hover:bg-gray-50"
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E5E5E5",
              borderRadius: "var(--radius-lg)",
            }}
          >
            <span
              className="text-black"
              style={{
                fontFamily: "var(--font-inter), 'Inter', sans-serif",
                fontSize: "16px",
                fontWeight: 600,
              }}
            >
              {t('profile.announcements')}
            </span>
            <ChevronRight size={20} color="#A3A3A3" strokeWidth={2} />
          </button>

          <button
            onClick={() => router.push("/faq")}
            className="w-full px-6 py-5 flex items-center justify-between transition-all hover:bg-gray-50"
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E5E5E5",
              borderRadius: "var(--radius-lg)",
            }}
          >
            <span
              className="text-black"
              style={{
                fontFamily: "var(--font-inter), 'Inter', sans-serif",
                fontSize: "16px",
                fontWeight: 600,
              }}
            >
              {t('profile.faq')}
            </span>
            <ChevronRight size={20} color="#A3A3A3" strokeWidth={2} />
          </button>

          <button
            onClick={() => router.push("/notifications")}
            className="w-full px-6 py-5 flex items-center justify-between transition-all hover:bg-gray-50"
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E5E5E5",
              borderRadius: "var(--radius-lg)",
            }}
          >
            <span
              className="text-black"
              style={{
                fontFamily: "var(--font-inter), 'Inter', sans-serif",
                fontSize: "16px",
                fontWeight: 600,
              }}
            >
              {t('profile.notifications')}
            </span>
            <ChevronRight size={20} color="#A3A3A3" strokeWidth={2} />
          </button>
        </div>

        {/* 로그아웃 버튼 */}
        <button
          onClick={handleLogout}
          className="w-full px-6 py-5 flex items-center justify-center gap-3 transition-all hover:opacity-80 mt-4"
          style={{
            backgroundColor: "#000000",
            borderRadius: "var(--radius-pill)",
          }}
        >
          <LogOut size={18} color="#FFFFFF" strokeWidth={2} />
          <span
            className="text-white"
            style={{
              fontFamily: "var(--font-inter), 'Inter', sans-serif",
              fontSize: "16px",
              fontWeight: 700,
            }}
          >
            {t('profile.logout')}
          </span>
        </button>
      </div>

      {/* 닉네임 설정 다이얼로그 */}
      <Dialog.Root
        open={showNicknameDialog}
        onOpenChange={setShowNicknameDialog}
      >
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 bg-black/40 z-50" />
          <Dialog.Popup
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white z-50 w-[90%] max-w-[420px]"
            style={{
              borderRadius: "var(--radius-xl)",
              padding: "32px",
            }}
            aria-describedby={undefined}
          >
            <h2
              className="text-black mb-8"
              style={{
                fontFamily: "var(--font-inter), 'Inter', sans-serif",
                fontSize: "28px",
                fontWeight: 700,
              }}
            >
              {t('profile.editNickname')}
            </h2>

            <div className="mb-8">
              <h3
                className="text-black mb-4"
                style={{
                  fontFamily: "var(--font-inter), 'Inter', sans-serif",
                  fontSize: "13px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                {t('profile.nickname')}
              </h3>
              <input
                type="text"
                value={tempNickname}
                onChange={(e) => setTempNickname(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{
                  fontFamily: "var(--font-inter), 'Inter', sans-serif",
                  fontSize: "15px",
                  fontWeight: 400,
                }}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleResetNickname}
                disabled={isResettingNickname}
                className="flex-1 py-4 transition-all hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "var(--radius-pill)",
                  border: "1.5px solid #E5E5E5",
                  color: "#000",
                  fontFamily: "var(--font-inter), 'Inter', sans-serif",
                  fontSize: "16px",
                  fontWeight: 700,
                }}
              >
                {isResettingNickname ? (
                  <>
                    <Spinner size="sm" className="text-[#555555]" />
                    {t('profile.resetNickname')}
                  </>
                ) : (
                  t('profile.resetNickname')
                )}
              </button>
              <button
                onClick={handleSaveNickname}
                disabled={isResettingNickname}
                className="flex-1 py-4 text-white transition-all hover:opacity-90"
                style={{
                  backgroundColor: "#000",
                  borderRadius: "var(--radius-pill)",
                  fontFamily: "var(--font-inter), 'Inter', sans-serif",
                  fontSize: "16px",
                  fontWeight: 700,
                }}
              >
                {t('profile.apply')}
              </button>
            </div>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>

      {/* 환경설정 다이얼로그 */}
      <Dialog.Root
        open={showSettingsDialog}
        onOpenChange={setShowSettingsDialog}
      >
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 bg-black/40 z-50" />
          <Dialog.Popup
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white z-50 w-[90%] max-w-[420px]"
            style={{
              borderRadius: "var(--radius-xl)",
              padding: "32px",
            }}
            aria-describedby={undefined}
          >
            <h2
              className="text-black mb-8"
              style={{
                fontFamily: "var(--font-inter), 'Inter', sans-serif",
                fontSize: "28px",
                fontWeight: 700,
              }}
            >
              {t('profile.settingsDialog.title')}
            </h2>

            <div className="mb-8">
              <h3
                className="text-black mb-4"
                style={{
                  fontFamily: "var(--font-inter), 'Inter', sans-serif",
                  fontSize: "13px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                {t('profile.settingsDialog.temperatureUnit')}
              </h3>
              <div className="flex gap-3">
                <button
                  onClick={() => setTemperatureUnit("celsius")}
                  className="flex-1 py-4 transition-all"
                  style={{
                    backgroundColor:
                      temperatureUnit === "celsius" ? "#000" : "#FFFFFF",
                    color:
                      temperatureUnit === "celsius" ? "#FFFFFF" : "#000",
                    borderRadius: "var(--radius-pill)",
                    border:
                      temperatureUnit === "celsius"
                        ? "none"
                        : "1.5px solid #E5E5E5",
                    fontFamily: "var(--font-inter), 'Inter', sans-serif",
                    fontSize: "15px",
                    fontWeight: 700,
                  }}
                >
                  {t('profile.settingsDialog.celsius')}
                </button>
                <button
                  onClick={() => setTemperatureUnit("fahrenheit")}
                  className="flex-1 py-4 transition-all"
                  style={{
                    backgroundColor:
                      temperatureUnit === "fahrenheit" ? "#000" : "#FFFFFF",
                    color:
                      temperatureUnit === "fahrenheit" ? "#FFFFFF" : "#000",
                    borderRadius: "var(--radius-pill)",
                    border:
                      temperatureUnit === "fahrenheit"
                        ? "none"
                        : "1.5px solid #E5E5E5",
                    fontFamily: "var(--font-inter), 'Inter', sans-serif",
                    fontSize: "15px",
                    fontWeight: 700,
                  }}
                >
                  {t('profile.settingsDialog.fahrenheit')}
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowSettingsDialog(false)}
              className="w-full py-4 text-white transition-all hover:opacity-90"
              style={{
                backgroundColor: "#000",
                borderRadius: "var(--radius-pill)",
                fontFamily: "var(--font-inter), 'Inter', sans-serif",
                fontSize: "16px",
                fontWeight: 700,
              }}
            >
              {t('profile.confirm')}
            </button>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>

      {/* 언어 설정 다이얼로그 */}
      <Dialog.Root
        open={showLanguageDialog}
        onOpenChange={setShowLanguageDialog}
      >
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 bg-black/40 z-50" />
          <Dialog.Popup
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white z-50 w-[90%] max-w-[420px]"
            style={{
              borderRadius: "var(--radius-xl)",
              padding: "32px",
            }}
            aria-describedby={undefined}
          >
            <h2
              className="text-black mb-8"
              style={{
                fontFamily: "var(--font-inter), 'Inter', sans-serif",
                fontSize: "28px",
                fontWeight: 700,
              }}
            >
              {t('profile.languageDialog.title')}
            </h2>

            <div className="mb-8">
              <h3
                className="text-black mb-4"
                style={{
                  fontFamily: "var(--font-inter), 'Inter', sans-serif",
                  fontSize: "13px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                {t('profile.languageDialog.language')}
              </h3>
              <div className="flex gap-3">
                <button
                  onClick={() => handleLanguageChange("ko")}
                  className="flex-1 py-4 transition-all"
                  style={{
                    backgroundColor:
                      language === "ko" ? "#000" : "#FFFFFF",
                    color:
                      language === "ko" ? "#FFFFFF" : "#000",
                    borderRadius: "var(--radius-pill)",
                    border:
                      language === "ko"
                        ? "none"
                        : "1.5px solid #E5E5E5",
                    fontFamily: "var(--font-inter), 'Inter', sans-serif",
                    fontSize: "15px",
                    fontWeight: 700,
                  }}
                >
                  {t('profile.languageDialog.korean')}
                </button>
                <button
                  onClick={() => handleLanguageChange("en")}
                  className="flex-1 py-4 transition-all"
                  style={{
                    backgroundColor:
                      language === "en" ? "#000" : "#FFFFFF",
                    color:
                      language === "en" ? "#FFFFFF" : "#000",
                    borderRadius: "var(--radius-pill)",
                    border:
                      language === "en"
                        ? "none"
                        : "1.5px solid #E5E5E5",
                    fontFamily: "var(--font-inter), 'Inter', sans-serif",
                    fontSize: "15px",
                    fontWeight: 700,
                  }}
                >
                  {t('profile.languageDialog.english')}
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowLanguageDialog(false)}
              className="w-full py-4 text-white transition-all hover:opacity-90"
              style={{
                backgroundColor: "#000",
                borderRadius: "var(--radius-pill)",
                fontFamily: "var(--font-inter), 'Inter', sans-serif",
                fontSize: "16px",
                fontWeight: 700,
              }}
            >
              {t('profile.confirm')}
            </button>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
