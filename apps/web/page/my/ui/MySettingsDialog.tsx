'use client';

import { Button } from '@/shared/ui/Button';
import {
  closeGlobalDialog,
  openGlobalDialog,
  useGlobalDialogOpen,
} from '@/shared/model/globalDialogStore';
import { Text } from '@/shared/ui/Text';
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
        <Text as="h3" variant="sectionLabel" className="mb-4">
          {sectionLabel}
        </Text>
        <div className="flex gap-3">
          <Button
            onClick={() => onChangeTemperatureUnit('celsius')}
            variant={temperatureUnit === 'celsius' ? 'solid' : 'secondary'}
            size="xl"
            className="flex-1 text-[15px] font-bold"
          >
            {celsiusLabel}
          </Button>
          <Button
            onClick={() => onChangeTemperatureUnit('fahrenheit')}
            variant={temperatureUnit === 'fahrenheit' ? 'solid' : 'secondary'}
            size="xl"
            className="flex-1 text-[15px] font-bold"
          >
            {fahrenheitLabel}
          </Button>
        </div>
      </div>

      <Button
        onClick={() => closeGlobalDialog('my:settings')}
        variant="solid"
        size="xl"
        fullWidth
        className="text-[16px] font-bold"
      >
        {confirmLabel}
      </Button>
    </MyDialogShell>
  );
}
