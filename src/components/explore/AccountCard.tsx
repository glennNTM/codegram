import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";

import { FollowButton } from "@/components/ui/FollowButton";
import { Icon } from "@/components/ui/Icon";
import { formatCount } from "@/lib/format";
import type { SuggestedUser } from "@/mocks/explore";

type Props = {
  user: SuggestedUser;
  onPress?: () => void;
};

// "Accounts to follow" card: left-aligned avatar with a verified badge, category, followers, Follow.
export function AccountCard({ user, onPress }: Props) {
  return (
    <View className="w-[98px] rounded-[12px] border border-divider bg-white px-[7px] pb-[8px] pt-[6px]">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Open ${user.username}'s profile`}
        onPress={onPress}
        className="active:opacity-70"
      >
        <View className="self-start">
          <View className="h-[32px] w-[32px] items-center justify-center rounded-full border-[1.5px] border-primary">
            <Image source={user.avatar} style={{ width: 27, height: 27, borderRadius: 13.5 }} contentFit="cover" />
          </View>
          {user.verified ? (
            <View className="absolute bottom-[-1px] right-[-3px] rounded-full bg-white p-[1px]">
              <Icon name="verified" size={10} color="#1F74FD" />
            </View>
          ) : null}
        </View>
        <Text numberOfLines={1} className="mt-[6px] font-inter-semibold text-[10px] text-ink">
          {user.username}
        </Text>
        {user.category ? (
          <Text numberOfLines={1} className="mt-[3px] font-inter text-[8px] text-muted">
            {user.category}
          </Text>
        ) : null}
        <Text numberOfLines={1} className="mt-[2px] font-inter text-[8px] text-muted">
          {formatCount(user.followerCount)} followers
        </Text>
      </Pressable>
      <FollowButton className="mt-[7px]" />
    </View>
  );
}
