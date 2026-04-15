import React, { useState, useEffect, useCallback, useRef } from "react";
import { View, Text, Pressable, SafeAreaView, Dimensions, Platform, StatusBar } from "react-native";

import { useRouter } from "expo-router";
import Animated, { 
  FadeInDown, 
  FadeOutUp, 
  Layout, 
  ZoomIn,
  withSpring,
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming
} from "react-native-reanimated";
import { Feather as Icons } from "@expo/vector-icons";
import { useGameStore } from "@/store/gameStore";
import { wordRaceQuestions } from "@/constants/mockData";
import { WordRaceCanvas } from "@/components/games/WordRaceCanvas";
import { ChildButton } from "@/components/buttons/ChildButton";
import { cn } from "@/lib/utils";

const { width } = Dimensions.get("window");

export default function WordRaceScreen() {
  const router = useRouter();
  const { 
    startGame, 
    submitAnswer, 
    nextQuestion, 
    score, 
    coins, 
    streak, 
    carState,
    currentQuestionIndex,
    questions,
    isAnswerLocked,
    isSessionActive
  } = useGameStore();

  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [showCountdown, setShowCountdown] = useState(true);
  const [countdown, setCountdown] = useState(3);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; correctAnswer: string } | null>(null);

  // Initialize Game
  useEffect(() => {
    startGame(wordRaceQuestions);
  }, []);

  // Countdown Logic
  useEffect(() => {
    if (showCountdown && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && showCountdown) {
      setShowCountdown(false);
    }
  }, [countdown, showCountdown]);

  // Session timer
  useEffect(() => {
    if (!showCountdown && isSessionActive && timeLeft > 0) {
      const interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(interval);
    } else if (timeLeft === 0) {
      handleGameOver();
    }
  }, [showCountdown, isSessionActive, timeLeft]);

  const handleAnswer = (option: string) => {
    if (isAnswerLocked) return;
    
    setSelectedOption(option);
    const result = submitAnswer(option);
    setFeedback(result);
    
    // Show feedback for 1.5 seconds then next question
    setTimeout(() => {
      setSelectedOption(null);
      setFeedback(null);
      
      if (currentQuestionIndex === questions.length - 1) {
        handleGameOver();
      } else {
        nextQuestion();
      }
    }, 1800);
  };

  const [ranking, setRanking] = useState(1);
  const startTime = useRef(Date.now());

  // ... (keep useEffect for countdown, startGame, etc.)
  
  const handleGameOver = () => {
    const totalTime = Math.round((Date.now() - startTime.current) / 1000);
    const finalRank = ranking;
    
    // Mock rival times relative to player
    const rival1Time = totalTime + (finalRank === 1 ? 2 : finalRank === 2 ? -1 : -3);
    const rival2Time = totalTime + (finalRank === 1 ? 4 : finalRank === 2 ? 1 : -2);

    setTimeout(() => {
      router.push({
        pathname: "/(child)/games/result",
        params: {
          gameType: "word-race",
          score,
          coins,
          accuracy: Math.round((useGameStore.getState().correctCount / questions.length) * 100),
          stars: finalRank === 1 ? 3 : finalRank === 2 ? 2 : 1,
          timeTaken: totalTime,
          rank: finalRank,
          rivalTimes: JSON.stringify([rival1Time, rival2Time]),
        }
      });
    }, 800);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getRankSuffix = (r: number) => {
    if (r === 1) return "st";
    if (r === 2) return "nd";
    return "rd";
  };

  if (showCountdown) {
    return (
      <View className="flex-1 bg-child-primary items-center justify-center">
        <Animated.View entering={ZoomIn} key={countdown} className="items-center">
          <Text className="text-[120px] font-black text-white shadow-lg">
            {countdown === 0 ? "GO!" : countdown}
          </Text>
          <Text className="text-white/80 font-black uppercase tracking-[10px] text-xl mt-4">
            Word Race
          </Text>
        </Animated.View>
      </View>
    );
  }

  const currentQ = questions[currentQuestionIndex];

  return (
    <View className="flex-1 bg-slate-900">
      <StatusBar barStyle="light-content" />
      {/* HUD Bar */}
      <SafeAreaView className="bg-slate-900/80">
        <View className="flex-row justify-between items-center px-6 py-4">
          <View className="flex-row items-center gap-4">
             <Pressable onPress={() => router.back()} className="w-10 h-10 items-center justify-center bg-white/10 rounded-xl">
               <Icons name="arrow-left" size={20} color="white" />
             </Pressable>
             <View>
               <Text className="text-white/40 text-[10px] font-black uppercase tracking-widest">Streak</Text>
               <View className="flex-row items-center gap-1">
                 <Icons name="zap" size={14} color="#FFD700" />
                 <Text className="text-white font-black text-xl">{streak}</Text>
               </View>
             </View>
          </View>
          
          <View className="items-center flex-1 mx-4">
             <View className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-1">
                <Animated.View 
                  className="h-full bg-child-primary"
                  style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                />
             </View>
             <Text className="text-white/40 text-[9px] font-black uppercase">Race Progress</Text>
          </View>

          <View className="items-end">
            <Text className="text-white/40 text-[10px] font-black uppercase tracking-widest">Position</Text>
            <View className="flex-row items-baseline">
              <Text className="text-child-primary font-black text-2xl">{ranking}</Text>
              <Text className="text-child-primary/60 font-black text-sm">{getRankSuffix(ranking)}</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>

      {/* Skia Canvas Area */}
      <View className="border-y-4 border-slate-800">
        <WordRaceCanvas 
          carState={carState} 
          questionText={currentQ?.question || ""}
          isSignVisible={!feedback}
          onRankingChange={setRanking}
        />

        
        {/* Nitro Meter Overlay */}
        <View className="absolute bottom-4 left-6 bg-black/40 px-3 py-1 rounded-full border border-white/10 flex-row items-center gap-2">
           <View className="flex-row gap-0.5">
              {[1, 2, 3].map(i => (
                <View 
                  key={i} 
                  className={cn(
                    "w-4 h-1.5 rounded-sm",
                    streak >= i ? "bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)]" : "bg-white/20"
                  )} 
                />
              ))}
           </View>
           <Text className="text-[9px] text-white/60 font-black uppercase">Nitro</Text>
        </View>
      </View>

      {/* Game UI Layer */}
      <View className="flex-1 px-6 pt-6 pb-10 justify-between bg-slate-50 rounded-t-[40px] -mt-6">
        {/* Question Area */}
        <Animated.View 
          entering={FadeInDown} 
          key={currentQuestionIndex}
          className="bg-white p-8 rounded-[32px] shadow-2xl border-2 border-slate-100 items-center"
        >
          <View className="bg-child-primary/10 px-4 py-1 rounded-full mb-4">
            <Text className="text-child-primary font-black uppercase text-[10px] tracking-widest">
              Level {currentQuestionIndex + 1}
            </Text>
          </View>
          <Text className="text-3xl font-black text-slate-800 leading-tight text-center">
            {currentQ?.question}
          </Text>
        </Animated.View>

        {/* Answer Buttons */}
        <View className="gap-4">
          {currentQ?.options.map((option: string, i: number) => {
            const isSelected = selectedOption === option;
            const isCorrect = feedback?.isCorrect && isSelected;
            const isWrong = feedback && !feedback.isCorrect && isSelected;
            const showCorrectAnswer = feedback && !feedback.isCorrect && option === feedback.correctAnswer;

            return (
              <Pressable
                key={i}
                onPress={() => handleAnswer(option)}
                disabled={isAnswerLocked}
                className={cn(
                  "h-18 rounded-3xl flex-row items-center px-6 border-b-[6px] active:scale-[0.98] transition-all",
                  !feedback && "bg-white border-slate-200",
                  isCorrect && "bg-child-success border-green-700",
                  isWrong && "bg-child-danger border-red-700",
                  showCorrectAnswer && "bg-child-success/10 border-child-success"
                )}
              >
                <View className={cn(
                  "w-10 h-10 rounded-2xl items-center justify-center mr-4 shadow-sm",
                  !feedback ? "bg-slate-50" : "bg-white/20"
                )}>
                  {isCorrect ? <Icons name="check" size={20} color="white" /> :
                   isWrong ? <Icons name="x" size={20} color="white" /> :
                   <Text className="font-black text-slate-400 text-lg">{String.fromCharCode(65 + i)}</Text>}
                </View>
                <Text className={cn(
                  "text-xl font-black flex-1",
                  (isCorrect || isWrong) ? "text-white" : "text-slate-700"
                )}>
                  {option}
                </Text>
                {isCorrect && (
                  <Animated.View entering={ZoomIn}>
                    <Icons name="zap" size={20} color="white" />
                  </Animated.View>
                )}
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Turbo Overlay */}
      {carState === 'turbo' && (
        <Animated.View 
          entering={ZoomIn.duration(300)}
          className="absolute inset-0 pointer-events-none border-[16px] border-yellow-400/20"
        >
          <View className="flex-1 items-center justify-center">
             <Text className="text-yellow-400 font-black text-8xl opacity-10 rotate-12">TURBO</Text>
          </View>
        </Animated.View>
      )}
    </View>
  );
}
