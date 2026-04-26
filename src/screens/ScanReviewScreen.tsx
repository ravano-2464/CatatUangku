import * as Haptics from 'expo-haptics';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CategorySelector } from '../components/CategorySelector';
import { InputField } from '../components/InputField';
import { PrimaryButton } from '../components/PrimaryButton';
import { expenseCategories } from '../constants/categories';
import { RootStackParamList } from '../navigation/types';
import { useFinanceStore } from '../store/useFinanceStore';
import { showFeedback } from '../utils/feedback';
import { cleanNumberInput, formatDateLabel } from '../utils/format';

type ScanReviewScreenProps = NativeStackScreenProps<RootStackParamList, 'ScanReview'>;

export const ScanReviewScreen = ({ route, navigation }: ScanReviewScreenProps) => {
  const addTransaction = useFinanceStore((state) => state.addTransaction);
  const { draft, imageUri } = route.params;

  const [editable, setEditable] = useState(false);
  const [amount, setAmount] = useState(String(draft.amount));
  const [category, setCategory] = useState(draft.category);
  const [note, setNote] = useState(draft.note);

  const handleSave = async () => {
    const parsedAmount = Number(amount);

    if (!parsedAmount || parsedAmount <= 0) {
      showFeedback('Nominal hasil scan tidak valid.');
      return;
    }

    addTransaction({
      amount: parsedAmount,
      category,
      note: note.trim(),
      date: draft.date,
      type: 'expense',
      source: 'scan',
    });

    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      // Keep prototype flow running on unsupported devices.
    }

    showFeedback('Hasil scan berhasil disimpan.');
    navigation.navigate('MainTabs', { screen: 'Dashboard' });
  };

  return (
    <SafeAreaView className="flex-1 bg-soft">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="overflow-hidden rounded-3xl bg-slate-900 px-5 py-5">
          <View className="absolute -right-10 -top-8 h-24 w-24 rounded-full bg-brand-700/40" />
          <View className="absolute -left-8 -bottom-9 h-24 w-24 rounded-full bg-slate-700/60" />
          <Text className="text-xs uppercase tracking-widest text-slate-300">Review Scan</Text>
          <Text className="mt-2 text-2xl font-extrabold text-white">Validasi Hasil OCR</Text>
          <Text className="mt-2 text-sm text-slate-300">
            Tanggal: {formatDateLabel(new Date(draft.date))} • Edit sebelum simpan
          </Text>
        </View>

        {imageUri ? (
          <Image source={{ uri: imageUri }} className="mt-4 h-56 w-full rounded-3xl" resizeMode="cover" />
        ) : null}

        <View className="mt-4 rounded-3xl border border-slate-200 bg-white p-4">
          <InputField
            label="Nominal"
            value={amount}
            onChangeText={(value) => setAmount(cleanNumberInput(value))}
            keyboardType="number-pad"
            editable={editable}
          />

          <Text className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
            Kategori
          </Text>
          <CategorySelector
            categories={expenseCategories}
            selected={category}
            onSelect={setCategory}
            disabled={!editable}
          />

          <InputField
            label="Catatan"
            value={note}
            onChangeText={setNote}
            placeholder="Contoh: Belanja harian"
            editable={editable}
            multiline
          />
        </View>

        <View className="mt-4 flex-row gap-2">
          <View className="flex-1">
            <PrimaryButton
              label={editable ? 'Selesai Edit' : 'Edit Data'}
              variant="secondary"
              onPress={() => setEditable((value) => !value)}
            />
          </View>
          <View className="flex-1">
            <PrimaryButton label="Simpan Hasil" onPress={handleSave} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
