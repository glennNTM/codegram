import { Image } from "expo-image";
import { SymbolView } from "expo-symbols";
import { ActivityIndicator, Pressable, Text } from "react-native";

type Provider = "apple" | "google";

const appleSvg = require("@/assets/images/brand/apple.svg");
const googleSvg = require("@/assets/images/brand/google.svg");

const PROVIDERS = {
  apple: {
    label: "Continue with Apple",
    // Real SF Symbol on iOS; the SVG is the fallback for platforms without SF Symbols.
    icon: (
      <SymbolView
        name={{ ios: "apple.logo" }}
        size={18}
        tintColor="#FFFFFF"
        fallback={<Image source={appleSvg} style={{ width: 15, height: 18 }} contentFit="contain" />}
      />
    ),
    content: "gap-4 pl-[6px]",
    container: "bg-primary",
    shadow: "0px 4px 12px rgba(31, 116, 253, 0.22)",
    text: "text-white",
    spinner: "#FFFFFF",
  },
  google: {
    label: "Continue with Google",
    icon: <Image source={googleSvg} style={{ width: 18, height: 18 }} contentFit="contain" />,
    content: "gap-[18px] pl-[5px]",
    container: "border border-border bg-white",
    shadow: "0px 1px 3px rgba(16, 24, 40, 0.05)",
    text: "text-ink",
    spinner: "#0B1128",
  },
} as const;

type Props = {
  provider: Provider;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
};

export function SocialButton({ provider, onPress, loading, disabled }: Props) {
  const p = PROVIDERS[provider];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={p.label}
      onPress={onPress}
      disabled={disabled || loading}
      className={`h-11 flex-row items-center justify-center rounded-full active:opacity-80 ${p.content} ${p.container}`}
      style={{ boxShadow: p.shadow }}
    >
      {loading ? (
        <ActivityIndicator color={p.spinner} />
      ) : (
        <>
          {p.icon}
          <Text className={`font-inter-medium text-[13.5px] tracking-[-0.2px] ${p.text}`}>{p.label}</Text>
        </>
      )}
    </Pressable>
  );
}
