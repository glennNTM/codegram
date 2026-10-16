import type { ImageSourcePropType } from "react-native";

import { getMockFeed, type FeedPost } from "@/mocks/feed";
import { getMockProfile } from "@/mocks/profile";
import { createStore } from "@/mocks/store";

// Posts on mock data: the Home feed, single-post lookups and owner actions. Becomes
// `feed.home`, `posts.get`, `posts.create`, `posts.updateCaption` and `posts.remove` (Phases 6–7).

const HOUR = 3_600_000;

type State = { created: FeedPost[]; deleted: string[]; captions: Record<string, string> };
const store = createStore<State>({ created: [], deleted: [], captions: {} });
const seed = getMockFeed();

function apply(post: FeedPost, s: State): FeedPost | undefined {
  if (s.deleted.includes(post.id)) return undefined;
  const caption = s.captions[post.id];
  return caption != null ? { ...post, caption } : post;
}

/** Home feed (newest first) with the viewer's new posts, edits and deletions applied. */
export function useFeedPosts(): FeedPost[] {
  const s = store.use();
  return [...s.created, ...seed].flatMap((p) => apply(p, s) ?? []);
}

/**
 * A single post. Feed posts are found by id; profile grid tiles only carry a thumbnail,
 * so they're expanded into a full post from the owner's profile (`author` = username).
 */
export function useMockPost(postId: string, author?: string): FeedPost | undefined {
  const s = store.use();
  const known = [...s.created, ...seed].find((p) => p.id === postId);
  if (known) return apply(known, s);

  const profile = author ? getMockProfile(author) : undefined;
  const tile = profile && [...profile.posts, ...profile.saved].find((p) => p.id === postId);
  if (!profile || !tile) return undefined;

  return apply(
    {
      id: tile.id,
      author: { id: profile.id, username: profile.username, avatar: profile.avatar, verified: profile.verified },
      location: profile.location,
      createdAt: Date.now() - 3 * 24 * HOUR,
      media: [{ id: `${tile.id}_0`, source: tile.thumb }],
      caption: profile.bio.split("\n")[0],
      likeCount: tile.likeCount,
      commentCount: 0,
      viewerHasLiked: false,
      viewerHasSaved: false,
      previewComments: [],
    },
    s,
  );
}

type NewPost = {
  author: FeedPost["author"];
  source: ImageSourcePropType;
  caption: string;
  location?: string;
};

export function createPost({ author, source, caption, location }: NewPost) {
  const id = `p_${Date.now()}`;
  const post: FeedPost = {
    id,
    author,
    location,
    createdAt: Date.now(),
    media: [{ id: `${id}_0`, source }],
    caption,
    likeCount: 0,
    commentCount: 0,
    viewerHasLiked: false,
    viewerHasSaved: false,
    previewComments: [],
  };
  store.set((s) => ({ ...s, created: [post, ...s.created] }));
}

export function updateCaption(postId: string, caption: string) {
  store.set((s) => ({ ...s, captions: { ...s.captions, [postId]: caption } }));
}

export function deletePost(postId: string) {
  store.set((s) => ({ ...s, deleted: [...s.deleted, postId] }));
}
