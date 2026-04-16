import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { mockChild, achievements } from "@/constants/mockData";
import { Feather as Icons } from "@expo/vector-icons";
import Animated, { FadeInDown, ZoomIn } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

const ACHIEVEMENT_COLORS = ["#FF6B35", "#eab308", "#1B4FE4", "#ef4444"];
const iconMap: Record<string, any> = { award: "award", star: "star", zap: "zap", book: "book" };

export default function ProfileScreen() {
  const router = useRouter();
  const totalPts = mockChild.rewardPoints;
  const nextLevel = 3000;
  const progress = Math.min(totalPts / nextLevel, 1);

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.topBar}>
          <Text style={styles.pageTitle}>My Profile</Text>
          <Pressable onPress={() => router.push("/(auth)/splash")} style={styles.logoutBtn}>
            <Icons name="log-out" size={18} color="#94A3B8" />
          </Pressable>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Avatar */}
        <Animated.View entering={ZoomIn.duration(400)} style={styles.avatarSection}>
          <View style={styles.avatarRing}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{mockChild.name[0]}</Text>
            </View>
          </View>
          <View style={styles.camBtn}>
            <Icons name="camera" size={14} color="#FF6B35" />
          </View>
          <Text style={styles.profileName}>{mockChild.name}</Text>
          <View style={styles.gradePill}>
            <Text style={styles.gradePillText}>{mockChild.grade}  ·  EXPLORER</Text>
          </View>
        </Animated.View>

        {/* Stats */}
        <Animated.View entering={FadeInDown.delay(150).duration(350)} style={styles.statsRow}>
          {[
            { label: "POINTS", val: mockChild.rewardPoints, color: "#FF6B35" },
            { label: "BADGES", val: mockChild.levelBadges.length, color: "#eab308" },
            { label: "STREAK", val: 5, color: "#ef4444" },
          ].map((s, i) => (
            <View key={i} style={styles.statCard}>
              <Text style={[styles.statVal, { color: s.color }]}>{s.val}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Level Progress */}
        <Animated.View entering={FadeInDown.delay(200).duration(350)} style={styles.levelCard}>
          <View style={styles.levelHeader}>
            <Text style={styles.levelTitle}>Explorer  →  Champion</Text>
            <Text style={styles.levelLabel}>{nextLevel - totalPts} pts to go</Text>
          </View>
          <View style={styles.progTrack}>
            <View style={[styles.progFill, { width: `${progress * 100}%` as any }]} />
          </View>
          <Text style={styles.progPct}>{Math.round(progress * 100)}% complete</Text>
        </Animated.View>

        {/* Achievements */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <Icons name="award" size={18} color="#94A3B8" />
        </View>

        <View style={styles.achList}>
          {achievements.map((ach: Achievement, idx: number) => {
            const iconName = iconMap[ach.icon] || "award";
            const color = ach.unlocked ? ACHIEVEMENT_COLORS[idx % ACHIEVEMENT_COLORS.length] : "#CBD5E1";
            const bg = ach.unlocked ? `${ACHIEVEMENT_COLORS[idx % ACHIEVEMENT_COLORS.length]}20` : "#F1F5F9";
            return (
              <Animated.View
                key={ach.id}
                entering={FadeInDown.delay(280 + idx * 70).duration(280)}
                style={[styles.achItem, !ach.unlocked && styles.achLocked]}
              >
                <View style={[styles.achIconBox, { backgroundColor: bg }]}>
                  <Icons name={iconName} size={24} color={color} />
                </View>
                <View style={styles.achContent}>
                  <Text style={[styles.achTitle, !ach.unlocked && styles.achTitleLocked]}>{ach.name}</Text>
                  <Text style={styles.achDesc}>{ach.description}</Text>
                </View>
                {ach.unlocked
                  ? <Icons name="check-circle" size={22} color="#22C55E" />
                  : <Icons name="lock" size={18} color="#CBD5E1" />
                }
              </Animated.View>
            );
          })}
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F8FAFC" },
  safeArea: { backgroundColor: "#F8FAFC", paddingHorizontal: 24 },
  topBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 12 },
  pageTitle: { fontSize: 24, fontWeight: "800", color: "#1A1A2E" },
  logoutBtn: { padding: 8 },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 24 },
  // Avatar
  avatarSection: { alignItems: "center", paddingTop: 24, paddingBottom: 20, position: "relative" },
  avatarRing: { width: 108, height: 108, borderRadius: 54, borderWidth: 3, borderColor: "#FF6B35", padding: 3, shadowColor: "#FF6B35", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 10, elevation: 6 },
  avatarCircle: { flex: 1, borderRadius: 50, backgroundColor: "#FF6B35", alignItems: "center", justifyContent: "center" },
  avatarText: { fontSize: 48, fontWeight: "800", color: "white" },
  camBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: "white", alignItems: "center", justifyContent: "center", position: "absolute", right: "36%", bottom: 20, borderWidth: 2, borderColor: "white", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 6, elevation: 4 },
  profileName: { fontSize: 28, fontWeight: "800", color: "#1A1A2E", marginTop: 14 },
  gradePill: { backgroundColor: "#FFF3EE", paddingHorizontal: 16, paddingVertical: 6, borderRadius: 999, marginTop: 8, borderWidth: 1, borderColor: "rgba(255,107,53,0.35)" },
  gradePillText: { color: "#FF6B35", fontSize: 12, fontWeight: "700", letterSpacing: 1 },
  // Stats
  statsRow: { flexDirection: "row", gap: 12, marginBottom: 20 },
  statCard: { flex: 1, backgroundColor: "white", borderRadius: 20, padding: 16, alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 3 },
  statVal: { fontSize: 26, fontWeight: "900", marginBottom: 4 },
  statLabel: { fontSize: 10, fontWeight: "800", color: "#94A3B8", textTransform: "uppercase", letterSpacing: 1 },
  // Level progress
  levelCard: { backgroundColor: "white", borderRadius: 24, padding: 20, marginBottom: 28, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 3 },
  levelHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  levelTitle: { fontSize: 15, fontWeight: "800", color: "#1A1A2E" },
  levelLabel: { fontSize: 12, color: "#94A3B8", fontWeight: "600" },
  progTrack: { height: 10, backgroundColor: "#F1F5F9", borderRadius: 5, overflow: "hidden", marginBottom: 8 },
  progFill: { height: 10, backgroundColor: "#FF6B35", borderRadius: 5 },
  progPct: { fontSize: 11, color: "#94A3B8", fontWeight: "700" },
  // Achievements
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontWeight: "800", color: "#1A1A2E" },
  achList: { gap: 14, marginBottom: 16 },
  achItem: { backgroundColor: "white", borderRadius: 20, padding: 16, flexDirection: "row", alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 3 },
  achLocked: { opacity: 0.65 },
  achIconBox: { width: 52, height: 52, borderRadius: 14, alignItems: "center", justifyContent: "center", marginRight: 14 },
  achContent: { flex: 1 },
  achTitle: { fontSize: 15, fontWeight: "800", color: "#1A1A2E", marginBottom: 2 },
  achTitleLocked: { color: "#94A3B8" },
  achDesc: { fontSize: 12, color: "#94A3B8", fontWeight: "600" },
});
