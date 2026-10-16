import { Pressable, Text, View } from "react-native";

import { Icon } from "@/components/ui/Icon";

type Props = {
  title: string;
  onSeeAll?: () => void;
};

export function SectionHeader({ title, onSeeAll }: Props) {
  return (
    <View className="mb-[10px] h-6 flex-row items-center px-4">
      <Text accessibilityRole="header" className="flex-1 font-inter-bold text-[16px] text-ink tracking-[-0.3px]">
        {title}
      </Text>
      {onSeeAll ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`See all ${title}`}
          onPress={onSeeAll}
          hitSlop={10}
          className="flex-row items-center gap-[3px] active:opacity-60"
        >
          <Text className="font-inter text-[11px] text-muted">See all</Text>
          <Icon name="chevronRight" size={9} color="#6E7C99" weight="semibold" />
        </Pressable>
      ) : null}
    </View>
  );
}
