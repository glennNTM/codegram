import { useState } from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";

import { Icon } from "@/components/ui/Icon";

const CONFIRM_WORD = "DELETE";

type Props = {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

// Destructive confirm with a typed word (plan Phase 11), as an in-app sheet rather than an alert.
export function DeleteAccountSheet({ visible, onClose, onConfirm }: Props) {
  const [typed, setTyped] = useState("");
  const canDelete = typed.trim().toUpperCase() === CONFIRM_WORD;

  const close = () => {
    setTyped("");
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={close}>
      <View className="flex-1 bg-background px-5 pt-6">
        <View className="h-14 w-14 items-center justify-center rounded-full bg-danger-surface">
          <Icon name="trash" size={24} color="#E5343B" />
        </View>
        <Text accessibilityRole="header" className="mt-4 font-inter-bold text-[22px] text-ink">
          Delete your account?
        </Text>
        <Text className="mt-2 font-inter text-[14px] leading-[20px] text-muted">
          Your profile, posts, comments, likes, followers and messages will be permanently deleted. This can’t be undone.
        </Text>

        <Text className="mt-6 font-inter-medium text-[13px] text-ink">
          Type <Text className="font-inter-bold">{CONFIRM_WORD}</Text> to confirm
        </Text>
        <TextInput
          value={typed}
          onChangeText={setTyped}
          autoCapitalize="characters"
          autoCorrect={false}
          placeholder={CONFIRM_WORD}
          placeholderTextColor="#8491AC"
          accessibilityLabel={`Type ${CONFIRM_WORD} to confirm`}
          className="mt-2 h-12 rounded-[12px] border border-border bg-white px-4 font-inter text-[15px] text-ink"
        />

        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: !canDelete }}
          disabled={!canDelete}
          onPress={() => {
            setTyped("");
            onConfirm();
          }}
          className={`mt-6 h-12 items-center justify-center rounded-full bg-danger active:opacity-80 ${canDelete ? "" : "opacity-40"}`}
        >
          <Text className="font-inter-semibold text-[15px] text-white">Delete account</Text>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={close} className="mt-3 h-12 items-center justify-center rounded-full active:opacity-60">
          <Text className="font-inter-medium text-[15px] text-ink">Cancel</Text>
        </Pressable>
      </View>
    </Modal>
  );
}
