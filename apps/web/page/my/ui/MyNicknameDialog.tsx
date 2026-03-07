'use client';

import Spinner from '@/shared/ui/Spinner';
import {
  closeGlobalDialog,
  openGlobalDialog,
  useGlobalDialogOpen,
} from '@/shared/model/globalDialogStore';
import { MyDialogShell } from './MyDialogShell';

type MyNicknameDialogProps = {
  title: string;
  nicknameLabel: string;
  tempNickname: string;
  setTempNickname: (value: string) => void;
  isResettingNickname: boolean;
  isSavingNickname: boolean;
  resetLabel: string;
  applyLabel: string;
  onReset: () => void;
  onSave: () => void;
};

export function MyNicknameDialog({
  title,
  nicknameLabel,
  tempNickname,
  setTempNickname,
  isResettingNickname,
  isSavingNickname,
  resetLabel,
  applyLabel,
  onReset,
  onSave,
}: MyNicknameDialogProps) {
  const open = useGlobalDialogOpen('my:nickname');

  return (
    <MyDialogShell
      open={open}
      onOpenChange={(next) =>
        next ? openGlobalDialog('my:nickname') : closeGlobalDialog('my:nickname')
      }
      title={title}
    >
      <div className="mb-8">
        <h3
          className="text-black mb-4"
          style={{
            fontFamily: "var(--font-inter), 'Inter', sans-serif",
            fontSize: '13px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          {nicknameLabel}
        </h3>
        <input
          type="text"
          value={tempNickname}
          onChange={(e) => setTempNickname(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{
            fontFamily: "var(--font-inter), 'Inter', sans-serif",
            fontSize: '15px',
            fontWeight: 400,
          }}
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={onReset}
          disabled={isResettingNickname || isSavingNickname}
          className="flex-1 py-4 transition-all hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-pill)',
            border: '1.5px solid #E5E5E5',
            color: '#000',
            fontFamily: "var(--font-inter), 'Inter', sans-serif",
            fontSize: '16px',
            fontWeight: 700,
          }}
        >
          {isResettingNickname ? (
            <>
              <Spinner size="sm" className="text-[#555555]" />
              {resetLabel}
            </>
          ) : (
            resetLabel
          )}
        </button>
        <button
          onClick={onSave}
          disabled={isSavingNickname || isResettingNickname}
          className="flex-1 py-4 text-white transition-all hover:opacity-90 disabled:opacity-60 inline-flex items-center justify-center gap-2"
          style={{
            backgroundColor: '#000',
            borderRadius: 'var(--radius-pill)',
            fontFamily: "var(--font-inter), 'Inter', sans-serif",
            fontSize: '16px',
            fontWeight: 700,
          }}
        >
          {isSavingNickname ? (
            <>
              <Spinner size="sm" className="text-white" />
              {applyLabel}
            </>
          ) : (
            applyLabel
          )}
        </button>
      </div>
    </MyDialogShell>
  );
}
