l# Codegram — v1 Spec & Implementation Plan

## Context
Glenn wants a simple Instagram-style iOS app, built in the existing fresh Expo project at
`Desktop/codegram`: Expo SDK 57, expo-router ~57.0.28, RN 0.86.3, React 19.2.3, Reanimated 4.5.1,
`@expo/ui`, `expo-glass-effect`, `expo-image` and `expo-symbols` already installed, routes in `src/app/`, typed routes and
React Compiler enabled, alias `@/* → src/*`. Clerk handles auth and Convex is the backend and database. This file
records the spec agreed in the interview plus a phased plan to build it step by step.

**Step 0 on approval:** copy this whole document to `codegram/plan.md` (the project root), then run the phases in order.
Each phase ends with a check before the next one starts. Per `AGENTS.md`, check every Expo API against the v57 docs
(`https://docs.expo.dev/versions/v57.0.0/`), always use `npx expo install`, and run `npx expo lint` and `npx tsc --noEmit` at
the end of each phase.

---

## 1. Spec summary

**Product**: a mobile-first photo/video social app. Users post one photo or one video, follow people, like and comment,
and DM each other.
**Platform**: iOS only, light mode only. Runs as a local development build or simulator; no TestFlight or App Store in v1.

### Scope: IN
- Sign in / sign up with **Google** and **Apple** through **Clerk browser OAuth (`useSSO`)**, using **only the publishable key**
  and the Clerk dev instance's shared OAuth credentials (no Apple Developer or Google Cloud setup, no Clerk secret key).
- Onboarding: a unique @username (checked live) plus an optional display name and avatar.
- Post: **1 photo OR 1 video (≤60s)** plus a caption. Media comes from the photo library or the system camera. The caption can be edited later; the media can't.
- Delete your own posts. Delete your own comments; a post owner can delete any comment on their post.
- Follow / unfollow (public accounts only, instant).
- Like / unlike; flat comments, newest first.
- **Demo content**: seeded demo accounts and posts. A user who follows nobody sees them in Home under
  "Suggested for you", with Follow buttons.
- DMs: the Messages tab is a **minimal chat list** (avatar, name, last message, time, unread dot; no search, filters or
  requests). Tapping a row opens a real-time 1:1 text chat with a "Seen" marker. Anyone can DM anyone except blocked users.
- Activity screen (heart icon in the Home header): likes, comments and follows, with an unread dot.
- Own profile: view and edit avatar, display name, username and bio. Other users' profiles: posts grid, counts, Follow, Message.
- Block a user; report a post, comment or user (stored and reviewed in the Convex dashboard).
- In-app account deletion = hard delete of all Convex data plus Clerk `user.delete()`.
- 4 **NativeTabs**: Home, Messages, Explore, Profile.

### Scope: OUT (v1)
Android, web, dark mode, push notifications, carousels, threaded replies and comment likes, group chats, media in DMs, sharing posts to DMs,
private accounts, stories/reels, ranking, admin UI, Clerk webhooks or secret key, TestFlight/App Store, prod environment, i18n.

### Core flows
1. **First launch** → Sign-in (Continue with Apple / Google) → onboarding (username, then optional avatar/name) → Home shows the
   "Suggested for you" demo posts. *Aha moment: tapping Follow on a demo or real user makes Home turn into their feed.*
2. **Returning user** → session restored from `tokenCache` (secure store) → Home.
3. **Create post** → "+" in the Home header → modal: pick from library or camera → preview, caption → Share → progress →
   the modal closes and the post shows up in your profile and your followers' feeds.
4. **Home** → paginated feed of posts from people you follow plus your own (or the demo fallback) → like, comment, author.
5. **Explore** → 3-column grid of recent posts from everyone + header search bar (users) → profile.
6. **Messages** → minimal chat list → chat (real-time, Seen). New chats start from a profile's "Message" button.
7. **Profile** → header (avatar, counts, bio), posts grid, Edit profile, Settings (blocked users, sign out, delete account).

