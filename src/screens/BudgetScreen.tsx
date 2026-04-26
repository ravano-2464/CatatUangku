import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { InputField } from '../components/InputField';
import { PrimaryButton } from '../components/PrimaryButton';
import { ProgressBar } from '../components/ProgressBar';
import { MainTabParamList } from '../navigation/types';
import { useFinanceStore } from '../store/useFinanceStore';
import { calculateDashboardSummary } from '../utils/finance';
import { showFeedback } from '../utils/feedback';
import { cleanNumberInput, formatCurrency } from '../utils/format';

type BudgetScreenProps = BottomTabScreenProps<MainTabParamList, 'Budget'>;

const budgetPresets = [1_000_000, 2_000_000, 3_000_000];

export const BudgetScreen = (_: BudgetScreenProps) => {
  const transactions = useFinanceStore((state) => state.transactions);
  const budgetLimit = useFinanceStore((state) => state.budgetLimit);
  const setBudgetLimit = useFinanceStore((state) => state.setBudgetLimit);
  const trackFeature = useFinanceStore((state) => state.trackFeature);
  const [budgetInput, setBudgetInput] = useState(String(budgetLimit));

  useFocusEffect(
    useCallback(() => {
      trackFeature('budget_view');
      setBudgetInput(String(budgetLimit));
    }, [trackFeature, budgetLimit])
  );

  const summary = useMemo(
    () => calculateDashboardSummary(transactions, budgetLimit),
    [transactions, budgetLimit]
  );

  const usageRatio = budgetLimit > 0 ? summary.budgetUsed / budgetLimit : 0;
  const overBudget = usageRatio > 1;

  const handleSave = () => {
    const parsed = Number(cleanNumberInput(budgetInput));

    if (!parsed || parsed <= 0) {
      showFeedback('Budget harus lebih dari 0.');
      return;
    }

    setBudgetLimit(parsed);
    showFeedback('Limit budget berhasil diperbarui.');
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-100" edges={['top']}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 26 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-2xl font-bold text-slate-900">Atur Budget</Text>
        <Text className="mt-1 text-sm text-slate-500">
          Tentukan limit bulanan agar pengeluaran tetap terkontrol.
        </Text>

        <View className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
          <InputField
            label="Limit Budget Bulanan"
            value={budgetInput}
            onChangeText={(value) => setBudgetInput(cleanNumberInput(value))}
            keyboardType="number-pad"
            placeholder="Contoh: 2500000"
          />

          <Text className="mb-2 text-sm font-semibold text-slate-700">Preset Cepat</Text>
          <View className="mb-4 flex-row gap-2">
            {budgetPresets.map((preset) => (
              <Pressable
                key={preset}
                onPress={() => setBudgetInput(String(preset))}
                className="rounded-full border border-slate-300 bg-slate-50 px-4 py-2"
              >
                <Text className="text-xs font-semibold text-slate-700">
                  {formatCurrency(preset)}
                </Text>
              </Pressable>
            ))}
          </View>

          <PrimaryButton label="Simpan Budget" onPress={handleSave} />
        </View>

        <View className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
          <Text className="text-sm font-semibold text-slate-700">Status Budget Bulanan</Text>
          <Text className="mt-3 text-sm text-slate-600">
            Budget terpakai: {formatCurrency(summary.budgetUsed)}
          </Text>
          <Text className="mt-1 text-sm text-slate-600">
            Sisa budget: {formatCurrency(summary.budgetRemaining)}
          </Text>
          <View className="mt-3">
            <ProgressBar
              progress={Math.min(usageRatio, 1)}
              percentageLabel={`${Math.round(usageRatio * 100)}%`}
              fillColor={overBudget ? '#dc2626' : '#0f766e'}
            />
          </View>
          {overBudget ? (
            <Text className="mt-3 text-xs font-semibold text-rose-600">
              Pengeluaran sudah melewati limit budget.
            </Text>
          ) : (
            <Text className="mt-3 text-xs text-slate-500">
              Pengeluaran masih dalam batas budget.
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
