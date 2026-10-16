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
  play: { ios: "play.fill", android: "play_arrow", web: "play_arrow" },
  multiple: { ios: "square.fill.on.square.fill", android: "filter_none", web: "filter_none" },
  search: { ios: "magnifyingglass", android: "search", web: "search" },
  clear: { ios: "xmark.circle.fill", android: "cancel", web: "cancel" },
  person: { ios: "person", android: "person", web: "person" },
  personAdd: { ios: "person.badge.plus", android: "person_add", web: "person_add" },
  chevronRight: { ios: "chevron.right", android: "chevron_right", web: "chevron_right" },
  chevronLeft: { ios: "chevron.left", android: "chevron_left", web: "chevron_left" },
  check: { ios: "checkmark", android: "check", web: "check" },
  camera: { ios: "camera.fill", android: "photo_camera", web: "photo_camera" },
  gear: { ios: "gearshape", android: "settings", web: "settings" },
  grid: { ios: "square.grid.3x3", android: "grid_on", web: "grid_on" },
  reels: { ios: "play.rectangle", android: "slideshow", web: "slideshow" },
  tagged: { ios: "person.crop.square", android: "account_box", web: "account_box" },
  location: { ios: "mappin.and.ellipse", android: "location_on", web: "location_on" },
  link: { ios: "link", android: "link", web: "link" },
  at: { ios: "at", android: "alternate_email", web: "alternate_email" },
  text: { ios: "text.alignleft", android: "notes", web: "notes" },
  calendar: { ios: "calendar", android: "calendar_today", web: "calendar_today" },
  shield: { ios: "checkmark.shield", android: "verified_user", web: "verified_user" },
  globe: { ios: "globe", android: "language", web: "language" },
  feedback: { ios: "ellipsis.bubble", android: "chat", web: "chat" },
  flag: { ios: "flag", android: "flag", web: "flag" },
  trash: { ios: "trash", android: "delete", web: "delete" },
  airplane: { ios: "airplane", android: "flight", web: "flight" },
  mountain: { ios: "mountain.2.fill", android: "landscape", web: "landscape" },
  tag: { ios: "tag", android: "sell", web: "sell" },
  compose: { ios: "square.and.pencil", android: "edit_square", web: "edit_square" },
  info: { ios: "info.circle", android: "info", web: "info" },
  block: { ios: "hand.raised", android: "block", web: "block" },
  help: { ios: "questionmark.circle", android: "help", web: "help" },
  signOut: { ios: "rectangle.portrait.and.arrow.right", android: "logout", web: "logout" },
  sendFill: { ios: "arrow.up", android: "arrow_upward", web: "arrow_upward" },
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