---

## 2. Decisions locked in the interview
| Topic | Decision |
|---|---|
| Platforms | iOS only, light mode only (`userInterfaceStyle: "light"`) |
| Auth | Clerk `@clerk/expo` (v4.12.x), browser OAuth via `useSSO`, publishable key only, dev instance |
| User source of truth | The Convex `users` table. Clerk = identity only. The user row is created on the first authenticated call. |
| Media | Convex File Storage, compressed on the device, video ≤60s |
| Post shape | 1 photo or 1 video + caption (caption editable) |
| Capture | `expo-image-picker` (library + system camera) |
| Accounts | Public only (`follows.status` reserved for v2) |
| Feeds | Home = following + own (demo fallback if following nobody); Explore = everyone's posts + user search |
| DMs | Minimal list, 1:1 text, real-time, Seen/unread, anyone ↔ anyone |
| Notifications | No push. An in-app Activity screen. |
| Comments | Flat |
| Moderation | Block + report → Convex dashboard |
| Deletion | Hard delete everything |
| Styling | **NativeWind 4.2.7 + Tailwind CSS v3**, light theme tokens with placeholder colors until the design reference arrives |
| Environments | Dev only (one Convex dev deployment, one Clerk dev instance) |
| Done | Every flow works in the local iOS dev build or simulator; lint, typecheck and Convex tests pass |
| Tests | Convex function tests only (`convex-test` + Vitest) |

---

## 3. Data model (`convex/schema.ts`)
| Table | Fields | Indexes |
|---|---|---|
| users | tokenIdentifier, username (lowercase), displayName?, bio?, avatarStorageId?, followerCount, followingCount, postCount, isDemo, onboarded | by_token, by_username, by_demo; searchIndex `search_username` (searchField username, plus displayName) |
| posts | authorId, mediaType `"image"\|"video"`, mediaStorageId, thumbStorageId?, width, height, durationMs?, caption, likeCount, commentCount, isDemo, editedAt? | by_author, by_demo |
| feedItems | ownerId, postId, authorId, postCreatedAt | by_owner_time [ownerId, postCreatedAt], by_post, by_owner_author |
| follows | followerId, followingId, status `"active"` | by_follower, by_following, by_pair [followerId, followingId] |
| likes | postId, userId | by_post_user, by_user |
| comments | postId, authorId, body | by_post, by_author |
| conversations | pairKey (`${minId}_${maxId}`), lastMessageAt, lastMessagePreview, lastSenderId | by_pairKey |
| conversationMembers | conversationId, userId, lastReadAt, lastMessageAt (denormalized) | by_user_lastMessage [userId, lastMessageAt], by_conversation |
| messages | conversationId, senderId, body | by_conversation |
| notifications | recipientId, actorId, type `"like"\|"comment"\|"follow"`, postId?, commentId?, readAt? | by_recipient, by_recipient_unread |
| blocks | blockerId, blockedId | by_blocker, by_blocked, by_pair |
| reports | reporterId, targetType `"post"\|"comment"\|"user"`, targetId (string), reason, status `"open"` | by_status |

Rules: uniqueness (username, follow pair, like pair, pairKey) is enforced inside mutations. Counters change in the same
mutation as the row. All IDs use `v.id(...)`. Text limits: username 3–30 chars `[a-z0-9._]`, caption ≤2200, comment ≤500,
DM ≤2000, bio ≤150.

---

