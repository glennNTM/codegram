import { Stack } from "expo-router";

import { tabStackOptions } from "@/components/navigation/stackOptions";

export default function MessagesStack() {
  return (
    <Stack screenOptions={tabStackOptions}>
      {/* Messages draws its own header (title, compose, search field), per the design. */}
      <Stack.Screen name="index" options={{ title: "Messages", headerShown: false }} />
    </Stack>
  );
}
