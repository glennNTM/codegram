import { Pressable, TextInput, View } from "react-native";

import { Icon } from "@/components/ui/Icon";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  /** "sm": compact pill (Explore). "lg": taller rounded field (Messages). */
  size?: "sm" | "lg";
};

const SIZES = {
  sm: { box: "h-[32px] gap-2 rounded-full pl-3 pr-2", icon: 14, text: "text-[13px]" },
  lg: { box: "h-[42px] gap-[10px] rounded-[12px] pl-[14px] pr-3", icon: 17, text: "text-[14.5px]" },
} as const;

export function SearchField({ value, onChangeText, placeholder, size = "sm" }: Props) {
  const s = SIZES[size];
  return (
    <View className={`flex-row items-center bg-surface ${s.box}`}>
      <Icon name="search" size={s.icon} color="#6E7C99" weight="medium" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#8491AC"
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        clearButtonMode="never"
        accessibilityLabel="Search"
        className={`flex-1 font-inter text-ink ${s.text}`}
      />
      {value ? (
        <Pressable accessibilityRole="button" accessibilityLabel="Clear search" onPress={() => onChangeText("")} hitSlop={8}>
          <Icon name="clear" size={15} color="#8491AC" />
        </Pressable>
      ) : null}
    </View>
  );
}