## 4. Project structure (target)
```
codegram/
  plan.md
  app.json                      # userInterfaceStyle "light", plugins (expo-image-picker perms, expo-video, expo-secure-store, expo-web-browser)
  babel.config.js               # nativewind/babel preset (v4)
  metro.config.js               # withNativeWind(config, { input: "./src/global.css" })
  tailwind.config.js            # content: ./src/**/*.{ts,tsx}; theme tokens (placeholder palette)
  nativewind-env.d.ts
  vitest.config.ts              # edge-runtime env for convex-test
  .env.local                    # EXPO_PUBLIC_CONVEX_URL, EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY (gitignored)
  convex/
    schema.ts  auth.config.ts  convex.config.ts (rate-limiter component)
    lib/auth.ts                 # getViewer / requireViewer / requireOnboarded
    lib/blocks.ts               # isBlockedEitherWay
    lib/rateLimits.ts
    users.ts  files.ts  posts.ts  feed.ts  follows.ts  likes.ts  comments.ts
    notifications.ts  messages.ts  blocks.ts  reports.ts  account.ts  seed.ts
    tests/*.test.ts
  src/
    global.css
    app/
      _layout.tsx               # ClerkProvider > ConvexProviderWithClerk > root Stack with Stack.Protected guards
      sign-in.tsx
      onboarding.tsx
      create.tsx                # modal
      user/[username].tsx
      post/[postId].tsx
      post/[postId]/comments.tsx   # formSheet
      (tabs)/_layout.tsx        # NativeTabs: home, messages, explore, profile
      (tabs)/home/_layout.tsx  index.tsx  activity.tsx
      (tabs)/messages/_layout.tsx  index.tsx  [conversationId].tsx
      (tabs)/explore/_layout.tsx  index.tsx
      (tabs)/profile/_layout.tsx  index.tsx  edit.tsx  settings.tsx  blocked.tsx
    components/                 # PostCard, PostMedia, VideoPlayer, Avatar, ProfileHeader, PostGrid, FollowButton,
                                # CommentRow, ChatRow, MessageBubble, EmptyState, Button, TextField
    lib/                        # upload.ts, media.ts (compress/thumbnail), time.ts, username.ts
    hooks/                      # useViewer, useUploadMedia
```
Add tsconfig path `"@convex/*": ["./convex/*"]`. Shared detail routes (`user/`, `post/`) live on the root Stack, so they cover
the tab bar. This is a deliberate simplification for v1.

---

## 5. Implementation phases

### Phase 1: Foundation (styling + cleanup)
1. `app.json`: `userInterfaceStyle: "light"`, keep `scheme: "codegram"` (needed for the OAuth redirect), set the iOS `bundleIdentifier`
   (`com.glenn.codegram`).
2. Remove the template screens in `src/app/index.tsx` / `_layout.tsx` (the `reset-project` script references are fine to drop).
3. NativeWind v4: `npx expo install nativewind@4.2.7 tailwindcss@^3.4 react-native-css-interop` (check the v4 docs for
   the current dependency list). Create `tailwind.config.js` (preset `nativewind/preset`), `src/global.css`
   (`@tailwind base; components; utilities`), `babel.config.js` (`jsxImportSource: "nativewind"`, `nativewind/babel`),
   `metro.config.js` (`withNativeWind`), and `nativewind-env.d.ts`. Import `global.css` in the root layout.
4. Theme tokens in `tailwind.config.js`: `bg`, `surface`, `border`, `text`, `muted`, `accent`, `danger`, plus radii and font sizes.
   **Placeholder palette** (neutral + one accent), to be replaced when the design reference arrives.
5. **Smoke test (go/no-go):** a test screen using `className` on View/Text/Pressable, plus one Reanimated animation, under React
   Compiler on RN 0.86. If it breaks, stop and switch to NativeWind 5.0.0-rc.0 or Uniwind 1.12 (both Tailwind v4) before going further.
- ✅ Check: the app runs on the iOS simulator with Tailwind styles applied; lint and tsc are clean.

### Phase 2: Convex backend skeleton
1. `npx expo install convex` → `npx convex dev` (creates the dev deployment, writes `EXPO_PUBLIC_CONVEX_URL` to `.env.local`).
2. Write the full `convex/schema.ts` from §3.
3. `convex/auth.config.ts`: provider `{ domain: process.env.CLERK_JWT_ISSUER_DOMAIN, applicationID: "convex" }`. Set the env var
   in the Convex dashboard. In Clerk, enable the Convex integration (or create a JWT template named `convex`).
