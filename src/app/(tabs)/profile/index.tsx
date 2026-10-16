import { useClerk } from "@clerk/expo";
import { Alert } from "react-native";

import { ProfileView } from "@/components/profile/ProfileView";
import { useMyProfile } from "@/mocks/profile";

// UI on mock data; swaps to `users.me` + `posts.listByAuthor` in Phase 5. Settings
// (blocked users, delete account) get their own screen in Phase 11.
export default function ProfileScreen() {
  const profile = useMyProfile();
  const { signOut } = useClerk();

  const onPressMore = () =>
    Alert.alert(profile.username, undefined, [
      { text: "Sign out", style: "destructive", onPress: () => signOut() },
      { text: "Cancel", style: "cancel" },
    ]);

  return <ProfileView profile={profile} isMe onPressMore={onPressMore} />;
}
