import { router } from "expo-router";
import { FlatList, Share, useWindowDimensions, View } from "react-native";

import { HomeHeader } from "@/components/feed/HomeHeader";
import { PostCard } from "@/components/feed/PostCard";
import { StoriesRow } from "@/components/feed/StoriesRow";
import { openPostMenu } from "@/lib/menus";
import { useHasUnreadActivity } from "@/mocks/activity";
import { currentUser, storyUsers } from "@/mocks/feed";
import { useFeedPosts } from "@/mocks/posts";
import { useMyProfile } from "@/mocks/profile";

// UI on mock data; swaps to the paginated Convex feed (usePaginatedQuery) in Phase 7.
export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const posts = useFeedPosts();
  const me = useMyProfile();
  const hasUnreadActivity = useHasUnreadActivity();

  return (
    <View className="flex-1 bg-white">
      <HomeHeader
        actions={[
          { icon: "plusSquare", label: "New post", onPress: () => router.push("/create") },
          { icon: "heart", label: "Likes", onPress: () => router.push("/activity") },
          { icon: "bell", label: "Notifications", onPress: () => router.push("/activity"), dot: hasUnreadActivity },
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
        renderItem={({ item }) => (
          <PostCard
            post={item}
            width={width}
            onPressAuthor={() => router.push({ pathname: "/user/[username]", params: { username: item.author.username } })}
            onPressComments={() => router.push({ pathname: "/post/[postId]", params: { postId: item.id } })}
            onPressMore={() => openPostMenu(item, item.author.username === me.username)}
            onPressShare={() => Share.share({ message: `Check out this post by @${item.author.username} on Codegram` })}
          />
        )}
      />
    </View>
  );
}
