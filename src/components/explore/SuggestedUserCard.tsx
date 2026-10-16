import { Pressable, Text, View } from "react-native";

import { RingAvatar } from "@/components/feed/RingAvatar";
import { FollowButton } from "@/components/ui/FollowButton";
import { Icon } from "@/components/ui/Icon";
import { formatCount } from "@/lib/format";
import type { SuggestedUser } from "@/mocks/explore";

type Props = {
  user: SuggestedUser;
  onPress?: () => void;
};

// "Suggestions for you" card: centered ringed avatar with a "+" badge, names, followers, Follow.
export function SuggestedUserCard({ user, onPress }: Props) {
  return (
    <View className="w-[92px] items-center rounded-[12px] bg-background px-2 pb-[9px] pt-[6px]">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Open ${user.username}'s profile`}
        onPress={onPress}
        className="items-center active:opacity-70"
      >
        <View>
          <RingAvatar source={user.avatar} size={52} ringWidth={1.5} gap={1.5} />
          <View className="absolute bottom-[1px] right-[-2px] h-[15px] w-[15px] items-center justify-center rounded-full border-[1.5px] border-white bg-primary">
            <Icon name="plus" size={7} color="#FFFFFF" weight="bold" />
          </View>
        </View>
        <Text numberOfLines={1} className="mt-[6px] font-inter-semibold text-[11px] text-ink">
          {user.username}
        </Text>
        <Text numberOfLines={1} className="mt-[2px] font-inter text-[9px] text-muted">
          {user.displayName}
        </Text>
        <Text numberOfLines={1} className="mt-[3px] font-inter text-[9px] text-muted">
          {formatCount(user.followerCount)} followers
        </Text>
      </Pressable>
      <FollowButton className="mt-[7px] self-stretch" />
    </View>
  );
}
