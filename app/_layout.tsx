import { Stack } from "expo-router";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import "./globals.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
        cardStyle: { backgroundColor: "#fff" },
      }}
    >
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(child)" />
      <Stack.Screen name="(parent)" />
    </Stack>
  );
}
