import { Stack } from "expo-router";

export default function GamesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="word-race" />
      <Stack.Screen name="math-jump" />
      <Stack.Screen name="result" />
    </Stack>
  );
}
