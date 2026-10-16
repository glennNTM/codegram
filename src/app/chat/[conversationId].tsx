import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo } from "react";
import { FlatList, KeyboardAvoidingView, Pressable, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { EmptyState } from "@/components/EmptyState";
import { ChatComposer } from "@/components/messages/ChatComposer";
import { MessageBubble } from "@/components/messages/MessageBubble";
import { Icon } from "@/components/ui/Icon";
import { formatDayLabel } from "@/lib/format";
import { markRead, ME_ID, sendMessage, useConversation, type Message } from "@/mocks/messages";

// A run of bubbles from the same sender breaks after this gap.
const GROUP_GAP_MS = 5 * 60_000;
const AVATAR = 36;

type Item =
  | { kind: "day"; key: string; label: string }
  | { kind: "message"; key: string; message: Message; last: boolean; status?: string };

/** Newest first (for the inverted list), with a day label above each day's first message. */
function buildItems(messages: Message[], otherLastReadAt: number): Item[] {
  const items: Item[] = [];
  const latest = messages.at(-1);
  messages.forEach((message, i) => {
    const prev = messages[i - 1];
    const next = messages[i + 1];
    const day = formatDayLabel(message.createdAt);
    if (!prev || formatDayLabel(prev.createdAt) !== day) items.push({ kind: "day", key: `day_${message.id}`, label: day });

    const last = !next || next.senderId !== message.senderId || next.createdAt - message.createdAt > GROUP_GAP_MS;
    const status =
      message === latest && message.senderId === ME_ID ? (otherLastReadAt >= message.createdAt ? "Seen" : "Sent") : undefined;
    items.push({ kind: "message", key: message.id, message, last: last || status != null, status });
  });
  return items.reverse();
}

// Real-time 1:1 chat on the root stack (covers the tab bar). Mock data until
// `messages.listMessages` / `send` / `markRead` land in Phase 10.
export default function ChatScreen() {
  const { conversationId } = useLocalSearchParams<{ conversationId: string }>();
  const insets = useSafeAreaInsets();
  const conversation = useConversation(conversationId);
  const lastMessageId = conversation?.messages.at(-1)?.id;

  // Mark read on open and whenever a new message arrives while the chat is open.
  useEffect(() => {
    markRead(conversationId);
  }, [conversationId, lastMessageId]);

  const items = useMemo(
    () => (conversation ? buildItems(conversation.messages, conversation.otherLastReadAt) : []),
    [conversation],
  );

  if (!conversation) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <EmptyState icon="bubble.left.and.exclamationmark.bubble.right" title="Conversation not found">
          <Pressable
            accessibilityRole="button"
            onPress={() => router.back()}
            className="mt-3 h-11 items-center justify-center rounded-full border border-border bg-white px-6 active:opacity-80"
          >
            <Text className="font-inter-medium text-[14px] text-ink">Go back</Text>
          </Pressable>
        </EmptyState>
      </SafeAreaView>
    );
  }

  const { other } = conversation;
  const openProfile = () => router.push({ pathname: "/user/[username]", params: { username: other.username } });

  return (
    <KeyboardAvoidingView behavior="padding" className="flex-1 bg-white">
      {/* Header: back, avatar + name (opens the profile), info */}
      <View
        className="flex-row items-center gap-1 border-b border-divider bg-white pl-2 pr-3"
        style={{ paddingTop: insets.top, height: insets.top + 56 }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back"
          onPress={() => router.back()}
          hitSlop={8}
          className="h-11 w-9 items-center justify-center active:opacity-60"
        >
          <Icon name="chevronLeft" size={18} weight="semibold" />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Open ${other.username}'s profile`}
          onPress={openProfile}
          className="flex-1 flex-row items-center gap-[10px] active:opacity-70"
        >
          <Image source={other.avatar} contentFit="cover" style={{ width: AVATAR, height: AVATAR, borderRadius: AVATAR / 2 }} />
          <View className="flex-1">
            <View className="flex-row items-center gap-1">
              <Text numberOfLines={1} className="font-inter-semibold text-[15px] text-ink">
                {other.username}
              </Text>
              {other.verified ? <Icon name="verified" size={12} color="#1F74FD" /> : null}
            </View>
            <Text numberOfLines={1} className="mt-[1px] font-inter text-[12px] text-muted">
              {other.online ? "Active now" : other.displayName ?? `@${other.username}`}
            </Text>
          </View>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Profile info"
          onPress={openProfile}
          hitSlop={8}
          className="h-11 w-9 items-center justify-center active:opacity-60"
        >
          <Icon name="info" size={21} />
        </Pressable>
      </View>

      <FlatList
        inverted
        data={items}
        keyExtractor={(item) => item.key}
        className="flex-1"
        contentContainerClassName="grow pb-2 pt-3"
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) =>
          item.kind === "day" ? (
            <Text className="my-3 text-center font-inter-medium text-[11px] text-subtle">{item.label}</Text>
          ) : (
            <MessageBubble
              body={item.message.body}
              createdAt={item.message.createdAt}
              mine={item.message.senderId === ME_ID}
              last={item.last}
              status={item.status}
            />
          )
        }
        // FlatList flips the empty component back itself when inverted.
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center gap-2 px-10">
            <Image source={other.avatar} contentFit="cover" style={{ width: 72, height: 72, borderRadius: 36 }} />
            <Text className="mt-1 font-inter-semibold text-[16px] text-ink">{other.displayName ?? other.username}</Text>
            <Text className="text-center font-inter text-[13px] text-muted">Say hi to @{other.username} 👋</Text>
          </View>
        }
      />

      <ChatComposer onSend={(body) => sendMessage(conversation.id, body)} />
    </KeyboardAvoidingView>
  );
}
