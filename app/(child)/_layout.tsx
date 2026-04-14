import { Tabs, usePathname } from "expo-router";
import { View, Platform, Text } from "react-native";
import { Feather as Icons } from "@expo/vector-icons";
import { cn } from "@/lib/utils";

// Tabs layout for the child section
export default function ChildTabsLayout() {
  const pathname = usePathname();
  
  // Hide tab bar for game screens for immersion
  const isGameActive = pathname.includes("/games/word-race") || 
                       pathname.includes("/games/math-jump") || 
                       pathname.includes("/games/result");

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          display: isGameActive ? "none" : "flex",
          backgroundColor: "#FFFFFF",
          borderTopWidth: 0,
          height: Platform.OS === "ios" ? 100 : 80,
          paddingBottom: Platform.OS === "ios" ? 30 : 15,
          paddingTop: 10,
          borderRadius: 40,
          position: "absolute",
          bottom: Platform.OS === "web" ? 20 : 0,
          left: 0,
          right: 0,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.05,
          shadowRadius: 10,
          elevation: 10,
        },
        tabBarActiveTintColor: "#FF5722",
        tabBarInactiveTintColor: "#94A3B8",
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View className={cn("items-center", focused && "scale-110")}>
              <Icons name="home" size={28} color={color} />
              <Text className={cn("text-[10px] font-black uppercase mt-1", focused ? "text-child-primary" : "text-slate-400")}>
                Home
              </Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="games"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <View 
              style={{ borderRadius: 20 }}
              className={cn(
                "p-3 items-center justify-center",
                focused ? "bg-child-primary/10" : ""
              )}
            >
              <Icons name="play-circle" size={26} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="rewards"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View className={cn("items-center", focused && "scale-110")}>
              <Icons name="gift" size={28} color={color} />
              <Text className={cn("text-[10px] font-black uppercase mt-1", focused ? "text-child-primary" : "text-slate-400")}>
                Prizes
              </Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View className={cn("items-center", focused && "scale-110")}>
              <Icons name="user" size={28} color={color} />
              <Text className={cn("text-[10px] font-black uppercase mt-1", focused ? "text-child-primary" : "text-slate-400")}>
                Me
              </Text>
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
