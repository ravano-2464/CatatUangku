import { useCallback, useMemo } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import { EmptyState } from '../components/EmptyState';
import { MetricCard } from '../components/MetricCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { ProgressBar } from '../components/ProgressBar';
import { MainTabParamList } from '../navigation/types';
import { useFinanceStore } from '../store/useFinanceStore';
import { FEATURE_LABELS } from '../types/finance';
import {
  calculateDashboardSummary,
  getMostUsedFeature,
} from '../utils/finance';
import { showFeedback } from '../utils/feedback';
import { formatCurrency, formatDateLabel } from '../utils/format';

type DashboardScreenProps = BottomTabScreenProps<MainTabParamList, 'Dashboard'>;

export const DashboardScreen = ({ navigation }: DashboardScreenProps) => {
  const transactions = useFinanceStore((state) => state.transactions);
  const budgetLimit = useFinanceStore((state) => state.budgetLimit);
  const analytics = useFinanceStore((state) => state.analytics);
  const generateDummyData = useFinanceStore((state) => state.generateDummyData);
  const trackFeature = useFinanceStore((state) => state.trackFeature);

  useFocusEffect(
    useCallback(() => {
      trackFeature('dashboard_view');
    }, [trackFeature])
  );

  const summary = useMemo(
    () => calculateDashboardSummary(transactions, budgetLimit),
    [transactions, budgetLimit]
  );

  const recentTransactions = useMemo(
    () =>
      [...transactions]
        .sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime())
        .slice(0, 6),
    [transactions]
  );

  const topFeature = useMemo(
    () => getMostUsedFeature(analytics.featureUsage),
    [analytics.featureUsage]
  );
  const usageRatio = budgetLimit > 0 ? summary.budgetUsed / budgetLimit : 0;
  const overBudget = usageRatio > 1;

  const handleGenerateData = () => {
    generateDummyData(8);
    showFeedback('8 transaksi dummy berhasil dibuat.');
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-100" edges={['top']}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 36 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-2xl font-bold text-slate-900">CatatUangku</Text>
        <Text className="mt-1 text-sm text-slate-500">{formatDateLabel(new Date())}</Text>

        <View className="mt-5 flex-row flex-wrap">
          <View className="w-1/2 pr-2 pb-2">
            <MetricCard
              title="Total Saldo"
              value={formatCurrency(summary.balance)}
              tone="highlight"
            />
          </View>
          <View className="w-1/2 pl-2 pb-2">
            <MetricCard
              title="Total Pemasukan"
              value={formatCurrency(summary.income)}
              tone="income"
            />
          </View>
          <View className="w-1/2 pr-2 pt-2">
            <MetricCard
              title="Total Pengeluaran"
              value={formatCurrency(summary.expense)}
              tone="expense"
            />
          </View>
          <View className="w-1/2 pl-2 pt-2">
            <MetricCard
              title="Sisa Budget"
              value={formatCurrency(summary.budgetRemaining)}
              subtitle={`Limit: ${formatCurrency(budgetLimit)}`}
              tone="default"
            />
          </View>
        </View>

        <View className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
          <Text className="text-sm font-semibold text-slate-700">Pemakaian Budget Bulanan</Text>
          <Text className="mt-1 text-xs text-slate-500">
            Terpakai {formatCurrency(summary.budgetUsed)}
          </Text>
          <View className="mt-3">
            <ProgressBar
              progress={Math.min(usageRatio, 1)}
              percentageLabel={`${Math.round(usageRatio * 100)}%`}
              fillColor={overBudget ? '#dc2626' : '#0f766e'}
            />
          </View>
        </View>

        <View className="mt-4 flex-row gap-2">
          <View className="flex-1">
            <PrimaryButton
              label="Tambah Cepat"
              onPress={() => navigation.navigate('AddTransaction')}
            />
          </View>
          <View className="flex-1">
            <PrimaryButton
              label="Dummy Data"
              variant="secondary"
              onPress={handleGenerateData}
            />
          </View>
        </View>

        <View className="mt-6">
          <Text className="text-base font-semibold text-slate-900">Transaksi Terbaru</Text>
          <Text className="mt-1 text-sm text-slate-500">Maksimal 6 transaksi terakhir</Text>

          <View className="mt-3">
            {recentTransactions.length === 0 ? (
              <EmptyState
                title="Belum ada transaksi"
                description="Tambahkan transaksi manual atau scan struk untuk mulai tracking."
              />
            ) : (
              recentTransactions.map((transaction) => (
                <View
                  key={transaction.id}
                  className="mb-2 rounded-xl border border-slate-200 bg-white px-4 py-3"
                >
                  <View className="flex-row items-center justify-between">
                    <Text className="text-sm font-semibold text-slate-800">
                      {transaction.category}
                    </Text>
                    <Text
                      className={`text-sm font-bold ${
                        transaction.type === 'expense' ? 'text-rose-600' : 'text-emerald-600'
                      }`}
                    >
                      {transaction.type === 'expense' ? '-' : '+'}
                      {formatCurrency(transaction.amount)}
                    </Text>
                  </View>
                  <Text className="mt-1 text-xs text-slate-500">
                    {transaction.note || 'Tanpa catatan'}
                  </Text>
                </View>
              ))
            )}
          </View>
        </View>

        <View className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
          <Text className="text-sm font-semibold text-slate-800">Insight Testing</Text>
          <Text className="mt-2 text-sm text-slate-600">
            Total tambah transaksi: {analytics.transactionsAdded}x
          </Text>
          <Text className="mt-1 text-sm text-slate-600">
            Fitur paling sering: {topFeature ? FEATURE_LABELS[topFeature.key] : '-'}{' '}
            {topFeature ? `(${topFeature.count}x)` : ''}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
