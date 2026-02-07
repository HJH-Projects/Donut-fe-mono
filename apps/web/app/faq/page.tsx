import { getFaqsServer } from '@/shared/api/faqs.server';
import { FaqPage } from '@/page/faq/ui/FaqPage';
import type { FAQItem } from '@/shared/api/faqs.types';

export default async function Page() {
  let faqs: FAQItem[] = [];

  try {
    faqs = await getFaqsServer();
  } catch { /* API 미연동 시 빈 배열 */ }

  return <FaqPage initialFaqs={faqs} />;
}
