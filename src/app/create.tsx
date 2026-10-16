import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Alert, Pressable, ScrollView, Text, TextInput, View, type ImageSourcePropType } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { SettingsRow } from "@/components/settings/SettingsRow";
import { Icon } from "@/components/ui/Icon";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { formatDuration } from "@/lib/format";
import { createPost } from "@/mocks/posts";
import { useMyProfile } from "@/mocks/profile";

const CAPTION_MAX = 2200;
const PREVIEW_ASPECT = 1.6;
const UPLOAD_MS = 1_200;

const TYPES = [
  { value: "image", label: "Photo" },
  { value: "video", label: "Video" },
] as const;

type MediaType = (typeof TYPES)[number]["value"];
type Picked = { type: MediaType; source: ImageSourcePropType; durationMs?: number };

// Stand-ins for the system library / camera until expo-image-picker lands (Phase 5).
const MOCK_LIBRARY: Record<MediaType, Picked[]> = {
  image: [
    { type: "image", source: require("@/assets/mock/post-coast.jpg") },
    { type: "image", source: require("@/assets/mock/post-lake.jpg") },
    { type: "image", source: require("@/assets/mock/post-sunset.jpg") },
  ],
  video: [
    { type: "video", source: require("@/assets/mock/reel-surf.jpg"), durationMs: 45_000 },
    { type: "video", source: require("@/assets/mock/reel-plane.jpg"), durationMs: 28_000 },
  ],
};

// Create post (design #7): Photo/Video, media preview, caption, location, Share with progress.
// Mock picker + upload; becomes expo-image-picker + `useUploadMedia` + `posts.create` (Phases 5–6).
export default function CreatePostScreen() {
  const insets = useSafeAreaInsets();
  const me = useMyProfile();
  const [type, setType] = useState<MediaType>("image");
  const [picked, setPicked] = useState<Picked | null>(null);
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState<string>();
  const [sharing, setSharing] = useState(false);
  const pickCount = useRef(0);

  const progress = useSharedValue(0);
  const progressStyle = useAnimatedStyle(() => ({ width: `${progress.get() * 100}%` }));

  useEffect(() => {
    if (!sharing) return;
    progress.set(withTiming(1, { duration: UPLOAD_MS }));
    const done = setTimeout(() => {
      if (picked) {
        createPost({
          author: { id: me.id, username: me.username, avatar: me.avatar, verified: me.verified },
          source: picked.source,
          caption: caption.trim(),
          location,
        });
      }
      router.back();
    }, UPLOAD_MS + 150);
    return () => clearTimeout(done);
  }, [sharing, picked, caption, location, me, progress]);

  const pickFromMock = () => {
    const options = MOCK_LIBRARY[type];
    setPicked(options[pickCount.current++ % options.length]);
  };

  const choose = () =>
    Alert.alert(type === "image" ? "Add a photo" : "Add a video", type === "video" ? "Up to 60 seconds." : undefined, [
      { text: "Choose from library", onPress: pickFromMock },
      { text: type === "image" ? "Take photo" : "Record video", onPress: pickFromMock },
      { text: "Cancel", style: "cancel" },
    ]);

  const onChangeType = (next: MediaType) => {
    if (next === type) return;
    setType(next);
    setPicked(null);
  };

  const onAddLocation = () =>
    Alert.prompt("Add location", undefined, (text) => setLocation(text.trim() || undefined), "plain-text", location);

  return (
    <View className="flex-1 bg-white">
      <ScreenHeader title="Create post" onBack={() => router.back()} safeTop={false} />

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: insets.bottom + 24, gap: 14 }}
        automaticallyAdjustKeyboardInsets
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
      >
        <SegmentedControl options={TYPES} value={type} onChange={onChangeType} />

        {/* Media preview (tap to pick / replace) */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={picked ? "Replace media" : type === "image" ? "Add a photo" : "Add a video"}
          onPress={choose}
          disabled={sharing}
          className="overflow-hidden rounded-[14px] bg-surface active:opacity-90"
          style={{ aspectRatio: PREVIEW_ASPECT }}
        >
          {picked ? (
            <>
              <Image source={picked.source} contentFit="cover" style={{ width: "100%", height: "100%" }} transition={150} />
              {picked.type === "video" ? (
                <View className="absolute bottom-3 left-3 flex-row items-center gap-[5px] rounded-full bg-black/50 px-[9px] py-[4px]">
                  <Icon name="play" size={10} color="#FFFFFF" />
                  <Text className="font-inter-medium text-[11px] text-white">{formatDuration(picked.durationMs ?? 0)}</Text>
                </View>
              ) : null}
              <View className="absolute right-3 top-3 h-[28px] flex-row items-center gap-[6px] rounded-full bg-white px-3">
                <Icon name="camera" size={11} />
                <Text className="font-inter-medium text-[11px] text-ink">Replace</Text>
              </View>
            </>
          ) : (
            <View className="flex-1 items-center justify-center gap-2 rounded-[14px] border-2 border-dashed border-border">
              <View className="h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Icon name={type === "image" ? "camera" : "reels"} size={22} color="#1F74FD" />
              </View>
              <Text className="font-inter-semibold text-[14px] text-ink">{type === "image" ? "Add a photo" : "Add a video"}</Text>
              <Text className="font-inter text-[12px] text-muted">
                {type === "image" ? "From your library or camera" : "Up to 60 seconds"}
              </Text>
            </View>
          )}
        </Pressable>

        {/* Caption */}
        <View>
          <TextInput
            value={caption}
            onChangeText={setCaption}
            placeholder="Add a caption…"
            placeholderTextColor="#8491AC"
            multiline
            maxLength={CAPTION_MAX}
            editable={!sharing}
            accessibilityLabel="Caption"
            className="min-h-[84px] rounded-[12px] border border-border bg-white px-4 pb-3 pt-3 font-inter text-[14px] leading-[20px] text-ink"
            style={{ textAlignVertical: "top" }}
          />
          <Text className="mt-[6px] self-end font-inter text-[11px] text-subtle">
            {caption.length}/{CAPTION_MAX}
          </Text>
        </View>

        <View className="rounded-[14px] border border-divider px-4">
          <SettingsRow icon="location" label="Add location" description={location} onPress={onAddLocation} />
          <SettingsRow
            icon="gear"
            label="Advanced settings"
            description="Hide like count, turn off comments"
            onPress={() => Alert.alert("Advanced settings", "Coming soon.")}
            divider
          />
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: !picked || sharing, busy: sharing }}
          disabled={!picked || sharing}
          onPress={() => setSharing(true)}
          className={`mt-1 h-12 items-center justify-center overflow-hidden rounded-full bg-primary active:opacity-80 ${picked ? "" : "opacity-40"}`}
        >
          {sharing ? <Animated.View className="absolute bottom-0 left-0 top-0 bg-white/25" style={progressStyle} /> : null}
          <Text className="font-inter-semibold text-[15px] text-white">{sharing ? "Sharing…" : "Share"}</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
