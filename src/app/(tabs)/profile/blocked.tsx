import { Image } from "expo-image";
import { Alert, FlatList, Pressable, Text, View } from "react-native";

import { EmptyState } from "@/components/EmptyState";
import { unblockUser, useBlockedUsers, type BlockedUser } from "@/mocks/session";

const AVATAR = 44;

// Blocked users with Unblock. Mock list until `blocks.listBlocked` / `unblock` land in Phase 11.
export default function BlockedUsersScreen() {
  const blocked = useBlockedUsers();

  const onUnblock = (user: BlockedUser) =>
    Alert.alert(`Unblock ${user.username}?`, "They'll be able to see your posts, follow you and message you again.", [
      { text: "Cancel", style: "cancel" },
      { text: "Unblock", onPress: () => unblockUser(user.id) },
    ]);

  return (
    <FlatList
      className="flex-1 bg-background"
      data={blocked}
      keyExtractor={(u) => u.id}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerClassName="grow pt-2"
      renderItem={({ item }) => (
        <View className="flex-row items-center gap-3 px-4 py-[9px]">
          <Image source={item.avatar} contentFit="cover" style={{ width: AVATAR, height: AVATAR, borderRadius: AVATAR / 2 }} />
          <View className="flex-1">
            <Text className="font-inter-semibold text-[14px] text-ink">{item.username}</Text>
            <Text className="mt-[2px] font-inter text-[12.5px] text-muted">{item.displayName}</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Unblock ${item.username}`}
            onPress={() => onUnblock(item)}
            className="h-[32px] items-center justify-center rounded-[10px] bg-surface px-4 active:opacity-70"
          >
            <Text className="font-inter-semibold text-[13px] text-ink">Unblock</Text>
          </Pressable>
        </View>
      )}
      ListEmptyComponent={
        <EmptyState icon="hand.raised" title="No blocked users" message="People you block will show up here." />
      }
    />
  );
}
