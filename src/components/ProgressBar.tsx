import { Text, View } from 'react-native';

interface ProgressBarProps {
  progress: number;
  label?: string;
  percentageLabel?: string;
  fillColor?: string;
}

export const ProgressBar = ({
  progress,
  label,
  percentageLabel,
  fillColor = '#0f766e',
}: ProgressBarProps) => {
  const safeProgress = Math.min(Math.max(progress, 0), 1);

  return (
    <View>
      {(label || percentageLabel) && (
        <View className="mb-2 flex-row items-center justify-between">
          <Text className="text-xs font-medium text-slate-500">{label}</Text>
          <Text className="text-xs font-bold text-slate-700">{percentageLabel}</Text>
        </View>
      )}
      <View className="h-2.5 overflow-hidden rounded-full bg-slate-200">
        <View
          className="h-2.5 rounded-full"
          style={{ width: `${safeProgress * 100}%`, backgroundColor: fillColor }}
        />
      </View>
    </View>
  );
};
