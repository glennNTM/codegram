import { Image } from "expo-image";
import { useWindowDimensions, View } from "react-native";

// Geometry measured from the design reference, laid out for a 402pt-wide screen.
const DESIGN_WIDTH = 402;
export const COLLAGE_HEIGHT = 302;

const CARDS = [
  {
    source: require("@/assets/images/auth/collage-coast.jpg"),
    centerX: 156.5,
    centerY: 136,
    width: 243,
    height: 232,
    rotate: "-7.4deg",
    radius: 16,
  },
  {
    source: require("@/assets/images/auth/collage-traveler.jpg"),
    centerX: 300.5,
    centerY: 193,
    width: 137,
    height: 189,
    rotate: "10deg",
    radius: 16,
  },
] as const;

const BORDER = 5;

export function PhotoCollage() {
  const { width } = useWindowDimensions();
  const offsetX = (width - DESIGN_WIDTH) / 2;

  return (
    <View style={{ height: COLLAGE_HEIGHT }} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {CARDS.map((card) => (
        <View
          key={card.centerX}
          className="absolute bg-white"
          style={{
            left: card.centerX - card.width / 2 + offsetX,
            top: card.centerY - card.height / 2,
            width: card.width,
            height: card.height,
            padding: BORDER,
            borderRadius: card.radius,
            transform: [{ rotate: card.rotate }],
            boxShadow: "0px 12px 28px rgba(16, 24, 40, 0.16)",
          }}
        >
          <Image
            source={card.source}
            contentFit="cover"
            style={{ flex: 1, borderRadius: card.radius - BORDER }}
          />
        </View>
      ))}
    </View>
  );
}
