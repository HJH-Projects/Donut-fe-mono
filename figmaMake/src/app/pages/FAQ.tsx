import { ChevronLeft, Plus, Minus } from "lucide-react";
import { useNavigate } from "react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslation } from "react-i18next";

type FAQItem = {
  id: string;
  question: string;
  answer: string;
};

export function FAQ() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [openId, setOpenId] = useState<string | null>(null);

  // Mock FAQ 데이터
  const faqs: FAQItem[] = [
    {
      id: "1",
      question: "룩은 어떻게 추가하나요?",
      answer: "룩 페이지에서 우측 상단의 + 버튼을 눌러 새로운 룩을 추가할 수 있습니다. 옷장에서 아이템을 선택하고 태그를 추가하세요.",
    },
    {
      id: "2",
      question: "옷장 아이템은 어떻게 관리하나요?",
      answer: "옷장 페이지에서 카테고리별로 아이템을 추가하고 관리할 수 있습니다. 각 아이템에 사진을 추가하고 정보를 입력하세요.",
    },
    {
      id: "3",
      question: "날씨 정보는 어떻게 확인하나요?",
      answer: "홈 화면에서 현재 날씨와 코디 추천을 확인할 수 있습니다. 위치 권한을 허용하면 현재 위치의 날씨가 표시됩니다.",
    },
    {
      id: "4",
      question: "룩을 공유하려면 어떻게 하나요?",
      answer: "룩 카드의 공유 버튼을 눌러 공유 링크를 생성할 수 있습니다. 링크를 복사하여 다른 사람과 공유하세요.",
    },
    {
      id: "5",
      question: "온도 단위를 변경할 수 있나요?",
      answer: "마이 페이지의 환경설정에서 섭씨(°C)와 화씨(°F) 사이를 전환할 수 있습니다.",
    },
  ];

  const toggleFAQ = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="min-h-screen w-full max-w-[500px] mx-auto flex flex-col pb-24" style={{ backgroundColor: "#FFFFFF" }}>
      {/* 상단 헤더 */}
      <div className="flex-shrink-0 px-6 pt-6 pb-6 flex items-center justify-center relative">
        <button
          onClick={() => navigate("/profile")}
          className="absolute left-6 p-2 hover:bg-gray-50 transition-colors -ml-2"
          style={{ borderRadius: "var(--radius-md)" }}
        >
          <ChevronLeft size={24} color="#000" strokeWidth={2} />
        </button>
        <h1
          className="text-black text-center"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "24px",
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}
        >
          FAQ
        </h1>
      </div>

      {/* FAQ 목록 */}
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
                      fontFamily: "'Inter', sans-serif",
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
                            fontFamily: "'Inter', sans-serif",
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