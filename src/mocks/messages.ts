import type { ImageSourcePropType } from "react-native";

import { mockUsers } from "@/mocks/feed";
import { createStore } from "@/mocks/store";

// 1:1 conversations on mock data. Shapes mirror `messages.listConversations` / `listMessages`
// so the screens only swap their data source in Phase 10.

export const ME_ID = "u_alex";

export type ChatUser = {
  id: string;
  username: string;
  /** Optional, like `users.displayName`; the chat list falls back to the username. */
  displayName?: string;
  avatar: ImageSourcePropType;
  verified?: boolean;
  hasStory?: boolean;
  /** Mock-only presence dot (no presence in the v1 backend). */
  online?: boolean;
};

export type Message = {
  id: string;
  senderId: string;
  body: string;
  createdAt: number;
};

type Conversation = {
  id: string;
  other: ChatUser;
  /** When I last opened the chat. */
  lastReadAt: number;
  /** When the other member last opened it (drives "Seen"). */
  otherLastReadAt: number;
  /** Oldest first. */
  messages: Message[];
};

export type ConversationSummary = {
  id: string;
  other: ChatUser;
  lastMessage?: Message;
  unread: boolean;
};

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const now = Date.now();

const DAY = 24 * HOUR;

const people = {
  sarah: { ...mockUsers.sarah, displayName: "Sarah K.", hasStory: true, online: true },
  alexis: { id: "u_alexis", username: "alexis.m", displayName: "Alexis Moreau", avatar: mockUsers.alex.avatar, verified: true },
  lina: { ...mockUsers.lina, displayName: undefined, hasStory: false },
  marc: { ...mockUsers.marc, displayName: undefined, hasStory: false },
  thomas: { ...mockUsers.thomas, displayName: undefined, hasStory: false },
  codegram: { id: "u_codegram", username: "codegram", displayName: "Codegram", avatar: require("@/assets/images/auth/collage-coast.jpg"), verified: true },
  emma: { id: "u_emma", username: "emma.riv", avatar: require("@/assets/mock/reel-sunset.jpg") },
} satisfies Record<string, ChatUser>;

/** People offered in the "New message" sheet (Phase 10: followers/following from Convex). */
export const suggestedRecipients: ChatUser[] = [people.sarah, people.lina, people.marc, people.thomas, people.emma];

function thread(otherId: string, lines: [mine: boolean, body: string, agoMs: number][]): Message[] {
  return lines.map(([mine, body, ago], i) => ({
    id: `${otherId}_${i}`,
    senderId: mine ? ME_ID : otherId,
    body,
    createdAt: now - ago,
  }));
}

function conversation(
  other: ChatUser,
  lines: [mine: boolean, body: string, agoMs: number][],
  { unread = false, seen = true } = {},
): Conversation {
  const messages = thread(other.id, lines);
  const last = messages.at(-1)?.createdAt ?? now;
  return {
    id: `conv_${other.username}`,
    other,
    lastReadAt: unread ? last - MINUTE : now,
    otherLastReadAt: seen ? now : last - MINUTE,
    messages,
  };
}

// Content mirrors design/message screen-ref.png.
const store = createStore<Conversation[]>([
  conversation(
    people.sarah,
    [
      [true, "Tu es où en ce moment ?", 40 * MINUTE],
      [false, "Salut ! Je suis à Santorin en ce moment, c'est magnifique 😍", 12 * MINUTE],
    ],
    { unread: true },
  ),
  conversation(
    people.alexis,
    [
      [true, "Je viens de poster les photos de Nice", HOUR],
      [false, "C'est incroyable ! Quelle vue 😍", 28 * MINUTE],
    ],
    { unread: true },
  ),
  conversation(people.lina, [
    [false, "On part en Grèce en juin !", 2 * HOUR],
    [true, "Tu pars quand exactement ?", HOUR],
  ], { seen: false }),
  conversation(
    people.marc,
    [
      [true, "Tu as trouvé où dormir ?", 5 * HOUR],
      [false, "J'ai trouvé un super hôtel à Chiang Mai", 3 * HOUR],
    ],
    { unread: true },
  ),
  conversation(people.thomas, [
    [false, "On part ce week-end ?", 8 * HOUR],
  ]),
  conversation(people.codegram, [[false, "Bienvenue sur Codegram ! 👋", DAY]]),
  conversation(people.emma, [
    [true, "Je suis rentrée hier 🌴", DAY + 2 * HOUR],
    [false, "Super voyage ! Tu nous raconteras ?", DAY],
  ]),
]);

function summarize(c: Conversation): ConversationSummary {
  const lastMessage = c.messages.at(-1);
  return {
    id: c.id,
    other: c.other,
    lastMessage,
    unread: lastMessage != null && lastMessage.senderId !== ME_ID && lastMessage.createdAt > c.lastReadAt,
  };
}

/** Chat list, most recent first; conversations with no messages yet are hidden. */
export function useConversations(): ConversationSummary[] {
  return store
    .use()
    .filter((c) => c.messages.length > 0)
    .map(summarize)
    .sort((a, b) => (b.lastMessage?.createdAt ?? 0) - (a.lastMessage?.createdAt ?? 0));
}

export function useUnreadConversationCount(): number {
  return useConversations().filter((c) => c.unread).length;
}

export function useConversation(id: string): Conversation | undefined {
  return store.use().find((c) => c.id === id);
}

export function markRead(id: string) {
  const conversation = store.get().find((c) => c.id === id);
  if (!conversation || !summarize(conversation).unread) return;
  store.set((all) => all.map((c) => (c.id === id ? { ...c, lastReadAt: Date.now() } : c)));
}

export function sendMessage(id: string, body: string) {
  const sentAt = Date.now();
  const message: Message = { id: `m_${sentAt}`, senderId: ME_ID, body, createdAt: sentAt };
  store.set((all) => all.map((c) => (c.id === id ? { ...c, lastReadAt: sentAt, messages: [...c.messages, message] } : c)));
  // Pretend the other person opens the chat shortly after, so "Seen" can be previewed.
  setTimeout(() => {
    store.set((all) => all.map((c) => (c.id === id ? { ...c, otherLastReadAt: Date.now() } : c)));
  }, 2_000);
}

/** Returns the existing 1:1 conversation with `user`, or starts an empty one. */
export function getOrCreateConversation(user: ChatUser): string {
  const existing = store.get().find((c) => c.other.id === user.id);
  if (existing) return existing.id;
  const id = `conv_${user.id}`;
  store.set((all) => [...all, { id, other: user, lastReadAt: Date.now(), otherLastReadAt: 0, messages: [] }]);
  return id;
}
