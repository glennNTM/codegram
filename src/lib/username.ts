// Username rules from plan §3: 3–30 chars, lowercase letters, digits, "." and "_".
// The server re-checks these (and uniqueness) in `users.updateProfile`.
export const USERNAME_MIN = 3;
export const USERNAME_MAX = 30;
const USERNAME_PATTERN = /^[a-z0-9._]+$/;

export function normalizeUsername(input: string): string {
  return input.trim().toLowerCase();
}

/** Returns an error message, or null when the username is valid. */
export function validateUsername(username: string): string | null {
  if (username.length < USERNAME_MIN) return `At least ${USERNAME_MIN} characters.`;
  if (username.length > USERNAME_MAX) return `At most ${USERNAME_MAX} characters.`;
  if (!USERNAME_PATTERN.test(username)) return "Only letters, numbers, periods and underscores.";
  return null;
}
