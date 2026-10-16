import { useSyncExternalStore } from "react";
import type { ImageSourcePropType } from "react-native";

import type { IconName } from "@/components/ui/Icon";

// Mock data for the Profile, Edit profile and user screens. Shapes mirror what `users.getByUsername`
// and `posts.listByAuthor` will return, so screens only swap their data source in Phase 5.

export type ProfileTag = {
  label: string;
  icon?: IconName;
};

export type GridPost = {
  id: string;
  thumb: ImageSourcePropType;
  mediaType: "image" | "video" | "multiple";
  likeCount: number;
};

export type Highlight = {
  id: string;
  title: string;
  cover: ImageSourcePropType;
};

export type Profile = {
  id: string;
  username: string;
  displayName: string;
  avatar: ImageSourcePropType;
  cover: ImageSourcePropType;
  verified: boolean;
  tags: ProfileTag[];
  bio: string;
  age?: number;
  location?: string;
  website?: string;
  postCount: number;
  followerCount: number;
  followingCount: number;
  viewerIsFollowing: boolean;
  highlights: Highlight[];
  posts: GridPost[];
  saved: GridPost[];
  tagged: GridPost[];
};

/** The editable subset of a profile (Edit profile screen). */
export type ProfileDraft = Pick<Profile, "displayName" | "username" | "bio" | "age" | "location" | "website" | "tags">;

const img = {
  nice: require("@/assets/mock/post-nice.jpg"),
  coast: require("@/assets/mock/post-coast.jpg"),
  backpacker: require("@/assets/mock/post-backpacker.jpg"),
  lake: require("@/assets/mock/post-lake.jpg"),
  food: require("@/assets/mock/post-food.jpg"),
  sunset: require("@/assets/mock/post-sunset.jpg"),
  tram: require("@/assets/mock/post-tram.jpg"),
  mountains: require("@/assets/mock/trend-mountains.jpg"),
  street: require("@/assets/mock/trend-street.jpg"),
  bowl: require("@/assets/mock/trend-food.jpg"),
  surf: require("@/assets/mock/reel-surf.jpg"),
  cathedral: require("@/assets/mock/reel-cathedral.jpg"),
  alley: require("@/assets/mock/reel-alley.jpg"),
  plane: require("@/assets/mock/reel-plane.jpg"),
  authCoast: require("@/assets/images/auth/collage-coast.jpg"),
  traveler: require("@/assets/images/auth/collage-traveler.jpg"),
} satisfies Record<string, ImageSourcePropType>;

const gridPosts: GridPost[] = [
  { id: "g_1", thumb: img.coast, mediaType: "video", likeCount: 12_400 },
  { id: "g_2", thumb: img.backpacker, mediaType: "video", likeCount: 8_700 },
  { id: "g_3", thumb: img.lake, mediaType: "multiple", likeCount: 15_800 },
  { id: "g_4", thumb: img.food, mediaType: "multiple", likeCount: 9_300 },
  { id: "g_5", thumb: img.sunset, mediaType: "video", likeCount: 21_300 },
  { id: "g_6", thumb: img.tram, mediaType: "multiple", likeCount: 7_500 },
  { id: "g_7", thumb: img.mountains, mediaType: "video", likeCount: 18_200 },
  { id: "g_8", thumb: img.cathedral, mediaType: "multiple", likeCount: 6_100 },
  { id: "g_9", thumb: img.plane, mediaType: "video", likeCount: 11_900 },
  { id: "g_10", thumb: img.surf, mediaType: "image", likeCount: 24_500 },
  { id: "g_11", thumb: img.alley, mediaType: "image", likeCount: 5_400 },
  { id: "g_12", thumb: img.nice, mediaType: "image", likeCount: 13_100 },
];

const highlights: Highlight[] = [
  { id: "h_1", title: "Travel", cover: img.authCoast },
  { id: "h_2", title: "Adventure", cover: img.mountains },
  { id: "h_3", title: "Food", cover: img.bowl },
  { id: "h_4", title: "Lifestyle", cover: img.street },
  { id: "h_5", title: "Nature", cover: img.lake },
];

const alex: Profile = {
  id: "u_alex",
  username: "alex.m",
  displayName: "Alex Martin",
  avatar: require("@/assets/mock/avatar-me.jpg"),
  cover: img.nice,
  verified: true,
  tags: [
    { label: "Photographer", icon: "camera" },
    { label: "Traveler", icon: "airplane" },
    { label: "Adventurer", icon: "mountain" },
  ],
  bio: "Capturing the world, one frame at a time.\nSharing my adventures, discoveries and my passion for photography.",
  age: 23,
  location: "France",
  website: "alexm.com",
  postCount: 248,
  followerCount: 12_400,
  followingCount: 342,
  viewerIsFollowing: false,
  highlights,
  posts: gridPosts,
  saved: [gridPosts[2], gridPosts[4], gridPosts[9]],
  tagged: [],
};

const others: Profile[] = [
  {
    ...alex,
    id: "u_lina",
    username: "lina.rs",
    displayName: "Lina Rousseau",
    avatar: require("@/assets/mock/avatar-lina.jpg"),
    cover: img.authCoast,
    verified: false,
    tags: [{ label: "Lifestyle" }, { label: "Paris" }],
    bio: "Slow mornings, long walks and good coffee ☕️",
    website: undefined,
    postCount: 182,
    followerCount: 89_200,
    followingCount: 410,
    posts: [...gridPosts].reverse(),
  },
  {
    ...alex,
    id: "u_marc",
    username: "marc.duval",
    displayName: "Marc Duval",
    avatar: require("@/assets/mock/avatar-marc.jpg"),
    cover: img.mountains,
    verified: false,
    tags: [{ label: "Hiker", icon: "mountain" }],
    bio: "Mountains first. Everything else after.",
    website: undefined,
    postCount: 96,
    followerCount: 41_700,
    followingCount: 201,
    posts: gridPosts.slice(3),
  },
  {
    ...alex,
    id: "u_sarah",
    username: "sarah.k",
    displayName: "Sarah Klein",
    avatar: require("@/assets/mock/avatar-sarah.jpg"),
    cover: img.sunset,
    tags: [{ label: "Surfer" }, { label: "Biarritz" }],
    bio: "Chasing waves and golden hours 🌊",
    website: "sarahk.studio",
    postCount: 311,
    followerCount: 23_900,
    followingCount: 512,
    posts: gridPosts.slice(0, 7),
  },
  {
    ...alex,
    id: "u_thomas",
    username: "thomas",
    displayName: "Thomas Lefèvre",
    avatar: require("@/assets/mock/avatar-thomas.jpg"),
    cover: img.cathedral,
    verified: false,
    tags: [{ label: "Architecture" }],
    bio: "Old buildings, new angles.",
    website: undefined,
    postCount: 57,
    followerCount: 56_100,
    followingCount: 98,
    posts: gridPosts.slice(5),
  },
];

// The signed-in user's profile, kept in memory so Edit profile → Save updates the Profile tab.
// Replaced by the `users.me` query + `users.updateProfile` mutation in Phase 5.
let me: Profile = alex;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useMyProfile(): Profile {
  return useSyncExternalStore(subscribe, () => me);
}

/** Any user's profile by username (mock lookup until `users.getByUsername`). */
export function getMockProfile(username: string): Profile | undefined {
  if (username === me.username) return me;
  return others.find((p) => p.username === username);
}

export function updateMyProfile(patch: Partial<ProfileDraft & Pick<Profile, "avatar">>) {
  me = { ...me, ...patch };
  listeners.forEach((l) => l());
}
