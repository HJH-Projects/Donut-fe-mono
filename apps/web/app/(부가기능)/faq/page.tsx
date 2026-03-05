import { FaqPage } from '@/page/faq/ui/FaqPage';
import { PageHeader } from '@/shared/ui/PageHeader';
import { HeaderBackLink } from '@/shared/ui/HeaderBackLink';

export default function Page() {
  return (
    <FaqPage
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
