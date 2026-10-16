import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { EmptyState } from "@/components/EmptyState";

// Photo/video post composer lands in Phase 6.
export default function CreatePostScreen() {
  return (
    <View className="flex-1 bg-background">
      <EmptyState icon="plus.app" title="New post" message="Sharing photos and videos is coming soon.">
        <Pressable
          accessibilityRole="button"
          onPress={() => router.back()}
          className="mt-3 h-11 items-center justify-center rounded-full border border-border bg-white px-6 active:opacity-80"
        >
          <Text className="font-inter-medium text-[14px] text-ink">Close</Text>
        </Pressable>
      </EmptyState>
    </View>
  );
}
