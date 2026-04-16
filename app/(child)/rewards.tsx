import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { mockChild, rewards } from "@/constants/mockData";
import { Feather as Icons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";

const CATEGORIES = ["All", "Badges", "Lives", "Themes", "Boosts"];
const REWARD_META = [
  { icon: "award" as const,   color: "#7C3AED", bg: "#EDE9FE" },
  { icon: "heart" as const,   color: "#ef4444", bg: "#FEE2E2" },
  { icon: "palette" as const, color: "#1B4FE4", bg: "#DBEAFE" },
  { icon: "zap" as const,     color: "#f97316", bg: "#FFEDD5" },
];

export default function RewardsScreen() {
  const [activeTab, setActiveTab] = useState("All");
  const myPoints = mockChild.rewardPoints;

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <Text style={styles.pageTitle}>Prize Shop</Text>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Points Card */}
        <Animated.View entering={FadeInDown.duration(300)} style={styles.pointsCard}>
          <View style={styles.pointsLeft}>
            <Text style={styles.pointsEyebrow}>MY POINTS</Text>
            <Text style={styles.pointsNum}>{myPoints.toLocaleString()}</Text>
            <Text style={styles.pointsSub}>{(3000 - myPoints)} pts to next level</Text>
            <View style={styles.pointsBarTrack}>
              <View style={[styles.pointsBarFill, { width: `${(myPoints / 3000) * 100}%` as any }]} />
            </View>
            <Text style={styles.pointsBarLabel}>Explorer  →  Champion</Text>
          </View>
          <View style={styles.pointsIconBox}>
            <Icons name="star" size={48} color="rgba(255,255,255,0.85)" />
          </View>
        </Animated.View>

        {/* Category Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContainer}
        >
          {CATEGORIES.map((cat) => (
            <Pressable
              key={cat}
              onPress={() => setActiveTab(cat)}
              style={[styles.tab, activeTab === cat && styles.tabActive]}
            >
              <Text style={[styles.tabText, activeTab === cat && styles.tabTextActive]}>{cat}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Rewards */}
        <Text style={styles.listTitle}>Available Prizes</Text>
        <View style={styles.rewardsList}>
          {rewards.map((reward, i) => {
            const meta = REWARD_META[i % REWARD_META.length];
            const canAfford = myPoints >= reward.cost;
            return (
              <Animated.View
                key={reward.id}
                entering={FadeInDown.delay(120 + i * 60).duration(280)}
                style={styles.rewardCard}
              >
                <View style={[styles.rewardIconBox, { backgroundColor: meta.bg }]}>
                  <Icons name={meta.icon} size={28} color={meta.color} />
                </View>
                <View style={styles.rewardContent}>
                  <Text style={styles.rewardName}>{reward.name}</Text>
                  <View style={styles.costRow}>
                    <Icons name="star" size={12} color="#f97316" />
                    <Text style={styles.rewardCost}>{reward.cost} pts</Text>
                  </View>
                  <Text style={canAfford ? styles.affordable : styles.notAffordable}>
                    {canAfford ? "You can unlock this" : `Need ${reward.cost - myPoints} more pts`}
                  </Text>
                </View>
                <Pressable
                  style={[styles.unlockBtn, canAfford ? styles.unlockActive : styles.unlockDisabled]}
                >
                  <Text style={[styles.unlockText, !canAfford && styles.unlockTextDisabled]}>
                    {canAfford ? "UNLOCK" : `${reward.cost}`}
                  </Text>
                </Pressable>
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
  safeArea: { backgroundColor: "#F8FAFC", paddingHorizontal: 24, paddingBottom: 8 },
  pageTitle: { fontSize: 26, fontWeight: "800", color: "#1A1A2E", paddingTop: 12 },
  scrollContent: { paddingHorizontal: 24, paddingTop: 16 },
  // Points Card
  pointsCard: { backgroundColor: "#FF6B35", borderRadius: 28, padding: 24, flexDirection: "row", alignItems: "center", marginBottom: 24, shadowColor: "#FF6B35", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 16, elevation: 8 },
  pointsLeft: { flex: 1 },
  pointsEyebrow: { color: "rgba(255,255,255,0.8)", fontSize: 10, fontWeight: "800", textTransform: "uppercase", letterSpacing: 3, marginBottom: 4 },
  pointsNum: { color: "white", fontSize: 52, fontWeight: "900", letterSpacing: -1 },
  pointsSub: { color: "rgba(255,255,255,0.8)", fontSize: 12, marginTop: 4, marginBottom: 10 },
  pointsBarTrack: { height: 6, backgroundColor: "rgba(255,255,255,0.3)", borderRadius: 3, overflow: "hidden", marginBottom: 6 },
  pointsBarFill: { height: 6, backgroundColor: "white", borderRadius: 3 },
  pointsBarLabel: { color: "rgba(255,255,255,0.7)", fontSize: 11, fontWeight: "700" },
  pointsIconBox: { paddingLeft: 16 },
  // Tabs
  tabsContainer: { gap: 10, paddingVertical: 12, paddingHorizontal: 2 },
  tab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999, backgroundColor: "white", borderWidth: 1, borderColor: "#E2E8F0" },
  tabActive: { backgroundColor: "#FF6B35", borderColor: "#FF6B35" },
  tabText: { fontSize: 13, fontWeight: "700", color: "#64748B" },
  tabTextActive: { color: "white" },
  // Rewards
  listTitle: { fontSize: 20, fontWeight: "800", color: "#1A1A2E", marginTop: 8, marginBottom: 16 },
  rewardsList: { gap: 14 },
  rewardCard: { backgroundColor: "white", borderRadius: 22, padding: 18, flexDirection: "row", alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 3 },
  rewardIconBox: { width: 58, height: 58, borderRadius: 16, alignItems: "center", justifyContent: "center", marginRight: 14 },
  rewardContent: { flex: 1 },
  rewardName: { fontSize: 15, fontWeight: "800", color: "#1A1A2E", marginBottom: 4 },
  costRow: { flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 3 },
  rewardCost: { fontSize: 14, fontWeight: "800", color: "#f97316" },
  affordable: { fontSize: 11, color: "#22C55E", fontWeight: "700" },
  notAffordable: { fontSize: 11, color: "#94A3B8", fontWeight: "600" },
  unlockBtn: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 999 },
  unlockActive: { backgroundColor: "#FF6B35", shadowColor: "#FF6B35", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  unlockDisabled: { backgroundColor: "#E2E8F0" },
  unlockText: { color: "white", fontSize: 11, fontWeight: "800", letterSpacing: 1 },
  unlockTextDisabled: { color: "#94A3B8" },
});
