import React, { useState, useEffect, useRef } from "react";
import { View, Text, Pressable, SafeAreaView, Dimensions, StatusBar, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import Animated, { FadeInDown, ZoomIn } from "react-native-reanimated";
import { Feather as Icons } from "@expo/vector-icons";
import { useGameStore } from "@/store/gameStore";
import { wordRaceQuestions } from "@/constants/mockData";
import { WordRaceCanvas } from "@/components/games/WordRaceCanvas";
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
    isSessionActive,
  } = useGameStore();

  const [timeLeft, setTimeLeft] = useState(300);
  const [showCountdown, setShowCountdown] = useState(true);
  const [countdown, setCountdown] = useState(3);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; correctAnswer: string } | null>(null);
  const [ranking, setRanking] = useState(3);
  const startTime = useRef(Date.now());

  useEffect(() => {
    startGame(wordRaceQuestions);
  }, []);

  useEffect(() => {
    if (showCountdown && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && showCountdown) {
      setShowCountdown(false);
    }
  }, [countdown, showCountdown]);

  useEffect(() => {
    if (!showCountdown && isSessionActive && timeLeft > 0) {
      const interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
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
    setTimeout(() => {
      setSelectedOption(null);
      setFeedback(null);
      if (currentQuestionIndex === questions.length - 1) {
        handleGameOver();
      } else {
        nextQuestion();
      }
    }, 1000);
  };

  const handleGameOver = () => {
    const totalTime = Math.round((Date.now() - startTime.current) / 1000);
    const finalRank = ranking;
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
        },
      });
    }, 500);
  };

  const getRankSuffix = (r: number) => {
    if (r === 1) return "st";
    if (r === 2) return "nd";
    return "rd";
  };

  // ─── Countdown Screen ───────────────────────────────────────────────
  if (showCountdown) {
    return (
      <View style={styles.countdownBg}>
        <Animated.View entering={ZoomIn} key={countdown} style={styles.countdownInner}>
          <View style={styles.countdownRing}>
            <Text style={styles.countdownNum}>{countdown === 0 ? "GO!" : countdown}</Text>
          </View>
          <Text style={styles.countdownLabel}>WORD RACE</Text>
        </Animated.View>
      </View>
    );
  }

  const currentQ = questions[currentQuestionIndex];

  // ─── Game Screen ─────────────────────────────────────────────────────
  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      {/* ── Top HUD ── */}
      <SafeAreaView style={styles.hud}>
        <View style={styles.hudRow}>
          {/* Back + Streak */}
          <View style={styles.hudLeft}>
            <Pressable onPress={() => router.back()} style={styles.backBtn}>
              <Icons name="arrow-left" size={20} color="white" />
            </Pressable>
            <View>
              <Text style={styles.hudLabel}>Streak</Text>
              <View style={styles.hudStreak}>
                <Icons name="zap" size={14} color="#f97316" />
                <Text style={styles.hudStreakNum}>{streak}</Text>
              </View>
            </View>
          </View>

          {/* Progress */}
          <View style={styles.hudProgress}>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${((currentQuestionIndex + 1) / Math.max(questions.length, 1)) * 100}%` },
                ]}
              />
            </View>
            <Text style={styles.hudLabel}>Race Progress</Text>
          </View>

          {/* Rank */}
          <View style={styles.hudRight}>
            <Text style={styles.hudLabel}>Position</Text>
            <View style={styles.rankRow}>
              <Text style={styles.rankNum}>{ranking}</Text>
              <Text style={styles.rankSuffix}>{getRankSuffix(ranking)}</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>

      {/* ── Canvas ── */}
      <View style={styles.canvasWrapper}>
        <WordRaceCanvas carState={carState} onRankingChange={setRanking} />

        {/* Nitro bar */}
        <View style={styles.nitroBar}>
          <View style={styles.nitroSegments}>
            {[1, 2, 3].map((i) => (
              <View
                key={i}
                style={[styles.nitroSeg, streak >= i ? styles.nitroActive : styles.nitroOff]}
              />
            ))}
          </View>
          <Text style={styles.nitroLabel}>NITRO</Text>
        </View>

        {/* Speed */}
        <View style={styles.speedBox}>
          <Text style={styles.speedLabel}>Speed</Text>
          <Text style={styles.speedNum}>
            {carState === "turbo" ? "240" : carState === "boosting" ? "180" : "120"}
            <Text style={styles.speedUnit}> KM/H</Text>
          </Text>
        </View>
      </View>

      {/* ── Question + Answers ── */}
      <View style={styles.sheet}>
        {/* Question */}
        <Animated.View
          entering={FadeInDown.springify()}
          key={currentQuestionIndex}
          style={styles.questionCard}
        >
          <View style={styles.challengeBadge}>
            <Text style={styles.challengeText}>CHALLENGE {currentQuestionIndex + 1}</Text>
          </View>
          <Text style={styles.questionText}>{currentQ?.question}</Text>
        </Animated.View>

        {/* Answer Buttons */}
        <View style={styles.options}>
          {currentQ?.options.map((option: string, i: number) => {
            const isSelected = selectedOption === option;
            const isCorrect = !!(feedback?.isCorrect && isSelected);
            const isWrong = !!(feedback && !feedback.isCorrect && isSelected);
            const showCorrect = !!(feedback && !feedback.isCorrect && option === feedback.correctAnswer);

            return (
              <Pressable
                key={i}
                onPress={() => handleAnswer(option)}
                disabled={isAnswerLocked}
                style={[
                  styles.optionBtn,
                  !feedback && styles.optionDefault,
                  isCorrect && styles.optionCorrect,
                  isWrong && styles.optionWrong,
                  showCorrect && styles.optionShowCorrect,
                ]}
              >
                <View style={[styles.optionIcon, !feedback ? styles.optionIconDefault : styles.optionIconFeedback]}>
                  {isCorrect ? (
                    <Icons name="check" size={22} color="#22c55e" />
                  ) : isWrong ? (
                    <Icons name="x" size={22} color="#ef4444" />
                  ) : (
                    <Text style={styles.optionLetter}>{String.fromCharCode(65 + i)}</Text>
                  )}
                </View>
                <Text
                  style={[
                    styles.optionText,
                    isCorrect ? styles.optionTextCorrect : isWrong ? styles.optionTextWrong : styles.optionTextDefault,
                  ]}
                >
                  {option}
                </Text>
                {isCorrect && (
                  <Animated.View entering={ZoomIn}>
                    <Icons name="zap" size={22} color="#f97316" />
                  </Animated.View>
                )}
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#020617" },
  // Countdown
  countdownBg: { flex: 1, backgroundColor: "#020617", alignItems: "center", justifyContent: "center" },
  countdownInner: { alignItems: "center" },
  countdownRing: { width: 192, height: 192, borderRadius: 96, borderWidth: 8, borderColor: "rgba(249,115,22,0.2)", alignItems: "center", justifyContent: "center" },
  countdownNum: { fontSize: 96, fontWeight: "900", color: "white" },
  countdownLabel: { fontSize: 22, fontWeight: "900", color: "#f97316", letterSpacing: 10, marginTop: 32 },
  // HUD
  hud: { backgroundColor: "rgba(2,6,23,0.6)", zIndex: 10 },
  hudRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 24, paddingVertical: 12 },
  hudLeft: { flexDirection: "row", alignItems: "center", gap: 16 },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" },
  hudLabel: { color: "rgba(255,255,255,0.4)", fontSize: 10, fontWeight: "900", textTransform: "uppercase", letterSpacing: 2 },
  hudStreak: { flexDirection: "row", alignItems: "center", gap: 4 },
  hudStreakNum: { color: "white", fontWeight: "900", fontSize: 20 },
  hudProgress: { alignItems: "center", flex: 1, marginHorizontal: 16 },
  progressTrack: { width: "100%", height: 10, backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 5, overflow: "hidden", marginBottom: 4, borderWidth: 1, borderColor: "rgba(255,255,255,0.05)" },
  progressFill: { height: "100%", backgroundColor: "#f97316", borderRadius: 5 },
  hudRight: { alignItems: "flex-end" },
  rankRow: { flexDirection: "row", alignItems: "baseline" },
  rankNum: { color: "#f97316", fontWeight: "900", fontSize: 28 },
  rankSuffix: { color: "rgba(249,115,22,0.6)", fontWeight: "900", fontSize: 13, marginLeft: 2 },
  hudRight2: { alignItems: "flex-end" },
  // Canvas
  canvasWrapper: { position: "relative" },
  nitroBar: { position: "absolute", bottom: 12, left: 24, flexDirection: "row", alignItems: "center", backgroundColor: "rgba(0,0,0,0.6)", paddingHorizontal: 16, paddingVertical: 6, borderRadius: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)", gap: 12 },
  nitroSegments: { flexDirection: "row", gap: 4 },
  nitroSeg: { width: 20, height: 8, borderRadius: 2 },
  nitroActive: { backgroundColor: "#facc15" },
  nitroOff: { backgroundColor: "rgba(255,255,255,0.1)" },
  nitroLabel: { color: "rgba(255,255,255,0.8)", fontSize: 10, fontWeight: "900", textTransform: "uppercase", letterSpacing: 2 },
  speedBox: { position: "absolute", bottom: 12, right: 24, alignItems: "flex-end" },
  speedLabel: { color: "rgba(255,255,255,0.4)", fontSize: 10, fontWeight: "900", textTransform: "uppercase" },
  speedNum: { color: "white", fontWeight: "900", fontSize: 22 },
  speedUnit: { color: "rgba(255,255,255,0.4)", fontSize: 12 },
  // Sheet
  sheet: { flex: 1, backgroundColor: "#0f172a", borderTopLeftRadius: 40, borderTopRightRadius: 40, marginTop: -24, borderTopWidth: 1.5, borderColor: "rgba(255,255,255,0.08)", paddingHorizontal: 24, paddingTop: 32, paddingBottom: 24, justifyContent: "space-between" },
  questionCard: { backgroundColor: "rgba(255,255,255,0.04)", padding: 28, borderRadius: 32, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)", alignItems: "center", marginBottom: 20 },
  challengeBadge: { backgroundColor: "rgba(249,115,22,0.15)", paddingHorizontal: 16, paddingVertical: 6, borderRadius: 999, marginBottom: 16, borderWidth: 1, borderColor: "rgba(249,115,22,0.25)" },
  challengeText: { color: "#f97316", fontWeight: "700", textTransform: "uppercase", fontSize: 10, letterSpacing: 4 },
  questionText: { fontSize: 26, fontWeight: "900", color: "white", textAlign: "center", lineHeight: 36 },
  // Options
  options: { gap: 12 },
  optionBtn: { height: 64, borderRadius: 24, flexDirection: "row", alignItems: "center", paddingHorizontal: 20, borderWidth: 1.5 },
  optionDefault: { backgroundColor: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.1)" },
  optionCorrect: { backgroundColor: "rgba(34,197,94,0.15)", borderColor: "rgba(34,197,94,0.5)" },
  optionWrong: { backgroundColor: "rgba(239,68,68,0.15)", borderColor: "rgba(239,68,68,0.5)" },
  optionShowCorrect: { backgroundColor: "rgba(34,197,94,0.07)", borderColor: "rgba(34,197,94,0.3)" },
  optionIcon: { width: 40, height: 40, borderRadius: 14, alignItems: "center", justifyContent: "center", marginRight: 16 },
  optionIconDefault: { backgroundColor: "rgba(255,255,255,0.05)" },
  optionIconFeedback: { backgroundColor: "rgba(255,255,255,0.1)" },
  optionLetter: { fontWeight: "900", color: "rgba(255,255,255,0.3)", fontSize: 18 },
  optionText: { fontSize: 18, fontWeight: "700", flex: 1 },
  optionTextDefault: { color: "white" },
  optionTextCorrect: { color: "#4ade80" },
  optionTextWrong: { color: "#f87171" },
});
