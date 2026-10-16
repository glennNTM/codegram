import type { ImageSourcePropType } from "react-native";

// Mock data for the Home UI. Shapes mirror what the Convex feed queries will return,
// so screens only swap their data source when the backend lands (Phase 7).

export type FeedUser = {
  id: string;
  username: string;
  avatar: ImageSourcePropType;
  verified?: boolean;
  hasStory?: boolean;
};

export type FeedMedia = {
  id: string;
  source: ImageSourcePropType;
};

export type FeedComment = {
  id: string;
  username: string;
  body: string;
};

export type FeedPost = {
  id: string;
  author: FeedUser;
  location?: string;
  createdAt: number;
  media: FeedMedia[];
  caption: string;
  likeCount: number;
  commentCount: number;
  viewerHasLiked: boolean;
  viewerHasSaved: boolean;
  previewComments: FeedComment[];
};

const HOUR = 3_600_000;

export const mockUsers = {
  me: { id: "u_me", username: "you", avatar: require("@/assets/mock/avatar-me.jpg") },
  alex: { id: "u_alex", username: "alex.m", avatar: require("@/assets/mock/avatar-alex.jpg"), verified: true, hasStory: true },
  lina: { id: "u_lina", username: "lina.rs", avatar: require("@/assets/mock/avatar-lina.jpg"), hasStory: true },
  marc: { id: "u_marc", username: "marc.duval", avatar: require("@/assets/mock/avatar-marc.jpg"), hasStory: true },
  sarah: { id: "u_sarah", username: "sarah.k", avatar: require("@/assets/mock/avatar-sarah.jpg"), verified: true, hasStory: true },
  thomas: { id: "u_thomas", username: "thomas", avatar: require("@/assets/mock/avatar-thomas.jpg"), hasStory: true },
} satisfies Record<string, FeedUser>;

export const currentUser: FeedUser = mockUsers.me;

export const storyUsers: FeedUser[] = [mockUsers.alex, mockUsers.lina, mockUsers.marc, mockUsers.sarah, mockUsers.thomas];

const nice = require("@/assets/mock/post-nice.jpg");
const coast = require("@/assets/images/auth/collage-coast.jpg");
const traveler = require("@/assets/images/auth/collage-traveler.jpg");

export function getMockFeed(now = Date.now()): FeedPost[] {
  return [
    {
      id: "p_1",
      // The reference shows alex.m's post with the "me" photo as avatar.
      author: { ...mockUsers.alex, avatar: mockUsers.me.avatar, hasStory: false },
      location: "Nice, France",
      createdAt: now - 2 * HOUR,
      media: [nice, coast, traveler, nice, coast, traveler].map((source, i) => ({ id: `m_1_${i}`, source })),
      caption: "Good vibes, better views. Nice never gets old. ☀️",
      likeCount: 12_400,
      commentCount: 342,
      viewerHasLiked: true,
      viewerHasSaved: false,
      previewComments: [
        { id: "c_1", username: "lina.rs", body: "Incroyable ! 😍" },
        { id: "c_2", username: "marc.duval", body: "La vue est folle 😍" },
      ],
    },
    {
      id: "p_2",
      author: mockUsers.sarah,
      location: "Biarritz, France",
      createdAt: now - 5 * HOUR,
      media: [{ id: "m_2_0", source: traveler }],
      caption: "Golden hour vibes ✨",
      likeCount: 856,
      commentCount: 32,
      viewerHasLiked: false,
      viewerHasSaved: false,
      previewComments: [],
    },
    {
      id: "p_3",
      author: mockUsers.lina,
      location: "Amalfi, Italy",
      createdAt: now - 26 * HOUR,
      media: [{ id: "m_3_0", source: coast }],
      caption: "Nature, toujours une bonne idée 🌊",
      likeCount: 1_200,
      commentCount: 48,
      viewerHasLiked: false,
      viewerHasSaved: true,
      previewComments: [{ id: "c_3", username: "alex.m", body: "Take me back 🙌" }],
    },
  ];
}
