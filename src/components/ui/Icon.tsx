import { SymbolView, type SymbolViewProps } from "expo-symbols";
import type { ColorValue, StyleProp, ViewStyle } from "react-native";

// SF Symbol on iOS, Material Symbol on Android/web (keeps web previews laid out like iOS).
const ICONS = {
  plusSquare: { ios: "plus.app", android: "add_box", web: "add_box" },
  heart: { ios: "heart", android: "favorite", web: "favorite" },
  heartFill: { ios: "heart.fill", android: "favorite", web: "favorite" },
  bell: { ios: "bell", android: "notifications", web: "notifications" },
  more: { ios: "ellipsis", android: "more_horiz", web: "more_horiz" },
  comment: { ios: "bubble.left", android: "chat_bubble", web: "chat_bubble" },
  send: { ios: "paperplane", android: "send", web: "send" },
  bookmark: { ios: "bookmark", android: "bookmark", web: "bookmark" },
  bookmarkFill: { ios: "bookmark.fill", android: "bookmark", web: "bookmark" },
  verified: { ios: "checkmark.seal.fill", android: "verified", web: "verified" },
  plus: { ios: "plus", android: "add", web: "add" },
} as const satisfies Record<string, SymbolViewProps["name"]>;

export type IconName = keyof typeof ICONS;

type Props = {
  name: IconName;
  size?: number;
  color?: ColorValue;
  weight?: "regular" | "medium" | "semibold" | "bold";
  style?: StyleProp<ViewStyle>;
};

export function Icon({ name, size = 24, color = "#0B1128", weight = "regular", style }: Props) {
  return <SymbolView name={ICONS[name]} size={size} tintColor={color} weight={weight} style={style} />;
}