4. `convex/lib/auth.ts`: `getViewer(ctx)` (identity → user via `by_token`, may return null), `requireViewer`, and `requireOnboarded`.
5. `users.ensureUser` mutation: idempotent; creates the row (`onboarded: false`, counts 0) on the first authenticated call.
6. Tests: `npm i -D vitest convex-test @edge-runtime/vm`, `vitest.config.ts`, a `"test": "vitest"` script. First test: ensureUser
   is idempotent.
- ✅ Check: `npx convex dev` deploys the schema; `npm test` passes.

### Phase 3: Auth + guards + onboarding
1. `npx expo install @clerk/expo expo-secure-store expo-web-browser expo-auth-session expo-crypto` (confirm the needed
   peer packages for `useSSO` in the Clerk Expo docs at implementation time).
2. Root `_layout.tsx`: `<ClerkProvider publishableKey tokenCache>` (from `@clerk/expo/token-cache`) →
   `<ConvexProviderWithClerk client useAuth>` → `<Stack>` with `Stack.Protected` guards:
   signed-out → `sign-in`; signed-in but not onboarded → `onboarding`; onboarded → `(tabs)` plus the detail and modal routes.
   Splash screen stays up until Clerk is loaded and the viewer query resolves.
3. `sign-in.tsx`: logo and tagline, "Continue with Apple" and "Continue with Google" buttons → `useSSO().startSSOFlow({ strategy:
   "oauth_apple" | "oauth_google", redirectUrl })` → `setActive`. Call `WebBrowser.maybeCompleteAuthSession()` and warm up the browser.
   Show a loading state and errors in a toast or inline.
4. Clerk dashboard (dev): enable the Google and Apple social connections (shared dev credentials), allow the native redirect
   `codegram://`, and enable **"Allow users to delete their accounts"** (needed for Phase 11).
5. After sign-in, the client calls `users.ensureUser`.
6. `onboarding.tsx`: a username field with live `users.isUsernameAvailable` (debounced), validation from `lib/username.ts`,
   optional display name, optional avatar (upload util from Phase 5, or skip). `users.completeOnboarding` re-checks
   uniqueness on the server and sets `onboarded: true`.
- ✅ Check: a fresh Google and Apple sign-in reaches onboarding; a duplicate username is rejected; relaunching the app skips sign-in;
  sign out returns to sign-in. Tests: username uniqueness, case-insensitivity, validation.

### Phase 4: Tab shell (NativeTabs)
1. `(tabs)/_layout.tsx`: `import { NativeTabs } from "expo-router/native-tabs"` with 4 `NativeTabs.Trigger`s:
   home (`house` / `house.fill`), messages (`bubble.left.and.bubble.right` / `.fill`), explore (`magnifyingglass`),
   profile (`person.crop.circle` / `.fill`). The Messages badge shows the unread conversation count (wired up in Phase 10).
   `minimizeBehavior="onScrollDown"` (iOS 26). Check the Trigger child API (`Icon` / `Label` / `Badge`) against the installed version.
2. Each tab folder gets a `_layout.tsx` Stack with large titles and an `index.tsx` placeholder. Home header: "+" (create) on the left,
   heart (activity) on the right.
3. Shared UI primitives: `Button`, `TextField`, `Avatar` (`expo-image`, initials fallback), `EmptyState`.
- ✅ Check: switching tabs keeps each tab's stack state; the tab bar uses native Liquid Glass on iOS 26.

### Phase 5: Media upload + profile
1. `npx expo install expo-image-picker expo-image-manipulator expo-video expo-video-thumbnails` plus config plugins with
   camera and photo permission strings in `app.json`.
2. `convex/files.ts`: `generateUploadUrl` (auth required), `getUrl`. Media URLs are resolved inside queries with
   `ctx.storage.getUrl`, so the client never handles storage IDs.
