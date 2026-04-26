import { ReactNode } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  icon?: ReactNode;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-brand-700 border border-brand-700',
  secondary: 'bg-slate-50 border border-slate-300',
  ghost: 'bg-soft border border-slate-200',
};

const textClasses: Record<ButtonVariant, string> = {
  primary: 'text-white',
  secondary: 'text-slate-800',
  ghost: 'text-slate-600',
};

export const PrimaryButton = ({
  label,
  onPress,
  icon,
  variant = 'primary',
  disabled = false,
  loading = false,
}: PrimaryButtonProps) => {
  const isDisabled = disabled || loading;
  const hasPrimaryShadow = variant === 'primary' && !isDisabled;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={`min-h-[54px] rounded-2xl items-center justify-center px-4 ${variantClasses[variant]}`}
      style={({ pressed }) => [
        hasPrimaryShadow && {
          shadowColor: '#134e4a',
          shadowOpacity: 0.2,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 8 },
          elevation: 4,
        },
        {
          opacity: isDisabled ? 0.5 : pressed ? 0.86 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
      ]}
    >
      <View className="flex-row items-center gap-2">
        {loading ? (
          <ActivityIndicator color={variant === 'primary' ? '#ffffff' : '#334155'} />
        ) : (
          icon
        )}
        <Text className={`text-[15px] font-extrabold tracking-wide ${textClasses[variant]}`}>{label}</Text>
      </View>
    </Pressable>
  );
};
