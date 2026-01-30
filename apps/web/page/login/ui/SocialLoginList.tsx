import { useLoginPopup } from '../model/useLoginPopup';

export const SocialLoginList = () => {
  const { openPopup } = useLoginPopup();

  return (
    <div className="flex flex-col gap-3 w-full max-w-xs">
      {/* Kakao Button */}
      <button
        onClick={() => openPopup('kakao')}
        className="w-full h-12 bg-[#FEE500] text-[#000000] rounded-md font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
      >
        <span className="text-sm">카카오로 시작하기</span>
      </button>

      {/* Google Button */}
      <button
        onClick={() => openPopup('google')}
        className="w-full h-12 bg-white border border-gray-200 text-gray-700 rounded-md font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm">Google로 시작하기</span>
      </button>

      {/* Apple Button (UI Only) */}
      <button
        disabled
        className="w-full h-12 bg-black text-white rounded-md font-semibold flex items-center justify-center gap-2 opacity-50 cursor-not-allowed"
      >
        <span className="text-sm">Apple로 시작하기</span>
      </button>
    </div>
  );
};
