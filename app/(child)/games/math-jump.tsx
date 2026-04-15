import React, { useState, useEffect, useCallback } from "react";
import { View, Text, Pressable, SafeAreaView, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import Animated, { 
  FadeInDown, 
  FadeInUp,
  ZoomIn,
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
  withTiming,
  Layout
} from "react-native-reanimated";
import { Feather as Icons } from "@expo/vector-icons";
import { ChildLayout } from "@/components/layouts/ChildLayout";
import { ChildButton } from "@/components/buttons/ChildButton";
import { cn } from "@/lib/utils";

const { width } = Dimensions.get("window");

interface MathQuestion {
  question: string;
  answer: number;
  options: number[];
}

export default function MathJumpScreen() {
  const router = useRouter();
  const [level, setLevel] = useState(1);
  const [hearts, setHearts] = useState(3);
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<MathQuestion | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);

  const characterJump = useSharedValue(0);

  // Generate dynamic question based on level
  const generateQuestion = useCallback((lvl: number): MathQuestion => {
    const operations = ["+", "-", "*"];
    const op = lvl === 1 ? "+" : operations[Math.floor(Math.random() * Math.min(lvl, 3))];
    
    let num1, num2, answer;
    if (op === "+") {
      num1 = Math.floor(Math.random() * (10 + lvl * 2));
      num2 = Math.floor(Math.random() * (10 + lvl * 2));
      answer = num1 + num2;
    } else if (op === "-") {
      num1 = Math.floor(Math.random() * (10 + lvl * 3)) + 5;
      num2 = Math.floor(Math.random() * num1);
      answer = num1 - num2;
    } else {
      num1 = Math.floor(Math.random() * (5 + lvl));
      num2 = Math.floor(Math.random() * (5 + lvl));
      answer = num1 * num2;
    }

    const options = [answer];
    while (options.length < 3) {
      const wrong = answer + (Math.floor(Math.random() * 10) - 5);
      if (wrong !== answer && wrong >= 0 && !options.includes(wrong)) {
        options.push(wrong);
      }
    }
    
    return {
      question: `${num1} ${op} ${num2} = ?`,
      answer,
      options: options.sort(() => Math.random() - 0.5)
    };
  }, []);

  useEffect(() => {
    setCurrentQuestion(generateQuestion(level));
  }, [level, generateQuestion]);

  const handleAnswer = (option: number) => {
    if (selectedOption !== null || isGameOver) return;
    
    setSelectedOption(option);
    const correct = option === currentQuestion?.answer;
    setIsCorrect(correct);

    if (correct) {
      setScore(s => s + 100 * level);
      characterJump.value = withSequence(
        withSpring(-100, { damping: 10, stiffness: 100 }),
        withSpring(0, { damping: 10, stiffness: 100 })
      );
    } else {
      setHearts(h => h - 1);
      if (hearts <= 1) {
        setIsGameOver(true);
      }
    }

    setTimeout(() => {
      if (correct) {
        setLevel(l => l + 1);
      }
      setSelectedOption(null);
      setIsCorrect(null);
      if (!correct && hearts > 1) {
         setCurrentQuestion(generateQuestion(level));
      }
    }, 1500);
  };

  const jumpStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: characterJump.value }]
  }));

  if (isGameOver) {
    return (
      <View className="flex-1 bg-child-primary items-center justify-center p-6">
        <Animated.View entering={ZoomIn} className="bg-white p-10 rounded-[40px] items-center w-full shadow-2xl">
          <Text className="text-6xl mb-6">🏁</Text>
          <Text className="text-4xl font-black text-slate-800 mb-2">Game Over!</Text>
          <Text className="text-lg text-slate-500 mb-8 font-bold">You reached Level {level}</Text>
          
          <View className="bg-slate-50 p-6 rounded-3xl w-full mb-8">
             <View className="flex-row justify-between mb-2">
                <Text className="text-slate-400 font-bold uppercase text-xs">Final Score</Text>
                <Text className="text-child-primary font-black text-xl">{score}</Text>
             </View>
          </View>

          <View className="w-full gap-4">
            <ChildButton 
              title="Play Again" 
              onPress={() => {
                setLevel(1);
                setHearts(3);
                setScore(0);
                setIsGameOver(false);
                setCurrentQuestion(generateQuestion(1));
              }}
              variant="primary"
            />
            <ChildButton 
              title="Back to Games" 
              onPress={() => router.replace("/(child)/games")}
              variant="secondary"
            />
          </View>

        </Animated.View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-sky-400">
      <SafeAreaView className="flex-1">
        {/* Header HUD */}
        <View className="flex-row justify-between items-center px-6 py-4">
          <Pressable 
            onPress={() => router.back()}
            className="w-12 h-12 bg-white/30 rounded-2xl items-center justify-center border-2 border-white/40"
          >
            <Icons name="arrow-left" size={24} color="white" />
          </Pressable>
          
          <View className="flex-row gap-3">
             <View className="bg-white/30 px-4 py-2 rounded-2xl border-2 border-white/40 flex-row items-center gap-2">
                <Icons name="star" size={16} color="gold" />
                <Text className="text-white font-black">{score}</Text>
             </View>
             <View className="bg-white/30 px-4 py-2 rounded-2xl border-2 border-white/40 flex-row items-center gap-2">
                <Icons name="heart" size={16} color="#ff4757" />
                <Text className="text-white font-black">{hearts}</Text>
             </View>
          </View>
        </View>

        {/* Game Area */}
        <View className="flex-1 px-6 pb-8">
           {/* Question Cloud */}
           <View className="flex-1 justify-center items-center">
              <Animated.View 
                entering={FadeInUp}
                key={level}
                className="bg-white p-10 rounded-[50px] shadow-2xl items-center w-full border-b-[8px] border-slate-200"
              >
                <Text className="text-child-primary/60 font-black uppercase tracking-widest text-xs mb-4">
                  Question Level {level}
                </Text>
                <Text className="text-6xl font-black text-slate-800">
                  {currentQuestion?.question}
                </Text>
              </Animated.View>

              {/* Character Area */}
              <View className="h-40 w-full items-center justify-end">
                  <Animated.View style={[jumpStyle]} className="items-center">
                     <Text className="text-8xl">🐵</Text>
                     {isCorrect === true && (
                       <Animated.View entering={FadeInUp} className="absolute -top-10 bg-green-500 px-4 py-1 rounded-full">
                          <Text className="text-white font-black">HOORAY!</Text>
                       </Animated.View>
                     )}
                     {isCorrect === false && (
                       <Animated.View entering={FadeInUp} className="absolute -top-10 bg-red-500 px-4 py-1 rounded-full">
                          <Text className="text-white font-black">Ouch!</Text>
                       </Animated.View>
                     )}
                  </Animated.View>
                  <View className="w-32 h-4 bg-black/10 rounded-full mt-2" />
              </View>
           </View>

           {/* Answer Options */}
           <View className="flex-row gap-4">
              {currentQuestion?.options.map((opt, i) => {
                const isItemCorrect = selectedOption === opt && isCorrect === true;
                const isItemWrong = selectedOption === opt && isCorrect === false;
                
                return (
                  <Pressable
                    key={i}
                    onPress={() => handleAnswer(opt)}
                    disabled={selectedOption !== null}
                    className={cn(
                      "flex-1 h-24 rounded-[32px] items-center justify-center border-b-8 active:scale-95 transition-all",
                      selectedOption === null ? "bg-white border-slate-200" :
                      isItemCorrect ? "bg-green-500 border-green-700" :
                      isItemWrong ? "bg-red-500 border-red-700" : "bg-white/50 border-transparent opacity-50"
                    )}
                  >
                    <Text className={cn(
                      "text-3xl font-black",
                      selectedOption !== null && (isItemCorrect || isItemWrong) ? "text-white" : "text-slate-800"
                    )}>
                      {opt}
                    </Text>
                  </Pressable>
                );
              })}
           </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

