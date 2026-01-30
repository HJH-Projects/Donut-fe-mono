import Link from 'next/link';

type Props = {
  href: string;
  label: string;
};

export const FloatingLinkButton = ({ href, label }: Props) => {
  return (
    <Link
      href={href}
      className="fixed bottom-24 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-black text-white shadow-lg"
      aria-label={label}
    >
      +
    </Link>
  );
};
