import React, { useState, useEffect, useCallback } from "react";
import { View, Text, Pressable, SafeAreaView, Dimensions, Platform } from "react-native";
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

  const handleGameOver = () => {
    // Drive car off screen delay
    setTimeout(() => {
      router.push({
        pathname: "/(child)/games/result",
        params: {
          score,
          coins,
          accuracy: Math.round((useGameStore.getState().correctCount / questions.length) * 100),
          stars: useGameStore.getState().correctCount >= 8 ? 3 : useGameStore.getState().correctCount >= 5 ? 2 : 1
        }
      });
    }, 400);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
    <View className="flex-1 bg-white">
      {/* HUD Bar */}
      <SafeAreaView className="bg-slate-900 pb-2">
        <View className="flex-row justify-between items-center px-6 py-2">
          <View className="flex-row items-center gap-3">
             <View className="bg-child-primary p-2 rounded-xl">
               <Icons name="zap" size={20} color="white" />
             </View>
             <View>
               <Text className="text-white/60 text-[10px] font-black uppercase">Streak</Text>
               <Text className="text-white font-black text-lg">{streak}</Text>
             </View>
          </View>
          
          <View className="items-center">
            <Text className="text-white/60 text-[10px] font-black uppercase">Progress</Text>
            <View className="flex-row gap-1 mt-1">
              {questions.map((_: any, i: number) => (
                <View 
                  key={i} 
                  className={cn(
                    "w-3 h-1.5 rounded-full",
                    i < currentQuestionIndex ? "bg-child-success" : 
                    i === currentQuestionIndex ? "bg-child-primary w-6" : "bg-white/20"
                  )} 
                />
              ))}
            </View>
          </View>

          <View className="items-end">
            <Text className="text-white/60 text-[10px] font-black uppercase">Time</Text>
            <Text className="text-white font-black text-lg">{formatTime(timeLeft)}</Text>
          </View>
        </View>
      </SafeAreaView>

      {/* Skia Canvas Area */}
      <WordRaceCanvas 
        carState={carState} 
        questionText={currentQ?.question || ""}
        isSignVisible={!feedback}
      />

      {/* Game UI Layer */}
      <View className="flex-1 px-6 pt-8 pb-12 justify-between">
        {/* Question Area */}
        <Animated.View 
          entering={FadeInDown} 
          key={currentQuestionIndex}
          className="bg-white rounded-[40px] p-8 shadow-xl border-4 border-slate-100"
        >
          <Text className="text-child-primary font-black uppercase tracking-widest text-xs mb-3">
            Question {currentQuestionIndex + 1}
          </Text>
          <Text className="text-3xl font-black text-slate-800 leading-tight">
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
                  "h-16 rounded-3xl flex-row items-center px-6 border-b-4 active:scale-95 transition-all shadow-md",
                  !feedback && "bg-white border-slate-200",
                  isCorrect && "bg-child-success border-green-700",
                  isWrong && "bg-child-danger border-red-700",
                  showCorrectAnswer && "bg-child-success/20 border-child-success"
                )}
              >
                <View className={cn(
                  "w-8 h-8 rounded-full items-center justify-center mr-4",
                  !feedback ? "bg-slate-100" : "bg-white"
                )}>
                  {isCorrect ? <Icons name="check" size={18} color="#4CAF50" /> :
                   isWrong ? <Icons name="x" size={18} color="#F44336" /> :
                   <Text className="font-black text-slate-400">{String.fromCharCode(65 + i)}</Text>}
                </View>
                <Text className={cn(
                  "text-xl font-black",
                  (isCorrect || isWrong) ? "text-white" : "text-slate-700"
                )}>
                  {option}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Turbo Overlay */}
      {carState === 'turbo' && (
        <Animated.View 
          entering={ZoomIn}
          className="absolute inset-0 pointer-events-none border-[12px] border-child-accent opacity-30"
        />
      )}
    </View>
  );
}
