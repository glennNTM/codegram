import { SymbolView, type SymbolViewProps } from "expo-symbols";
import type { ReactNode } from "react";
import { Text, View } from "react-native";

type Props = {
  icon: SymbolViewProps["name"];
  title: string;
  message?: string;
  children?: ReactNode;
};

export function EmptyState({ icon, title, message, children }: Props) {
  return (
    <View className="flex-1 items-center justify-center gap-3 px-10 py-16">
      <View className="mb-1 h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <SymbolView name={icon} size={28} tintColor="#1F74FD" />
      </View>
      <Text className="text-center font-inter-semibold text-[17px] text-ink">{title}</Text>
      {message ? (
        <Text className="text-center font-inter text-[14px] leading-[20px] text-muted">{message}</Text>
      ) : null}
      {children}
    </View>
  );
}
