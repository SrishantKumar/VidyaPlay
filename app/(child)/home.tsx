import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { mockChild, mockActivity } from "@/constants/mockData";
import { Feather as Icons } from "@expo/vector-icons";
import Animated, { FadeInDown, ZoomIn } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];
const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const GAME_CARDS = [
  { bg: "#1B4FE4", icon: "book-open" as const, label: "Word Race", sub: "Vocabulary · Class 3", route: "/(child)/games/word-race" as const },
  { bg: "#7C3AED", icon: "hash" as const,      label: "Math Jump", sub: "Mathematics · Class 3", route: "/(child)/games/math-jump" as const },
];

export default function ChildHomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        {/* Greeting */}
        <Animated.View entering={FadeInDown.duration(350)} style={styles.greetRow}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{mockChild.name[0]}</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.greetSub}>Welcome back</Text>
            <Text style={styles.greetName}>{mockChild.name}</Text>
          </View>
          <Pressable style={styles.bellBtn}>
            <Icons name="bell" size={20} color="#94A3B8" />
          </Pressable>
        </Animated.View>

        {/* Stat Pills */}
        <Animated.View entering={FadeInDown.delay(80).duration(300)} style={styles.statRow}>
          {[
            { icon: "zap" as const,      val: mockChild.rewardPoints, label: "pts",    color: "#f97316" },
            { icon: "activity" as const, val: 5,                       label: "streak", color: "#ef4444" },
            { icon: "star" as const,     val: mockChild.levelBadges.length, label: "badges", color: "#eab308" },
          ].map((s, i) => (
            <View key={i} style={styles.statPill}>
              <Icons name={s.icon} size={15} color={s.color} />
              <Text style={[styles.statVal, { color: s.color }]}>{s.val}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </Animated.View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Daily Challenge */}
        <Animated.View entering={FadeInDown.delay(120).duration(350)} style={styles.challengeCard}>
          <View style={styles.challengeLeft}>
            <Text style={styles.challengeEyebrow}>TODAY'S CHALLENGE</Text>
            <Text style={styles.challengeTitle}>Word Sprint</Text>
            <Text style={styles.challengeSub}>Answer 5 words, earn 30 coins</Text>
            <View style={styles.progressTrack}>
              <View style={styles.progressFill} />
            </View>
            <Text style={styles.progressLabel}>2 of 5 done</Text>
          </View>
          <View style={styles.challengeIconBox}>
            <Icons name="award" size={44} color="rgba(255,255,255,0.9)" />
          </View>
          <Pressable
            onPress={() => router.push("/(child)/games/word-race")}
            style={styles.challengeBtn}
          >
            <Text style={styles.challengeBtnText}>Play Now</Text>
            <Icons name="arrow-right" size={12} color="#FF6B35" />
          </Pressable>
        </Animated.View>

        {/* Game Zone */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Game Zone</Text>
        </View>
        <View style={styles.gameGrid}>
          {GAME_CARDS.map((g, i) => (
            <Animated.View key={i} entering={ZoomIn.delay(200 + i * 80)}>
              <Pressable
                onPress={() => router.push(g.route)}
                style={({ pressed }) => [styles.gameCard, { backgroundColor: g.bg, shadowColor: g.bg }, pressed && styles.gameCardPressed]}
              >
                <View style={styles.gameIconCircle}>
                  <Icons name={g.icon} size={28} color="white" />
                </View>
                <Text style={styles.gameCardTitle}>{g.label}</Text>
                <Text style={styles.gameCardSub}>{g.sub}</Text>
                <View style={styles.gameCardFooter}>
                  <Icons name="star" size={13} color="#facc15" />
                  <Icons name="star" size={13} color="#facc15" />
                  <Icons name="star" size={13} color="#facc15" />
                  <View style={styles.playPill}>
                    <Text style={styles.playPillText}>PLAY</Text>
                    <Icons name="chevron-right" size={11} color="white" />
                  </View>
                </View>
              </Pressable>
            </Animated.View>
          ))}
        </View>

        {/* Week Tracker */}
        <Animated.View entering={FadeInDown.delay(300).duration(350)} style={styles.weekCard}>
          <Text style={styles.weekTitle}>This Week</Text>
          <View style={styles.weekRow}>
            {DAYS.map((day, i) => {
              const done = i < 3;
              const today = i === 3;
              return (
                <View key={i} style={styles.dayItem}>
                  <View style={[styles.dayCircle, done && styles.dayDone, today && styles.dayToday, !done && !today && styles.dayFuture]}>
                    {done
                      ? <Icons name="check" size={16} color="white" />
                      : <Text style={[styles.dayLetter, today && styles.dayLetterToday]}>{day}</Text>}
                  </View>
                  <Text style={[styles.dayName, today && styles.dayNameToday]}>{DAY_NAMES[i].slice(0, 2)}</Text>
                </View>
              );
            })}
          </View>
        </Animated.View>

        {/* Adventure Logs */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
        </View>
        <View style={styles.activitiesList}>
          {mockActivity.map((a) => (
            <Pressable key={a.id} style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Icons name="zap" size={20} color="#FF6B35" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.activityTitle}>{a.type}</Text>
                <Text style={styles.activityTime}>{a.time}</Text>
              </View>
              <Text style={styles.activityPts}>+{a.points} pts</Text>
            </Pressable>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F8FAFC" },
  safeArea: { backgroundColor: "#F8FAFC", paddingHorizontal: 24, paddingBottom: 12 },
  scrollContent: { paddingHorizontal: 24, paddingTop: 8 },
  // Greeting
  greetRow: { flexDirection: "row", alignItems: "center", paddingTop: 8, paddingBottom: 4 },
  avatarCircle: { width: 52, height: 52, borderRadius: 26, backgroundColor: "#FF6B35", alignItems: "center", justifyContent: "center", shadowColor: "#FF6B35", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  avatarText: { color: "white", fontSize: 22, fontWeight: "800" },
  greetSub: { fontSize: 12, color: "#64748B", fontWeight: "600" },
  greetName: { fontSize: 24, fontWeight: "800", color: "#1A1A2E" },
  bellBtn: { padding: 8 },
  // Stat Pills
  statRow: { flexDirection: "row", gap: 10, paddingVertical: 12 },
  statPill: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "white", borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  statVal: { fontSize: 15, fontWeight: "800" },
  statLabel: { fontSize: 12, color: "#94A3B8", fontWeight: "600" },
  // Challenge Card
  challengeCard: { backgroundColor: "#FF6B35", borderRadius: 28, padding: 24, marginBottom: 28, flexDirection: "row", overflow: "hidden", shadowColor: "#FF6B35", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 16, elevation: 8 },
  challengeLeft: { flex: 1 },
  challengeEyebrow: { color: "rgba(255,255,255,0.8)", fontSize: 10, fontWeight: "800", textTransform: "uppercase", letterSpacing: 2, marginBottom: 4 },
  challengeTitle: { color: "white", fontSize: 22, fontWeight: "800", marginBottom: 4 },
  challengeSub: { color: "rgba(255,255,255,0.9)", fontSize: 13, marginBottom: 14 },
  progressTrack: { height: 6, backgroundColor: "rgba(255,255,255,0.25)", borderRadius: 3, overflow: "hidden", marginBottom: 5 },
  progressFill: { width: "40%", height: 6, backgroundColor: "white", borderRadius: 3 },
  progressLabel: { color: "rgba(255,255,255,0.8)", fontSize: 11, fontWeight: "700" },
  challengeIconBox: { alignItems: "center", justifyContent: "center", paddingLeft: 12 },
  challengeBtn: { position: "absolute", bottom: 20, right: 20, backgroundColor: "rgba(255,255,255,0.92)", paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999, flexDirection: "row", alignItems: "center", gap: 4 },
  challengeBtnText: { color: "#FF6B35", fontWeight: "800", fontSize: 12 },
  // Section
  sectionHeader: { marginBottom: 14, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  sectionTitle: { fontSize: 20, fontWeight: "800", color: "#1A1A2E" },
  // Game Cards
  gameGrid: { gap: 14, marginBottom: 28 },
  gameCard: { borderRadius: 24, padding: 24, height: 160, justifyContent: "space-between", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 16, elevation: 8 },
  gameCardPressed: { transform: [{ scale: 0.97 }] },
  gameIconCircle: { width: 52, height: 52, borderRadius: 26, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
  gameCardTitle: { color: "white", fontSize: 20, fontWeight: "800" },
  gameCardSub: { color: "rgba(255,255,255,0.8)", fontSize: 12 },
  gameCardFooter: { flexDirection: "row", alignItems: "center", gap: 3 },
  playPill: { marginLeft: "auto", backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: 14, paddingVertical: 6, borderRadius: 999, flexDirection: "row", alignItems: "center", gap: 2 },
  playPillText: { color: "white", fontWeight: "800", fontSize: 11 },
  // Week tracker
  weekCard: { backgroundColor: "white", borderRadius: 24, padding: 24, marginBottom: 28, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 3 },
  weekTitle: { fontSize: 17, fontWeight: "800", color: "#1A1A2E", marginBottom: 20 },
  weekRow: { flexDirection: "row", justifyContent: "space-between" },
  dayItem: { alignItems: "center", gap: 8 },
  dayCircle: { width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center" },
  dayDone: { backgroundColor: "#22C55E", shadowColor: "#22C55E", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 3 },
  dayToday: { backgroundColor: "#FF6B35", shadowColor: "#FF6B35", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.4, shadowRadius: 6, elevation: 4 },
  dayFuture: { backgroundColor: "#F1F5F9" },
  dayLetter: { fontSize: 14, fontWeight: "800", color: "#94A3B8" },
  dayLetterToday: { color: "white" },
  dayName: { fontSize: 10, color: "#94A3B8", fontWeight: "700" },
  dayNameToday: { color: "#FF6B35", fontWeight: "800" },
  // Activities
  activitiesList: { gap: 12, marginBottom: 8 },
  activityItem: { backgroundColor: "white", borderRadius: 20, padding: 16, flexDirection: "row", alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  activityIcon: { backgroundColor: "#FFF3EE", padding: 12, borderRadius: 14, marginRight: 14 },
  activityTitle: { fontSize: 16, fontWeight: "800", color: "#1A1A2E" },
  activityTime: { fontSize: 11, color: "#94A3B8", fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5, marginTop: 2 },
  activityPts: { fontSize: 15, fontWeight: "800", color: "#FF6B35" },
});
