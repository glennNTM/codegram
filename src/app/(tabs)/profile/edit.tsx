import { useClerk } from "@clerk/expo";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, ScrollView, Text, TextInput, View, type TextInputProps } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DeleteAccountSheet } from "@/components/settings/DeleteAccountSheet";
import { SettingsCard, SettingsRow } from "@/components/settings/SettingsRow";
import { Icon, type IconName } from "@/components/ui/Icon";
import { normalizeUsername, USERNAME_MAX, validateUsername } from "@/lib/username";
import { updateMyProfile, useMyProfile, type ProfileDraft } from "@/mocks/profile";

const BANNER_HEIGHT = 100;
const AVATAR = 80;
const BIO_MAX = 150;

// Edits the mock profile in memory; becomes `users.updateProfile` / `users.setAvatar` in Phase 5
// (avatar + banner pickers need expo-image-picker) and account deletion lands in Phase 11.
export default function EditProfileScreen() {
  const insets = useSafeAreaInsets();
  const profile = useMyProfile();
  const { signOut } = useClerk();
  const [deleting, setDeleting] = useState(false);
  const [draft, setDraft] = useState<ProfileDraft>(() => ({
    displayName: profile.displayName,
    username: profile.username,
    bio: profile.bio,
    age: profile.age,
    location: profile.location,
    website: profile.website,
    tags: profile.tags,
  }));

  const set = <K extends keyof ProfileDraft>(key: K, value: ProfileDraft[K]) => setDraft((d) => ({ ...d, [key]: value }));

  const usernameError = validateUsername(draft.username);
  const dirty = (Object.keys(draft) as (keyof ProfileDraft)[]).some((k) => draft[k] !== profile[k]);
  const canSave = dirty && usernameError == null;

  const onSave = () => {
    updateMyProfile({
      ...draft,
      displayName: draft.displayName.trim(),
      bio: draft.bio.trim(),
      location: draft.location?.trim() || undefined,
      website: draft.website?.trim() || undefined,
    });
    router.back();
  };

  const onAddTag = () =>
    Alert.prompt("Add a detail", "e.g. Photographer, Traveler", (text) => {
      const label = text.trim();
      if (label && !draft.tags.some((t) => t.label.toLowerCase() === label.toLowerCase())) {
        set("tags", [...draft.tags, { label, icon: "tag" }]);
      }
    });

  const onRemoveTag = (label: string) =>
    Alert.alert(`Remove “${label}”?`, undefined, [
      { text: "Cancel", style: "cancel" },
      { text: "Remove", style: "destructive", onPress: () => set("tags", draft.tags.filter((t) => t.label !== label)) },
    ]);

  return (
    <View className="flex-1 bg-background">
      {/* Header: back, title, Save pill */}
      <View className="flex-row items-center gap-2 bg-background pl-2 pr-4" style={{ paddingTop: insets.top, height: insets.top + 52 }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back"
          onPress={() => router.back()}
          hitSlop={8}
          className="h-11 w-9 items-center justify-center active:opacity-60"
        >
          <Icon name="chevronLeft" size={18} weight="semibold" />
        </Pressable>
        <Text accessibilityRole="header" className="flex-1 font-inter-bold text-[22px] text-ink tracking-[-0.5px]">
          Edit profile
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: !canSave }}
          disabled={!canSave}
          onPress={onSave}
          className={`h-[32px] flex-row items-center gap-[6px] rounded-full bg-primary px-[14px] active:opacity-80 ${canSave ? "" : "opacity-40"}`}
          style={{ boxShadow: "0px 4px 12px rgba(31, 116, 253, 0.22)" }}
        >
          <Icon name="check" size={12} color="#FFFFFF" weight="bold" />
          <Text className="font-inter-semibold text-[13px] text-white">Save</Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: insets.bottom + 24, gap: 10 }}
        automaticallyAdjustKeyboardInsets
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Cover + avatar */}
        <View className="mb-[22px]">
          <View className="overflow-hidden rounded-[14px] bg-divider" style={{ height: BANNER_HEIGHT }}>
            <Image source={profile.cover} contentFit="cover" style={{ width: "100%", height: BANNER_HEIGHT }} />
            <View className="absolute bottom-[8px] right-[8px] h-[26px] flex-row items-center gap-[6px] rounded-full bg-white px-3">
              <Icon name="camera" size={11} />
              <Text className="font-inter-medium text-[11px] text-ink">Change banner</Text>
            </View>
          </View>
          <View className="absolute left-3" style={{ top: BANNER_HEIGHT - AVATAR + 22 }}>
            <View
              className="items-center justify-center rounded-full bg-white"
              style={{ width: AVATAR, height: AVATAR, boxShadow: "0px 2px 8px rgba(16, 24, 40, 0.12)" }}
            >
              <Image source={profile.avatar} contentFit="cover" style={{ width: AVATAR - 6, height: AVATAR - 6, borderRadius: (AVATAR - 6) / 2 }} />
            </View>
            <View className="absolute bottom-0 right-[-2px] h-[22px] w-[22px] items-center justify-center rounded-full border-2 border-white bg-primary">
              <Icon name="camera" size={10} color="#FFFFFF" />
            </View>
          </View>
        </View>

        <SettingsCard title="Personal info" subtitle="Your public profile information">
          <FieldRow icon="person" label="Full name" value={draft.displayName} onChangeText={(v) => set("displayName", v)} textContentType="name" maxLength={50} />
          <FieldRow
            icon="at"
            label="Username"
            value={draft.username}
            onChangeText={(v) => set("username", normalizeUsername(v))}
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="username"
            maxLength={USERNAME_MAX}
            error={usernameError}
            divider
          />
          <FieldRow icon="text" label="Bio" value={draft.bio} onChangeText={(v) => set("bio", v)} multiline maxLength={BIO_MAX} muted divider />
          <FieldRow
            icon="calendar"
            label="Age"
            value={draft.age != null ? String(draft.age) : ""}
            onChangeText={(v) => {
              const digits = v.replace(/\D/g, "");
              set("age", digits ? Number(digits) : undefined);
            }}
            keyboardType="number-pad"
            maxLength={3}
            placeholder="Add your age"
            muted
            divider
          />
          <FieldRow icon="location" label="Location" value={draft.location ?? ""} onChangeText={(v) => set("location", v)} placeholder="Add a location" muted divider />
          <FieldRow
            icon="link"
            label="Website"
            value={draft.website ?? ""}
            onChangeText={(v) => set("website", v)}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            placeholder="Add a link"
            link
            divider
          />
        </SettingsCard>

        <SettingsCard>
          <View className="pb-[13px] pt-[13px]">
            <Text accessibilityRole="header" className="font-inter-semibold text-[15px] text-ink">
              Additional info
            </Text>
            <Text className="mt-[3px] font-inter text-[11px] text-muted">Add details about yourself</Text>
            <View className="mt-[11px] flex-row flex-wrap gap-2">
              {draft.tags.map((tag) => (
                <Pressable
                  key={tag.label}
                  accessibilityRole="button"
                  accessibilityHint="Removes this detail"
                  onPress={() => onRemoveTag(tag.label)}
                  className="h-[28px] flex-row items-center gap-[6px] rounded-full bg-surface px-3 active:opacity-70"
                >
                  {tag.icon ? <Icon name={tag.icon} size={11} /> : null}
                  <Text className="font-inter text-[10.5px] text-ink">{tag.label}</Text>
                </Pressable>
              ))}
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Add a detail"
                onPress={onAddTag}
                className="h-[28px] w-[28px] items-center justify-center rounded-full border border-border bg-white active:opacity-70"
              >
                <Icon name="plus" size={12} />
              </Pressable>
            </View>
          </View>
        </SettingsCard>

        <SettingsCard>
          <SettingsRow icon="shield" label="Privacy settings" description="Control who can see your information" />
          <SettingsRow icon="bell" label="Notification preferences" description="Manage your notifications" divider />
          <SettingsRow icon="globe" label="Language" description="English" divider />
        </SettingsCard>

        <SettingsCard tone="info">
          <SettingsRow icon="feedback" label="Give feedback" description="Help us improve Codegram" tone="info" />
        </SettingsCard>
        <SettingsCard tone="danger">
          <SettingsRow icon="flag" label="Report a problem" description="A bug? An error? Let us know" tone="danger" />
        </SettingsCard>
        <SettingsCard tone="danger">
          <SettingsRow icon="trash" label="Delete my account" description="This action can't be undone" tone="danger" onPress={() => setDeleting(true)} />
        </SettingsCard>
      </ScrollView>

      <DeleteAccountSheet
        visible={deleting}
        onClose={() => setDeleting(false)}
        onConfirm={() => {
          setDeleting(false);
          signOut();
        }}
      />
    </View>
  );
}

type FieldRowProps = Omit<TextInputProps, "className" | "style"> & {
  icon: IconName;
  label: string;
  error?: string | null;
  muted?: boolean;
  link?: boolean;
  divider?: boolean;
};

function FieldRow({ icon, label, error, muted, link, divider, ...input }: FieldRowProps) {
  const color = link ? "text-link" : muted ? "text-muted" : "text-ink";
  return (
    <SettingsRow icon={icon} label={label} divider={divider}>
      <TextInput
        {...input}
        accessibilityLabel={label}
        placeholderTextColor="#8491AC"
        className={`mt-[3px] p-0 font-inter text-[13px] leading-[18px] ${color}`}
      />
      {error ? <Text className="mt-[3px] font-inter text-[11px] text-danger">{error}</Text> : null}
    </SettingsRow>
  );
}
