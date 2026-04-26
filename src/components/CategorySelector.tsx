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
          className={`mr-2 rounded-full px-4 py-2 ${
            active ? 'bg-brand-700' : 'bg-white border border-slate-300'
          }`}
          style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
        >
          <Text className={`text-sm font-medium ${active ? 'text-white' : 'text-slate-700'}`}>
            {category}
          </Text>
        </Pressable>
      );
    })}
  </ScrollView>
);
