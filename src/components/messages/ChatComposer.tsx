import { useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Icon } from "@/components/ui/Icon";

const MAX_LENGTH = 2000;

type Props = {
  onSend: (body: string) => void;
};

// Pill text field + round send button (text only in v1: no media in DMs).
export function ChatComposer({ onSend }: Props) {
  const insets = useSafeAreaInsets();
  const [text, setText] = useState("");
  const canSend = text.trim().length > 0;

  const send = () => {
    if (!canSend) return;
    onSend(text.trim());
    setText("");
  };

  return (
    <View className="flex-row items-end gap-2 border-t border-divider bg-white px-3 pt-2" style={{ paddingBottom: Math.max(insets.bottom, 8) }}>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Type a message…"
        placeholderTextColor="#8491AC"
        multiline
        maxLength={MAX_LENGTH}
        accessibilityLabel="Message"
        className="max-h-[120px] min-h-[40px] flex-1 rounded-[20px] border border-border bg-background px-4 pb-[10px] pt-[10px] font-inter text-[15px] leading-[20px] text-ink"
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Send"
        accessibilityState={{ disabled: !canSend }}
        disabled={!canSend}
        onPress={send}
        className={`h-10 w-10 items-center justify-center rounded-full bg-primary active:opacity-80 ${canSend ? "" : "opacity-40"}`}
      >
        <Icon name="sendFill" size={17} color="#FFFFFF" weight="bold" />
      </Pressable>
    </View>
  );
}
