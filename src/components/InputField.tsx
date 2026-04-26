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
}: InputFieldProps) => (
  <View className="mb-4">
    <Text className="mb-2 text-sm font-semibold text-slate-700">{label}</Text>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      keyboardType={keyboardType}
      editable={editable}
      multiline={multiline}
      textAlignVertical={multiline ? 'top' : 'center'}
      className={`rounded-xl border border-slate-300 bg-white px-4 py-3 text-[15px] text-slate-900 ${
        multiline ? 'min-h-[100px]' : ''
      } ${editable ? '' : 'opacity-60'}`}
      placeholderTextColor="#94a3b8"
    />
  </View>
);
