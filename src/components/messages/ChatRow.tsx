import { Pressable, Text, View } from "react-native";

import { RingAvatar } from "@/components/feed/RingAvatar";
import { Icon } from "@/components/ui/Icon";
import { formatAgeShort } from "@/lib/format";
import { ME_ID, type ConversationSummary } from "@/mocks/messages";

const AVATAR = 50;

type Props = {
  conversation: ConversationSummary;
  onPress: () => void;
};

// Chat list row from design/message screen-ref.png: avatar (story ring + online dot),
// name + verified badge, last message, time with an unread dot under it.
export function ChatRow({ conversation, onPress }: Props) {
  const { other, lastMessage, unread } = conversation;
  const name = other.displayName ?? other.username;
  const preview = lastMessage ? `${lastMessage.senderId === ME_ID ? "You: " : ""}${lastMessage.body}` : "";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${name}${unread ? ", unread" : ""}. ${preview}`}
      onPress={onPress}
      className="flex-row items-center gap-[14px] px-5 py-[9px] active:bg-surface"
    >
      <View>
        <RingAvatar source={other.avatar} size={AVATAR} ring={other.hasStory ? "story" : "none"} ringWidth={1.5} gap={2} />
        {other.online ? (
          <View className="absolute bottom-0 right-0 h-[14px] w-[14px] rounded-full border-[2.5px] border-white bg-[#22C55E]" />
        ) : null}
      </View>

      <View className="flex-1">
        <View className="flex-row items-center gap-[5px]">
          <Text numberOfLines={1} className="shrink font-inter-semibold text-[15px] text-ink">
            {name}
          </Text>
          {other.verified ? <Icon name="verified" size={14} color="#1F74FD" /> : null}
        </View>
        <Text numberOfLines={1} className={`mt-[3px] font-inter text-[13.5px] ${unread ? "text-ink" : "text-muted"}`}>
          {preview}
        </Text>
      </View>

      <View className="items-end gap-[9px] self-stretch pt-[7px]">
        {lastMessage ? (
          <Text className={`font-inter text-[12.5px] ${unread ? "text-muted" : "text-subtle"}`}>
            {formatAgeShort(lastMessage.createdAt)}
          </Text>
        ) : null}
        {unread ? <View className="h-[9px] w-[9px] rounded-full bg-primary" /> : null}
      </View>
    </Pressable>
  );
}
