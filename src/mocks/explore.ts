import type { ImageSourcePropType } from "react-native";

// Mock data for the Explore UI. Swaps to `posts.explore` + `users.search` in Phase 9.

export type SuggestedUser = {
  id: string;
  username: string;
  displayName: string;
  avatar: ImageSourcePropType;
  followerCount: number;
  /** Short line under the name on "Accounts to follow" cards. */
  category?: string;
  verified?: boolean;
};

export type TrendingTopic = {
  id: string;
  title: string;
  subtitle: string;
  cover: ImageSourcePropType;
  /** Wide card (the first one in the design). */
  featured?: boolean;
};

export type Reel = {
  id: string;
  thumb: ImageSourcePropType;
  durationMs: number;
  likeCount: number;
};

export type Place = {
  id: string;
  name: string;
  country: string;
  postCount: number;
  cover: ImageSourcePropType;
};

const avatars = {
  alex: require("@/assets/mock/avatar-alex.jpg"),
  lina: require("@/assets/mock/avatar-lina.jpg"),
  marc: require("@/assets/mock/avatar-marc.jpg"),
  sarah: require("@/assets/mock/avatar-sarah.jpg"),
  thomas: require("@/assets/mock/avatar-thomas.jpg"),
};

export const suggestedUsers: SuggestedUser[] = [
  { id: "u_lina", username: "lina.rs", displayName: "Lina Rousseau", avatar: avatars.lina, followerCount: 89_200 },
  { id: "u_marc", username: "marc.duval", displayName: "Marc Duval", avatar: avatars.marc, followerCount: 41_700 },
  { id: "u_sarah", username: "sarah.k", displayName: "Sarah Klein", avatar: avatars.sarah, followerCount: 23_900 },
  { id: "u_thomas", username: "thomas", displayName: "Thomas Lefèvre", avatar: avatars.thomas, followerCount: 56_100 },
];

export const accountsToFollow: SuggestedUser[] = [
  { id: "u_emma", username: "emma.riv", displayName: "Emma Rivière", avatar: avatars.sarah, followerCount: 142_000, category: "Photographer · Traveler", verified: true },
  { id: "u_nicolas", username: "nicolas.f", displayName: "Nicolas Fabre", avatar: avatars.thomas, followerCount: 98_000, category: "Food & Lifestyle", verified: true },
  { id: "u_julie", username: "julie.pics", displayName: "Julie Petit", avatar: avatars.lina, followerCount: 76_000, category: "Nature & Adventure", verified: true },
  { id: "u_adrien", username: "adrien.t", displayName: "Adrien Thomas", avatar: avatars.alex, followerCount: 54_000, category: "Art & Design", verified: true },
  { id: "u_lea", username: "lea", displayName: "Léa Martin", avatar: avatars.marc, followerCount: 42_000, category: "Fashion", verified: true },
];

export const trendingTopics: TrendingTopic[] = [
  { id: "t_travel", title: "Travel & Adventure", subtitle: "Incredible places around the world", cover: require("@/assets/mock/trend-mountains.jpg"), featured: true },
  { id: "t_lifestyle", title: "Lifestyle", subtitle: "Fashion, culture, everyday life", cover: require("@/assets/mock/trend-street.jpg") },
  { id: "t_food", title: "Food", subtitle: "Recipes and tasty finds", cover: require("@/assets/mock/trend-food.jpg") },
  { id: "t_architecture", title: "Architecture", subtitle: "The most beautiful places", cover: require("@/assets/mock/trend-architecture.jpg") },
];

export const popularReels: Reel[] = [
  { id: "r_1", thumb: require("@/assets/mock/reel-surf.jpg"), durationMs: 42_000, likeCount: 245_000 },
  { id: "r_2", thumb: require("@/assets/mock/reel-cathedral.jpg"), durationMs: 65_000, likeCount: 189_000 },
  { id: "r_3", thumb: require("@/assets/mock/reel-alley.jpg"), durationMs: 38_000, likeCount: 156_000 },
  { id: "r_4", thumb: require("@/assets/mock/reel-sunset.jpg"), durationMs: 51_000, likeCount: 142_000 },
  { id: "r_5", thumb: require("@/assets/mock/reel-plane.jpg"), durationMs: 47_000, likeCount: 98_000 },
];

export const places: Place[] = [
  { id: "pl_nice", name: "Nice", country: "France", postCount: 1_240_000, cover: require("@/assets/mock/post-coast.jpg") },
  { id: "pl_lisbon", name: "Lisbon", country: "Portugal", postCount: 980_000, cover: require("@/assets/mock/post-tram.jpg") },
  { id: "pl_biarritz", name: "Biarritz", country: "France", postCount: 312_000, cover: require("@/assets/mock/reel-surf.jpg") },
  { id: "pl_amalfi", name: "Amalfi", country: "Italy", postCount: 754_000, cover: require("@/assets/mock/post-sunset.jpg") },
  { id: "pl_dolomites", name: "Dolomites", country: "Italy", postCount: 421_000, cover: require("@/assets/mock/post-lake.jpg") },
];

/** Every searchable account (mock for `users.search`). */
export const searchableUsers: SuggestedUser[] = [...suggestedUsers, ...accountsToFollow];
