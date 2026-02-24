'use client';

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4 px-6">
      <p
        className="text-[#555]"
        style={{ fontFamily: "var(--font-inter), sans-serif" }}
      >
        문제가 발생했습니다
      </p>
      <button
        onClick={reset}
        className="bg-black text-white px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
        style={{
          fontFamily: "var(--font-inter), sans-serif",
          fontSize: "14px",
          fontWeight: 600,
        }}
      >
        다시 시도
      </button>
    </div>
  );
}
