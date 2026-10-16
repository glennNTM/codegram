import { useClerk, useUser } from "@clerk/expo";
import { Image } from "expo-image";
import { Pressable, ScrollView, Text, View } from "react-native";

// Profile header + posts grid land in Phase 5; settings (blocked users, delete account) in Phase 11.
export default function ProfileScreen() {
  const { user } = useUser();
  const { signOut } = useClerk();

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerClassName="grow">
      <View className="items-center gap-3 px-8 py-10">
        {user?.imageUrl ? (
          <Image source={user.imageUrl} style={{ width: 88, height: 88, borderRadius: 44 }} />
        ) : null}
        <Text className="font-inter-semibold text-[18px] text-ink">
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
    </ScrollView>
  );
}
