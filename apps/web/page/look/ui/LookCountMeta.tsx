'use client';

type LookCountMetaProps = {
  count: number;
  suffix: string;
};

export function LookCountMeta({ count, suffix }: LookCountMetaProps) {
  return (
    <div className="shrink-0 px-6 pb-2 pt-1 flex justify-end">
      <p className="text-[#555555] flex-shrink-0 text-[12px] font-medium">
        {count}
        {suffix}
      </p>
    </div>
  );
}
