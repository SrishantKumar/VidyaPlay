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
  const { score, coins, accuracy, stars } = useLocalSearchParams();
  
  const [displayCoins, setDisplayCoins] = useState(0);
  const [displayedStars, setDisplayedStars] = useState(0);

  // Animated values
  const star1Scale = useSharedValue(0);
  const star2Scale = useSharedValue(0);
  const star3Scale = useSharedValue(0);

  useEffect(() => {
    // Star sequence
    const starCount = Number(stars) || 0;
    
    star1Scale.value = withDelay(600, withSpring(1, { damping: 12 }));
    if (starCount >= 2) {
      star2Scale.value = withDelay(900, withSpring(1, { damping: 12 }));
    }
    if (starCount >= 3) {
      star3Scale.value = withDelay(1200, withSpring(1, { damping: 12 }));
    }

    // Coin counter roll
    const targetCoins = Number(coins) || 0;
    const interval = setInterval(() => {
      setDisplayCoins(prev => {
        if (prev >= targetCoins) {
          clearInterval(interval);
          return targetCoins;
        }
        return prev + Math.ceil(targetCoins / 20);
      });
    }, 50);

    return () => clearInterval(interval);
  }, [stars, coins]);

  return (
    <ChildLayout scrollable={false}>
      <View className="flex-1 justify-center items-center py-6">
        
        {/* Title Section */}
        <Animated.View entering={FadeInDown.delay(200)} className="items-center mb-6">
          <Text className="text-sm font-black text-child-primary uppercase tracking-[5px] mb-2">
            Mission Complete
          </Text>
          <Text className="text-5xl font-black text-slate-800 tracking-tighter">
            GREAT JOB!
          </Text>
        </Animated.View>

        {/* Stars Container */}
        <View className="flex-row gap-6 mb-12">
          <Animated.View style={[{ transform: [{ scale: star1Scale }] }]}>
            <Icons name="star" size={60} color="#FFD600" fill="#FFD600" />
          </Animated.View>
          <Animated.View style={[{ transform: [{ scale: star2Scale }], marginTop: -20 }]}>
             <Icons name="star" size={80} color="#FFD600" fill="#FFD600" />
          </Animated.View>
          <Animated.View style={[{ transform: [{ scale: star3Scale }] }]}>
            <Icons name="star" size={60} color="#FFD600" fill="#FFD600" />
          </Animated.View>
        </View>

        {/* Stats Card */}
        <Animated.View 
          entering={FadeInUp.delay(1400)}
          style={{ borderRadius: 40 }}
          className="bg-white/50 w-full p-8 border-4 border-slate-100 mb-12"
        >
          <View className="flex-row justify-around">
            <View className="items-center">
              <View className="bg-child-primary/10 p-3 rounded-2xl mb-2">
                 <Icons name="award" size={24} color="#FF5722" />
              </View>
              <Text className="text-2xl font-black text-slate-800">{score}</Text>
              <Text className="text-slate-400 text-[10px] font-black uppercase">Points</Text>
            </View>

            <View className="items-center">
              <View className="bg-child-accent/10 p-3 rounded-2xl mb-2">
                 <Icons name="zap" size={24} color="#FFD600" />
              </View>
              <Text className="text-2xl font-black text-slate-800">{accuracy}%</Text>
              <Text className="text-slate-400 text-[10px] font-black uppercase">Accuracy</Text>
            </View>

            <View className="items-center">
              <View className="bg-child-success/10 p-3 rounded-2xl mb-2">
                 <Icons name="gift" size={24} color="#4CAF50" />
              </View>
              <Text className="text-2xl font-black text-slate-800">+{displayCoins}</Text>
              <Text className="text-slate-400 text-[10px] font-black uppercase">Coins</Text>
            </View>
          </View>
        </Animated.View>

        {/* Buttons */}
        <Animated.View entering={FadeInUp.delay(1800)} className="w-full gap-4">
           <ChildButton
              title="Play Again"
              onPress={() => router.replace("/(child)/games/word-race")}
              variant="primary"
              size="large"
           />
           <ChildButton
              title="Back to Home"
              onPress={() => router.replace("/(child)/home")}
              variant="outline"
              size="large"
           />
        </Animated.View>
      </View>
    </ChildLayout>
  );
}
