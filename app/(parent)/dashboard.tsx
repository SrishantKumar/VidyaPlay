import { View, Text, ScrollView, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { mockChild, parentInsights } from "@/constants/mockData";
import { ParentLayout } from "@/components/layouts/ParentLayout";
import { StatCard } from "@/components/cards/StatCard";
import { ParentButton } from "@/components/buttons/ParentButton";

export default function DashboardScreen() {
  const router = useRouter();

  const trendColor = parentInsights.learningTrend === "improving" ? "text-child-success" : "text-child-danger";

  return (
    <ParentLayout scrollable={true}>
      {/* Header */}
      <View className="mb-8">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-3xl font-bold text-parent-primary">
              Dashboard
            </Text>
            <Text className="text-text-secondary mt-2">
              {mockChild.name}'s Progress
            </Text>
          </View>
          <Pressable
            onPress={() => router.push("/(auth)/splash")}
            className="bg-parent-secondary px-4 py-2 rounded-lg"
          >
            <Text className="text-white font-semibold">Logout</Text>
          </Pressable>
        </View>
      </View>

      {/* Quick Stats */}
      <View className="flex-row gap-3 mb-8">
        <StatCard
          label="Total Points"
          value={parentInsights.totalPoints}
          icon="⭐"
          variant="primary"
        />
        <StatCard
          label="Games Played"
          value={parentInsights.gamesPlayed}
          icon="🎮"
          variant="secondary"
        />
      </View>

      {/* Learning Insights */}
      <View className="mb-8">
        <Text className="text-xl font-bold text-parent-primary mb-4">
          Learning Insights
        </Text>
        <View className="bg-bg-dark rounded-xl p-6">
          <View className="flex-row justify-between items-center mb-4 pb-4 border-b border-border-light">
            <Text className="text-text-secondary">Session Duration</Text>
            <Text className="text-lg font-bold text-parent-primary">
              {parentInsights.averageSessionDuration}
            </Text>
          </View>
          <View className="flex-row justify-between items-center mb-4 pb-4 border-b border-border-light">
            <Text className="text-text-secondary">Favorite Subject</Text>
            <Text className="text-lg font-bold text-parent-primary">
              {parentInsights.favoriteSubject}
            </Text>
          </View>
          <View className="flex-row justify-between items-center mb-4 pb-4 border-b border-border-light">
            <Text className="text-text-secondary">Completion Rate</Text>
            <Text className="text-lg font-bold text-parent-primary">
              {parentInsights.completionRate}%
            </Text>
          </View>
          <View className="flex-row justify-between items-center">
            <Text className="text-text-secondary">Learning Trend</Text>
            <Text className={`text-lg font-bold ${trendColor}`}>
              {parentInsights.learningTrend === "improving" ? "📈 Improving" : "📉 Declining"}
            </Text>
          </View>
        </View>
      </View>

      {/* Weekly Summary */}
      <View className="mb-8">
        <Text className="text-xl font-bold text-parent-primary mb-4">
          Weekly Average
        </Text>
        <View className="bg-parent-accent rounded-xl p-6">
          <Text className="text-white text-sm opacity-75 mb-2">
            Weekly Points
          </Text>
          <Text className="text-4xl font-bold text-white">
            {parentInsights.weeklyAveragePoints}
          </Text>
          <Text className="text-white text-sm mt-3 opacity-75">
            Points per day on average
          </Text>
        </View>
      </View>

      {/* Actions */}
      <View className="gap-3 mb-8">
        <ParentButton
          label="View Child Profile"
          onPress={() => alert("Child Profile View")}
          variant="primary"
          size="large"
        />
        <ParentButton
          label="Settings"
          onPress={() => alert("Settings")}
          variant="secondary"
          size="large"
        />
        <ParentButton
          label="Switch to Child App"
          onPress={() => router.push("/(child)/home")}
          variant="outline"
          size="large"
        />
      </View>
    </ParentLayout>
  );
}
