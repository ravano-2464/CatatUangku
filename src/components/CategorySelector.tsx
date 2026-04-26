import { Pressable, ScrollView, Text } from 'react-native';

interface CategorySelectorProps {
  selected: string;
  categories: string[];
  onSelect: (category: string) => void;
  disabled?: boolean;
}

export const CategorySelector = ({
  selected,
  categories,
  onSelect,
  disabled = false,
}: CategorySelectorProps) => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
    {categories.map((category) => {
      const active = category === selected;
      return (
        <Pressable
          key={category}
          onPress={() => onSelect(category)}
          disabled={disabled}
          className={`mr-2 rounded-full border px-4 py-2.5 ${
            active ? 'border-brand-700 bg-brand-700' : 'border-slate-300 bg-white'
          }`}
          style={({ pressed }) => [{ opacity: disabled ? 0.55 : pressed ? 0.82 : 1 }]}
        >
          <Text className={`text-sm font-semibold ${active ? 'text-white' : 'text-slate-700'}`}>
            {category}
          </Text>
        </Pressable>
      );
    })}
  </ScrollView>
);
