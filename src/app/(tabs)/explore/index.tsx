import { ScrollView } from "react-native";

import { EmptyState } from "@/components/EmptyState";

// Post grid + user search land in Phase 9.
export default function ExploreScreen() {
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerClassName="grow">
      <EmptyState
        icon="safari"
        title="Nothing to explore yet"
        message="Posts from everyone on Codegram will show up here."
      />
    </ScrollView>
  );
}
