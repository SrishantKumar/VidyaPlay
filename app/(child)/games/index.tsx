import React from "react";
import { View, Text, Alert } from "react-native";
import { useRouter } from "expo-router";
import { games } from "@/constants/mockData";
import { ChildLayout } from "@/components/layouts/ChildLayout";
import { GameCard } from "@/components/cards/GameCard";
import { Feather as Icons } from "@expo/vector-icons";

export default function GamesScreen() {
  const router = useRouter();

  const handleGamePress = (title: string, id: string) => {
    if (id === "word-builder") {
      router.push("/(child)/games/word-race");
    } else if (id === "math-quest") {
      router.push("/(child)/games/math-jump");
    } else {
      Alert.alert("Adventure Unlocked!", `Ready to start ${title}?`);
    }
  };

  return (
    <ChildLayout>
      <View className="mb-8 pt-4">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-4xl font-black text-text-primary tracking-tighter">
            Game Zone
          </Text>
          <View className="bg-child-primary/10 p-3 rounded-2xl">
            <Icons name="play" size={24} color="#FF5722" />
          </View>
        </View>
        <Text className="text-text-secondary text-lg font-bold">
          Choose a subject and start learning!
        </Text>
      </View>

      <View className="flex-row flex-wrap -mr-4">
        {games.map((game) => (
          <View key={game.id} className="w-1/2">
            <GameCard
              {...game}
              onPress={() => handleGamePress(game.title, game.id)}
            />
          </View>
        ))}
      </View>

      <View className="mb-20" />
    </ChildLayout>
  );
}
