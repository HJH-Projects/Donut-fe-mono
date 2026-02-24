import Link from 'next/link';

interface PageHeaderProps {
  title?: string;
  titleHref?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
}

export function PageHeader({ title, titleHref, left, right }: PageHeaderProps) {
  return (
    <div className="flex-shrink-0 px-6 pt-6 pb-6 flex items-center justify-center relative">
      {left && (
        <div className="absolute left-6">{left}</div>
      )}
      {title && (
        titleHref ? (
          <Link
            href={titleHref}
            className="text-black text-center"
            style={{
              fontFamily: "var(--font-inter), 'Inter', sans-serif",
              fontSize: '24px',
              fontWeight: 700,
              letterSpacing: '-0.02em',
            }}
          >
            {title}
          </Link>
        ) : (
          <h1
            className="text-black text-center"
            style={{
              fontFamily: "var(--font-inter), 'Inter', sans-serif",
              fontSize: '24px',
              fontWeight: 700,
              letterSpacing: '-0.02em',
            }}
          >
            {title}
          </h1>
        )
      )}
      {right && (
        <div className="absolute right-6">{right}</div>
      )}
    </div>
  );
}
