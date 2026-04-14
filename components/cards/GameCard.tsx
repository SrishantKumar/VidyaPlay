import React from "react";
import { Pressable, Text, View, Platform } from "react-native";
import { cn } from "@/lib/utils";
import { Feather as Icons } from "@expo/vector-icons";

interface GameCardProps {
  id: string;
  title: string;
  icon: string;
  color: string;
  difficulty: string;
  points: number;
  onPress: () => void;
}

export const GameCard: React.FC<GameCardProps> = ({
  title,
  icon,
  color,
  difficulty,
  points,
  onPress,
}) => {
  const difficultyColors = {
    Easy: "bg-child-success",
    Medium: "bg-child-accent",
    Hard: "bg-child-danger",
  };

  // Map icon names to Feather icons (they are very similar)
  const iconMap: { [key: string]: keyof typeof Icons.glyphMap } = {
    "calculator": "hash",
    "book-open": "book-open",
    "puzzle": "box",
    "gamepad-2": "play",
    "microscope": "search",
    "palette": "layers",
    "medal": "award",
    "heart": "heart",
    "zap": "zap",
    "footprints": "activity",
    "crown": "star",
    "sparkles": "sun",
    "book": "book",
    "user": "user",
  };

  const IconName = iconMap[icon] || "help-circle";

  return (
    <Pressable
      onPress={onPress}
      className={cn(
        "flex-1 rounded-4xl overflow-hidden mb-6 mr-4 active:scale-95 transition-transform",
        Platform.OS === "web" && "shadow"
      )}
      style={{ 
        backgroundColor: color,
        borderBottomWidth: 6,
        borderBottomColor: 'rgba(0,0,0,0.15)'
      }}
    >
      <View className="p-8 flex-1 justify-between min-h-56">
        <View className="items-start">
          <View className="bg-white/20 p-4 rounded-3xl mb-4">
            <Icons name={IconName as any} size={40} color="white" />
          </View>
          <Text className="text-white font-black text-2xl tracking-tight leading-tight">
            {title}
          </Text>
        </View>

        <View className="flex-row items-center justify-between mt-4">
          <View
            className={cn(
              difficultyColors[difficulty as keyof typeof difficultyColors],
              "px-4 py-1.5 rounded-full shadow-sm"
            )}
          >
            <Text className="text-white text-xs font-black uppercase tracking-wider">
              {difficulty}
            </Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Icons name="star" size={16} color="white" />
            <Text className="text-white font-black text-xl">+{points}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};


