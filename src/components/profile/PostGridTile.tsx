import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";

import { Icon } from "@/components/ui/Icon";
import { formatCount } from "@/lib/format";
import type { GridPost } from "@/mocks/profile";

type Props = {
  post: GridPost;
  width: number;
  height: number;
  onPress?: () => void;
};

// Grid tile: media type glyph top-right (video / multiple), like count bottom-left.
export function PostGridTile({ post, width, height, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${post.mediaType === "video" ? "Video" : "Photo"}, ${formatCount(post.likeCount)} likes`}
      onPress={onPress}
      className="overflow-hidden rounded-[6px] bg-divider active:opacity-85"
      style={{ width, height }}
    >
      <Image source={post.thumb} contentFit="cover" style={{ width, height }} transition={150} />
      {post.mediaType !== "image" ? (
        <View className="absolute right-[6px] top-[6px]">
          <Icon name={post.mediaType === "video" ? "play" : "multiple"} size={11} color="#FFFFFF" />
        </View>
      ) : null}
      <View className="absolute bottom-[6px] left-[7px] flex-row items-center gap-[3px]">
        <Icon name="heart" size={10} color="#FFFFFF" weight="semibold" />
        <Text className="font-inter-semibold text-[10px] text-white">{formatCount(post.likeCount)}</Text>
      </View>
    </Pressable>
  );
}
