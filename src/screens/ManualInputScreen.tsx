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
      showFeedback('Nominal wajib lebih dari 0.');
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
    <SafeAreaView className="flex-1 bg-slate-100">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 28 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-sm font-semibold text-slate-800">Jenis Transaksi</Text>
        <View className="mt-2 mb-4 flex-row rounded-xl bg-slate-200 p-1">
          {(['expense', 'income'] as TransactionType[]).map((value) => {
            const active = value === type;
            return (
              <Pressable
                key={value}
                onPress={() => handleTypeChange(value)}
                className={`flex-1 rounded-lg py-2 ${active ? 'bg-white' : ''}`}
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

        <Text className="mb-2 text-sm font-semibold text-slate-700">Kategori</Text>
        <CategorySelector selected={category} categories={categories} onSelect={setCategory} />

        <Text className="mb-2 text-sm font-semibold text-slate-700">Tanggal</Text>
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
            placeholder="Tambahkan catatan transaksi"
            multiline
          />
        </View>

        <View className="mt-3">
          <PrimaryButton label="Simpan Transaksi" onPress={handleSave} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
