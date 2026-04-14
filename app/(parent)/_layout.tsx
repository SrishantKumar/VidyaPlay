import { Stack } from "expo-router";

export default function ParentLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
        gestureEnabled: true,
      }}
    >
      <Stack.Screen name="pin" />
      <Stack.Screen name="dashboard" />
    </Stack>
  );
}
