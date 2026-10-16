import { Alert, type ImageSourcePropType } from "react-native";

import { deletePost, updateCaption } from "@/mocks/posts";
import { blockUser } from "@/mocks/session";

// Native action menus shared by posts, comments and profiles. The mock calls become
// `reports.create`, `blocks.block`, `posts.updateCaption` / `posts.remove` (Phases 6 and 11).

const REPORT_REASONS = ["Spam", "Nudity or sexual content", "Hate or harassment", "Something else"];

export function confirmReport(target: "post" | "comment" | "account") {
  Alert.alert(`Report this ${target}?`, "Why are you reporting it? Your report is anonymous.", [
    ...REPORT_REASONS.map((reason) => ({
      text: reason,
      onPress: () => Alert.alert("Thanks for letting us know", "We'll review your report."),
    })),
    { text: "Cancel", style: "cancel" as const },
  ]);
}

type BlockTarget = { id: string; username: string; displayName?: string; avatar: ImageSourcePropType };

export function confirmBlock(user: BlockTarget, onBlocked?: () => void) {
  Alert.alert(
    `Block ${user.username}?`,
    "They won't be able to see your posts, follow you or message you. They won't be notified.",
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Block",
        style: "destructive",
        onPress: () => {
          blockUser({ id: user.id, username: user.username, displayName: user.displayName ?? user.username, avatar: user.avatar });
          onBlocked?.();
        },
      },
    ],
  );
}

type MenuPost = { id: string; caption: string; author: BlockTarget };

/** "…" on a post: Edit caption / Delete for the owner, Report / Block for everyone else. */
export function openPostMenu(post: MenuPost, isMine: boolean, onDeleted?: () => void) {
  if (isMine) {
    Alert.alert("Post options", undefined, [
      {
        text: "Edit caption",
        onPress: () =>
          Alert.prompt("Edit caption", undefined, (text) => updateCaption(post.id, text.trim()), "plain-text", post.caption),
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () =>
          Alert.alert("Delete post?", "This can't be undone.", [
            { text: "Cancel", style: "cancel" },
            {
              text: "Delete",
              style: "destructive",
              onPress: () => {
                deletePost(post.id);
                onDeleted?.();
              },
            },
          ]),
      },
      { text: "Cancel", style: "cancel" },
    ]);
    return;
  }

  Alert.alert(post.author.username, undefined, [
    { text: "Report", style: "destructive", onPress: () => confirmReport("post") },
    { text: `Block ${post.author.username}`, style: "destructive", onPress: () => confirmBlock(post.author) },
    { text: "Cancel", style: "cancel" },
  ]);
}
