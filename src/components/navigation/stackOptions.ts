import type { NativeStackNavigationOptions } from "expo-router";

// Shared native-stack header look for every tab (large titles in Inter, design background).
export const tabStackOptions: NativeStackNavigationOptions = {
  headerLargeTitle: true,
  headerShadowVisible: false,
  headerLargeTitleShadowVisible: false,
  headerTintColor: "#0B1128",
  headerStyle: { backgroundColor: "#FBFCFE" },
  headerLargeStyle: { backgroundColor: "#FBFCFE" },
  headerTitleStyle: { fontFamily: "Inter_600SemiBold", fontSize: 17, color: "#0B1128" },
  headerLargeTitleStyle: { fontFamily: "Inter_700Bold", fontSize: 32, color: "#0B1128" },
  headerBackButtonDisplayMode: "minimal",
  contentStyle: { backgroundColor: "#FBFCFE" },
};
