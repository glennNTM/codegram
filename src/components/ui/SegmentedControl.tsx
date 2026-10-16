import { Pressable, Text, View } from "react-native";

type Props<T extends string> = {
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
};

// Pill segmented control from the Explore design (white thumb on the surface track).
export function SegmentedControl<T extends string>({ options, value, onChange }: Props<T>) {
  return (
    <View accessibilityRole="tablist" className="h-[30px] flex-row rounded-full bg-surface p-[2px]">
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            onPress={() => onChange(option.value)}
            className={`flex-1 items-center justify-center rounded-full ${selected ? "bg-white" : ""}`}
            style={selected ? { boxShadow: "0px 1px 3px rgba(16, 24, 40, 0.12)" } : undefined}
          >
            <Text className={`text-[12px] ${selected ? "font-inter-semibold text-ink" : "font-inter text-muted"}`}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
