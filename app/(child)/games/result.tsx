import React, { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Animated, {
  FadeInUp,
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
} from "react-native-reanimated";
import { Feather as Icons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ResultScreen() {
  const router = useRouter();
  const { score, coins, accuracy, stars, gameType, timeTaken, rank, rivalTimes } = useLocalSearchParams();

  const [displayCoins, setDisplayCoins] = useState(0);
  const rivals = rivalTimes ? JSON.parse(rivalTimes as string) : [];
  const starCount = Number(stars) || 0;
  const isRace = gameType === "word-race";

  const star1Scale = useSharedValue(0);
  const star2Scale = useSharedValue(0);
  const star3Scale = useSharedValue(0);

  const star1Style = useAnimatedStyle(() => ({ transform: [{ scale: star1Scale.value }] }));
  const star2Style = useAnimatedStyle(() => ({ transform: [{ scale: star2Scale.value }], marginTop: -20 }));
  const star3Style = useAnimatedStyle(() => ({ transform: [{ scale: star3Scale.value }] }));

  useEffect(() => {
    star1Scale.value = withDelay(500, withSpring(1, { damping: 8, stiffness: 180 }));
    if (starCount >= 2) star2Scale.value = withDelay(800, withSpring(1, { damping: 8, stiffness: 180 }));
    if (starCount >= 3) star3Scale.value = withDelay(1100, withSpring(1, { damping: 8, stiffness: 180 }));

    const target = Number(coins) || 0;
    const iv = setInterval(() => {
      setDisplayCoins((p) => { if (p >= target) { clearInterval(iv); return target; } return p + Math.ceil(target / 20); });
    }, 50);
    return () => clearInterval(iv);
  }, []);

  const perf = starCount === 3 ? "PERFECT!" : starCount === 2 ? "GREAT JOB!" : "KEEP GOING!";
  const perfColor = starCount === 3 ? "#22C55E" : starCount === 2 ? "#FF6B35" : "#1B4FE4";

  return (
    <View style={styles.root}>
      <SafeAreaView edges={["top"]}>
        <View style={styles.header}>
          <Text style={styles.headerLabel}>RACE COMPLETE</Text>
        </View>
      </SafeAreaView>

      <View style={styles.center}>
        {/* Performance */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.perfSection}>
          <Text style={[styles.perfText, { color: perfColor }]}>{perf}</Text>
        </Animated.View>

        {/* Stars */}
        <View style={styles.starsRow}>
          <Animated.View style={star1Style}>
            <Icons name="star" size={52} color={starCount >= 1 ? "#facc15" : "#1e293b"} />
          </Animated.View>
          <Animated.View style={star2Style}>
            <Icons name="star" size={68} color={starCount >= 2 ? "#facc15" : "#1e293b"} />
          </Animated.View>
          <Animated.View style={star3Style}>
            <Icons name="star" size={52} color={starCount >= 3 ? "#facc15" : "#1e293b"} />
          </Animated.View>
        </View>

        {/* Race Leaderboard */}
        {isRace && (
          <Animated.View entering={FadeInUp.delay(700)} style={styles.leaderboard}>
            <Text style={styles.lbTitle}>RACE LEADERBOARD</Text>
            <View style={[styles.lbRow, rank === "1" && styles.lbRowHighlight]}>
              <View style={styles.lbBadge}><Text style={styles.lbBadgeText}>{rank}</Text></View>
              <Text style={styles.lbName}>YOU</Text>
              <Text style={styles.lbTime}>{timeTaken}s</Text>
            </View>
            {rivals.map((time: number, i: number) => (
              <View key={i} style={styles.lbRowRival}>
                <View style={styles.lbBadgeGray}><Text style={styles.lbBadgeGrayText}>{i + 2}</Text></View>
                <Text style={styles.lbRivalName}>Rival {i + 1}</Text>
                <Text style={styles.lbRivalTime}>{time}s</Text>
              </View>
            ))}
          </Animated.View>
        )}

        {/* Stats */}
        <Animated.View entering={FadeInUp.delay(isRace ? 1100 : 700)} style={styles.statsRow}>
          {[
            { icon: "award" as const,  val: String(score),       label: "Points",   color: "#FF6B35" },
            { icon: "zap" as const,    val: `${accuracy}%`,       label: "Accuracy", color: "#1B4FE4" },
            { icon: "gift" as const,   val: `+${displayCoins}`,   label: "Coins",    color: "#22C55E" },
          ].map((s, i) => (
            <View key={i} style={styles.statCard}>
              <Icons name={s.icon} size={20} color={s.color} />
              <Text style={[styles.statVal, { color: s.color }]}>{s.val}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Buttons */}
        <Animated.View entering={FadeInUp.delay(isRace ? 1300 : 900)} style={styles.btns}>
          <Pressable
            onPress={() => router.replace(isRace ? "/(child)/games/word-race" : "/(child)/games/math-jump")}
            style={({ pressed }) => [styles.playBtn, pressed && styles.pressed]}
          >
            <Text style={styles.playBtnText}>Play Again</Text>
          </Pressable>
          <Pressable
            onPress={() => router.replace("/(child)/home")}
            style={({ pressed }) => [styles.homeBtn, pressed && styles.pressed]}
          >
            <Text style={styles.homeBtnText}>Go Home</Text>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0F172A" },
  header: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 4 },
  headerLabel: { color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: "800", textTransform: "uppercase", letterSpacing: 4, textAlign: "center" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 24, gap: 20 },
  // Performance
  perfSection: { alignItems: "center" },
  perfText: { fontSize: 32, fontWeight: "900", letterSpacing: -0.5, textAlign: "center" },
  // Stars
  starsRow: { flexDirection: "row", alignItems: "flex-end", gap: 8 },
  // Leaderboard
  leaderboard: { width: "100%", backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 24, padding: 20, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
  lbTitle: { color: "rgba(255,255,255,0.35)", fontSize: 9, fontWeight: "800", textTransform: "uppercase", letterSpacing: 2, marginBottom: 14 },
  lbRow: { flexDirection: "row", alignItems: "center", padding: 12, borderRadius: 14, marginBottom: 8 },
  lbRowHighlight: { backgroundColor: "rgba(249,115,22,0.15)", borderWidth: 1, borderColor: "rgba(249,115,22,0.3)" },
  lbBadge: { width: 30, height: 30, borderRadius: 15, backgroundColor: "#f97316", alignItems: "center", justifyContent: "center", marginRight: 12 },
  lbBadgeText: { color: "white", fontWeight: "800", fontSize: 13 },
  lbName: { flex: 1, color: "white", fontWeight: "800", fontSize: 16 },
  lbTime: { color: "white", fontWeight: "800", fontSize: 18 },
  lbRowRival: { flexDirection: "row", alignItems: "center", padding: 10, borderRadius: 12, marginBottom: 4, opacity: 0.55 },
  lbBadgeGray: { width: 26, height: 26, borderRadius: 13, backgroundColor: "rgba(255,255,255,0.12)", alignItems: "center", justifyContent: "center", marginRight: 12 },
  lbBadgeGrayText: { color: "rgba(255,255,255,0.6)", fontWeight: "800", fontSize: 11 },
  lbRivalName: { flex: 1, color: "rgba(255,255,255,0.6)", fontWeight: "700", fontSize: 14 },
  lbRivalTime: { color: "rgba(255,255,255,0.6)", fontWeight: "700", fontSize: 14 },
  // Stats
  statsRow: { flexDirection: "row", width: "100%", gap: 12 },
  statCard: { flex: 1, backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 20, padding: 16, alignItems: "center", gap: 6, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
  statVal: { fontSize: 20, fontWeight: "900" },
  statLabel: { fontSize: 9, color: "rgba(255,255,255,0.4)", fontWeight: "800", textTransform: "uppercase", letterSpacing: 1 },
  // Buttons
  btns: { width: "100%", gap: 12 },
  playBtn: { backgroundColor: "#FF6B35", borderRadius: 20, height: 56, alignItems: "center", justifyContent: "center", shadowColor: "#FF6B35", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 16, elevation: 8 },
  playBtnText: { color: "white", fontSize: 17, fontWeight: "800" },
  homeBtn: { borderRadius: 20, height: 52, alignItems: "center", justifyContent: "center", borderWidth: 1.5, borderColor: "rgba(249,115,22,0.5)" },
  homeBtnText: { color: "#f97316", fontSize: 16, fontWeight: "700" },
  pressed: { transform: [{ scale: 0.97 }] },
});