3. `src/lib/media.ts`: image → resize to max 1080px wide, JPEG 0.8. Video → picker `videoMaxDuration: 60`, iOS export preset at medium
   quality, reject >100 MB, generate a thumbnail with `expo-video-thumbnails`.
4. `src/hooks/useUploadMedia.ts`: get an upload URL → `fetch(POST, blob)` → `storageId`, with progress and error state and one automatic retry.
5. `users.ts`: `me`, `getByUsername` (profile + counts + `isFollowing` + `isBlocked`), `updateProfile` (username re-checked),
   `setAvatar` (deletes the old storage file).
6. Screens: `profile/index.tsx` (ProfileHeader + PostGrid, with an empty state), `profile/edit.tsx`, `user/[username].tsx`.
- ✅ Check: edit name, bio and avatar and see the change everywhere instantly. Tests: updateProfile ownership, username conflict.

### Phase 6: Posts
1. `posts.ts`: `create` (validates storage IDs, media type and caption; increments `postCount`; schedules
   `internal.feed.fanOut`), `updateCaption` (author only, sets `editedAt`), `remove` (author only → deletes the storage files and
   schedules `internal.posts.cascadeDelete` for likes, comments, notifications and feedItems, in batches), `get`, `listByAuthor`
   (paginated, for grids).
2. `create.tsx` modal: choose Library or Camera → preview (image, or video with play) → caption → Share (disabled while uploading,
   with a progress bar) → close.
3. Components: `PostCard` (header with avatar, username, time and a "…" menu offering Delete/Edit for the owner or Report/Block for others;
   media; action row with like, comment and message icons; like count; caption; "View all N comments"), `PostMedia`, `VideoPlayer`
   (`expo-video` `useVideoPlayer`, muted autoplay when visible via `onViewableItemsChanged`, tap to unmute, loop).
4. `post/[postId].tsx`: detail view using PostCard.
- ✅ Check: post a photo and a 60s video, edit the caption, delete the post and confirm everything is gone, including storage. Tests: only the author can
  edit or delete; the cascade removes dependents.

### Phase 7: Follows + Home feed + demo fallback
1. `follows.ts`: `follow` (idempotent through `by_pair`, no self-follow, blocked either way → error; updates both counters;
   creates a `follow` notification; schedules `internal.feed.backfill` for the followee's latest 20 posts), `unfollow` (idempotent;
   schedules `internal.feed.removeAuthor`), `listFollowers` / `listFollowing` (paginated).
2. `feed.ts`: `fanOut(postId)` inserts a feedItem for the author and each follower, in batches of 200 with self-rescheduling.
   `home` is a paginated query on `by_owner_time`; it joins post, author and `viewerHasLiked` and filters out blocked authors.
   `suggested` returns posts with `isDemo` (index `by_demo`), newest first, with author info.
3. `home/index.tsx`: `usePaginatedQuery(home)`. If the viewer's `followingCount === 0`, render a "Suggested for you" header plus
   the demo posts, each with a FollowButton. Pull to refresh (no-op re-render), infinite scroll, skeletons on first load.
4. `FollowButton` with an optimistic update (`withOptimisticUpdate`).
- ✅ Check: a new user sees demo posts; following a demo account switches Home to the real feed and shows their posts; unfollowing
  removes them. Tests: follow idempotency, counters, backfill, fan-out, no self-follow.

### Phase 8: Likes, comments, activity
1. `likes.ts`: `toggle` (idempotent; updates `likeCount`; creates a `like` notification when you like someone else's post, and deletes it
   on unlike). Optimistic update in PostCard. Double-tap to like the media, with a heart animation (Reanimated).
2. `comments.ts`: `add` (≤500 chars, rate-limited, increments `commentCount`, `comment` notification), `remove` (comment
   author OR post author), `listByPost` (paginated, newest first, blocked users filtered out).
3. `post/[postId]/comments.tsx` as a `formSheet`: list, composer pinned to the bottom (keyboard-aware), swipe or long-press to
   delete for allowed users.
