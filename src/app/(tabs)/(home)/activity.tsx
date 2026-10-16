import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { SectionList, Text } from "react-native";

import { ActivityRow } from "@/components/activity/ActivityRow";
import { EmptyState } from "@/components/EmptyState";
import { markAllActivityRead, useActivity, type ActivityItem } from "@/mocks/activity";

const DAY = 24 * 3_600_000;

function sectionsFor(items: ActivityItem[], now: number) {
  const groups: { title: string; data: ActivityItem[] }[] = [
    { title: "Today", data: [] },
    { title: "This week", data: [] },
    { title: "Earlier", data: [] },
  ];
  for (const item of items) {
    const age = now - item.createdAt;
    groups[age < DAY ? 0 : age < 7 * DAY ? 1 : 2].data.push(item);
  }
  return groups.filter((g) => g.data.length > 0);
}

// Notifications (design #14): likes, comments and follows, grouped by age. Rows opened unread
// keep their tint until you leave; everything is marked read on blur (`notifications.markAllRead`, Phase 8).
export default function ActivityScreen() {
  const items = useActivity();
  const [now] = useState(() => Date.now());

  useFocusEffect(useCallback(() => () => markAllActivityRead(), []));

  const openProfile = (username: string) => router.push({ pathname: "/user/[username]", params: { username } });

  return (
    <SectionList
      className="flex-1 bg-white"
      sections={sectionsFor(items, now)}
      keyExtractor={(item) => item.id}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerClassName="grow pb-6"
      stickySectionHeadersEnabled={false}
      renderSectionHeader={({ section }) => (
        <Text className="px-4 pb-1 pt-4 font-inter-semibold text-[15px] text-ink">{section.title}</Text>
      )}
      renderItem={({ item }) => (
        <ActivityRow
          item={item}
          onPressActor={() => openProfile(item.actor.username)}
          onPress={() =>
            item.post
              ? router.push({ pathname: "/post/[postId]", params: { postId: item.post.id, author: item.post.author } })
              : openProfile(item.actor.username)
          }
        />
      )}
      ListEmptyComponent={
        <EmptyState icon="heart" title="No activity yet" message="When people like, comment on or follow you, you'll see it here." />
      }
    />
  );
}
