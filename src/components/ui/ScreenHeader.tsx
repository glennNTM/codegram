import type { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Icon } from "@/components/ui/Icon";

type Props = {
  title?: string;
  onBack?: () => void;
  /** Trailing action (e.g. a Share button). */
  right?: ReactNode;
  /** Pads for the status bar; off inside sheets and modals that start below it. */
  safeTop?: boolean;
};

// Compact custom header from the design: back chevron, centered title, optional trailing action.
export function ScreenHeader({ title, onBack, right, safeTop = true }: Props) {
  const insets = useSafeAreaInsets();
  const top = safeTop ? insets.top : 0;

  return (
    <View className="flex-row items-center bg-white px-2" style={{ paddingTop: top, height: top + 52 }}>
      <View className="w-12 items-start">
        {onBack ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back"
            onPress={onBack}
            hitSlop={8}
            className="h-11 w-10 items-center justify-center active:opacity-60"
          >
            <Icon name="chevronLeft" size={18} weight="semibold" />
          </Pressable>
        ) : null}
      </View>
      <Text accessibilityRole="header" numberOfLines={1} className="flex-1 text-center font-inter-semibold text-[16px] text-ink">
        {title}
      </Text>
      <View className="w-12 items-end pr-2">{right}</View>
    </View>
  );
}
