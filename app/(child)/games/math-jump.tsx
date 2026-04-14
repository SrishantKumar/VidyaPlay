import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { ChildLayout } from "@/components/layouts/ChildLayout";
import { ChildButton } from "@/components/buttons/ChildButton";

export default function MathJumpScreen() {
  const router = useRouter();

  return (
    <ChildLayout scrollable={false}>
      <View className="flex-1 justify-between py-6">
        <View className="flex-row justify-between items-center mb-6">
          <Pressable onPress={() => router.back()}>
            <Text className="text-4xl">🔙</Text>
          </Pressable>
          <View className="bg-child-primary px-4 py-2 rounded-full">
            <Text className="text-white font-bold">Level: 5</Text>
          </View>
          <View className="bg-child-secondary px-4 py-2 rounded-full">
            <Text className="text-white font-bold">Hearts: ❤️❤️❤️</Text>
          </View>
        </View>

        <View className="flex-1 bg-green-100 rounded-3xl items-center justify-center border-4 border-green-300">
          <View className="bg-white p-8 rounded-2xl shadow-sm mb-12 items-center">
            <Text className="text-5xl font-bold text-text-primary">8 + 5 = ?</Text>
          </View>
          
          <View className="flex-row gap-6">
            <Pressable className="bg-white px-8 py-6 rounded-2xl border-4 border-green-300 shadow-lg active:scale-95">
              <Text className="text-4xl font-bold text-child-primary">12</Text>
            </Pressable>
            <Pressable className="bg-white px-8 py-6 rounded-2xl border-4 border-green-300 shadow-lg active:scale-95">
              <Text className="text-4xl font-bold text-child-primary">13</Text>
            </Pressable>
            <Pressable className="bg-white px-8 py-6 rounded-2xl border-4 border-green-300 shadow-lg active:scale-95">
              <Text className="text-4xl font-bold text-child-primary">15</Text>
            </Pressable>
          </View>
        </View>

        <View className="mt-8">
          <ChildButton
            label="Jump to Results"
            onPress={() => router.push("/(child)/games/result")}
            variant="primary"
            size="large"
          />
        </View>
      </View>
    </ChildLayout>
  );
}
