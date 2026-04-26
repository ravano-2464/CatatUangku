import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState } from '../components/EmptyState';
import { ProgressBar } from '../components/ProgressBar';
import { SimpleBarChart } from '../components/SimpleBarChart';
import { MainTabParamList } from '../navigation/types';
import { useFinanceStore } from '../store/useFinanceStore';
import { ReportFilter } from '../types/finance';
import { filterTransactionsByRange, getCategoryBreakdown, getTrendData } from '../utils/finance';
import { formatCurrency } from '../utils/format';

type ReportsScreenProps = BottomTabScreenProps<MainTabParamList, 'Reports'>;

const filterLabels: Record<ReportFilter, string> = {
  daily: 'Harian',
  weekly: 'Mingguan',
  monthly: 'Bulanan',
};

export const ReportsScreen = (_: ReportsScreenProps) => {
  const transactions = useFinanceStore((state) => state.transactions);
  const trackFeature = useFinanceStore((state) => state.trackFeature);
  const [activeFilter, setActiveFilter] = useState<ReportFilter>('weekly');

  useFocusEffect(
    useCallback(() => {
      trackFeature('report_view');
    }, [trackFeature])
  );

  const filteredTransactions = useMemo(
    () => filterTransactionsByRange(transactions, activeFilter),
    [transactions, activeFilter]
  );

  const income = useMemo(
    () =>
      filteredTransactions
        .filter((transaction) => transaction.type === 'income')
        .reduce((total, transaction) => total + transaction.amount, 0),
    [filteredTransactions]
  );

  const expense = useMemo(
    () =>
      filteredTransactions
        .filter((transaction) => transaction.type === 'expense')
        .reduce((total, transaction) => total + transaction.amount, 0),
    [filteredTransactions]
  );

  const breakdown = useMemo(
    () => getCategoryBreakdown(filteredTransactions).slice(0, 4),
    [filteredTransactions]
  );

  const trendData = useMemo(
    () => getTrendData(filteredTransactions, activeFilter),
    [filteredTransactions, activeFilter]
  );

  return (
    <SafeAreaView className="flex-1 bg-soft" edges={['top']}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 112 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="overflow-hidden rounded-3xl bg-slate-900 px-5 py-5">
          <View className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-brand-700/45" />
          <View className="absolute -left-8 -bottom-10 h-24 w-24 rounded-full bg-slate-700/70" />
          <Text className="text-xs uppercase tracking-widest text-slate-300">Laporan Keuangan</Text>
          <Text className="mt-2 text-2xl font-extrabold text-white">Ringkasan Arus Kas</Text>
          <Text className="mt-2 text-sm text-slate-300">
            Pantau pola pemasukan dan pengeluaran berdasarkan periode.
          </Text>

          <View className="mt-4 flex-row">
            <View className="mr-2 flex-1 rounded-2xl bg-emerald-500/20 px-3 py-3">
              <Text className="text-[11px] uppercase tracking-wide text-emerald-200">Pemasukan</Text>
              <Text className="mt-1 text-base font-bold text-white">{formatCurrency(income)}</Text>
            </View>
            <View className="ml-2 flex-1 rounded-2xl bg-rose-500/20 px-3 py-3">
              <Text className="text-[11px] uppercase tracking-wide text-rose-200">Pengeluaran</Text>
              <Text className="mt-1 text-base font-bold text-white">{formatCurrency(expense)}</Text>
            </View>
          </View>
        </View>

        <View className="mt-4 flex-row rounded-2xl bg-slate-200 p-1">
          {(['daily', 'weekly', 'monthly'] as ReportFilter[]).map((filter) => {
            const active = filter === activeFilter;
            return (
              <Pressable
                key={filter}
                onPress={() => setActiveFilter(filter)}
                className={`flex-1 rounded-xl py-2.5 ${active ? 'bg-white' : ''}`}
                style={
                  active
                    ? {
                        shadowColor: '#0f172a',
                        shadowOpacity: 0.08,
                        shadowRadius: 8,
                        shadowOffset: { width: 0, height: 3 },
                      }
                    : undefined
                }
              >
                <Text
                  className={`text-center text-sm font-semibold ${
                    active ? 'text-slate-900' : 'text-slate-500'
                  }`}
                >
                  {filterLabels[filter]}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View className="mt-4">
          <SimpleBarChart data={trendData} />
        </View>

        <View className="mt-4 rounded-3xl border border-slate-200 bg-white p-4">
          <Text className="text-sm font-bold text-slate-700">Pengeluaran per Kategori</Text>

          {breakdown.length === 0 ? (
            <View className="mt-3">
              <EmptyState
                title="Belum ada data laporan"
                description="Tambahkan transaksi agar tren pengeluaran bisa ditampilkan."
                iconName="stats-chart-outline"
              />
            </View>
          ) : (
            <View className="mt-3 gap-3">
              {breakdown.map((item) => (
                <View key={item.category}>
                  <View className="mb-1 flex-row items-center justify-between">
                    <Text className="text-sm font-medium text-slate-700">{item.category}</Text>
                    <Text className="text-xs font-semibold text-slate-500">
                      {formatCurrency(item.amount)}
                    </Text>
                  </View>
                  <ProgressBar progress={item.percentage} />
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
