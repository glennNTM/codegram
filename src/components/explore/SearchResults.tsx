import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";

import { EmptyState } from "@/components/EmptyState";
import { Icon } from "@/components/ui/Icon";
import { formatCount } from "@/lib/format";
import { places, searchableUsers, type Place, type SuggestedUser } from "@/mocks/explore";

type Props = {
  query: string;
  scope: "people" | "places";
  onPressUser: (user: SuggestedUser) => void;
};

// Client-side filter over mocks; becomes `users.search` (withSearchIndex) in Phase 9.
export function SearchResults({ query, scope, onPressUser }: Props) {
  const q = query.trim().toLowerCase();

  if (scope === "people") {
    const users = searchableUsers.filter(
      (u) => u.username.includes(q) || u.displayName.toLowerCase().includes(q),
    );
    if (users.length === 0) return <NoResults query={query} />;
    return (
      <View>
        {users.map((user) => (
          <Pressable
            key={user.id}
            accessibilityRole="button"
            onPress={() => onPressUser(user)}
            className="h-[58px] flex-row items-center gap-3 px-4 active:bg-surface"
          >
            <Image source={user.avatar} style={{ width: 40, height: 40, borderRadius: 20 }} contentFit="cover" />
            <View className="flex-1">
              <View className="flex-row items-center gap-1">
                <Text className="font-inter-semibold text-[13px] text-ink">{user.username}</Text>
                {user.verified ? <Icon name="verified" size={11} color="#1F74FD" /> : null}
              </View>
              <Text numberOfLines={1} className="mt-[2px] font-inter text-[12px] text-muted">
                {user.displayName} · {formatCount(user.followerCount)} followers
              </Text>
            </View>
          </Pressable>
        ))}
      </View>
    );
  }

  const matches = places.filter((p) => p.name.toLowerCase().includes(q) || p.country.toLowerCase().includes(q));
  if (matches.length === 0) return <NoResults query={query} />;
  return (
    <View>
      {matches.map((place) => (
        <PlaceRow key={place.id} place={place} />
      ))}
    </View>
  );
}

function PlaceRow({ place }: { place: Place }) {
  return (
    <View className="h-[58px] flex-row items-center gap-3 px-4">
      <Image source={place.cover} style={{ width: 40, height: 40, borderRadius: 10 }} contentFit="cover" />
      <View className="flex-1">
        <Text className="font-inter-semibold text-[13px] text-ink">{place.name}</Text>
        <Text numberOfLines={1} className="mt-[2px] font-inter text-[12px] text-muted">
          {place.country} · {formatCount(place.postCount)} posts
        </Text>
      </View>
      <Icon name="location" size={16} color="#8491AC" />
    </View>
  );
}

function NoResults({ query }: { query: string }) {
  return <EmptyState icon="magnifyingglass" title="No results" message={`Nothing matches “${query.trim()}”.`} />;
}
