import { Ionicons } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback } from 'react';
import { Text, View } from 'react-native';
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
    <SafeAreaView className="flex-1 bg-slate-100" edges={['top']}>
      <View className="flex-1 px-4 pt-4">
        <Text className="text-2xl font-bold text-slate-900">Tambah Transaksi</Text>
        <Text className="mt-1 text-sm text-slate-500">
          Maksimal 3 tap ke fitur utama: pilih metode input yang paling cepat.
        </Text>

        <View className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
          <View className="flex-row items-center">
            <View className="h-10 w-10 items-center justify-center rounded-lg bg-cyan-50">
              <Ionicons name="pulse-outline" size={18} color="#0f766e" />
            </View>
            <View className="ml-3">
              <Text className="text-sm font-semibold text-slate-800">Status Testing</Text>
              <Text className="text-xs text-slate-500">
                Total transaksi disimpan: {analytics.transactionsAdded}
              </Text>
            </View>
          </View>
        </View>

        <View className="mt-5 gap-3">
          <ActionCard
            iconName="create-outline"
            title="Input Manual"
            description="Isi nominal, kategori, tanggal, dan catatan secara cepat."
            onPress={() => navigation.navigate('ManualInput')}
          />
          <ActionCard
            iconName="scan-outline"
            title="Scan Struk (Simulasi OCR)"
            description="Upload atau ambil foto struk lalu review hasil deteksi."
            onPress={() => navigation.navigate('ScanReceipt')}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};
