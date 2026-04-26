import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { Image, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PrimaryButton } from '../components/PrimaryButton';
import { RootStackParamList } from '../navigation/types';
import { useFinanceStore } from '../store/useFinanceStore';
import { showFeedback } from '../utils/feedback';
import { generateScanDraft } from '../utils/scanSimulator';

type ScanReceiptScreenProps = NativeStackScreenProps<RootStackParamList, 'ScanReceipt'>;

const OCR_SIMULATION_DELAY_MS = 1300;

export const ScanReceiptScreen = ({ navigation }: ScanReceiptScreenProps) => {
  const trackFeature = useFinanceStore((state) => state.trackFeature);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      trackFeature('scan_receipt');
    }, [trackFeature])
  );

  const pickFromLibrary = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      showFeedback('Izin galeri diperlukan untuk upload struk.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.6,
      allowsEditing: false,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0]?.uri ?? null);
    }
  };

  const pickFromCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      showFeedback('Izin kamera diperlukan untuk scan struk.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.6,
      allowsEditing: false,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0]?.uri ?? null);
    }
  };

  const handleSimulateScan = () => {
    if (!imageUri) {
      showFeedback('Pilih atau ambil foto struk terlebih dahulu.');
      return;
    }

    setProcessing(true);

    setTimeout(() => {
      const draft = generateScanDraft();
      setProcessing(false);
      navigation.navigate('ScanReview', {
        draft,
        imageUri,
      });
    }, OCR_SIMULATION_DELAY_MS);
  };

  return (
    <SafeAreaView className="flex-1 bg-soft">
      <View className="flex-1 px-4 pt-4 pb-6">
        <View className="overflow-hidden rounded-3xl bg-slate-900 px-5 py-5">
          <View className="absolute -right-10 -top-8 h-24 w-24 rounded-full bg-brand-700/40" />
          <View className="absolute -left-8 -bottom-9 h-24 w-24 rounded-full bg-slate-700/60" />
          <Text className="text-xs uppercase tracking-widest text-slate-300">Scan Struk</Text>
          <Text className="mt-2 text-2xl font-extrabold text-white">Simulasi OCR</Text>
          <Text className="mt-2 text-sm text-slate-300">
            Ambil foto atau upload struk untuk membuat draft transaksi otomatis.
          </Text>
        </View>

        <View className="mt-4">
          {imageUri ? (
            <Image source={{ uri: imageUri }} className="h-64 w-full rounded-3xl" resizeMode="cover" />
          ) : (
            <View className="h-64 items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50">
              <Ionicons name="receipt-outline" size={40} color="#64748b" />
              <Text className="mt-3 text-sm font-semibold text-slate-600">Belum ada gambar struk</Text>
              <Text className="mt-1 text-xs text-slate-500">Ambil foto atau upload dari galeri</Text>
            </View>
          )}
        </View>

        <View className="mt-4 gap-2">
          <PrimaryButton
            label="Ambil Foto Struk"
            variant="secondary"
            onPress={pickFromCamera}
            icon={<Ionicons name="camera-outline" size={18} color="#334155" />}
          />
          <PrimaryButton
            label="Upload dari Galeri"
            variant="secondary"
            onPress={pickFromLibrary}
            icon={<Ionicons name="image-outline" size={18} color="#334155" />}
          />
        </View>

        <View className="mt-auto">
          <PrimaryButton
            label="Proses OCR Simulasi"
            onPress={handleSimulateScan}
            disabled={!imageUri}
            loading={processing}
            icon={<Ionicons name="scan-outline" size={18} color="#ffffff" />}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};
