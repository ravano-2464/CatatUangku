import { Text, View } from 'react-native';

type MetricTone = 'default' | 'income' | 'expense' | 'highlight';

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  tone?: MetricTone;
}

const toneClasses: Record<MetricTone, string> = {
  default: 'bg-white border border-slate-200',
  income: 'bg-emerald-50 border border-emerald-100',
  expense: 'bg-rose-50 border border-rose-100',
  highlight: 'bg-cyan-50 border border-cyan-100',
};

export const MetricCard = ({ title, value, subtitle, tone = 'default' }: MetricCardProps) => (
  <View className={`rounded-2xl p-4 ${toneClasses[tone]}`}>
    <Text className="text-xs font-medium text-slate-500">{title}</Text>
    <Text className="mt-2 text-lg font-bold text-slate-900">{value}</Text>
    {subtitle ? <Text className="mt-1 text-xs text-slate-500">{subtitle}</Text> : null}
  </View>
);