4. `notifications.ts`: `list` (paginated, joins actor and post thumbnail), `unreadCount`, `markAllRead` (called when the
   Activity screen is opened). `home/activity.tsx` shows the list. The Home header heart shows a dot when `unreadCount > 0`.
- ✅ Check: two simulator accounts like and comment on each other's posts; Activity updates live; delete rules hold.
  Tests: comment deletion permissions, like idempotency, notification creation and removal.

### Phase 9: Explore
1. `posts.explore`: paginated query of recent posts from everyone (newest first, excluding blocked users; demo posts included).
2. `users.search`: `withSearchIndex("search_username")`, limit 20, excludes blocked users and yourself.
3. `explore/index.tsx`: a 3-column square grid (video tiles show a play glyph and use the thumbnail), plus a native header search bar
   (`headerSearchBarOptions`). While a query is typed, show user results; with an empty query, show the grid.
- ✅ Check: search finds users by username or display name; tapping a tile opens the post detail.

### Phase 10: Direct messages
1. `messages.ts`:
   - `getOrCreateConversation(otherUserId)`: pairKey lookup; creates the conversation plus 2 members; rejected if blocked.
   - `send(conversationId, body)`: membership check, ≤2000 chars, rate limit 30/min; inserts the message; updates the conversation's
     `lastMessageAt` and preview and each member's `lastMessageAt`; the sender's `lastReadAt` = now.
   - `listConversations`: paginated via `by_user_lastMessage`; joins the other user and `unread` (lastMessageAt > lastReadAt and
     lastSenderId ≠ me).
   - `listMessages(conversationId)`: paginated, newest first (inverted list); membership check.
   - `markRead(conversationId)` and `unreadConversationCount` (feeds the NativeTabs badge).
2. `messages/index.tsx`: **minimal chat list** of rows (avatar, name, preview, relative time, unread dot), with an empty
   state ("Message someone from their profile").
3. `messages/[conversationId].tsx`: inverted FlatList of bubbles, a "Seen" label under your last message when the other member's
   `lastReadAt` ≥ its time, a composer with a send button, `markRead` on focus and on each new incoming message, and a keyboard-avoiding layout.
4. The "Message" button on `user/[username]` → getOrCreateConversation → navigates to the chat.
- ✅ Check: two accounts chat in real time; the badge and unread dot clear on open; Seen appears. Tests: membership enforcement,
  pairKey uniqueness, a blocked user can't send, unread logic.

### Phase 11: Safety + account deletion
1. `blocks.ts`: `block` (removes follows both ways and fixes counters, removes feedItems both ways), `unblock`, `listBlocked`.
   `lib/blocks.ts` `isBlockedEitherWay` is used in profile, feed, explore, search, comments, follow and DM functions.
2. `reports.ts`: `create` (deduplicated per reporter and target). Reporting from the PostCard menu, the comment long-press, and a profile's "…" menu.
3. Rate limits (`@convex-dev/rate-limiter` component registered in `convex.config.ts`): posts 10/h, comments 60/h, DMs 30/min,
   follows 100/h, reports 20/day. The UI shows a friendly "Slow down" message.
4. `account.ts`: `deleteMe` mutation marks the user deleted and schedules `internal.account.cascade`, which runs in batches over
   posts and their files, the avatar file, comments, likes, follows (with counter fixes), feedItems, notifications, conversations,
   members and messages, blocks and reports. It's idempotent and self-rescheduling. The client then calls Clerk `user.delete()` and signs out.
   If the Clerk delete fails, show an error; signing in again just creates a fresh empty user.
5. `profile/settings.tsx`: Blocked users, Sign out, Delete account (a destructive confirm with a typed confirmation word, using a custom
   in-app sheet rather than an alert). `profile/blocked.tsx` lists blocked users with Unblock.
- ✅ Check: blocking hides content both ways and stops DMs; deleting an account removes all of its rows and files (check in the Convex
  dashboard). Tests: block side effects, cascade completeness across all tables.

