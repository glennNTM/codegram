import type { ImageSourcePropType } from "react-native";

import { mockUsers, type FeedUser } from "@/mocks/feed";
import { createStore } from "@/mocks/store";

// In-app notifications on mock data. Becomes `notifications.list` / `unreadCount` /
// `markAllRead` in Phase 8.

export type ActivityItem = {
  id: string;
  type: "like" | "comment" | "follow";
  actor: FeedUser;
  createdAt: number;
  /** Post id + its owner's username (to open it), and its thumbnail. */
  post?: { id: string; author: string; thumb: ImageSourcePropType };
  commentBody?: string;
  read: boolean;
};

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const now = Date.now();
const nicePost = { id: "p_1", author: "alex.m", thumb: require("@/assets/mock/post-nice.jpg") };
const lakePost = { id: "g_3", author: "alex.m", thumb: require("@/assets/mock/post-lake.jpg") };

const store = createStore<ActivityItem[]>([
  { id: "a_1", type: "like", actor: mockUsers.sarah, createdAt: now - 2 * MINUTE, post: nicePost, read: false },
  { id: "a_2", type: "comment", actor: mockUsers.lina, createdAt: now - 12 * MINUTE, post: nicePost, commentBody: "Incroyable ! 😍", read: false },
  { id: "a_3", type: "follow", actor: mockUsers.marc, createdAt: now - HOUR, read: false },
  { id: "a_4", type: "like", actor: mockUsers.thomas, createdAt: now - 2 * HOUR, post: lakePost, read: true },
  { id: "a_5", type: "follow", actor: mockUsers.sarah, createdAt: now - 3 * DAY, read: true },
  { id: "a_6", type: "comment", actor: mockUsers.thomas, createdAt: now - 9 * DAY, post: lakePost, commentBody: "Where is this lake?!", read: true },
]);

export const useActivity = store.use;

export function useHasUnreadActivity(): boolean {
  return store.use().some((a) => !a.read);
}

export function markAllActivityRead() {
  if (!store.get().some((a) => !a.read)) return;
  store.set((all) => all.map((a) => (a.read ? a : { ...a, read: true })));
}
