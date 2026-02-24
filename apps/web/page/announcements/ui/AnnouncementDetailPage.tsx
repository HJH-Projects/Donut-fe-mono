'use client';

import { type ReactNode } from "react";

type AnnouncementDetail = {
  id: string;
  title: string;
  content: string;
  date: string;
};

const fallbackAnnouncementData: Record<string, AnnouncementDetail> = {
  "1": {
    id: "1",
    title: "서비스 업데이트 안내",
    content: "안녕하세요, Donut입니다.\n\n이번 업데이트에서는 사용자 경험을 개선하고 새로운 기능을 추가했습니다.\n\n주요 업데이트 내용:\n• 날씨 기반 코디 추천 알고리즘 개선\n• 룩 공유 기능 강화\n• 옷장 관리 UI/UX 개선\n• 알림 기능 추가\n\n더 나은 서비스를 제공하기 위해 노력하겠습니다.\n감사합니다.",
    date: "2026-02-04",
  },
  "2": {
    id: "2",
    title: "새로운 기능 추가 안내",
    content: "안녕하세요, Donut입니다.\n\n사용자 여러분의 의견을 반영하여 새로운 기능을 추가했습니다.\n\n새로운 기능:\n• 룩 북마크 기능\n• 코디 태그 자동 추천\n• 날씨 알림 설정\n• 프로필 커스터마이징\n\n앞으로도 더 좋은 기능으로 찾아뵙겠습니다.\n감사합니다.",
    date: "2026-02-01",
  },
  "3": {
    id: "3",
    title: "겨울 시즌 코디 팁 업데이트",
    content: "안녕하세요, Donut입니다.\n\n겨울 시즌을 맞아 새로운 코디 팁을 업데이트했습니다.\n\n이번 시즌 트렌드:\n• 레이어드 스타일링\n• 오버사이즈 아우터\n• 니트 조합 코디\n• 겨울 컬러 매칭 팁\n\n홈 화면에서 날씨에 맞는 코디 추천을 확인해보세요.\n감사합니다.",
    date: "2026-01-28",
  },
  "4": {
    id: "4",
    title: "서비스 점검 안내",
    content: "안녕하세요, Donut입니다.\n\n안정적인 서비스 제공을 위해 정기 점검을 진행합니다.\n\n점검 일시: 2026년 1월 26일 02:00 ~ 04:00 (약 2시간)\n\n점검 중에는 서비스 이용이 일시적으로 제한될 수 있습니다.\n이용에 불편을 드려 죄송합니다.\n\n감사합니다.",
    date: "2026-01-25",
  },
  "5": {
    id: "5",
    title: "신규 회원 이벤트 안내",
    content: "안녕하세요, Donut입니다.\n\n신규 회원 가입 이벤트를 진행합니다!\n\n이벤트 기간: 2026년 1월 20일 ~ 2월 20일\n\n혜택:\n• 프리미엄 테마 무료 제공\n• 코디 추천 우선 제공\n• 특별 배지 증정\n\n많은 관심과 참여 부탁드립니다.\n감사합니다.",
    date: "2026-01-20",
  },
};

interface AnnouncementDetailPageProps {
  initialAnnouncement?: AnnouncementDetail | null;
  header?: ReactNode;
}

export function AnnouncementDetailPage({ initialAnnouncement = null, header }: AnnouncementDetailPageProps) {
  // initialAnnouncement이 없으면 fallback 데이터에서 검색하지 않고 null 유지
  // (RSC에서 이미 id로 fetch하므로 여기서는 fallback만 표시)
  const announcement = initialAnnouncement;

  if (!announcement) {
    return (
      <div className="flex-1 min-h-0 w-full max-w-[500px] mx-auto flex flex-col items-center justify-center" style={{ backgroundColor: "#FFFFFF" }}>
        <p
          style={{
            fontFamily: "var(--font-inter), 'Inter', sans-serif",
            fontSize: "16px",
            fontWeight: 600,
            color: "#737373",
          }}
        >
          공지사항을 찾을 수 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 w-full max-w-[500px] mx-auto flex flex-col pb-24" style={{ backgroundColor: "#FFFFFF" }}>
      {header}

      <div className="flex-1 px-6">
        <h2
          className="text-black mb-3"
          style={{
            fontFamily: "var(--font-inter), 'Inter', sans-serif",
            fontSize: "20px",
            fontWeight: 700,
            lineHeight: "1.4",
          }}
        >
          {announcement.title}
        </h2>

        <p
          className="mb-6 pb-6"
          style={{
            color: "#A3A3A3",
            fontFamily: "var(--font-inter), 'Inter', sans-serif",
            fontSize: "13px",
            fontWeight: 500,
            borderBottom: "1px solid #F5F5F5",
          }}
        >
          {announcement.date}
        </p>

        <div
          style={{
            color: "#525252",
            fontFamily: "var(--font-inter), 'Inter', sans-serif",
            fontSize: "15px",
            fontWeight: 400,
            lineHeight: "1.8",
            whiteSpace: "pre-line",
          }}
        >
          {announcement.content}
        </div>
      </div>
    </div>
  );
}