### Phase 12: Demo seed
1. `convex/seed.ts`: `internalAction seedDemo` (idempotent; skips if demo users already exist). It creates about 5 demo users
   (`isDemo: true`, `onboarded: true`, `tokenIdentifier: "demo|<n>"`), fetches about 20 royalty-free images (e.g. picsum.photos
   or Unsplash Source with credits) and 2–3 short sample videos (public-domain sample MP4s, plus thumbnail images) into storage via
   `ctx.storage.store`, then creates posts with `isDemo: true`, plus a few demo likes and comments between demo users.
   `internalMutation clearDemo` removes them.
2. Run with `npx convex run seed:seedDemo` and document it in the README.
- ✅ Check: a fresh account sees the populated "Suggested for you" feed and a full Explore grid.

### Phase 13: Polish + final verification
- Empty, loading (skeleton) and error states on every list; offline or slow network shows an inline retry for uploads.
- Accessibility labels on icon buttons, 44pt touch targets, Dynamic Type not blocked.
- `npx expo-doctor`, `npx expo lint`, `npx tsc --noEmit`, `npm test` all clean.
- Update the README: setup (Clerk dev keys, Convex env vars, the `CLERK_JWT_ISSUER_DOMAIN` issuer, seeding, dev build commands).

---

## 6. Verification (end-to-end, v1 "done")
Run `npx expo run:ios` (dev build on the simulator) plus `npx convex dev`. Sign in with two different accounts (simulator +
device, or sign out and back in) and go through: sign in with Google and Apple → onboarding → demo feed → follow → post photo and video →
like, comment, delete comment → Activity → Explore grid and search → DM with Seen and badge → block and report → delete account
(check the tables in the Convex dashboard). Automated: `npm test` covers permissions, idempotency, blocks, fan-out and cascades.

## 7. ASSUMPTIONS (not explicitly confirmed)
1. Home uses fan-out-on-write (`feedItems`) for clean pagination; follow backfills 20 posts; unfollow and block remove them.
2. Media limits: images max 1080px, JPEG 0.8; video ≤60s and ≤100 MB; text limits as in §3.
3. Username: 3–30 chars `[a-z0-9._]`, case-insensitive unique, changeable at any time.
4. Explore = newest posts (no ranking); search covers usernames and display names only.
5. Blocking removes follows both ways, hides content both ways and blocks DMs. Reports are only stored.
6. Hard delete also deletes the user's DMs (the conversation disappears for the other participant).
7. Seen = the other member's `lastReadAt` ≥ the message time; no typing indicators.
8. Rate limits as listed in Phase 11.
9. Content is visible to signed-in users only; no deep links or share links in v1.
10. Detail routes (`user/`, `post/`) sit on the root stack and cover the tab bar.
11. English only, basic accessibility, observability = Convex dashboard logs only.
12. Demo media = royalty-free remote images and sample videos fetched by the seed action.

## 8. OPEN RISKS
1. **NativeWind 4.2.7 on RN 0.86 / Reanimated 4.5 / React Compiler**: Phase 1 includes a go/no-go smoke test. Fallback:
   NativeWind 5 RC or Uniwind.
2. **The Clerk `useSSO` redirect** with the `codegram://` scheme, and Apple sign-in through the browser on dev shared credentials.
   Verify early in Phase 3. Apple's web flow may show "Hide my email" relay addresses, which is fine since the username comes from onboarding.
3. **Client-side `user.delete()`** depends on the Clerk dashboard setting; without a secret key we can't delete Clerk users from
   the server.
4. **Video playback from Convex storage URLs** with `expo-video` (no HLS) may start slowly on bad networks.
5. **Convex free-tier quotas** (storage and bandwidth, mostly from video).
6. **Clerk dev instance** limits (dev banner, user caps); needs migrating before any real release.
7. Cascade deletes must stay batched and idempotent to stay within Convex mutation limits.
8. The design reference arrives later → color and radius tokens are centralized in `tailwind.config.js` to limit rework.
