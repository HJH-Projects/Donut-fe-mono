'use client';

import { Plus, Minus } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trans, useTranslation } from 'react-i18next';

const FAQ_IDS = ['1', '2', '3', '4', '5', '6', '7', '8'] as const;

interface FaqPageProps {
  header?: ReactNode;
}

export function FaqPage({ header }: FaqPageProps) {
  const { t } = useTranslation();
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleFAQ = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div
      className="flex-1 min-h-0 w-full max-w-[500px] mx-auto flex flex-col overflow-hidden"
      style={{ backgroundColor: '#FFFFFF' }}
    >
      <div className="shrink-0">{header}</div>

      <div className="flex-1 min-h-0 overflow-y-auto px-6 pb-28">
        <div className="space-y-3">
          {FAQ_IDS.map((id) => {
            const isOpen = openId === id;

            return (
              <div
                key={id}
                className="transition-all"
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E5E5',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                }}
              >
                <button
                  onClick={() => toggleFAQ(id)}
                  className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <h3
                    className="text-black text-left flex-1 pr-4"
                    style={{
                      fontFamily: "var(--font-inter), 'Inter', sans-serif",
                      fontSize: '16px',
                      fontWeight: 700,
                    }}
                  >
                    {t(`faq.items.${id}.q`)}
                  </h3>
                  <div
                    className="shrink-0 w-6 h-6 flex items-center justify-center"
                    style={{
                      backgroundColor: isOpen ? '#000' : '#F5F5F5',
                      borderRadius: 'var(--radius-sm)',
                      transition: 'all 0.2s',
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
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        className="px-6 pb-6"
                        style={{
                          borderTop: '1px solid #F5F5F5',
                          paddingTop: '20px',
                        }}
                      >
                        <p
                          style={{
                            color: '#525252',
                            fontFamily: "var(--font-inter), 'Inter', sans-serif",
                            fontSize: '14px',
                            fontWeight: 400,
                            lineHeight: '1.7',
                          }}
                        >
                          {id === '7' ? (
                            <Trans
                              i18nKey="faq.items.7.a"
                              components={{
                                strong: <strong />,
                                br: <br />,
                                supportMail: (
                                  <a
                                    href="mailto:support@doknot.xyz"
                                    className="underline"
                                    style={{ color: '#2563EB' }}
                                  />
                                ),
                              }}
                            />
                          ) : id === '8' ? (
                            <Trans
                              i18nKey="faq.items.8.a"
                              components={{
                                strong: <strong />,
                                br: <br />,
                                googleForm: (
                                  <a
                                    href="https://forms.gle/doknot-feedback"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="underline"
                                    style={{ color: '#2563EB' }}
                                  />
                                ),
                              }}
                            />
                          ) : (
                            <Trans i18nKey={`faq.items.${id}.a`} components={{ strong: <strong /> }} />
                          )}
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
