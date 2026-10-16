import { router } from "expo-router";
import { Pressable, ScrollView, Text } from "react-native";

import { EmptyState } from "@/components/EmptyState";

// Feed lands in Phase 7 (follows + fan-out + demo fallback).
export default function HomeScreen() {
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerClassName="grow">
      <EmptyState
        icon="photo.on.rectangle.angled"
        title="Your feed is empty"
        message="Follow people from Explore to see their photos and videos here."
      >
        <Pressable
          accessibilityRole="button"
          onPress={() => router.navigate("/explore")}
          className="mt-3 h-11 items-center justify-center rounded-full bg-primary px-6 active:opacity-80"
        >
          <Text className="font-inter-medium text-[14px] text-white">Explore</Text>
        </Pressable>
      </EmptyState>
    </ScrollView>
  );
}
