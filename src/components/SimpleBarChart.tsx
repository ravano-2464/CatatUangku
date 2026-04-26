import { Text, View } from 'react-native';

interface ChartItem {
  label: string;
  value: number;
}

interface SimpleBarChartProps {
  data: ChartItem[];
}

const formatCompactValue = (value: number) =>
  new Intl.NumberFormat('id-ID', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);

export const SimpleBarChart = ({ data }: SimpleBarChartProps) => {
  const maxValue = Math.max(...data.map((item) => item.value), 1);
  const chartHeight = 120;
  const topLabelValue = maxValue > 0 ? maxValue : 0;
  const midLabelValue = Math.round(maxValue / 2);

  return (
    <View className="rounded-3xl border border-slate-200 bg-white p-4">
      <View className="flex-row items-center justify-between">
        <Text className="text-sm font-bold text-slate-700">Tren Pengeluaran</Text>
        <Text className="text-xs text-slate-500">Nominal per periode</Text>
      </View>

      <View className="mt-4 h-40 flex-row">
        <View className="mr-2 justify-between pb-6">
          <Text className="text-[10px] text-slate-400">{formatCompactValue(topLabelValue)}</Text>
          <Text className="text-[10px] text-slate-400">{formatCompactValue(midLabelValue)}</Text>
          <Text className="text-[10px] text-slate-400">0</Text>
        </View>

        <View className="flex-1 flex-row items-end justify-between">
          {data.map((item) => {
            const barHeight =
              item.value === 0 ? 6 : Math.max((item.value / maxValue) * chartHeight, 6);

            return (
              <View key={item.label} className="mx-1 flex-1 items-center">
                <View className="w-6 rounded-t-xl bg-brand-500" style={{ height: barHeight }} />
                <Text className="mt-2 text-[11px] font-medium text-slate-500">{item.label}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};
