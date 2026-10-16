import { router } from "expo-router";
import { useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { EmptyState } from "@/components/EmptyState";
import { ChatRow } from "@/components/messages/ChatRow";
import { Icon } from "@/components/ui/Icon";
import { SearchField } from "@/components/ui/SearchField";
import { useConversations, type ConversationSummary } from "@/mocks/messages";

function matches(c: ConversationSummary, q: string) {
  return (
    c.other.username.includes(q) ||
    (c.other.displayName ?? "").toLowerCase().includes(q) ||
    (c.lastMessage?.body.toLowerCase().includes(q) ?? false)
  );
}

// Chat list from design/message screen-ref.png: title + compose, search over names and
// messages, then the conversations. Mock data until `messages.listConversations` (Phase 10).
export default function MessagesScreen() {
  const insets = useSafeAreaInsets();
  const conversations = useConversations();
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const visible = q ? conversations.filter((c) => matches(c, q)) : conversations;

  return (
    <View className="flex-1 bg-white">
      <View className="bg-white px-5 pb-3" style={{ paddingTop: insets.top + 8 }}>
        <View className="h-[44px] flex-row items-center">
          <Text accessibilityRole="header" className="flex-1 font-inter-bold text-[30px] text-ink tracking-[-0.6px]">
            Messages
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="New message"
            onPress={() => router.push("/new-message")}
            hitSlop={8}
            className="h-10 w-10 items-center justify-center active:opacity-60"
          >
            <Icon name="compose" size={23} weight="medium" />
          </Pressable>
        </View>
        <View className="mt-3">
          <SearchField value={query} onChangeText={setQuery} placeholder="Search messages or people…" size="lg" />
        </View>
      </View>

      <FlatList
        data={visible}
        keyExtractor={(c) => c.id}
        contentContainerClassName="grow pb-6 pt-1"
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ChatRow
            conversation={item}
            onPress={() => router.push({ pathname: "/chat/[conversationId]", params: { conversationId: item.id } })}
          />
        )}
        ListEmptyComponent={
          q ? (
            <EmptyState icon="magnifyingglass" title="No results" message={`Nothing matches “${query.trim()}”.`} />
          ) : (
            <EmptyState
              icon="bubble.left.and.bubble.right"
              title="No messages yet"
              message="Message someone from their profile to start a conversation."
            />
          )
        }
      />
    </View>
  );
}
