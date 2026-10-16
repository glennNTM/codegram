import { NativeTabs } from "expo-router/unstable-native-tabs";

// Tab bar colors from the design reference: primary blue when selected, ink otherwise.
const PRIMARY = "#1F74FD";
const INK = "#0B1128";

export default function TabsLayout() {
  return (
    <NativeTabs
      tintColor={PRIMARY}
      iconColor={{ default: INK, selected: PRIMARY }}
      labelStyle={{
        default: { fontFamily: "Inter_500Medium", fontSize: 10, color: INK },
        selected: { fontFamily: "Inter_500Medium", fontSize: 10, color: PRIMARY },
      }}
      minimizeBehavior="onScrollDown"
    >
      <NativeTabs.Trigger name="(home)">
        <NativeTabs.Trigger.Icon sf={{ default: "house", selected: "house.fill" }} md="home" />
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="messages">
        <NativeTabs.Trigger.Icon sf={{ default: "bubble.left", selected: "bubble.left.fill" }} md="chat_bubble" />
        <NativeTabs.Trigger.Label>Messages</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="explore">
        <NativeTabs.Trigger.Icon sf={{ default: "safari", selected: "safari.fill" }} md="explore" />
        <NativeTabs.Trigger.Label>Explore</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Icon sf={{ default: "person", selected: "person.fill" }} md="person" />
        <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
