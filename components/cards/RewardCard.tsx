import React from "react";
import { Pressable, Text, View } from "react-native";

interface RewardCardProps {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: string;
  onPress: () => void;
}

export const RewardCard: React.FC<RewardCardProps> = ({
  name,
  description,
  cost,
  icon,
  onPress,
}) => {
  return (
    <Pressable
      onPress={onPress}
      className="bg-bg-light border border-border-light rounded-xl p-4 mb-3"
    >
      <View className="flex-row items-center">
        <Text className="text-5xl mr-4">{icon}</Text>
        <View className="flex-1">
          <Text className="text-lg font-bold text-text-primary">{name}</Text>
          <Text className="text-sm text-text-secondary">{description}</Text>
        </View>
        <View className="bg-child-accent px-3 py-2 rounded-lg">
          <Text className="text-white font-bold">{cost}</Text>
        </View>
      </View>
    </Pressable>
  );
};
