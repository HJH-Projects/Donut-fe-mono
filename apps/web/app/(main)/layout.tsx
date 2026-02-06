import { BottomNav } from '@/shared/ui/BottomNav';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-white">
      {children}
      <BottomNav />
    </div>
  );
}
