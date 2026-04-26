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
    className="rounded-2xl border border-slate-200 bg-white p-4"
    style={({ pressed }) => [
      {
        opacity: pressed ? 0.85 : 1,
        transform: [{ scale: pressed ? 0.98 : 1 }],
      },
    ]}
  >
    <View className="h-12 w-12 items-center justify-center rounded-xl bg-cyan-50">
      <Ionicons name={iconName} size={22} color="#0f766e" />
    </View>
    <Text className="mt-4 text-base font-semibold text-slate-900">{title}</Text>
    <Text className="mt-1 text-sm text-slate-500">{description}</Text>
  </Pressable>
);
