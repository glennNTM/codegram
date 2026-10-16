import { isClerkAPIResponseError, useSSO } from "@clerk/expo";
import type { OAuthStrategy } from "@clerk/expo/types";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { useState } from "react";

// Closes the auth popup when the redirect lands back in the app (needed on web).
WebBrowser.maybeCompleteAuthSession();

export type OAuthProvider = "apple" | "google";

const STRATEGIES: Record<OAuthProvider, OAuthStrategy> = {
  apple: "oauth_apple",
  google: "oauth_google",
};

// Must be allowlisted under the Clerk app's native redirect URLs, or no session is created.
const redirectUrl = AuthSession.makeRedirectUri({ scheme: "codegram", path: "sso-callback" });

/**
 * Browser-based OAuth (sign-in and sign-up are the same flow). On success the session is
 * activated and the root layout's Stack.Protected guards route the user into the app.
 */
export function useOAuthSignIn() {
  const { startSSOFlow } = useSSO();
  const [pending, setPending] = useState<OAuthProvider | null>(null);
  const [error, setError] = useState<string | null>(null);

  const signIn = async (provider: OAuthProvider) => {
    if (pending) return;
    setPending(provider);
    setError(null);

    try {
      const { createdSessionId, setActive, signUp, authSessionResult } = await startSSOFlow({
        strategy: STRATEGIES[provider],
        redirectUrl,
      });

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      } else if (authSessionResult?.type === "success") {
        // The provider succeeded but Clerk still needs something before it can create a session.
        setError(
          signUp?.status === "missing_requirements"
            ? `Sign-up needs more information: ${signUp.missingFields.join(", ")}.`
            : "We couldn't finish signing you in. Please try again.",
        );
      }
      // "cancel" / "dismiss": the user closed the sheet, nothing to report.
    } catch (err) {
      setError(
        isClerkAPIResponseError(err)
          ? (err.errors[0]?.longMessage ?? err.errors[0]?.message ?? "Sign-in failed.")
          : "Something went wrong. Please try again.",
      );
    } finally {
      setPending(null);
    }
  };

  return { signIn, pending, error };
}
