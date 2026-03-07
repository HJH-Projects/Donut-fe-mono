'use client';

import {
  closeGlobalDialog,
  openGlobalDialog,
  useGlobalDialogOpen,
} from '@/shared/model/globalDialogStore';
import type { TemperatureUnit } from '../model/useMyContentData';
import { MyDialogShell } from './MyDialogShell';

type MySettingsDialogProps = {
  title: string;
  sectionLabel: string;
  celsiusLabel: string;
  fahrenheitLabel: string;
  confirmLabel: string;
  temperatureUnit: TemperatureUnit;
  onChangeTemperatureUnit: (unit: TemperatureUnit) => void;
};

export function MySettingsDialog({
  title,
  sectionLabel,
  celsiusLabel,
  fahrenheitLabel,
  confirmLabel,
  temperatureUnit,
  onChangeTemperatureUnit,
}: MySettingsDialogProps) {
  const open = useGlobalDialogOpen('my:settings');

  return (
    <MyDialogShell
      open={open}
      onOpenChange={(next) =>
        next ? openGlobalDialog('my:settings') : closeGlobalDialog('my:settings')
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
          {sectionLabel}
        </h3>
        <div className="flex gap-3">
          <button
            onClick={() => onChangeTemperatureUnit('celsius')}
            className="flex-1 py-4 transition-all"
            style={{
              backgroundColor: temperatureUnit === 'celsius' ? '#000' : '#FFFFFF',
              color: temperatureUnit === 'celsius' ? '#FFFFFF' : '#000',
              borderRadius: 'var(--radius-pill)',
              border: temperatureUnit === 'celsius' ? 'none' : '1.5px solid #E5E5E5',
              fontFamily: "var(--font-inter), 'Inter', sans-serif",
              fontSize: '15px',
              fontWeight: 700,
            }}
          >
            {celsiusLabel}
          </button>
          <button
            onClick={() => onChangeTemperatureUnit('fahrenheit')}
            className="flex-1 py-4 transition-all"
            style={{
              backgroundColor: temperatureUnit === 'fahrenheit' ? '#000' : '#FFFFFF',
              color: temperatureUnit === 'fahrenheit' ? '#FFFFFF' : '#000',
              borderRadius: 'var(--radius-pill)',
              border: temperatureUnit === 'fahrenheit' ? 'none' : '1.5px solid #E5E5E5',
              fontFamily: "var(--font-inter), 'Inter', sans-serif",
              fontSize: '15px',
              fontWeight: 700,
            }}
          >
            {fahrenheitLabel}
          </button>
        </div>
      </div>

      <button
        onClick={() => closeGlobalDialog('my:settings')}
        className="w-full py-4 text-white transition-all hover:opacity-90"
        style={{
          backgroundColor: '#000',
          borderRadius: 'var(--radius-pill)',
          fontFamily: "var(--font-inter), 'Inter', sans-serif",
          fontSize: '16px',
          fontWeight: 700,
        }}
      >
        {confirmLabel}
      </button>
    </MyDialogShell>
  );
}
