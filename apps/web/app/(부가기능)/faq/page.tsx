import { FaqPage } from '@/page/faq/ui/FaqPage';
import { PageHeader } from '@/shared/ui/PageHeader';
import { HeaderBackLink } from '@/shared/ui/HeaderBackLink';

export default async function Page() {
  return (
    <FaqPage
      initialFaqs={[]}
      header={
        <PageHeader
          title="FAQ"
          titleHref="/faq"
          left={<HeaderBackLink href="/my" />}
        />
      }
    />
  );
}
