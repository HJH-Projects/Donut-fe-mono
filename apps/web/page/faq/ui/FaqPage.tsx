'use client';

import { Plus, Minus } from "lucide-react";
import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";

type FAQItem = {
  id: string;
  question: string;
  answer: ReactNode;
};

const faqs: FAQItem[] = [
  {
    id: "1",
    question: "Q. DONUT은 어떤 서비스인가요?",
    answer: (
      <>
        DONUT은 실시간 기상 정보를 분석하여 현재 날씨와 기온에 가장 적합한 옷차림을 제안해 드리는{" "}
        <strong>날씨 기반 의류 추천 웹앱 서비스</strong>
        입니다. "오늘 뭐 입지?"라는 고민을 날씨 데이터를 바탕으로 스마트하게 해결해 드립니다.
      </>
    ),
  },
  {
    id: "2",
    question: "Q. 유료인가요? 비용이 발생하나요?",
    answer: (
      <>
        모든 서비스는 <strong>무료</strong>로 이용 가능합니다. 별도의 결제 없이 날씨별 스타일링 추천 기능을 자유롭게 활용하실 수 있습니다.
      </>
    ),
  },
  {
    id: "3",
    question: "Q. 기존의 다른 서비스들과 무엇이 다른가요?",
    answer: (
      <>
        일반적인 패션 큐레이션과 달리,{" "}
        <strong>실시간 기온, 습도, 강수 여부 등 기상 변수</strong>
        를 최우선으로 고려합니다. 외부 활동 시 쾌적함을 유지하면서도 감각적인 룩을 완성할 수 있도록 돕는 실용적인 가이드라는 점이 가장 큰 특징입니다. 특히 로그인을 통해 본인의 옷을 등록하고 조합해보는 기능을 제공하여 개인화된 코디 관리가 가능합니다.
      </>
    ),
  },
  {
    id: "4",
    question: "Q. 계정 통합을 제공하나요?",
    answer: (
      <>
        사용자의 편의를 위해{" "}
        <strong>카카오, 네이버, 애플 등 주요 소셜 계정 연동(SSO)</strong>
        {" "}기능을 제공하고 있습니다. 다만, 통합 기능은 현재 제공하고 있지 않습니다.
      </>
    ),
  },
  {
    id: "5",
    question: "Q. 비밀번호를 잊어버렸어요.",
    answer:
      "DONUT은 소셜 로그인(구글, 애플, 카카오)을 사용하므로, 각 서비스 제공처(Google, Apple, Kakao)의 고객센터를 통해 계정 및 비밀번호를 관리하실 수 있습니다.",
  },
  {
    id: "6",
    question: "Q. 서비스 탈퇴는 어떻게 하나요?",
    answer: (
      <>
        마이페이지 내 <strong>계정 관리</strong> 메뉴에서 언제든지 탈퇴가 가능합니다. 탈퇴 시 저장된 옷장 데이터와 제작한 룩은 모두 파기됩니다.
      </>
    ),
  },
  {
    id: "7",
    question: "Q. 서비스 이용 중 오류(버그)를 발견하면 어떻게 하나요?",
    answer: (
      <>
        불편을 드려 죄송합니다. 발생한 오류의 내용이나 화면 캡처를 고객 지원 메일로 보내주시면 빠르게 확인하여 조치하겠습니다.
        <br />
        <strong>고객 지원 메일</strong>:{" "}
        <a
          href="mailto:support@doknot.xyz"
          className="underline"
          style={{ color: "#2563EB" }}
        >
          support@doknot.xyz
        </a>
      </>
    ),
  },
  {
    id: "8",
    question: "Q. 제가 제안하고 싶은 아이디어가 있어요!",
    answer: (
      <>
        사용자의 소중한 의견은 서비스 발전에 큰 힘이 됩니다. 제안하고 싶은 기능이나 아이디어가 있다면 고객 지원 메일을 통해 언제든 자유롭게 남겨주시기 바랍니다.
        <br />
        또한 아래 구글 폼으로도 의견을 접수하실 수 있습니다:
        {" "}
        <a
          href="https://forms.gle/doknot-feedback"
          target="_blank"
          rel="noreferrer"
          className="underline"
          style={{ color: "#2563EB" }}
        >
          <strong>구글 폼</strong>
        </a>
      </>
    ),
  },
];

interface FaqPageProps {
  header?: ReactNode;
}

export function FaqPage({ header }: FaqPageProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleFAQ = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="flex-1 min-h-0 w-full max-w-[500px] mx-auto flex flex-col pb-24" style={{ backgroundColor: "#FFFFFF" }}>
      {header}

      <div className="flex-1 px-6">
        <div className="space-y-3">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;

            return (
              <div
                key={faq.id}
                className="transition-all"
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E5E5E5",
                  borderRadius: "var(--radius-lg)",
                  overflow: "hidden",
                }}
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <h3
                    className="text-black text-left flex-1 pr-4"
                    style={{
                      fontFamily: "var(--font-inter), 'Inter', sans-serif",
                      fontSize: "16px",
                      fontWeight: 700,
                    }}
                  >
                    {faq.question}
                  </h3>
                  <div
                    className="flex-shrink-0 w-6 h-6 flex items-center justify-center"
                    style={{
                      backgroundColor: isOpen ? "#000" : "#F5F5F5",
                      borderRadius: "var(--radius-sm)",
                      transition: "all 0.2s",
                    }}
                  >
                    {isOpen ? (
                      <Minus size={14} color="#FFFFFF" strokeWidth={2.5} />
                    ) : (
                      <Plus size={14} color="#000" strokeWidth={2.5} />
                    )}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        overflow: "hidden",
                      }}
                    >
                      <div
                        className="px-6 pb-6"
                        style={{
                          borderTop: "1px solid #F5F5F5",
                          paddingTop: "20px",
                        }}
                      >
                        <p
                          style={{
                            color: "#525252",
                            fontFamily: "var(--font-inter), 'Inter', sans-serif",
                            fontSize: "14px",
                            fontWeight: 400,
                            lineHeight: "1.7",
                          }}
                        >
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
