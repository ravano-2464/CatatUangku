import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

type MetricTone = 'default' | 'income' | 'expense' | 'highlight';

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  tone?: MetricTone;
  iconName?: keyof typeof Ionicons.glyphMap;
}

const toneClasses: Record<MetricTone, string> = {
  default: 'bg-white border border-slate-200',
  income: 'bg-emerald-50 border border-emerald-100',
  expense: 'bg-rose-50 border border-rose-100',
  highlight: 'bg-brand-50 border border-brand-100',
};

export const MetricCard = ({
  title,
  value,
  subtitle,
  tone = 'default',
  iconName,
}: MetricCardProps) => (
  <View className={`rounded-2xl p-4 ${toneClasses[tone]}`}>
    <View className="flex-row items-center justify-between">
      <Text className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{title}</Text>
      {iconName ? (
        <View className="h-7 w-7 items-center justify-center rounded-full bg-white/80">
          <Ionicons name={iconName} size={15} color="#334155" />
        </View>
      ) : null}
    </View>
    <Text className="mt-2 text-lg font-extrabold text-slate-900">{value}</Text>
    {subtitle ? <Text className="mt-1 text-xs text-slate-500">{subtitle}</Text> : null}
  </View>
);
