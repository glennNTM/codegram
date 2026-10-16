import { Stack } from "expo-router";

import { tabStackOptions } from "@/components/navigation/stackOptions";

export default function ExploreStack() {
  return (
    <Stack screenOptions={tabStackOptions}>
      {/* Explore draws its own header (title + profile shortcut, search, segments), per the design. */}
      <Stack.Screen name="index" options={{ title: "Explore", headerShown: false }} />
    </Stack>
  );
}
