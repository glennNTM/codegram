import { Stack } from "expo-router";

import { tabStackOptions } from "@/components/navigation/stackOptions";

export default function MessagesStack() {
  return (
    <Stack screenOptions={tabStackOptions}>
      <Stack.Screen name="index" options={{ title: "Messages" }} />
    </Stack>
  );
}
