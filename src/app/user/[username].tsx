import { router, useLocalSearchParams } from "expo-router";
import { Alert, Pressable, Share, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { EmptyState } from "@/components/EmptyState";
import { ProfileView } from "@/components/profile/ProfileView";
import { confirmBlock, confirmReport } from "@/lib/menus";
import { getOrCreateConversation } from "@/mocks/messages";
import { getMockProfile, useMyProfile } from "@/mocks/profile";

// Another user's profile, on the root stack so it covers the tab bar (plan §4).
// Mock lookup until `users.getByUsername` lands in Phase 5; Report / Block are mocked until Phase 11.
export default function UserProfileScreen() {
  const { username } = useLocalSearchParams<{ username: string }>();
  const me = useMyProfile();
  const profile = getMockProfile(username);

  if (!profile) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <EmptyState icon="person.crop.circle.badge.questionmark" title="User not found" message={`@${username} doesn't exist.`}>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.back()}
            className="mt-3 h-11 items-center justify-center rounded-full border border-border bg-white px-6 active:opacity-80"
          >
            <Text className="font-inter-medium text-[14px] text-ink">Go back</Text>
          </Pressable>
        </EmptyState>
      </SafeAreaView>
    );
  }

  const onPressMore = () =>
    Alert.alert(profile.username, undefined, [
      { text: "Share profile", onPress: () => Share.share({ message: `Follow @${profile.username} on Codegram` }) },
      { text: "Report", style: "destructive", onPress: () => confirmReport("account") },
      { text: "Block", style: "destructive", onPress: () => confirmBlock(profile, () => router.back()) },
      { text: "Cancel", style: "cancel" },
    ]);

  return (
    <View className="flex-1 bg-white">
      <ProfileView
        profile={profile}
        isMe={profile.id === me.id}
        onBack={() => router.back()}
        onPressMore={onPressMore}
        onPressMessage={() => {
          const conversationId = getOrCreateConversation(profile);
          router.push({ pathname: "/chat/[conversationId]", params: { conversationId } });
        }}
      />
    </View>
  );
}
