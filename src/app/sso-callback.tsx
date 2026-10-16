import { ActivityIndicator, View } from "react-native";

// OAuth redirect target (codegram://sso-callback). The auth session consumes the URL; if the
// deep link ever opens this route, show a spinner until the guards in _layout redirect.
export default function SSOCallback() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <ActivityIndicator />
    </View>
  );
}
