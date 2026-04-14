import { View, Text, Pressable } from "react-native";
import { mockChild, rewards } from "@/constants/mockData";
import { ChildLayout } from "@/components/layouts/ChildLayout";
import { Feather as Icons } from "@expo/vector-icons";
import { cn } from "@/lib/utils";

export default function RewardsScreen() {
  return (
    <ChildLayout>
      {/* Points Summary */}
      <View className="mb-10 pt-4">
        <View 
          style={{ borderRadius: 40, borderBottomWidth: 8, borderBottomColor: 'rgba(0,0,0,0.1)' }}
          className="bg-child-primary p-8 shadow overflow-hidden"
        >
          <View className="flex-row justify-between items-center mb-4">
            <View className="bg-white/20 p-4 rounded-3xl">
              <Icons name="gift" size={32} color="white" />
            </View>
            <View className="bg-white px-4 py-2 rounded-2xl">
              <Text className="text-child-primary font-black text-xs uppercase tracking-widest">Premium balance</Text>
            </View>
          </View>
          <Text className="text-white/80 text-sm font-black uppercase tracking-[4px] mb-1">My Points</Text>
          <Text className="text-white text-5xl font-black tracking-tight">
            {mockChild.rewardPoints}
          </Text>
        </View>
      </View>

      {/* Rewards List */}
      <View className="mb-20">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-2xl font-black text-text-primary tracking-tight">
            Available Prizes
          </Text>
          <View className="flex-row items-center gap-2">
            <Icons name="filter" size={16} color="#64748B" />
            <Text className="text-slate-500 font-bold uppercase text-xs tracking-widest">Filter</Text>
          </View>
        </View>
        
        <View className="gap-6">
          {rewards.map((reward) => (
            <View 
              key={reward.id}
              style={{ borderRadius: 32 }}
              className="bg-white p-6 shadow border border-slate-50 flex-row items-center"
            >
              <View className="bg-child-primary/10 p-5 rounded-3xl mr-5">
                <Icons name="box" size={30} color="#FF5722" />
              </View>
              <View className="flex-1">
                <Text className="text-xl font-black text-text-primary mb-1">
                  {reward.name}
                </Text>
                <View className="flex-row items-center">
                  <View className="bg-child-accent p-1 rounded-full mr-2">
                    <Icons name="zap" size={10} color="white" />
                  </View>
                  <Text className="text-child-primary font-black text-lg">
                    {reward.cost} pts
                  </Text>
                </View>
              </View>
              <Pressable className="bg-child-primary px-6 py-3 rounded-2xl shadow active:scale-95">
                <Text className="text-white font-black uppercase tracking-widest text-xs">Buy</Text>
              </Pressable>
            </View>
          ))}
        </View>
      </View>
    </ChildLayout>
  );
}
