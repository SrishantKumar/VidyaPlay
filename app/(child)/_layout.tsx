import { Tabs } from "expo-router";
import { View, Platform, Text } from "react-native";
import { Feather as Icons } from "@expo/vector-icons";
import { cn } from "@/lib/utils";

// Tabs layout for the child section
export default function ChildTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 0,
          height: Platform.OS === "ios" ? 100 : 80,
          paddingBottom: Platform.OS === "ios" ? 30 : 15,
          paddingTop: 10,
          borderRadius: 40,
          position: "absolute",
          bottom: Platform.OS === "web" ? 20 : 0,
          left: Platform.OS === "web" ? "25%" : 0,
          right: Platform.OS === "web" ? "25%" : 0,
          maxWidth: Platform.OS === "web" ? 480 : "100%",
          // Using standard shadow props for cross-platform support
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
        name="games/index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View className={cn("items-center", focused && "scale-110")}>
              <Icons name="play-circle" size={28} color={color} />
              <Text className={cn("text-[10px] font-black uppercase mt-1", focused ? "text-child-primary" : "text-slate-400")}>
                Games
              </Text>
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
