import { Text, View } from 'react-native';

interface ChartItem {
  label: string;
  value: number;
}

interface SimpleBarChartProps {
  data: ChartItem[];
}

export const SimpleBarChart = ({ data }: SimpleBarChartProps) => {
  const maxValue = Math.max(...data.map((item) => item.value), 1);
  const chartHeight = 120;

  return (
    <View className="rounded-2xl border border-slate-200 bg-white p-4">
      <Text className="text-sm font-semibold text-slate-700">Tren Pengeluaran</Text>
      <View className="mt-4 h-40 flex-row items-end justify-between">
        {data.map((item) => {
          const barHeight = item.value === 0 ? 6 : Math.max((item.value / maxValue) * chartHeight, 6);
          return (
            <View key={item.label} className="mx-1 flex-1 items-center">
              <View className="w-6 rounded-t-xl bg-brand-500" style={{ height: barHeight }} />
              <Text className="mt-2 text-[11px] text-slate-500">{item.label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};
