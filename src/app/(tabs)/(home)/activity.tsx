import { ScrollView } from "react-native";

import { EmptyState } from "@/components/EmptyState";

// Likes / comments / follows list lands in Phase 8.
export default function ActivityScreen() {
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerClassName="grow">
      <EmptyState
        icon="heart"
        title="No activity yet"
        message="When people like, comment on or follow you, you'll see it here."
      />
    </ScrollView>
  );
}
