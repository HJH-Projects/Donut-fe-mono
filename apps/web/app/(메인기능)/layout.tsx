import PageLayout from "@/shared/ui/pageLayout";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <PageLayout >
      {children}
    </PageLayout>
  );
}
