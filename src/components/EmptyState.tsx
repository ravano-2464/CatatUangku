import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

interface EmptyStateProps {
  title: string;
  description: string;
  iconName?: keyof typeof Ionicons.glyphMap;
}

export const EmptyState = ({
  title,
  description,
  iconName = 'document-text-outline',
}: EmptyStateProps) => (
  <View className="items-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-8">
    <View className="h-12 w-12 items-center justify-center rounded-full bg-white">
      <Ionicons name={iconName} size={22} color="#64748b" />
    </View>
    <Text className="mt-3 text-base font-bold text-slate-800">{title}</Text>
    <Text className="mt-1 text-center text-sm leading-5 text-slate-500">{description}</Text>
  </View>
);
