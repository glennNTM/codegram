import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, Text, View } from "react-native";

import { Icon } from "@/components/ui/Icon";
import type { TrendingTopic } from "@/mocks/explore";

const HEIGHT = 138;

type Props = {
  topic: TrendingTopic;
  onPress?: () => void;
};

// Photo card with a bottom scrim: title, subtitle and a chevron chip; play chip top-right.
export function TrendingCard({ topic, onPress }: Props) {
  const width = topic.featured ? 136 : 88;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${topic.title}: ${topic.subtitle}`}
      onPress={onPress}
      className="overflow-hidden rounded-[10px] bg-divider active:opacity-85"
      style={{ width, height: HEIGHT }}
    >
      <Image source={topic.cover} contentFit="cover" style={{ width, height: HEIGHT }} />
      <LinearGradient
        colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.72)"]}
        style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: HEIGHT * 0.6 }}
      />
      <View className="absolute right-[6px] top-[6px] h-[17px] w-[17px] items-center justify-center rounded-full bg-black/35">
        <Icon name="play" size={8} color="#FFFFFF" />
      </View>
      <View className="absolute bottom-[8px] left-[8px] right-[6px] flex-row items-end gap-1">
        <View className="flex-1">
          <Text numberOfLines={1} className="font-inter-bold text-[10.5px] text-white">
            {topic.title}
          </Text>
          <Text numberOfLines={2} className="mt-[2px] font-inter text-[8px] leading-[10px] text-white/90">
            {topic.subtitle}
          </Text>
        </View>
        <View className="h-[16px] w-[16px] items-center justify-center rounded-full bg-black/40">
          <Icon name="chevronRight" size={8} color="#FFFFFF" weight="bold" />
        </View>
      </View>
    </Pressable>
  );
}
