import { router } from "expo-router";
import { useMemo } from "react";
import { FlatList, useWindowDimensions, View } from "react-native";

import { HomeHeader } from "@/components/feed/HomeHeader";
import { PostCard } from "@/components/feed/PostCard";
import { StoriesRow } from "@/components/feed/StoriesRow";
import { currentUser, getMockFeed, storyUsers } from "@/mocks/feed";

// UI on mock data; swaps to the paginated Convex feed (usePaginatedQuery) in Phase 7.
export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const posts = useMemo(() => getMockFeed(), []);

  return (
    <View className="flex-1 bg-white">
      <HomeHeader
        actions={[
          { icon: "plusSquare", label: "New post", onPress: () => router.push("/create") },
          { icon: "heart", label: "Likes", onPress: () => router.push("/activity") },
          { icon: "bell", label: "Notifications", onPress: () => router.push("/activity"), dot: true },
        ]}
      />
      <FlatList
        data={posts}
        keyExtractor={(p) => p.id}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View className="border-b border-divider pb-[10.3px] pt-[13px]">
            <StoriesRow me={currentUser} users={storyUsers} />
          </View>
        }
        ItemSeparatorComponent={() => <View className="h-px bg-divider" />}
        renderItem={({ item }) => <PostCard post={item} width={width} />}
      />
    </View>
  );
}
