import { useClerk } from "@clerk/expo";
import { Image } from "expo-image";
import { useEffect, useState, type ReactNode } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, TextInput, View, type TextInputProps } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Icon } from "@/components/ui/Icon";
import { normalizeUsername, USERNAME_MAX, validateUsername } from "@/lib/username";
import { updateMyProfile } from "@/mocks/profile";
import { checkUsernameAvailable, completeOnboarding } from "@/mocks/session";

const BIO_MAX = 150;
const CHECK_DEBOUNCE_MS = 400;
const AVATAR = 104;

type Availability = "idle" | "checking" | "available" | "taken";

// Stand-ins for the photo picker until expo-image-picker lands (Phase 5).
const MOCK_AVATARS = [require("@/assets/mock/avatar-me.jpg"), require("@/assets/mock/avatar-alex.jpg")];

// Onboarding (designs #4 and #5): pick a unique @username (checked live), then an optional
// photo, display name and bio. Mock checks until `users.isUsernameAvailable` /
// `users.completeOnboarding` (Phase 3).
export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const { signOut } = useClerk();
  const [step, setStep] = useState<"username" | "profile">("username");

  const [username, setUsername] = useState("");
  const usernameError = username ? validateUsername(username) : null;
  const checkable = username !== "" && usernameError == null;
  // Last server answer, keyed by the username it was for; anything else is still "checking".
  const [checked, setChecked] = useState<{ username: string; free: boolean } | null>(null);
  const availability: Availability = !checkable
    ? "idle"
    : checked?.username !== username
      ? "checking"
      : checked.free
        ? "available"
        : "taken";

  const [avatar, setAvatar] = useState<number | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");

  // Debounced live availability check; stale responses are ignored.
  useEffect(() => {
    if (!checkable) return;
    let cancelled = false;
    const timer = setTimeout(async () => {
      const free = await checkUsernameAvailable(username);
      if (!cancelled) setChecked({ username, free });
    }, CHECK_DEBOUNCE_MS);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [username, checkable]);

  const finish = (withProfile: boolean) => {
    updateMyProfile({
      username,
      ...(withProfile && {
        displayName: displayName.trim() || username,
        bio: bio.trim(),
        ...(avatar != null && { avatar: MOCK_AVATARS[avatar] }),
      }),
    });
    completeOnboarding();
  };

  const onBack = () =>
    step === "profile"
      ? setStep("username")
      : Alert.alert("Leave sign up?", "You'll be signed out.", [
          { text: "Stay", style: "cancel" },
          { text: "Sign out", style: "destructive", onPress: () => signOut() },
        ]);

  const pickAvatar = () =>
    Alert.alert("Profile photo", undefined, [
      { text: "Choose from library", onPress: () => setAvatar((a) => ((a ?? -1) + 1) % MOCK_AVATARS.length) },
      { text: "Take photo", onPress: () => setAvatar((a) => ((a ?? -1) + 1) % MOCK_AVATARS.length) },
      ...(avatar != null ? [{ text: "Remove photo", style: "destructive" as const, onPress: () => setAvatar(null) }] : []),
      { text: "Cancel", style: "cancel" as const },
    ]);

  return (
    <View className="flex-1 bg-background">
      <View className="px-3" style={{ paddingTop: insets.top }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back"
          onPress={onBack}
          hitSlop={8}
          className="h-11 w-10 items-center justify-center active:opacity-60"
        >
          <Icon name="chevronLeft" size={18} weight="semibold" />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 12, paddingBottom: insets.bottom + 24 }}
        automaticallyAdjustKeyboardInsets
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
      >
        {step === "username" ? (
          <>
            <Title title="Choose your username" subtitle="This will be your unique identity on Codegram. You can change it later." />
            <Field
              prefix="@"
              value={username}
              onChangeText={(v) => setUsername(normalizeUsername(v))}
              placeholder="username"
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus
              textContentType="username"
              maxLength={USERNAME_MAX}
              returnKeyType="next"
              onSubmitEditing={() => availability === "available" && setStep("profile")}
              trailing={
                availability === "checking" ? (
                  <ActivityIndicator size="small" color="#8491AC" />
                ) : availability === "available" ? (
                  <Icon name="check" size={15} color="#16A34A" weight="bold" />
                ) : null
              }
            />
            <UsernameStatus error={usernameError} availability={availability} />
            <PrimaryButton label="Next" disabled={availability !== "available"} onPress={() => setStep("profile")} />
          </>
        ) : (
          <>
            <Title title="Set up your profile" subtitle="Add a photo, your name and a short bio." />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={avatar != null ? "Change profile photo" : "Add a profile photo"}
              onPress={pickAvatar}
              className="mb-6 self-center active:opacity-80"
            >
              <View className="items-center justify-center overflow-hidden rounded-full bg-surface" style={{ width: AVATAR, height: AVATAR }}>
                {avatar != null ? (
                  <Image source={MOCK_AVATARS[avatar]} contentFit="cover" style={{ width: AVATAR, height: AVATAR }} />
                ) : (
                  <Icon name="person" size={42} color="#8491AC" />
                )}
              </View>
              <View className="absolute bottom-[2px] right-[2px] h-[30px] w-[30px] items-center justify-center rounded-full border-[2.5px] border-background bg-primary">
                <Icon name="camera" size={13} color="#FFFFFF" />
              </View>
            </Pressable>

            <Label text="Display name" />
            <Field value={displayName} onChangeText={setDisplayName} placeholder="Your name" textContentType="name" maxLength={50} />

            <Label text="Bio" className="mt-4" />
            <Field
              value={bio}
              onChangeText={setBio}
              placeholder="Developer • Traveler • Basketball"
              multiline
              maxLength={BIO_MAX}
              inputClassName="min-h-[84px] py-3"
            />
            <Text className="mt-[6px] self-end font-inter text-[11px] text-subtle">
              {bio.length}/{BIO_MAX}
            </Text>

            <PrimaryButton label="Save" onPress={() => finish(true)} />
            <Pressable accessibilityRole="button" onPress={() => finish(false)} className="mt-2 h-11 items-center justify-center active:opacity-60">
              <Text className="font-inter-medium text-[14px] text-muted">Skip for now</Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </View>
  );
}

function Title({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <View className="mb-7">
      <Text accessibilityRole="header" className="font-inter-bold text-[26px] text-ink tracking-[-0.5px]">
        {title}
      </Text>
      <Text className="mt-2 font-inter text-[14px] leading-[20px] text-muted">{subtitle}</Text>
    </View>
  );
}

function Label({ text, className = "" }: { text: string; className?: string }) {
  return <Text className={`mb-[6px] font-inter-medium text-[12.5px] text-muted ${className}`}>{text}</Text>;
}

type FieldProps = Omit<TextInputProps, "className" | "style"> & {
  prefix?: string;
  trailing?: ReactNode;
  inputClassName?: string;
};

function Field({ prefix, trailing, inputClassName = "h-12", ...input }: FieldProps) {
  return (
    <View className="flex-row items-center gap-2 rounded-[12px] border border-border bg-white px-4">
      {prefix ? <Text className="font-inter-medium text-[16px] text-subtle">{prefix}</Text> : null}
      <TextInput
        {...input}
        placeholderTextColor="#8491AC"
        className={`flex-1 font-inter text-[15px] text-ink ${inputClassName}`}
        style={input.multiline ? { textAlignVertical: "top" } : undefined}
      />
      {trailing}
    </View>
  );
}

function UsernameStatus({ error, availability }: { error: string | null; availability: Availability }) {
  const [text, color] = error
    ? [error, "text-danger"]
    : availability === "taken"
      ? ["This username is already taken.", "text-danger"]
      : availability === "available"
        ? ["Username available", "text-[#16A34A]"]
        : availability === "checking"
          ? ["Checking availability…", "text-muted"]
          : ["Letters, numbers, periods and underscores.", "text-subtle"];
  return <Text className={`mt-2 font-inter text-[12px] ${color}`}>{text}</Text>;
}

function PrimaryButton({ label, disabled, onPress }: { label: string; disabled?: boolean; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      className={`mt-6 h-12 items-center justify-center rounded-full bg-primary active:opacity-80 ${disabled ? "opacity-40" : ""}`}
      style={{ boxShadow: "0px 4px 12px rgba(31, 116, 253, 0.22)" }}
    >
      <Text className="font-inter-semibold text-[15px] text-white">{label}</Text>
    </Pressable>
  );
}
