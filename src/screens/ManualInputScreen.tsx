import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import * as Haptics from 'expo-haptics';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CategorySelector } from '../components/CategorySelector';
import { InputField } from '../components/InputField';
import { PrimaryButton } from '../components/PrimaryButton';
import { expenseCategories, incomeCategories } from '../constants/categories';
import { RootStackParamList } from '../navigation/types';
import { useFinanceStore } from '../store/useFinanceStore';
import { TransactionType } from '../types/finance';
import { showFeedback } from '../utils/feedback';
import { cleanNumberInput, formatDateLabel } from '../utils/format';

type ManualInputScreenProps = NativeStackScreenProps<RootStackParamList, 'ManualInput'>;

export const ManualInputScreen = ({ navigation }: ManualInputScreenProps) => {
  const addTransaction = useFinanceStore((state) => state.addTransaction);
  const trackFeature = useFinanceStore((state) => state.trackFeature);

  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [category, setCategory] = useState(expenseCategories[0]);
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useFocusEffect(
    useCallback(() => {
      trackFeature('manual_input');
    }, [trackFeature])
  );

  const categories = useMemo(
    () => (type === 'expense' ? expenseCategories : incomeCategories),
    [type]
  );

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (event.type === 'dismissed') {
      setShowDatePicker(false);
      return;
    }

    if (selectedDate) {
      setDate(selectedDate);
    }

    setShowDatePicker(false);
  };

  const handleTypeChange = (nextType: TransactionType) => {
    setType(nextType);
    setCategory(nextType === 'expense' ? expenseCategories[0] : incomeCategories[0]);
  };

  const handleSave = async () => {
    const parsedAmount = Number(amount);

    if (!parsedAmount || parsedAmount <= 0) {
      showFeedback('Nominal harus lebih dari 0.');
      return;
    }

    addTransaction({
      amount: parsedAmount,
      category,
      note: note.trim(),
      date: date.toISOString(),
      type,
      source: 'manual',
    });

    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      // Haptics is optional for testing devices.
    }

    showFeedback('Transaksi manual berhasil disimpan.');
    navigation.navigate('MainTabs', { screen: 'Dashboard' });
  };

  return (
    <SafeAreaView className="flex-1 bg-soft">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="overflow-hidden rounded-3xl bg-slate-900 px-5 py-5">
          <View className="absolute -right-10 -top-8 h-24 w-24 rounded-full bg-brand-700/40" />
          <View className="absolute -left-8 -bottom-9 h-24 w-24 rounded-full bg-slate-700/60" />
          <Text className="text-xs uppercase tracking-widest text-slate-300">Input Manual</Text>
          <Text className="mt-2 text-2xl font-extrabold text-white">Catat Transaksi</Text>
          <Text className="mt-2 text-sm text-slate-300">
            Isi detail transaksi, lalu simpan langsung ke dashboard.
          </Text>
        </View>

        <View className="mt-4 rounded-3xl border border-slate-200 bg-white p-4">
          <Text className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
            Jenis Transaksi
          </Text>
          <View className="mt-1 mb-4 flex-row rounded-2xl bg-slate-200 p-1">
            {(['expense', 'income'] as TransactionType[]).map((value) => {
              const active = value === type;

              return (
                <Pressable
                  key={value}
                  onPress={() => handleTypeChange(value)}
                  className={`flex-1 rounded-xl py-2.5 ${active ? 'bg-white' : ''}`}
                >
                  <Text
                    className={`text-center text-sm font-semibold ${
                      active ? 'text-slate-900' : 'text-slate-500'
                    }`}
                  >
                    {value === 'expense' ? 'Pengeluaran' : 'Pemasukan'}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <InputField
            label="Nominal"
            value={amount}
            onChangeText={(value) => setAmount(cleanNumberInput(value))}
            placeholder="Contoh: 150000"
            keyboardType="number-pad"
          />

          <Text className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
            Kategori
          </Text>
          <CategorySelector selected={category} categories={categories} onSelect={setCategory} />

          <Text className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
            Tanggal Transaksi
          </Text>
          <PrimaryButton
            label={formatDateLabel(date)}
            variant="secondary"
            onPress={() => setShowDatePicker(true)}
          />

          {showDatePicker && (
            <DateTimePicker value={date} mode="date" display="default" onChange={onDateChange} />
          )}

          <View className="mt-4">
            <InputField
              label="Catatan"
              value={note}
              onChangeText={setNote}
              placeholder="Contoh: Belanja mingguan"
              multiline
            />
          </View>

          <View className="mt-1">
            <PrimaryButton label="Simpan Transaksi" onPress={handleSave} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
