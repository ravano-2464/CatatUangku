import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useCallback, useMemo } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState } from '../components/EmptyState';
import { MetricCard } from '../components/MetricCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { ProgressBar } from '../components/ProgressBar';
import { MainTabParamList } from '../navigation/types';
import { useFinanceStore } from '../store/useFinanceStore';
import { FEATURE_LABELS } from '../types/finance';
import { calculateDashboardSummary, getMostUsedFeature } from '../utils/finance';
import { showFeedback } from '../utils/feedback';
import { formatCurrency, formatDateLabel, formatShortDate } from '../utils/format';

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
  const netFlow = summary.income - summary.expense;

  const handleGenerateData = () => {
    generateDummyData(8);
    showFeedback('8 transaksi dummy berhasil dibuat.');
  };

  return (
    <SafeAreaView className="flex-1 bg-soft" edges={['top']}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 112 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="overflow-hidden rounded-3xl bg-brand-700 px-5 py-5">
          <View className="absolute -right-8 -top-10 h-32 w-32 rounded-full bg-brand-600/70" />
          <View className="absolute -left-8 -bottom-14 h-28 w-28 rounded-full bg-brand-800/80" />

          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-xs uppercase tracking-widest text-brand-100">CatatUangku</Text>
              <Text className="mt-1 text-sm text-brand-100">{formatDateLabel(new Date())}</Text>
            </View>
            <View className="h-10 w-10 items-center justify-center rounded-full bg-white/20">
              <Ionicons name="wallet-outline" size={20} color="#f8fafc" />
            </View>
          </View>

          <Text className="mt-6 text-sm text-brand-100">Total Saldo</Text>
          <Text className="mt-1 text-3xl font-extrabold text-white">
            {formatCurrency(summary.balance)}
          </Text>

          <View className="mt-5 flex-row">
            <View className="mr-2 flex-1 rounded-2xl bg-white/15 px-3 py-3">
              <Text className="text-[11px] uppercase tracking-wide text-brand-100">Pemasukan</Text>
              <Text className="mt-1 text-base font-bold text-white">
                {formatCurrency(summary.income)}
              </Text>
            </View>
            <View className="ml-2 flex-1 rounded-2xl bg-white/15 px-3 py-3">
              <Text className="text-[11px] uppercase tracking-wide text-brand-100">Pengeluaran</Text>
              <Text className="mt-1 text-base font-bold text-white">
                {formatCurrency(summary.expense)}
              </Text>
            </View>
          </View>
        </View>

        <View className="mt-4 rounded-3xl border border-slate-200 bg-white p-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-sm font-bold text-slate-800">Tracker Budget Bulanan</Text>
            <Text className="text-xs font-semibold text-slate-500">
              Limit {formatCurrency(budgetLimit)}
            </Text>
          </View>
          <Text className="mt-1 text-xs text-slate-500">
            Terpakai {formatCurrency(summary.budgetUsed)} | Sisa {formatCurrency(summary.budgetRemaining)}
          </Text>
          <View className="mt-3">
            <ProgressBar
              progress={Math.min(usageRatio, 1)}
              percentageLabel={`${Math.round(usageRatio * 100)}%`}
              fillColor={overBudget ? '#dc2626' : '#0f766e'}
            />
          </View>
          {overBudget ? (
            <Text className="mt-2 text-xs font-semibold text-rose-600">
              Pengeluaran sudah melebihi limit bulanan.
            </Text>
          ) : null}
        </View>

        <View className="mt-4 flex-row">
          <View className="w-1/2 pr-2">
            <MetricCard
              title="Arus Kas Bersih"
              value={formatCurrency(netFlow)}
              tone={netFlow >= 0 ? 'income' : 'expense'}
              iconName="trending-up-outline"
            />
          </View>
          <View className="w-1/2 pl-2">
            <MetricCard
              title="Transaksi"
              value={`${transactions.length}`}
              subtitle="Total data"
              iconName="receipt-outline"
            />
          </View>
        </View>

        <View className="mt-4 flex-row gap-2">
          <View className="flex-1">
            <PrimaryButton
              label="Tambah Cepat"
              onPress={() => navigation.navigate('AddTransaction')}
              icon={<Ionicons name="add-outline" size={18} color="#fff" />}
            />
          </View>
          <View className="flex-1">
            <PrimaryButton
              label="Dummy Data"
              variant="secondary"
              onPress={handleGenerateData}
              icon={<Ionicons name="sparkles-outline" size={16} color="#334155" />}
            />
          </View>
        </View>

        <View className="mt-6">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-base font-bold text-slate-900">Transaksi Terbaru</Text>
            <Text className="text-xs text-slate-500">6 data terakhir</Text>
          </View>

          {recentTransactions.length === 0 ? (
            <EmptyState
              title="Belum ada transaksi"
              description="Mulai dengan input manual atau scan struk."
              iconName="wallet-outline"
            />
          ) : (
            recentTransactions.map((transaction) => (
              <View
                key={transaction.id}
                className="mb-2 rounded-2xl border border-slate-200 bg-white px-4 py-3"
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-1 pr-3">
                    <View className="flex-row items-center">
                      <View
                        className={`mr-2 h-8 w-8 items-center justify-center rounded-xl ${
                          transaction.type === 'expense' ? 'bg-rose-100' : 'bg-emerald-100'
                        }`}
                      >
                        <Ionicons
                          name={transaction.type === 'expense' ? 'arrow-down-outline' : 'arrow-up-outline'}
                          size={15}
                          color={transaction.type === 'expense' ? '#be123c' : '#15803d'}
                        />
                      </View>
                      <Text className="text-sm font-semibold text-slate-800">{transaction.category}</Text>
                    </View>
                    <Text className="mt-1 text-xs text-slate-500">
                      {formatShortDate(new Date(transaction.date))} •{' '}
                      {transaction.source === 'scan' ? 'Scan' : transaction.source === 'manual' ? 'Manual' : 'Dummy'}
                    </Text>
                  </View>
                  <Text
                    className={`text-sm font-extrabold ${
                      transaction.type === 'expense' ? 'text-rose-600' : 'text-emerald-600'
                    }`}
                  >
                    {transaction.type === 'expense' ? '-' : '+'}
                    {formatCurrency(transaction.amount)}
                  </Text>
                </View>
                <Text className="mt-2 text-xs text-slate-500">{transaction.note || 'Tanpa catatan'}</Text>
              </View>
            ))
          )}
        </View>

        <View className="mt-4 rounded-3xl border border-slate-200 bg-white p-4">
          <Text className="text-sm font-bold text-slate-800">Insight Penggunaan</Text>
          <Text className="mt-2 text-sm text-slate-600">
            Total transaksi ditambahkan: {analytics.transactionsAdded}x
          </Text>
          <Text className="mt-1 text-sm text-slate-600">
            Fitur paling sering dipakai: {topFeature ? FEATURE_LABELS[topFeature.key] : '-'}{' '}
            {topFeature ? `(${topFeature.count}x)` : ''}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
