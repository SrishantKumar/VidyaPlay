import { View, Text, SafeAreaView, Platform, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { ChildButton } from "@/components/buttons/ChildButton";
import { Feather as Icons } from "@expo/vector-icons";

export default function SplashScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-child-surface">
      <SafeAreaView className="flex-1">
        <View style={styles.webContainer}>
          <View className="flex-1 items-center justify-center px-8">
            {/* Logo Section */}
            <View className="items-center mb-12">
              <View className="bg-white p-8 shadow mb-8" style={{ borderRadius: 48 }}>
                <Icons name="book-open" size={80} color="#FF5722" />
              </View>
              <Text className="text-6xl font-black text-child-primary tracking-tighter">
                Vidya<Text className="text-child-accent">Play</Text>
              </Text>
              <View className="mt-2 bg-child-primary/10 px-4 py-1 rounded-full">
                <Text className="text-child-primary font-black uppercase tracking-widest text-xs">
                  Learning is Magic
                </Text>
              </View>
            </View>

            {/* Welcome Text */}
            <View className="items-center mb-12">
              <Text className="text-center text-text-primary text-2xl font-black leading-tight mb-2">
                Ready for an adventure?
              </Text>
              <Text className="text-center text-text-secondary text-lg font-bold">
                Play games, earn points, and learn something new every day!
              </Text>
            </View>

            {/* Action Buttons */}
            <View className="w-full gap-4 max-w-sm">
              <ChildButton
                title="Let's Go!"
                onPress={() => router.push("/(child)/home")}
                variant="primary"
              />
              <ChildButton
                title="Parent Dashboard"
                onPress={() => {}}
                variant="outline"
              />
            </View>
          </View>

          {/* Footer */}
          <View className="px-8 pb-8 items-center">
            <Text className="text-text-secondary text-sm font-bold opacity-50 uppercase tracking-widest">
              v2.0 • Premium Edition
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
    width: "100%",
    maxWidth: Platform.OS === "web" ? 480 : undefined,
    alignSelf: "center",
    backgroundColor: "#F5F3FF", // Match bg-child-surface
  },
});
