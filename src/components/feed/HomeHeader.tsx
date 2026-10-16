import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Icon, type IconName } from "@/components/ui/Icon";

type Action = {
  icon: IconName;
  label: string;
  onPress: () => void;
  dot?: boolean;
};

type Props = {
  actions: Action[];
};

// Custom header: the design puts the wordmark and the actions on one row,
// which a native large-title header can't do.
export function HomeHeader({ actions }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-row items-center bg-white pl-4 pr-3" style={{ paddingTop: insets.top, height: insets.top + 30 }}>
      <Text accessibilityRole="header" className="flex-1 font-inter-bold text-[28.5px] text-ink tracking-[-0.8px]">
        Codegram
      </Text>
      <View className="flex-row items-center gap-[15px]">
        {actions.map((action) => (
          <Pressable
            key={action.label}
            accessibilityRole="button"
            accessibilityLabel={action.label}
            onPress={action.onPress}
            hitSlop={6}
            className="h-6 w-6 items-center justify-center active:opacity-60"
          >
            <Icon name={action.icon} size={24} weight="medium" />
            {action.dot ? (
              <View className="absolute right-[-1px] top-[-2px] h-[7px] w-[7px] rounded-full bg-danger" />
            ) : null}
          </Pressable>
        ))}
      </View>
    </View>
  );
}
