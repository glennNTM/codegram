import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";

import { FollowButton } from "@/components/ui/FollowButton";
import { formatAgeShort } from "@/lib/format";
import type { ActivityItem } from "@/mocks/activity";

const AVATAR = 44;
const THUMB = 44;

const TEXT: Record<ActivityItem["type"], string> = {
  like: "liked your post.",
  comment: "commented:",
  follow: "started following you.",
};

type Props = {
  item: ActivityItem;
  onPressActor: () => void;
  onPress: () => void;
};

// Notification row (design #14): avatar, "username action", age; a Follow button for follows,
// the post thumbnail for likes and comments. Unread rows get a light tint.
export function ActivityRow({ item, onPressActor, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className={`flex-row items-center gap-3 px-4 py-[10px] active:opacity-80 ${item.read ? "" : "bg-info-surface"}`}
    >
      <Pressable accessibilityRole="button" accessibilityLabel={item.actor.username} onPress={onPressActor} hitSlop={4}>
        <Image source={item.actor.avatar} contentFit="cover" style={{ width: AVATAR, height: AVATAR, borderRadius: AVATAR / 2 }} />
      </Pressable>

      <Text className="flex-1 font-inter text-[13.5px] leading-[19px] text-ink">
        <Text onPress={onPressActor} className="font-inter-semibold">
          {item.actor.username}
        </Text>{" "}
        <Text className="text-muted">{TEXT[item.type]}</Text>
        {item.commentBody ? ` “${item.commentBody}”` : ""}{" "}
        <Text className="text-subtle">{formatAgeShort(item.createdAt)}</Text>
      </Text>

      {item.type === "follow" ? (
        <FollowButton size="md" />
      ) : item.post ? (
        <Image source={item.post.thumb} contentFit="cover" style={{ width: THUMB, height: THUMB, borderRadius: 6 }} />
      ) : (
        <View />
      )}
    </Pressable>
  );
}
