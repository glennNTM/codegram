import { ScrollView } from "react-native";

import { EmptyState } from "@/components/EmptyState";

// Chat list lands in Phase 10.
export default function MessagesScreen() {
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerClassName="grow">
      <EmptyState
        icon="bubble.left.and.bubble.right"
        title="No messages yet"
        message="Message someone from their profile to start a conversation."
      />
    </ScrollView>
  );
}
