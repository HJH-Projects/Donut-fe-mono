import Link from 'next/link';

type Props = {
  href: string;
  label: string;
};

export const FloatingLinkButton = ({ href, label }: Props) => {
  return (
    <div className="fixed inset-x-0 bottom-24 z-40">
      <div className="mx-auto flex w-full max-w-[600px] justify-end px-6">
        <Link
          href={href}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white shadow-lg"
          aria-label={label}
        >
          +
        </Link>
      </div>
    </div>
  );
};
