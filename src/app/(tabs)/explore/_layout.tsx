import { Stack } from "expo-router";

import { tabStackOptions } from "@/components/navigation/stackOptions";

export default function ExploreStack() {
  return (
    <Stack screenOptions={tabStackOptions}>
      <Stack.Screen name="index" options={{ title: "Explore" }} />
    </Stack>
  );
}
