import { useClerk } from "@clerk/expo";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";

import { DeleteAccountSheet } from "@/components/settings/DeleteAccountSheet";
import { SettingsCard, SettingsRow } from "@/components/settings/SettingsRow";
import { Icon } from "@/components/ui/Icon";
import { useBlockedUsers } from "@/mocks/session";

const comingSoon = (title: string) => Alert.alert(title, "Coming soon.");

// Settings (design #17). Sign out is real (Clerk); account deletion is mocked until Phase 11
// (`account.deleteMe` + Clerk `user.delete()`), so for now it just signs out.
export default function SettingsScreen() {
  const { signOut } = useClerk();
  const blocked = useBlockedUsers();
  const [deleting, setDeleting] = useState(false);

  const onSignOut = () =>
    Alert.alert("Sign out?", "You can sign back in at any time.", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign out", style: "destructive", onPress: () => signOut() },
    ]);

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ paddingHorizontal: 12, paddingTop: 8, paddingBottom: 32, gap: 10 }}
    >
      <SettingsCard>
        <SettingsRow icon="person" label="Account" description="Name, username, bio" onPress={() => router.push("/profile/edit")} />
        <SettingsRow icon="shield" label="Privacy" description="Your account is public" onPress={() => comingSoon("Privacy")} divider />
        <SettingsRow icon="bell" label="Notifications" description="Likes, comments and follows" onPress={() => comingSoon("Notifications")} divider />
        <SettingsRow
          icon="block"
          label="Blocked users"
          description={blocked.length === 0 ? "No one" : `${blocked.length} ${blocked.length === 1 ? "account" : "accounts"}`}
          onPress={() => router.push("/profile/blocked")}
          divider
        />
      </SettingsCard>

      <SettingsCard>
        <SettingsRow icon="flag" label="Report a problem" description="A bug? An error? Let us know" onPress={() => comingSoon("Report a problem")} />
        <SettingsRow icon="help" label="Help" description="FAQ and support" onPress={() => comingSoon("Help")} divider />
      </SettingsCard>

      <Pressable
        accessibilityRole="button"
        onPress={onSignOut}
        className="mt-2 h-12 flex-row items-center justify-center gap-2 rounded-[14px] border border-divider bg-white active:opacity-70"
        style={{ boxShadow: "0px 1px 3px rgba(16, 24, 40, 0.04)" }}
      >
        <Icon name="signOut" size={17} color="#E5343B" weight="medium" />
        <Text className="font-inter-semibold text-[15px] text-danger-ink">Sign out</Text>
      </Pressable>

      <SettingsCard tone="danger">
        <SettingsRow icon="trash" label="Delete account" description="This action can't be undone" tone="danger" onPress={() => setDeleting(true)} />
      </SettingsCard>

      <View className="items-center pt-2">
        <Text className="font-inter text-[11px] text-subtle">Codegram 1.0.0</Text>
      </View>

      <DeleteAccountSheet
        visible={deleting}
        onClose={() => setDeleting(false)}
        onConfirm={() => {
          setDeleting(false);
          signOut();
        }}
      />
    </ScrollView>
  );
}
