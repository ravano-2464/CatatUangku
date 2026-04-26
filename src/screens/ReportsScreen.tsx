import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState } from '../components/EmptyState';
import { MetricCard } from '../components/MetricCard';
import { ProgressBar } from '../components/ProgressBar';
import { SimpleBarChart } from '../components/SimpleBarChart';
import { MainTabParamList } from '../navigation/types';
import { useFinanceStore } from '../store/useFinanceStore';
import { ReportFilter } from '../types/finance';
import {
  filterTransactionsByRange,
  getCategoryBreakdown,
  getTrendData,
} from '../utils/finance';
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
    <SafeAreaView className="flex-1 bg-slate-100" edges={['top']}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 26 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-2xl font-bold text-slate-900">Laporan Keuangan</Text>
        <Text className="mt-1 text-sm text-slate-500">
          Pantau arus kas harian, mingguan, atau bulanan.
        </Text>

        <View className="mt-4 flex-row rounded-xl bg-slate-200 p-1">
          {(['daily', 'weekly', 'monthly'] as ReportFilter[]).map((filter) => {
            const active = filter === activeFilter;
            return (
              <Pressable
                key={filter}
                onPress={() => setActiveFilter(filter)}
                className={`flex-1 rounded-lg py-2 ${active ? 'bg-white' : ''}`}
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

        <View className="mt-4 flex-row">
          <View className="w-1/2 pr-2">
            <MetricCard title="Pemasukan" value={formatCurrency(income)} tone="income" />
          </View>
          <View className="w-1/2 pl-2">
            <MetricCard title="Pengeluaran" value={formatCurrency(expense)} tone="expense" />
          </View>
        </View>

        <View className="mt-4">
          <SimpleBarChart data={trendData} />
        </View>

        <View className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
          <Text className="text-sm font-semibold text-slate-700">Kategori Pengeluaran</Text>

          {breakdown.length === 0 ? (
            <View className="mt-3">
              <EmptyState
                title="Belum ada data"
                description="Tambahkan transaksi dulu supaya laporan terisi."
              />
            </View>
          ) : (
            <View className="mt-3 gap-3">
              {breakdown.map((item) => (
                <View key={item.category}>
                  <View className="mb-1 flex-row items-center justify-between">
                    <Text className="text-sm text-slate-700">{item.category}</Text>
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
