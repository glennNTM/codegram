import { useClerk, useUser } from "@clerk/expo";
import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Temporary signed-in screen; replaced by the NativeTabs shell in Phase 4.
export default function Home() {
  const { user } = useUser();
  const { signOut } = useClerk();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center gap-4 px-8">
        {user?.imageUrl ? (
          <Image source={user.imageUrl} style={{ width: 72, height: 72, borderRadius: 36 }} />
        ) : null}
        <Text className="font-inter-bold text-[22px] text-ink">You&apos;re signed in</Text>
        <Text className="text-center font-inter text-[14px] text-muted">
          {user?.fullName || user?.primaryEmailAddress?.emailAddress}
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => signOut()}
          className="mt-4 h-11 items-center justify-center rounded-full border border-border bg-white px-8 active:opacity-80"
        >
          <Text className="font-inter-medium text-[14px] text-ink">Sign out</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
