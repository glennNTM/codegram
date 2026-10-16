import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";

import { formatAgeShort } from "@/lib/format";
import type { Comment } from "@/mocks/comments";

const AVATAR = 32;

type Props = {
  comment: Comment;
  onPressAuthor: () => void;
  onLongPress: () => void;
};

// Comment row from the design system: avatar, username + body, age. Flat (no replies in v1).
export function CommentRow({ comment, onPressAuthor, onLongPress }: Props) {
  return (
    <Pressable
      onLongPress={onLongPress}
      accessibilityHint="Long press for options"
      className="flex-row gap-3 px-4 py-[9px] active:bg-surface"
    >
      <Pressable accessibilityRole="button" accessibilityLabel={comment.author.username} onPress={onPressAuthor} hitSlop={4}>
        <Image source={comment.author.avatar} contentFit="cover" style={{ width: AVATAR, height: AVATAR, borderRadius: AVATAR / 2 }} />
      </Pressable>
      <View className="flex-1">
        <Text className="font-inter text-[13px] leading-[18px] text-ink">
          <Text onPress={onPressAuthor} className="font-inter-semibold">
            {comment.author.username}
          </Text>
          {"  "}
          {comment.body}
        </Text>
        <Text className="mt-[3px] font-inter text-[11px] text-subtle">{formatAgeShort(comment.createdAt)}</Text>
      </View>
    </Pressable>
  );
}
