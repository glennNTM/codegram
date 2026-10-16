import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import type { ImageSourcePropType } from "react-native";
import { View } from "react-native";

// Story ring from the design: blue → violet gradient, thin white gap, then the photo.
const RING_COLORS = ["#1F74FD", "#6A3CF5"] as const;

type Props = {
  source: ImageSourcePropType;
  /** Outer diameter including the ring. */
  size: number;
  ring?: "story" | "none" | "muted";
  ringWidth?: number;
  gap?: number;
};

export function RingAvatar({ source, size, ring = "story", ringWidth = 2, gap = 1.5 }: Props) {
  const photo = ring === "none" ? size : size - 2 * (ringWidth + gap);
  const image = (
    <Image source={source} style={{ width: photo, height: photo, borderRadius: photo / 2 }} contentFit="cover" />
  );

  if (ring === "none") return image;

  const inner = (
    <View
      className="items-center justify-center bg-white"
      style={{ width: size - 2 * ringWidth, height: size - 2 * ringWidth, borderRadius: size / 2 }}
    >
      {image}
    </View>
  );

  if (ring === "muted") {
    return (
      <View
        className="items-center justify-center bg-divider"
        style={{ width: size, height: size, borderRadius: size / 2 }}
      >
        {inner}
      </View>
    );
  }

  return (
    <LinearGradient
      colors={RING_COLORS}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
      style={{ width: size, height: size, borderRadius: size / 2, alignItems: "center", justifyContent: "center" }}
    >
      {inner}
    </LinearGradient>
  );
}
