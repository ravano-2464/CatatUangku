import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

interface EmptyStateProps {
  title: string;
  description: string;
}

export const EmptyState = ({ title, description }: EmptyStateProps) => (
  <View className="items-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-8">
    <View className="h-12 w-12 items-center justify-center rounded-full bg-slate-200">
      <Ionicons name="document-text-outline" size={24} color="#64748b" />
    </View>
    <Text className="mt-3 text-base font-semibold text-slate-800">{title}</Text>
    <Text className="mt-1 text-center text-sm text-slate-500">{description}</Text>
  </View>
);
