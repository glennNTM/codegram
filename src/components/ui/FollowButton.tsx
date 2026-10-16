import { useState } from "react";
import { Pressable, Text } from "react-native";

type Props = {
  initialFollowing?: boolean;
  /** "sm" for the compact pills on Explore cards, "md" for the profile action row. */
  size?: "sm" | "md";
  className?: string;
};

// Local toggle for now; becomes `follows.follow` / `unfollow` with an optimistic update in Phase 7.
export function FollowButton({ initialFollowing = false, size = "sm", className = "" }: Props) {
  const [following, setFollowing] = useState(initialFollowing);
  const sizing = size === "sm" ? "h-[22px] rounded-full px-3" : "h-[34px] rounded-[10px] px-4";
  const text = size === "sm" ? "text-[10px]" : "text-[13.5px]";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: following }}
      onPress={() => setFollowing((f) => !f)}
      hitSlop={size === "sm" ? 8 : 4}
      className={`items-center justify-center active:opacity-80 ${sizing} ${following ? "bg-surface" : "bg-primary"} ${className}`}
    >
      <Text className={`font-inter-semibold ${text} ${following ? "text-ink" : "text-white"}`}>
        {following ? "Following" : "Follow"}
      </Text>
    </Pressable>
  );
}
