import { View, Text, ScrollView, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { mockChild, achievements } from "@/constants/mockData";
import { ChildLayout } from "@/components/layouts/ChildLayout";
import { ChildButton } from "@/components/buttons/ChildButton";
import { Feather as Icons } from "@expo/vector-icons";
import { cn } from "@/lib/utils";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <ChildLayout>
      {/* Profile Header */}
      <View className="items-center mb-10 mt-4">
        <View className="relative">
          <View style={{ borderRadius: 40 }} className="bg-white p-2 shadow">
            <View style={{ borderRadius: 32 }} className="bg-child-surface w-32 h-32 items-center justify-center overflow-hidden">
               <Icons name="user" size={80} color="#1A237E" />
            </View>
          </View>
          <View className="absolute -bottom-2 -right-2 bg-child-primary p-3 rounded-2xl shadow border-4 border-white">
            <Icons name="camera" size={20} color="white" />
          </View>
        </View>
        
        <View className="mt-6 items-center">
          <Text className="text-4xl font-black text-text-primary tracking-tight mb-1">
            {mockChild.name}
          </Text>
          <View className="bg-child-primary/10 px-4 py-1 rounded-full">
            <Text className="text-child-primary font-black uppercase tracking-widest text-xs">
              {mockChild.grade} • Explorer
            </Text>
          </View>
        </View>
      </View>

      {/* Stats Row */}
      <View className="flex-row gap-4 mb-10">
        <View style={{ borderRadius: 32 }} className="flex-1 bg-white p-6 shadow items-center border border-slate-50">
          <Text className="text-text-secondary text-xs font-black uppercase tracking-widest mb-1">Points</Text>
          <Text className="text-3xl font-black text-child-primary">
            {mockChild.rewardPoints}
          </Text>
        </View>
        <View style={{ borderRadius: 32 }} className="flex-1 bg-white p-6 shadow items-center border border-slate-50">
          <Text className="text-text-secondary text-xs font-black uppercase tracking-widest mb-1">Badges</Text>
          <Text className="text-3xl font-black text-child-accent">
            {mockChild.levelBadges.length}
          </Text>
        </View>
      </View>

      {/* Achievements */}
      <View className="mb-8">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-2xl font-black text-text-primary tracking-tight">
            Achievements
          </Text>
          <Icons name="award" size={20} color="#64748B" />
        </View>
        
        <View className="gap-4">
          {achievements.map((achievement: Achievement) => {
            const iconMap: { [key: string]: keyof typeof Icons.glyphMap } = {
              "award": "award",
              "star": "star",
              "zap": "zap",
              "medal": "award",
              "crown": "star",
              "heart": "heart",
              "zap-off": "zap",
            };

            const IconName = iconMap[achievement.icon] || "award";

            return (
              <View
                key={achievement.id}
                className={cn(
                  "bg-white rounded-3xl p-5 shadow border border-slate-50 flex-row items-center",
                  !achievement.unlocked && "opacity-60"
                )}
              >
                <View className={cn(
                  "p-4 rounded-2xl mr-4",
                  achievement.unlocked ? "bg-child-primary/10" : "bg-slate-100"
                )}>
                  <Icons 
                    name={IconName as any}
                    size={28} 
                    color={achievement.unlocked ? "#FF5722" : "#94A3B8"} 
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-black text-text-primary leading-tight">
                    {achievement.name}
                  </Text>
                  <Text className="text-text-secondary text-xs font-bold uppercase tracking-wider">
                    {achievement.description}
                  </Text>
                </View>
                {achievement.unlocked && (
                  <View className="bg-child-success/10 p-2 rounded-full">
                    <Icons name="check-circle" size={24} color="#4CAF50" />
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </View>

      {/* Logout Button */}
      <View className="pb-10">
        <ChildButton
          title="Logout"
          onPress={() => router.push("/(auth)/splash")}
          variant="secondary"
          size="large"
        />
      </View>
    </ChildLayout>
  );
}
