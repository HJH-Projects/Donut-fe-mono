'use client';

import { ChevronRight } from 'lucide-react';
import { Card } from '@/shared/ui/Card';
import { Text } from '@/shared/ui/Text';

type MyMenuItem = {
  label: string;
  onClick: () => void;
};

type MyMenuSectionProps = {
  title: string;
  items: MyMenuItem[];
};

export function MyMenuSection({ title, items }: MyMenuSectionProps) {
  return (
    <section className="mb-8">
      <Text as="h3" variant="sectionLabel" className="mb-4">
        {title}
      </Text>

      <div className="space-y-2">
        {items.map((item) => (
          <Card
            key={item.label}
            onClick={item.onClick}
            variant="outlined"
            interactive
            className="flex w-full items-center justify-between px-6 py-5"
          >
            <Text as="span" variant="bodyStrong" className="text-[16px]">
              {item.label}
            </Text>
            <ChevronRight size={20} color="#A3A3A3" strokeWidth={2} />
          </Card>
        ))}
      </div>
    </section>
  );
}
