import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";

import { Icon } from "@/components/ui/Icon";
import { formatCount, formatDuration } from "@/lib/format";
import type { Reel } from "@/mocks/explore";

const WIDTH = 79;
const HEIGHT = 117;

type Props = {
  reel: Reel;
  onPress?: () => void;
};

export function ReelTile({ reel, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Reel, ${formatDuration(reel.durationMs)}, ${formatCount(reel.likeCount)} likes`}
      onPress={onPress}
      className="overflow-hidden rounded-[8px] bg-divider active:opacity-85"
      style={{ width: WIDTH, height: HEIGHT }}
    >
      <Image source={reel.thumb} contentFit="cover" style={{ width: WIDTH, height: HEIGHT }} />
      <View className="absolute left-[5px] top-[5px] rounded-full bg-black/45 px-[5px] py-[1px]">
        <Text className="font-inter-medium text-[8px] text-white">{formatDuration(reel.durationMs)}</Text>
      </View>
      <View className="absolute right-[6px] top-[6px]">
        <Icon name="play" size={10} color="#FFFFFF" />
      </View>
      <View className="absolute bottom-[6px] left-[7px] flex-row items-center gap-[3px]">
        <Icon name="heartFill" size={9} color="#FFFFFF" />
        <Text className="font-inter-semibold text-[9px] text-white">{formatCount(reel.likeCount)}</Text>
      </View>
    </Pressable>
  );
}
