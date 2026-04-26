import { useState } from 'react';
import { KeyboardTypeOptions, Text, TextInput, View } from 'react-native';

interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  multiline?: boolean;
  editable?: boolean;
}

export const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  multiline = false,
  editable = true,
}: InputFieldProps) => {
  const [focused, setFocused] = useState(false);

  return (
    <View className="mb-4">
      <Text className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        editable={editable}
        multiline={multiline}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        textAlignVertical={multiline ? 'top' : 'center'}
        className={`rounded-2xl border bg-white px-4 py-3 text-[15px] text-slate-900 ${
          focused ? 'border-brand-600' : 'border-slate-300'
        } ${multiline ? 'min-h-[100px]' : ''} ${editable ? '' : 'opacity-60'}`}
        placeholderTextColor="#94a3b8"
      />
    </View>
  );
};
