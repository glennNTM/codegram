import { Stack } from "expo-router";

import { tabStackOptions } from "@/components/navigation/stackOptions";

export default function ProfileStack() {
  return (
    <Stack screenOptions={tabStackOptions}>
      {/* Profile and Edit profile draw their own headers (cover banner / Save pill), per the design. */}
      <Stack.Screen name="index" options={{ title: "Profile", headerShown: false }} />
      <Stack.Screen name="edit" options={{ title: "Edit profile", headerShown: false }} />
      <Stack.Screen name="settings" options={{ title: "Settings" }} />
      <Stack.Screen name="blocked" options={{ title: "Blocked users", headerLargeTitle: false }} />
    </Stack>
  );
}
