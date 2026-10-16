import { router } from "expo-router";
import { useState, type ReactNode } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AccountCard } from "@/components/explore/AccountCard";
import { ReelTile } from "@/components/explore/ReelTile";
import { SearchResults } from "@/components/explore/SearchResults";
import { SectionHeader } from "@/components/explore/SectionHeader";
import { SuggestedUserCard } from "@/components/explore/SuggestedUserCard";
import { TrendingCard } from "@/components/explore/TrendingCard";
import { Icon } from "@/components/ui/Icon";
import { SearchField } from "@/components/ui/SearchField";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { accountsToFollow, popularReels, suggestedUsers, trendingTopics } from "@/mocks/explore";

const SCOPES = [
  { value: "people", label: "People" },
  { value: "places", label: "Places" },
] as const;

type Scope = (typeof SCOPES)[number]["value"];

const openProfile = (username: string) => router.push({ pathname: "/user/[username]", params: { username } });

// UI on mock data; swaps to `posts.explore` + `users.search` in Phase 9.
export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState<Scope>("people");
  const searching = query.trim().length > 0;

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{ paddingTop: insets.top + 6, paddingBottom: 24 }}
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* Header: the design pairs the large title with a profile shortcut, so it's drawn in-screen. */}
      <View className="flex-row items-center px-4">
        <Text accessibilityRole="header" className="flex-1 font-inter-bold text-[32px] text-ink tracking-[-0.8px]">
          Explore
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Your profile"
          onPress={() => router.navigate("/profile")}
          className="h-[32px] w-[32px] items-center justify-center rounded-full border border-divider bg-white active:opacity-70"
          style={{ boxShadow: "0px 1px 3px rgba(16, 24, 40, 0.06)" }}
        >
          <Icon name="person" size={16} weight="medium" />
        </Pressable>
      </View>

      <View className="mt-[10px] gap-[10px] px-4">
        <SearchField value={query} onChangeText={setQuery} placeholder="Search people and places…" />
        <SegmentedControl options={SCOPES} value={scope} onChange={setScope} />
      </View>

      {searching ? (
        <View className="mt-3">
          <SearchResults query={query} scope={scope} onPressUser={(u) => openProfile(u.username)} />
        </View>
      ) : (
        <>
          <View className="mt-[22px]">
            <SectionHeader title="Suggested for you" />
            <HorizontalRail gap={8}>
              {suggestedUsers.map((user) => (
                <SuggestedUserCard key={user.id} user={user} onPress={() => openProfile(user.username)} />
              ))}
            </HorizontalRail>
          </View>

          <View className="mt-[22px]">
            <SectionHeader title="Trending" />
            <HorizontalRail gap={6}>
              {trendingTopics.map((topic) => (
                <TrendingCard key={topic.id} topic={topic} />
              ))}
            </HorizontalRail>
          </View>

          <View className="mt-[22px]">
            <SectionHeader title="Popular reels" />
            <HorizontalRail gap={6}>
              {popularReels.map((reel) => (
                <ReelTile key={reel.id} reel={reel} />
              ))}
            </HorizontalRail>
          </View>

          <View className="mt-[22px]">
            <SectionHeader title="Accounts to follow" />
            <HorizontalRail gap={8}>
              {accountsToFollow.map((user) => (
                <AccountCard key={user.id} user={user} onPress={() => openProfile(user.username)} />
              ))}
            </HorizontalRail>
          </View>
        </>
      )}
    </ScrollView>
  );
}

function HorizontalRail({ gap, children }: { gap: number; children: ReactNode }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="grow-0"
      contentContainerStyle={{ paddingHorizontal: 16, gap }}
    >
      {children}
    </ScrollView>
  );
}
