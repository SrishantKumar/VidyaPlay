import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, Dimensions, Platform } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Animated, { 
  FadeInUp, 
  FadeInDown, 
  ZoomIn, 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withDelay, 
  withSequence,
  withTiming,
  Easing
} from "react-native-reanimated";
import { Feather as Icons } from "@expo/vector-icons";
import { ChildLayout } from "@/components/layouts/ChildLayout";
import { ChildButton } from "@/components/buttons/ChildButton";
import { cn } from "@/lib/utils";

const { width } = Dimensions.get("window");

export default function ResultScreen() {
  const router = useRouter();
  const { score, coins, accuracy, stars, gameType, timeTaken, rank, rivalTimes } = useLocalSearchParams();
  
  const [displayCoins, setDisplayCoins] = useState(0);
  const rivals = rivalTimes ? JSON.parse(rivalTimes as string) : [];

  useEffect(() => {
    // Star animations logic
    const starCount = Number(stars) || 0;
    star1Scale.value = withDelay(600, withSpring(1, { damping: 12 }));
    if (starCount >= 2) star2Scale.value = withDelay(900, withSpring(1, { damping: 12 }));
    if (starCount >= 3) star3Scale.value = withDelay(1200, withSpring(1, { damping: 12 }));

    const targetCoins = Number(coins) || 0;
    const interval = setInterval(() => {
      setDisplayCoins(prev => {
        if (prev >= targetCoins) { clearInterval(interval); return targetCoins; }
        return prev + Math.ceil(targetCoins / 20);
      });
    }, 50);
    return () => clearInterval(interval);
  }, [stars, coins]);

  // Shared shared values
  const star1Scale = useSharedValue(0);
  const star2Scale = useSharedValue(0);
  const star3Scale = useSharedValue(0);

  const isRace = gameType === 'word-race';

  return (
    <ChildLayout scrollable={true}>
      <View className="flex-1 justify-center items-center py-6 px-4">
        
        {/* Title Section */}
        <Animated.View entering={FadeInDown.delay(200)} className="items-center mb-6">
          <Text className="text-sm font-black text-child-primary uppercase tracking-[5px] mb-2">
            Game Over
          </Text>
          <Text className="text-5xl font-black text-slate-800 tracking-tighter text-center">
            {isRace && rank === '1' ? "CHAMPION!" : "WELL DONE!"}
          </Text>
        </Animated.View>

        {/* Victory Stars */}
        <View className="flex-row gap-6 mb-8">
           <Animated.View style={[{ transform: [{ scale: star1Scale }] }]}>
            <Icons name="star" size={60} color="#FFD600" />
          </Animated.View>
          <Animated.View style={[{ transform: [{ scale: star2Scale }], marginTop: -20 }]}>
            <Icons name="star" size={80} color="#FFD600" />
          </Animated.View>
          <Animated.View style={[{ transform: [{ scale: star3Scale }] }]}>
            <Icons name="star" size={60} color="#FFD600" />
          </Animated.View>
        </View>

        {isRace && (
          <Animated.View 
            entering={FadeInUp.delay(1000)}
            className="bg-slate-900 w-full p-6 rounded-[32px] mb-6 border-4 border-slate-800 shadow-xl"
          >
            <Text className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-4">Race Leaderboard</Text>
            
            {/* Player Place */}
            <View className={cn("flex-row items-center justify-between p-4 rounded-2xl mb-2", rank === '1' ? "bg-child-primary/20 border-2 border-child-primary" : "bg-white/5")}>
              <View className="flex-row items-center gap-3">
                <View className="w-8 h-8 rounded-full bg-child-primary items-center justify-center">
                  <Text className="text-white font-black">{rank}</Text>
                </View>
                <Text className="text-white font-black text-lg">YOU</Text>
              </View>
              <Text className="text-white font-black text-xl">{timeTaken}s</Text>
            </View>

            {/* Rivals */}
            {rivals.map((time: number, i: number) => {
               const rRank = time < Number(timeTaken) ? (i === 0 ? 1 : 2) : (i === 0 ? 2 : 3);
               // Simple mock ranking logic for display
               return (
                <View key={i} className="flex-row items-center justify-between p-4 bg-white/5 rounded-2xl mb-1 opacity-60">
                  <View className="flex-row items-center gap-3">
                    <View className="w-6 h-6 rounded-full bg-slate-700 items-center justify-center">
                      <Text className="text-white/60 font-black text-xs">{i + 2}</Text>
                    </View>
                    <Text className="text-white/60 font-black">Rival {i + 1}</Text>
                  </View>
                  <Text className="text-white/60 font-black">{time}s</Text>
                </View>
               );
            })}
          </Animated.View>
        )}

        {/* Stats Card */}
        <Animated.View 
          entering={FadeInUp.delay(isRace ? 1500 : 1200)}
          style={{ borderRadius: 40 }}
          className="bg-white p-8 border-4 border-slate-100 mb-8 w-full"
        >
          <View className="flex-row justify-around">
            <View className="items-center">
               <View className="bg-child-primary/10 p-3 rounded-2xl mb-1">
                 <Icons name="award" size={24} color="#FF5722" />
               </View>
               <Text className="text-xl font-black text-slate-800">{score}</Text>
               <Text className="text-slate-400 text-[9px] font-black uppercase">Points</Text>
            </View>
            <View className="items-center">
               <View className="bg-child-accent/10 p-3 rounded-2xl mb-1">
                 <Icons name="zap" size={24} color="#FFD600" />
               </View>
               <Text className="text-xl font-black text-slate-800">{accuracy}%</Text>
               <Text className="text-slate-400 text-[9px] font-black uppercase">Accuracy</Text>
            </View>
            <View className="items-center">
               <View className="bg-child-success/10 p-3 rounded-2xl mb-1">
                 <Icons name="gift" size={24} color="#4CAF50" />
               </View>
               <Text className="text-xl font-black text-slate-800">+{displayCoins}</Text>
               <Text className="text-slate-400 text-[9px] font-black uppercase">Coins</Text>
            </View>
          </View>
        </Animated.View>

        {/* Buttons */}
        <View className="w-full gap-4">
           <ChildButton
              title="Play Again"
              onPress={() => router.replace(isRace ? "/(child)/games/word-race" : "/(child)/games/math-jump")}
              variant="primary"
              size="large"
           />
           <ChildButton
              title="Back to Home"
              onPress={() => router.replace("/(child)/home")}
              variant="outline"
              size="large"
           />
        </View>
      </View>
    </ChildLayout>
  );
}

