import { Text, View } from "react-native";

import { formatClock } from "@/lib/format";

type Props = {
  body: string;
  createdAt: number;
  mine: boolean;
  /** Last bubble of a run from the same sender: shows the time and a tighter corner. */
  last: boolean;
  /** "Seen" / "Sent" under my latest message. */
  status?: string;
};

// Message bubble from the design: blue with white text for me, light surface for them.
export function MessageBubble({ body, createdAt, mine, last, status }: Props) {
  return (
    <View className={`px-4 ${mine ? "items-end" : "items-start"} ${last ? "mb-[10px]" : "mb-[3px]"}`}>
      <View
        className={`max-w-[78%] rounded-[20px] px-[14px] py-[9px] ${mine ? "bg-primary" : "bg-surface"} ${
          last ? (mine ? "rounded-br-[6px]" : "rounded-bl-[6px]") : ""
        }`}
      >
        <Text selectable className={`font-inter text-[15px] leading-[20px] ${mine ? "text-white" : "text-ink"}`}>
          {body}
        </Text>
      </View>
      {last ? (
        <Text className={`mt-[3px] px-1 font-inter text-[10.5px] ${mine ? "text-primary" : "text-subtle"}`}>
          {formatClock(createdAt)}
          {status ? ` · ${status}` : ""}
        </Text>
      ) : null}
    </View>
  );
}
