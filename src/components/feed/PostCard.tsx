import { useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from "react-native-reanimated";

import { PostMedia } from "@/components/feed/PostMedia";
import { RingAvatar } from "@/components/feed/RingAvatar";
import { Icon } from "@/components/ui/Icon";
import { formatAgeLong, formatAgeShort, formatCount } from "@/lib/format";
import type { FeedPost } from "@/mocks/feed";

const LIKE_RED = "#F0303F";
const DOUBLE_TAP_MS = 280;
// Non-breaking: single-line Text on web collapses regular double spaces.
const NAME_GAP = "\u00A0\u00A0";

type Props = {
  post: FeedPost;
  width: number;
  onPressAuthor?: () => void;
  onPressComments?: () => void;
  onPressMore?: () => void;
  onPressShare?: () => void;
};

export function PostCard({ post, width, onPressAuthor, onPressComments, onPressMore, onPressShare }: Props) {
  // Local optimistic state; becomes Convex mutations (likes.toggle) in Phase 8.
  const [liked, setLiked] = useState(post.viewerHasLiked);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [saved, setSaved] = useState(post.viewerHasSaved);

  const lastTap = useRef(0);
  const burst = useSharedValue(0);
  const burstStyle = useAnimatedStyle(() => ({
    opacity: burst.get(),
    transform: [{ scale: 0.6 + burst.get() * 0.4 }],
  }));

  const setLike = (next: boolean) => {
    if (next === liked) return;
    setLiked(next);
    setLikeCount((c) => c + (next ? 1 : -1));
  };

  const onMediaPress = () => {
    const now = Date.now();
    if (now - lastTap.current < DOUBLE_TAP_MS) {
      setLike(true);
      burst.set(withSequence(withSpring(1, { damping: 12, stiffness: 260 }), withTiming(0, { duration: 350 })));
    }
    lastTap.current = now;
  };

  return (
    <View className="bg-white pb-[13px] pt-[9.5px]">
      {/* Header */}
      <View className="h-[34px] flex-row items-center pl-[15px] pr-[13px]">
        <Pressable accessibilityRole="button" onPress={onPressAuthor} className="flex-1 flex-row items-center gap-[10px]">
          <RingAvatar source={post.author.avatar} size={post.author.hasStory ? 37 : 34} ring={post.author.hasStory ? "story" : "none"} ringWidth={1.5} gap={1.5} />
          <View className="flex-1">
            <View className="flex-row items-center gap-1">
              <Text className="font-inter-semibold text-[12px] text-ink">{post.author.username}</Text>
              {post.author.verified ? <Icon name="verified" size={11} color="#1F74FD" /> : null}
            </View>
            <Text numberOfLines={1} className="mt-[2px] font-inter text-[10px] text-muted">
              {post.location ? `${post.location} · ` : ""}
              {formatAgeShort(post.createdAt)}
            </Text>
          </View>
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel="More options" onPress={onPressMore} hitSlop={10}>
          <Icon name="more" size={20} color="#5B6478" weight="bold" />
        </Pressable>
      </View>

      {/* Media + double-tap like */}
      <Pressable onPress={onMediaPress} className="mt-[6.8px]" accessibilityHint="Double tap to like">
        <PostMedia media={post.media} width={width} />
        <Animated.View
          pointerEvents="none"
          style={[{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, alignItems: "center", justifyContent: "center" }, burstStyle]}
        >
          <Icon name="heartFill" size={96} color="#FFFFFF" />
        </Animated.View>
      </Pressable>

      {/* Actions */}
      <View className="mt-2 h-[26px] flex-row items-center pl-[15px] pr-[13px]">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={liked ? "Unlike" : "Like"}
          onPress={() => setLike(!liked)}
          hitSlop={6}
          className="flex-row items-center gap-[6px]"
        >
          <Icon name={liked ? "heartFill" : "heart"} size={25} color={liked ? LIKE_RED : "#0B1128"} weight="medium" />
          <Text className="font-inter-medium text-[11px] text-ink">{formatCount(likeCount)}</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Comments"
          onPress={onPressComments}
          hitSlop={6}
          className="ml-[14px] flex-row items-center gap-[2px]"
        >
          <Icon name="comment" size={24} weight="medium" />
          <Text className="font-inter-medium text-[11px] text-ink">{formatCount(post.commentCount)}</Text>
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel="Share" onPress={onPressShare} hitSlop={6} className="ml-3">
          <Icon name="send" size={23} weight="medium" />
        </Pressable>
        <View className="flex-1" />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={saved ? "Remove from saved" : "Save"}
          onPress={() => setSaved((s) => !s)}
          hitSlop={6}
        >
          <Icon name={saved ? "bookmarkFill" : "bookmark"} size={24} weight="medium" />
        </Pressable>
      </View>

      {/* Caption, comments preview, meta */}
      <View className="mt-[8.3px] px-[18px]">
        <Text className="font-inter text-[11.25px] leading-[17px] text-ink">
          <Text className="font-inter-semibold">{post.author.username}</Text>
          {NAME_GAP}
          {post.caption}
        </Text>

        {post.commentCount > 0 ? (
          <Text onPress={onPressComments} className="mt-1 font-inter text-[11px] leading-[16px] text-subtle">
            View all {post.commentCount} comments
          </Text>
        ) : null}

        {post.previewComments.length > 0 ? (
          <View className="mt-[6.5px] gap-[2.2px]">
            {post.previewComments.map((c) => (
              <Text key={c.id} numberOfLines={1} className="font-inter text-[11px] leading-[17px] text-ink">
                <Text className="font-inter-semibold">{c.username}</Text>
                {NAME_GAP}
                {c.body}
              </Text>
            ))}
          </View>
        ) : null}

        <Text className="mt-[7.7px] font-inter text-[9px] leading-[13px] text-subtle">
          {formatAgeLong(post.createdAt)}
          {" · "}
          <Text className="font-inter-medium text-ink">See translation</Text>
        </Text>
      </View>
    </View>
  );
}
