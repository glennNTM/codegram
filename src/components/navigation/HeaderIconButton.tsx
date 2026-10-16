import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { Pressable } from "react-native";

type Props = {
  icon: SymbolViewProps["name"];
  accessibilityLabel: string;
  onPress: () => void;
};

// Native header action (SF Symbol). iOS 26 wraps header items in Liquid Glass automatically.
export function HeaderIconButton({ icon, accessibilityLabel, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      hitSlop={8}
      className="h-9 w-9 items-center justify-center active:opacity-60"
    >
      <SymbolView name={icon} size={22} tintColor="#0B1128" weight="medium" />
    </Pressable>
  );
}
