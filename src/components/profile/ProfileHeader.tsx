import { Image } from "expo-image";
import { Fragment } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { FollowButton } from "@/components/ui/FollowButton";
import { Icon, type IconName } from "@/components/ui/Icon";
import { formatCount } from "@/lib/format";
import type { Profile } from "@/mocks/profile";

const BANNER_HEIGHT = 86;
const AVATAR = 80;
const AVATAR_OVERLAP = 48;

type Props = {
  profile: Profile;
  isMe: boolean;
  onBack?: () => void;
  onPressSettings?: () => void;
  onPressMore?: () => void;
  onPressEdit?: () => void;
  onPressMessage?: () => void;
  onPressShare?: () => void;
  onPressSuggestions?: () => void;
};

export function ProfileHeader({
  profile,
  isMe,
  onBack,
  onPressSettings,
  onPressMore,
  onPressEdit,
  onPressMessage,
  onPressShare,
  onPressSuggestions,
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View className="bg-white" style={{ paddingTop: insets.top + 4 }}>
      {/* Cover + floating actions */}
      <View className="mx-1 overflow-hidden rounded-b-[16px] rounded-t-[12px] bg-divider" style={{ height: BANNER_HEIGHT }}>
        <Image source={profile.cover} contentFit="cover" style={{ width: "100%", height: BANNER_HEIGHT }} />
        {onBack ? (
          <View className="absolute left-[10px] top-[10px]">
            <BannerButton icon="chevronLeft" label="Back" onPress={onBack} />
          </View>
        ) : null}
        <View className="absolute right-[10px] top-[10px] flex-row gap-2">
          {isMe ? <BannerButton icon="gear" label="Settings" onPress={onPressSettings} /> : null}
          <BannerButton icon="more" label="More options" onPress={onPressMore} />
        </View>
      </View>

      {/* Avatar overlapping the cover */}
      <View className="ml-3 self-start" style={{ marginTop: -AVATAR_OVERLAP }}>
        <View
          className="items-center justify-center rounded-full bg-white"
          style={{ width: AVATAR, height: AVATAR, boxShadow: "0px 2px 8px rgba(16, 24, 40, 0.12)" }}
        >
          <Image
            source={profile.avatar}
            contentFit="cover"
            style={{ width: AVATAR - 6, height: AVATAR - 6, borderRadius: (AVATAR - 6) / 2 }}
          />
        </View>
        {isMe ? (
          <View className="absolute bottom-[2px] right-[-2px] h-[20px] w-[20px] items-center justify-center rounded-full border-2 border-white bg-primary">
            <Icon name="plus" size={9} color="#FFFFFF" weight="bold" />
          </View>
        ) : null}
      </View>

      <View className="px-4">
        {/* Identity */}
        <View className="mt-2 flex-row items-center gap-[6px]">
          <Text className="font-inter-bold text-[22px] text-ink tracking-[-0.5px]">{profile.username}</Text>
          {profile.verified ? <Icon name="verified" size={16} color="#1F74FD" /> : null}
        </View>
        <Text className="mt-[2px] font-inter text-[13px] text-ink">{profile.displayName}</Text>
        {profile.tags.length > 0 ? (
          <Text className="mt-[3px] font-inter text-[11.5px] text-muted">
            {profile.tags.map((tag, i) => (
              <Fragment key={tag.label}>
                {i > 0 ? "  •  " : ""}
                {tag.label}
              </Fragment>
            ))}
          </Text>
        ) : null}
        {profile.bio ? (
          <Text className="mt-[10px] font-inter text-[12px] leading-[17px] text-ink">{profile.bio}</Text>
        ) : null}

        {profile.location || profile.website ? (
          <View className="mt-[9px] flex-row items-center gap-4">
            {profile.location ? (
              <View className="flex-row items-center gap-[5px]">
                <Icon name="location" size={11} color="#6E7C99" />
                <Text className="font-inter text-[11px] text-muted">{profile.location}</Text>
              </View>
            ) : null}
            {profile.website ? (
              <View className="flex-row items-center gap-[5px]">
                <Icon name="link" size={11} color="#1F6FFB" />
                <Text className="font-inter text-[11px] text-link">{profile.website}</Text>
              </View>
            ) : null}
          </View>
        ) : null}

        {/* Counts */}
        <View className="mt-[14px] flex-row">
          <Stat value={profile.postCount} label="posts" />
          <Stat value={profile.followerCount} label="followers" />
          <Stat value={profile.followingCount} label="following" />
        </View>

        {/* Actions */}
        <View className="mt-[14px] flex-row gap-2">
          {isMe ? (
            <SecondaryButton label="Edit profile" onPress={onPressEdit} />
          ) : (
            <FollowButton size="md" initialFollowing={profile.viewerIsFollowing} className="flex-1" />
          )}
          {isMe ? <SecondaryButton label="Share profile" onPress={onPressShare} /> : <SecondaryButton label="Message" onPress={onPressMessage} />}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Suggested accounts"
            onPress={onPressSuggestions}
            className="h-[34px] w-[34px] items-center justify-center rounded-[10px] border border-divider bg-white active:opacity-70"
          >
            <Icon name="personAdd" size={15} weight="medium" />
          </Pressable>
        </View>
      </View>

      {/* Highlights */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mt-[16px] grow-0"
        contentContainerStyle={{ paddingHorizontal: 12, gap: 14 }}
      >
        {isMe ? (
          <View className="items-center">
            <View className="h-[50px] w-[50px] items-center justify-center rounded-full border border-border bg-white">
              <Icon name="plus" size={20} weight="regular" />
            </View>
            <Text className="mt-[5px] font-inter text-[10px] text-ink">New</Text>
          </View>
        ) : null}
        {profile.highlights.map((h) => (
          <View key={h.id} className="items-center">
            <View className="h-[50px] w-[50px] items-center justify-center rounded-full border border-border bg-white">
              <Image source={h.cover} contentFit="cover" style={{ width: 44, height: 44, borderRadius: 22 }} />
            </View>
            <Text numberOfLines={1} className="mt-[5px] font-inter text-[10px] text-ink">
              {h.title}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function BannerButton({ icon, label, onPress }: { icon: IconName; label: string; onPress?: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      hitSlop={6}
      className="h-[30px] w-[30px] items-center justify-center rounded-full bg-white/90 active:opacity-70"
    >
      <Icon name={icon} size={14} weight="semibold" />
    </Pressable>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <View className="flex-1">
      <Text className="font-inter-bold text-[14px] text-ink">{formatCount(value)}</Text>
      <Text className="mt-[1px] font-inter text-[10.5px] text-muted">{label}</Text>
    </View>
  );
}

function SecondaryButton({ label, onPress }: { label: string; onPress?: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className="h-[34px] flex-1 items-center justify-center rounded-[10px] bg-surface active:opacity-70"
    >
      <Text className="font-inter-semibold text-[13.5px] text-ink">{label}</Text>
    </Pressable>
  );
}
