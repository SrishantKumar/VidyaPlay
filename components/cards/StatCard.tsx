import React from "react";
import { Text, View } from "react-native";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  variant?: "primary" | "secondary";
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  variant = "primary",
}) => {
  const bgColor = variant === "primary" ? "bg-parent-primary" : "bg-parent-secondary";

  return (
    <View className={`${bgColor} rounded-xl p-6 flex-1 mr-3`}>
      <Text className="text-white text-sm font-semibold opacity-75 mb-2">
        {label}
      </Text>
      <View className="flex-row items-center justify-between">
        <Text className="text-white text-3xl font-bold">{value}</Text>
        <Text className="text-4xl">{icon}</Text>
      </View>
    </View>
  );
};
