import type { ImageSourcePropType } from "react-native";

import { mockUsers } from "@/mocks/feed";
import { createStore } from "@/mocks/store";

// Flat comments, newest first. Becomes `comments.listByPost` / `add` / `remove` in Phase 8.

export type Comment = {
  id: string;
  postId: string;
  author: { id: string; username: string; avatar: ImageSourcePropType };
  body: string;
  createdAt: number;
};

const MINUTE = 60_000;
const now = Date.now();

const store = createStore<Comment[]>([
  { id: "c_1", postId: "p_1", author: mockUsers.lina, body: "Incroyable ! 😍", createdAt: now - 12 * MINUTE },
  { id: "c_2", postId: "p_1", author: mockUsers.marc, body: "La vue est folle 😍", createdAt: now - 40 * MINUTE },
  { id: "c_3", postId: "p_1", author: mockUsers.sarah, body: "Which beach is this? Adding it to my list.", createdAt: now - 70 * MINUTE },
  { id: "c_4", postId: "p_1", author: mockUsers.thomas, body: "The light on the second one 👌", createdAt: now - 95 * MINUTE },
  { id: "c_5", postId: "p_2", author: mockUsers.lina, body: "That colour palette!", createdAt: now - 3 * 60 * MINUTE },
  { id: "c_6", postId: "p_3", author: mockUsers.alex, body: "Take me back 🙌", createdAt: now - 20 * 60 * MINUTE },
]);

export function useComments(postId: string): Comment[] {
  return store
    .use()
    .filter((c) => c.postId === postId)
    .sort((a, b) => b.createdAt - a.createdAt);
}

export function addComment(postId: string, author: Comment["author"], body: string) {
  const comment: Comment = { id: `c_${Date.now()}`, postId, author, body, createdAt: Date.now() };
  store.set((all) => [comment, ...all]);
}

export function removeComment(commentId: string) {
  store.set((all) => all.filter((c) => c.id !== commentId));
}
