import { Image } from "expo-image";
import { router } from "expo-router";
import { useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";

import { EmptyState } from "@/components/EmptyState";
import { Icon } from "@/components/ui/Icon";
import { SearchField } from "@/components/ui/SearchField";
import { getOrCreateConversation, suggestedRecipients, type ChatUser } from "@/mocks/messages";

const AVATAR = 44;

// Form sheet behind the compose button in Messages: pick someone to start (or reopen) a chat.
export default function NewMessageScreen() {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const people = q
    ? suggestedRecipients.filter((u) => u.username.includes(q) || (u.displayName ?? "").toLowerCase().includes(q))
    : suggestedRecipients;

  const open = (user: ChatUser) => {
    const conversationId = getOrCreateConversation(user);
    router.dismiss();
    router.push({ pathname: "/chat/[conversationId]", params: { conversationId } });
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center px-4 pb-3 pt-5">
        <View className="w-9" />
        <Text accessibilityRole="header" className="flex-1 text-center font-inter-semibold text-[16px] text-ink">
          New message
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close"
          onPress={() => router.back()}
          hitSlop={8}
          className="h-9 w-9 items-center justify-center rounded-full bg-surface active:opacity-70"
        >
          <Icon name="plus" size={14} weight="semibold" style={{ transform: [{ rotate: "45deg" }] }} />
        </Pressable>
      </View>
      <View className="px-4 pb-2">
        <SearchField value={query} onChangeText={setQuery} placeholder="Search people" />
      </View>
      <Text className="px-4 pb-1 pt-3 font-inter-semibold text-[13px] text-muted">Suggested</Text>
      <FlatList
        data={people}
        keyExtractor={(u) => u.id}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerClassName="grow pb-6"
        renderItem={({ item }) => (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Message ${item.username}`}
            onPress={() => open(item)}
            className="flex-row items-center gap-3 px-4 py-[9px] active:bg-surface"
          >
            <Image source={item.avatar} contentFit="cover" style={{ width: AVATAR, height: AVATAR, borderRadius: AVATAR / 2 }} />
            <View className="flex-1">
              <Text className="font-inter-semibold text-[14px] text-ink">{item.username}</Text>
              {item.displayName ? <Text className="mt-[2px] font-inter text-[12.5px] text-muted">{item.displayName}</Text> : null}
            </View>
            <Icon name="chevronRight" size={12} color="#8491AC" weight="semibold" />
          </Pressable>
        )}
        ListEmptyComponent={<EmptyState icon="person.crop.circle.badge.questionmark" title="No one found" />}
      />
    </View>
  );
}
