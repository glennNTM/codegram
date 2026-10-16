import type { ImageSourcePropType } from "react-native";

import { createStore } from "@/mocks/store";

// Viewer-level mock state: onboarding status and blocked users. Becomes the `users` row
// (`onboarded`, `isUsernameAvailable`) in Phase 3 and `blocks.*` in Phase 11.

// Starts false (in memory) so every fresh launch walks through onboarding while the UI is reviewed.
const onboarded = createStore(false);

export const useOnboarded = onboarded.use;

export function completeOnboarding() {
  onboarded.set(true);
}

const TAKEN = ["alex.m", "lina.rs", "marc.duval", "sarah.k", "thomas", "admin", "codegram"];

/** Fake network round-trip for the live username check (`users.isUsernameAvailable`). */
export function checkUsernameAvailable(username: string): Promise<boolean> {
  return new Promise((resolve) => setTimeout(() => resolve(!TAKEN.includes(username)), 450));
}

export type BlockedUser = {
  id: string;
  username: string;
  displayName: string;
  avatar: ImageSourcePropType;
};

const blocked = createStore<BlockedUser[]>([
  { id: "u_spam", username: "free.followers", displayName: "Free Followers", avatar: require("@/assets/mock/avatar-thomas.jpg") },
]);

export const useBlockedUsers = blocked.use;

export function blockUser(user: BlockedUser) {
  blocked.set((all) => (all.some((u) => u.id === user.id) ? all : [user, ...all]));
}

export function unblockUser(id: string) {
  blocked.set((all) => all.filter((u) => u.id !== id));
}
