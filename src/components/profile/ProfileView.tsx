import { router } from "expo-router";
import type { SymbolViewProps } from "expo-symbols";
import { useState } from "react";
import { FlatList, Pressable, Share, Text, useWindowDimensions, View } from "react-native";

import { EmptyState } from "@/components/EmptyState";
import { PostGridTile } from "@/components/profile/PostGridTile";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { Icon, type IconName } from "@/components/ui/Icon";
import type { GridPost, Profile } from "@/mocks/profile";

const COLUMNS = 3;
const GRID_PADDING = 6;
const GRID_GAP = 5;
// Tiles in the design are slightly wider than tall.
const TILE_ASPECT = 1.17;

type Tab = "posts" | "reels" | "saved" | "tagged";

const TABS: { value: Tab; label: string; icon: IconName }[] = [
  { value: "posts", label: "Posts", icon: "grid" },
  { value: "reels", label: "Reels", icon: "reels" },
  { value: "saved", label: "Saved", icon: "bookmark" },
  { value: "tagged", label: "Tagged", icon: "tagged" },
];

const EMPTY: Record<Tab, { icon: SymbolViewProps["name"]; title: string }> = {
  posts: { icon: "camera", title: "No posts yet" },
  reels: { icon: "play.rectangle", title: "No reels yet" },
  saved: { icon: "bookmark", title: "Nothing saved yet" },
  tagged: { icon: "person.crop.square", title: "No tagged posts" },
};

type Props = {
  profile: Profile;
  isMe: boolean;
  onBack?: () => void;
  onPressMore?: () => void;
  onPressMessage?: () => void;
};

function postsFor(profile: Profile, tab: Tab): GridPost[] {
  switch (tab) {
    case "posts":
      return profile.posts;
    case "reels":
      return profile.posts.filter((p) => p.mediaType === "video");
    case "saved":
      return profile.saved;
    case "tagged":
      return profile.tagged;
  }
}

// Shared by the Profile tab (isMe) and user/[username]. Mock data until `users.getByUsername` +
// `posts.listByAuthor` land in Phase 5; "Saved" only shows on your own profile.
export function ProfileView({ profile, isMe, onBack, onPressMore, onPressMessage }: Props) {
  const { width } = useWindowDimensions();
  const [tab, setTab] = useState<Tab>("posts");
  const tabs = isMe ? TABS : TABS.filter((t) => t.value !== "saved");
  const posts = postsFor(profile, tab);

  const tileWidth = (width - GRID_PADDING * 2 - GRID_GAP * (COLUMNS - 1)) / COLUMNS;
  const tileHeight = Math.round(tileWidth / TILE_ASPECT);

  return (
    <FlatList
      className="flex-1 bg-white"
      data={posts}
      numColumns={COLUMNS}
      keyExtractor={(p) => p.id}
      showsVerticalScrollIndicator={false}
      columnWrapperStyle={{ gap: GRID_GAP, paddingHorizontal: GRID_PADDING }}
      contentContainerStyle={{ gap: GRID_GAP, paddingBottom: 24 }}
      ListHeaderComponent={
        <View>
          <ProfileHeader
            profile={profile}
            isMe={isMe}
            onBack={onBack}
            onPressMore={onPressMore}
            onPressSettings={() => router.push("/profile/settings")}
            onPressEdit={() => router.push("/profile/edit")}
            onPressMessage={onPressMessage}
            onPressShare={() => Share.share({ message: `Follow @${profile.username} on Codegram` })}
            onPressSuggestions={() => router.navigate("/explore")}
          />
          <View accessibilityRole="tablist" className="mt-[18px] h-[44px] flex-row border-b border-divider px-2">
            {tabs.map((t) => {
              const selected = t.value === tab;
              const color = selected ? "#1F74FD" : "#6E7C99";
              return (
                <Pressable
                  key={t.value}
                  accessibilityRole="tab"
                  accessibilityState={{ selected }}
                  accessibilityLabel={t.label}
                  onPress={() => setTab(t.value)}
                  className="flex-1 flex-row items-center justify-center gap-[6px]"
                >
                  <Icon name={t.icon} size={15} color={color} weight={selected ? "semibold" : "regular"} />
                  <Text className={`text-[11.5px] ${selected ? "font-inter-semibold text-primary" : "font-inter text-muted"}`}>
                    {t.label}
                  </Text>
                  {selected ? <View className="absolute bottom-[-1px] left-3 right-3 h-[2px] rounded-full bg-primary" /> : null}
                </Pressable>
              );
            })}
          </View>
          <View className="h-[3px]" />
        </View>
      }
      ListEmptyComponent={<EmptyState icon={EMPTY[tab].icon} title={EMPTY[tab].title} />}
      renderItem={({ item }) => (
        <PostGridTile
          post={item}
          width={tileWidth}
          height={tileHeight}
          onPress={() => router.push({ pathname: "/post/[postId]", params: { postId: item.id, author: profile.username } })}
        />
      )}
    />
  );
}
