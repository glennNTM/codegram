import { Image } from "expo-image";
import { useState } from "react";
import { Pressable, Text, TextInput, View, type ImageSourcePropType } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MAX_LENGTH = 500;
const AVATAR = 32;

type Props = {
  avatar: ImageSourcePropType;
  onSubmit: (body: string) => void;
};

// "Add a comment…" bar pinned under Post details (design #9).
export function CommentComposer({ avatar, onSubmit }: Props) {
  const insets = useSafeAreaInsets();
  const [text, setText] = useState("");
  const canPost = text.trim().length > 0;

  const submit = () => {
    if (!canPost) return;
    onSubmit(text.trim());
    setText("");
  };

  return (
    <View className="flex-row items-center gap-3 border-t border-divider bg-white px-4 pt-2" style={{ paddingBottom: Math.max(insets.bottom, 8) }}>
      <Image source={avatar} contentFit="cover" style={{ width: AVATAR, height: AVATAR, borderRadius: AVATAR / 2 }} />
      <View className="min-h-[40px] flex-1 flex-row items-center rounded-[20px] border border-border bg-background pl-4 pr-2">
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Add a comment…"
          placeholderTextColor="#8491AC"
          multiline
          maxLength={MAX_LENGTH}
          accessibilityLabel="Add a comment"
          className="max-h-[100px] flex-1 py-[10px] font-inter text-[14px] leading-[19px] text-ink"
        />
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: !canPost }}
          disabled={!canPost}
          onPress={submit}
          hitSlop={6}
          className="px-2 active:opacity-60"
        >
          <Text className={`font-inter-semibold text-[14px] text-primary ${canPost ? "" : "opacity-40"}`}>Post</Text>
        </Pressable>
      </View>
    </View>
  );
}
