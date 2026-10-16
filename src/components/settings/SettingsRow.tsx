import type { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";

import { Icon, type IconName } from "@/components/ui/Icon";

type Tone = "default" | "info" | "danger";

const TONES = {
  default: { icon: "#0B1128", label: "text-ink", sub: "text-muted", chevron: "#8491AC" },
  info: { icon: "#1F74FD", label: "text-primary", sub: "text-muted", chevron: "#1F74FD" },
  danger: { icon: "#E5343B", label: "text-danger-ink", sub: "text-muted", chevron: "#E5343B" },
} as const;

type Props = {
  icon: IconName;
  label: string;
  /** Secondary line under the label (ignored when `children` is given). */
  description?: string;
  /** Custom content under the label, e.g. an inline TextInput. */
  children?: ReactNode;
  tone?: Tone;
  onPress?: () => void;
  /** Hairline above the row (every row but the first in a card). */
  divider?: boolean;
};

// One row of an Edit profile card: leading icon, label + value/description, trailing chevron when tappable.
export function SettingsRow({ icon, label, description, children, tone = "default", onPress, divider }: Props) {
  const t = TONES[tone];
  const content = (
    <>
      <View className="w-6 pt-[1px]">
        <Icon name={icon} size={18} color={t.icon} />
      </View>
      <View className="flex-1">
        <Text className={`font-inter-semibold text-[12px] ${t.label}`}>{label}</Text>
        {children ?? (description ? <Text className={`mt-[3px] font-inter text-[11px] ${t.sub}`}>{description}</Text> : null)}
      </View>
      {onPress ? <Icon name="chevronRight" size={11} color={t.chevron} weight="semibold" /> : null}
    </>
  );
  const className = `flex-row items-center gap-3 py-[11px] ${divider ? "border-t border-divider" : ""}`;

  if (!onPress) return <View className={className}>{content}</View>;
  return (
    <Pressable accessibilityRole="button" onPress={onPress} className={`${className} active:opacity-70`}>
      {content}
    </Pressable>
  );
}

type CardProps = {
  title?: string;
  subtitle?: string;
  tone?: Tone;
  children: ReactNode;
};

export function SettingsCard({ title, subtitle, tone = "default", children }: CardProps) {
  const surface = tone === "info" ? "bg-info-surface border-info-surface" : tone === "danger" ? "bg-danger-surface border-danger-surface" : "bg-white border-divider";

  return (
    <View className={`rounded-[14px] border px-4 ${surface}`} style={tone === "default" ? { boxShadow: "0px 1px 3px rgba(16, 24, 40, 0.04)" } : undefined}>
      {title ? (
        <View className="border-b border-divider pb-[11px] pt-[13px]">
          <Text accessibilityRole="header" className="font-inter-semibold text-[15px] text-ink">
            {title}
          </Text>
          {subtitle ? <Text className="mt-[3px] font-inter text-[11px] text-muted">{subtitle}</Text> : null}
        </View>
      ) : null}
      {children}
    </View>
  );
}
