'use client';

import { Home, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useTranslation();

  const navItems = [
    { id: 'home', icon: Home, label: t('nav.home'), path: '/' },
    { id: 'profile', icon: User, label: t('nav.profile'), path: '/my' },
  ];

  return (
    <div
      className="fixed bottom-0 left-0 right-0 bg-black px-6 py-4 z-50 max-w-[500px] mx-auto"
      style={{
        borderTopLeftRadius: '32px',
        borderTopRightRadius: '32px',
      }}
    >
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.id}
              href={item.path}
              prefetch={true}
              className="flex flex-col items-center gap-1 transition-all duration-200"
            >
              <Icon
                size={22}
                color="white"
                strokeWidth={1.5}
                className={`${isActive ? 'opacity-100 scale-110' : 'opacity-60'}`}
                style={{ strokeLinecap: 'round', strokeLinejoin: 'round' }}
              />
              <span
                className={`text-white text-xs ${isActive ? 'opacity-100' : 'opacity-60'}`}
                style={{
                  fontFamily: "var(--font-inter), 'Inter', sans-serif",
                  fontSize: '11px',
                  fontWeight: 600,
                }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
