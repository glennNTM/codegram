import { Image } from "expo-image";
import { useState } from "react";
import { FlatList, Text, View, type NativeScrollEvent, type NativeSyntheticEvent } from "react-native";

import type { FeedMedia } from "@/mocks/feed";

// Media frame from the design: 4pt side inset, 9pt radius, ~1.305 aspect ratio.
const SIDE_INSET = 4;
const ASPECT = 1.305;

type Props = {
  media: FeedMedia[];
  width: number;
};

export function PostMedia({ media, width }: Props) {
  const [index, setIndex] = useState(0);
  const frameWidth = width - SIDE_INSET * 2;
  const frameHeight = Math.round(frameWidth / ASPECT);

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setIndex(Math.round(e.nativeEvent.contentOffset.x / frameWidth));
  };

  return (
    <View
      className="overflow-hidden rounded-[9px] bg-divider"
      style={{ marginHorizontal: SIDE_INSET, width: frameWidth, height: frameHeight }}
    >
      <FlatList
        data={media}
        keyExtractor={(m) => m.id}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScrollEnd}
        scrollEnabled={media.length > 1}
        renderItem={({ item }) => (
          <Image source={item.source} contentFit="cover" style={{ width: frameWidth, height: frameHeight }} />
        )}
      />
      {media.length > 1 ? (
        <View className="absolute right-[11px] top-[11px] h-[19px] min-w-[33px] items-center justify-center rounded-full bg-black/45 px-2">
          <Text className="font-inter-medium text-[11.5px] text-white">
            {index + 1}/{media.length}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
