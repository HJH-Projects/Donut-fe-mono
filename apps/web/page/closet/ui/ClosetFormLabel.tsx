'use client';

type ClosetFormLabelProps = {
  text: string;
  required?: boolean;
};

export function ClosetFormLabel({ text, required = false }: ClosetFormLabelProps) {
  return (
    <label className="text-black mb-1.5 block text-[12px] font-semibold">
      {text}
      {required ? ' *' : ''}
    </label>
  );
}
