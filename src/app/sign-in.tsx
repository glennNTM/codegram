import { Image } from "expo-image";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PhotoCollage } from "@/components/auth/PhotoCollage";
import { SocialButton } from "@/components/auth/SocialButton";
import { useOAuthSignIn } from "@/hooks/useOAuthSignIn";

export default function SignInScreen() {
  const { signIn, pending, error } = useOAuthSignIn();
  // OAuth sign-up and sign-in are the same flow; this link's destination is still undecided.
  const onCreateAccount = () => {};

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "bottom"]}>
      <ScrollView
        contentContainerClassName="grow pb-4"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <PhotoCollage />

        <View className="px-8">
          <View className="ml-2 h-[54px] flex-row items-center gap-[18px]">
            <Image
              source={require("@/assets/images/brand/logo.svg")}
              style={{ width: 54, height: 54 }}
              accessibilityLabel="Codegram logo"
            />
            <Text className="font-inter-bold text-[36px] text-ink tracking-[-0.6px]">Codegram</Text>
          </View>

          <Text
            accessibilityRole="header"
            className="ml-2 mt-[19.5px] font-inter-bold text-[25.5px] leading-[30px] text-ink tracking-[-0.5px]"
          >
            Discover amazing people and places
          </Text>

          <Text className="ml-2 mt-[9px] max-w-[262px] font-inter text-[14px] leading-[20px] text-muted">
            Follow creators, explore new content and be part of a global community.
          </Text>

          <View className="mt-[35px] gap-[15px]">
            <SocialButton
              provider="apple"
              onPress={() => signIn("apple")}
              loading={pending === "apple"}
              disabled={pending !== null}
            />
            <SocialButton
              provider="google"
              onPress={() => signIn("google")}
              loading={pending === "google"}
              disabled={pending !== null}
            />
          </View>

          {error ? (
            <Text accessibilityRole="alert" className="mt-3 text-center font-inter text-[13px] text-danger">
              {error}
            </Text>
          ) : null}

          <View className="mt-[22px] h-4 flex-row items-center gap-4">
            <View className="h-px flex-1 bg-divider" />
            <Text className="font-inter text-[13px] text-muted">or</Text>
            <View className="h-px flex-1 bg-divider" />
          </View>

          <Text
            accessibilityRole="link"
            onPress={onCreateAccount}
            className="mt-[21px] self-center font-inter-medium text-[12.5px] leading-[18px] text-link tracking-[-0.2px]"
          >
            Create an account
          </Text>

          <Text className="mt-6 text-center font-inter text-[11px] leading-[16px] text-subtle tracking-[-0.4px]">
            By continuing, you agree to our <Text className="text-link">Terms of Service</Text>
            {"\n"}and <Text className="text-link">Privacy Policy</Text>.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
