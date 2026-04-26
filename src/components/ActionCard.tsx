import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

interface ActionCardProps {
  iconName: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  onPress: () => void;
}

export const ActionCard = ({ iconName, title, description, onPress }: ActionCardProps) => (
  <Pressable
    onPress={onPress}
    className="min-h-[162px] rounded-3xl border border-slate-200 bg-white p-4"
    style={({ pressed }) => [
      {
        shadowColor: '#0f172a',
        shadowOpacity: 0.06,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 8 },
        elevation: 2,
      },
      {
        opacity: pressed ? 0.92 : 1,
        transform: [{ scale: pressed ? 0.98 : 1 }],
      },
    ]}
  >
    <View className="flex-row items-center justify-between">
      <View className="h-12 w-12 items-center justify-center rounded-2xl bg-brand-100">
        <Ionicons name={iconName} size={22} color="#0f766e" />
      </View>
      <View className="h-8 w-8 items-center justify-center rounded-full bg-slate-100">
        <Ionicons name="chevron-forward" size={18} color="#64748b" />
      </View>
    </View>
    <Text className="mt-4 text-base font-bold text-slate-900">{title}</Text>
    <Text className="mt-1 text-sm leading-5 text-slate-500">{description}</Text>
  </Pressable>
);
