import { router, useLocalSearchParams } from "expo-router";
import { Alert, FlatList, KeyboardAvoidingView, Pressable, Share, Text, useWindowDimensions, View } from "react-native";

import { EmptyState } from "@/components/EmptyState";
import { PostCard } from "@/components/feed/PostCard";
import { CommentComposer } from "@/components/post/CommentComposer";
import { CommentRow } from "@/components/post/CommentRow";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { confirmReport, openPostMenu } from "@/lib/menus";
import { addComment, removeComment, useComments, type Comment } from "@/mocks/comments";
import { useMockPost } from "@/mocks/posts";
import { useMyProfile } from "@/mocks/profile";

const openProfile = (username: string) => router.push({ pathname: "/user/[username]", params: { username } });

// Post details (design #9): the post, its comments newest first, and an "Add a comment" bar.
// On the root stack so it covers the tab bar. Mock data until `posts.get` +
// `comments.listByPost` / `add` / `remove` (Phases 6 and 8).
export default function PostDetailsScreen() {
  const { postId, author } = useLocalSearchParams<{ postId: string; author?: string }>();
  const { width } = useWindowDimensions();
  const me = useMyProfile();
  const post = useMockPost(postId, author);
  const comments = useComments(postId);

  if (!post) {
    return (
      <View className="flex-1 bg-white">
        <ScreenHeader onBack={() => router.back()} />
        <EmptyState icon="photo" title="Post not available" message="It may have been deleted.">
          <Pressable
            accessibilityRole="button"
            onPress={() => router.back()}
            className="mt-3 h-11 items-center justify-center rounded-full border border-border bg-white px-6 active:opacity-80"
          >
            <Text className="font-inter-medium text-[14px] text-ink">Go back</Text>
          </Pressable>
        </EmptyState>
      </View>
    );
  }

  const isMine = post.author.username === me.username;

  // Comment author can delete their comment; the post owner can delete any comment on it.
  const onCommentOptions = (comment: Comment) => {
    const canDelete = comment.author.username === me.username || isMine;
    Alert.alert("Comment", undefined, [
      canDelete
        ? {
            text: "Delete",
            style: "destructive",
            onPress: () => removeComment(comment.id),
          }
        : { text: "Report", style: "destructive", onPress: () => confirmReport("comment") },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  return (
    <KeyboardAvoidingView behavior="padding" className="flex-1 bg-white">
      <ScreenHeader title="Post" onBack={() => router.back()} />
      <FlatList
        data={comments}
        keyExtractor={(c) => c.id}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-4"
        ListHeaderComponent={
          <View className="border-b border-divider">
            <PostCard
              post={{ ...post, commentCount: Math.max(post.commentCount, comments.length) }}
              width={width}
              showCommentPreview={false}
              onPressAuthor={() => openProfile(post.author.username)}
              onPressMore={() => openPostMenu(post, isMine, () => router.back())}
              onPressShare={() => Share.share({ message: `Check out this post by @${post.author.username} on Codegram` })}
            />
          </View>
        }
        renderItem={({ item }) => (
          <CommentRow
            comment={item}
            onPressAuthor={() => openProfile(item.author.username)}
            onLongPress={() => onCommentOptions(item)}
          />
        )}
        ListEmptyComponent={
          <View className="items-center px-10 py-10">
            <Text className="font-inter-semibold text-[15px] text-ink">No comments yet</Text>
            <Text className="mt-1 font-inter text-[13px] text-muted">Start the conversation.</Text>
          </View>
        }
      />
      <CommentComposer
        avatar={me.avatar}
        onSubmit={(body) => addComment(post.id, { id: me.id, username: me.username, avatar: me.avatar }, body)}
      />
    </KeyboardAvoidingView>
  );
}
