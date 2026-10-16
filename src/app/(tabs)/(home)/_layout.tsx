import { Image } from "expo-image";
import { router, Stack } from "expo-router";
import { Text, View } from "react-native";

import { HeaderIconButton } from "@/components/navigation/HeaderIconButton";
import { tabStackOptions } from "@/components/navigation/stackOptions";

function HomeHeaderTitle() {
  return (
    <View className="flex-row items-center gap-2">
      <Image source={require("@/assets/images/brand/logo.svg")} style={{ width: 28, height: 28 }} />
      <Text className="font-inter-bold text-[21px] text-ink tracking-[-0.4px]">Codegram</Text>
    </View>
  );
}

export default function HomeStack() {
  return (
    <Stack screenOptions={tabStackOptions}>
      <Stack.Screen
        name="index"
        options={{
          title: "Home",
          headerLargeTitle: false,
          headerTitleAlign: "left",
          headerTitle: () => <HomeHeaderTitle />,
          headerRight: () => (
            <View className="flex-row items-center gap-1">
              <HeaderIconButton icon="plus.app" accessibilityLabel="New post" onPress={() => router.push("/create")} />
              <HeaderIconButton icon="heart" accessibilityLabel="Activity" onPress={() => router.push("/activity")} />
            </View>
          ),
        }}
      />
      <Stack.Screen name="activity" options={{ title: "Activity" }} />
    </Stack>
  );
}
