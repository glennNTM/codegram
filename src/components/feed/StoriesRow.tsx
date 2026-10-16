import { Pressable, ScrollView, Text, View } from "react-native";

import { RingAvatar } from "@/components/feed/RingAvatar";
import { Icon } from "@/components/ui/Icon";
import type { FeedUser } from "@/mocks/feed";

const ITEM_WIDTH = 72;
const AVATAR = 60;

type Props = {
  me: FeedUser;
  users: FeedUser[];
  onPressUser?: (user: FeedUser) => void;
  onPressMe?: () => void;
};

export function StoriesRow({ me, users, onPressUser, onPressMe }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="pl-2 pr-2"
      className="grow-0"
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Your story"
        onPress={onPressMe}
        className="mr-1 items-center active:opacity-70"
        style={{ width: ITEM_WIDTH }}
      >
        <View>
          <RingAvatar source={me.avatar} size={AVATAR} ring="muted" ringWidth={1.5} gap={1.5} />
          <View className="absolute -bottom-[1px] -right-[3px] h-[21px] w-[21px] items-center justify-center rounded-full border-2 border-white bg-primary">
            <Icon name="plus" size={11} color="#FFFFFF" weight="bold" />
          </View>
        </View>
        <Text numberOfLines={1} className="mt-[2.9px] font-inter text-[10px] leading-[12px] text-muted">
          Your story
        </Text>
      </Pressable>

      {users.map((user) => (
        <Pressable
          key={user.id}
          accessibilityRole="button"
          accessibilityLabel={`${user.username}'s story`}
          onPress={() => onPressUser?.(user)}
          className="items-center active:opacity-70"
          style={{ width: ITEM_WIDTH }}
        >
          <RingAvatar source={user.avatar} size={AVATAR} ring={user.hasStory ? "story" : "none"} />
          <Text numberOfLines={1} className="mt-[2.9px] font-inter text-[10px] leading-[12px] text-ink">
            {user.username}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}
