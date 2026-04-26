import { Ionicons } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActionCard } from '../components/ActionCard';
import { MainTabParamList, RootStackParamList } from '../navigation/types';
import { useFinanceStore } from '../store/useFinanceStore';

type AddTransactionScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'AddTransaction'>,
  NativeStackScreenProps<RootStackParamList>
>;

export const AddTransactionScreen = ({ navigation }: AddTransactionScreenProps) => {
  const analytics = useFinanceStore((state) => state.analytics);
  const trackFeature = useFinanceStore((state) => state.trackFeature);

  useFocusEffect(
    useCallback(() => {
      trackFeature('add_transaction_view');
    }, [trackFeature])
  );

  return (
    <SafeAreaView className="flex-1 bg-soft" edges={['top']}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 112 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="overflow-hidden rounded-3xl bg-slate-900 px-5 py-5">
          <View className="absolute -right-8 -top-9 h-24 w-24 rounded-full bg-brand-700/60" />
          <View className="absolute -left-10 -bottom-10 h-24 w-24 rounded-full bg-slate-700/70" />
          <Text className="text-xs uppercase tracking-widest text-slate-300">Tambah Transaksi</Text>
          <Text className="mt-2 text-2xl font-extrabold text-white">Input Cepat</Text>
          <Text className="mt-2 text-sm text-slate-300">
            Pilih metode yang paling nyaman untuk mencatat pengeluaran atau pemasukan.
          </Text>

          <View className="mt-4 rounded-2xl bg-white/10 px-4 py-3">
            <View className="flex-row items-center">
              <View className="h-10 w-10 items-center justify-center rounded-xl bg-brand-500/30">
                <Ionicons name="pulse-outline" size={18} color="#99f6e4" />
              </View>
              <View className="ml-3">
                <Text className="text-xs uppercase tracking-wide text-slate-300">Status Uji Coba</Text>
                <Text className="mt-1 text-sm font-semibold text-white">
                  Transaksi tersimpan: {analytics.transactionsAdded}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View className="mt-3 gap-2">

          <ActionCard
            iconName="create-outline"
            title="Input Manual"
            description="Isi nominal, kategori, tanggal, dan catatan dalam satu form."
            onPress={() => navigation.navigate('ManualInput')}
          />
          <ActionCard
            iconName="scan-outline"
            title="Scan Struk (Simulasi OCR)"
            description="Ambil foto atau upload struk, lalu cek hasil data yang terdeteksi."
            onPress={() => navigation.navigate('ScanReceipt')}
          />
        </View>

        <View className="mt-4 rounded-3xl border border-slate-200 bg-white px-4 py-4">
          <View className="flex-row items-center">
            <View className="h-9 w-9 items-center justify-center rounded-full bg-brand-100">
              <Ionicons name="bulb-outline" size={18} color="#0f766e" />
            </View>
            <Text className="ml-3 text-sm font-bold text-slate-800">Tips Input Cepat</Text>
          </View>
          <Text className="mt-3 text-sm leading-6 text-slate-600">
            Gunakan Input Manual untuk catatan harian. Gunakan Scan Struk saat belanja agar data
            nominal dan kategori lebih cepat diproses.
          </Text>
        </View>

        <Text className="mt-4 text-center text-xs text-slate-500">
          Pilih salah satu metode di atas untuk lanjut mencatat transaksi.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};
