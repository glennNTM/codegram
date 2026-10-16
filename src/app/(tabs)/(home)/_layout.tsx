import { Stack } from "expo-router";

import { tabStackOptions } from "@/components/navigation/stackOptions";

export default function HomeStack() {
  return (
    <Stack screenOptions={tabStackOptions}>
      {/* Home draws its own header (wordmark + actions on one row, per the design). */}
      <Stack.Screen name="index" options={{ title: "Home", headerShown: false }} />
      <Stack.Screen name="activity" options={{ title: "Activity" }} />
    </Stack>
  );
}
