import { View, Text, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { mockChild, mockActivity } from "@/constants/mockData";
import { ChildLayout } from "@/components/layouts/ChildLayout";
import { ChildButton } from "@/components/buttons/ChildButton";
import { Feather as Icons } from "@expo/vector-icons";
import { cn } from "@/lib/utils";

export default function ChildHomeScreen() {
  const router = useRouter();

  return (
    <ChildLayout>
      {/* Header */}
      <View className="mb-8 pt-4">
        <View className="flex-row justify-between items-center mb-2">
          <View>
            <Text className="text-sm font-black text-child-primary uppercase tracking-[3px] mb-1">
              Welcome back
            </Text>
            <Text className="text-4xl font-black text-text-primary tracking-tight">
              {mockChild.name}
            </Text>
          </View>
          <Pressable 
            onPress={() => router.push("/(child)/profile")}
            className="bg-white rounded-3xl w-16 h-16 justify-center items-center shadow"
          >
            <View className="bg-child-surface p-3 rounded-2xl">
              <Icons name="user" size={28} color="#1A237E" />
            </View>
          </Pressable>
        </View>
        <Text className="text-text-secondary font-bold uppercase tracking-widest text-xs">
          {mockChild.grade} • Explorer
        </Text>
      </View>

      {/* Points Card */}
      <View 
        style={{ borderRadius: 40, borderBottomWidth: 8, borderBottomColor: 'rgba(0,0,0,0.1)' }}
        className="bg-child-primary p-8 mb-10 shadow"
      >
        <View className="flex-row justify-between items-start mb-6">
          <View>
            <Text className="text-white text-xs font-black uppercase tracking-widest opacity-80 mb-1">Total Points</Text>
            <Text className="text-6xl font-black text-white tracking-tighter">
              {mockChild.rewardPoints}
            </Text>
          </View>
          <View className="bg-white/20 p-3 rounded-2xl">
            <Icons name="award" size={32} color="white" />
          </View>
        </View>
        
        <View className="flex-row flex-wrap gap-2">
          {mockChild.levelBadges.map((badge) => (
            <View key={badge} className="bg-white/20 rounded-full px-4 py-1.5 flex-row items-center gap-1.5">
              <Icons name="star" size={12} color="white" />
              <Text className="text-white text-xs font-black uppercase tracking-wider">{badge}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Daily Activity */}
      <View className="mb-8">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-2xl font-black text-text-primary tracking-tight">
            Daily Activity
          </Text>
          <Icons name="activity" size={20} color="#64748B" />
        </View>
        
        <View style={{ borderRadius: 32 }} className="flex-row justify-between items-center bg-white p-6 shadow border border-slate-50">
          {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => {
            const isCompleted = i < 3;
            const isToday = i === 3;
            return (
              <View key={i} className="items-center">
                <View 
                  className={cn(
                    "w-10 h-10 rounded-2xl items-center justify-center mb-2",
                    isCompleted ? "bg-child-success" : isToday ? "bg-child-primary shadow scale-110" : "bg-slate-100"
                  )}
                >
                  {isCompleted ? (
                    <Icons name="check-circle" size={20} color="white" />
                  ) : (
                    <Text className={cn("font-black text-xs", isToday ? "text-white" : "text-slate-400")}>
                      {day}
                    </Text>
                  )}
                </View>
                {isToday && <View className="h-1 w-4 bg-child-primary rounded-full" />}
              </View>
            );
          })}
        </View>
      </View>

      {/* Quick Stats */}
      <View className="flex-row gap-4 mb-10">
        <View style={{ borderRadius: 32 }} className="flex-1 bg-white p-6 shadow border border-slate-50">
          <Text className="text-text-secondary text-[10px] font-black uppercase tracking-widest mb-1">Time Today</Text>
          <Text className="text-2xl font-black text-text-primary">45 min</Text>
        </View>
        <View style={{ borderRadius: 32 }} className="flex-1 bg-white p-6 shadow border border-slate-50">
          <Text className="text-child-accent text-[10px] font-black uppercase tracking-widest mb-1">Goal</Text>
          <Text className="text-2xl font-black text-child-accent">60 min</Text>
        </View>
      </View>

      {/* Recent Activity List */}
      <View className="mb-20">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-2xl font-black text-text-primary tracking-tight">
             Adventure Logs
          </Text>
          <Icons name="arrow-right" size={20} color="#64748B" />
        </View>
        <View className="gap-4">
          {mockActivity.map((activity) => (
            <Pressable 
              key={activity.id}
              style={{ borderRadius: 32 }}
              className="bg-white p-5 shadow border border-slate-50 flex-row items-center active:scale-[0.98]"
            >
              <View className="bg-child-primary/10 p-4 rounded-2xl mr-4">
                 <Icons name="zap" size={24} color="#FF5722" />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-black text-text-primary">{activity.type}</Text>
                <Text className="text-text-secondary text-xs font-bold uppercase tracking-wider">{activity.time}</Text>
              </View>
              <View className="bg-slate-50 p-2 rounded-full">
                <Icons name="chevron-right" size={16} color="#94A3B8" />
              </View>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Bottom Action */}
      <View className="pb-12">
        <ChildButton
          title="Explore Games"
          onPress={() => router.push("/(child)/games")}
          variant="primary"
          size="large"
        />
      </View>
    </ChildLayout>
  );
}
