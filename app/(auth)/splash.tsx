import React, { useEffect } from "react";
import { View, Text, SafeAreaView, Platform, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Feather as Icons } from "@expo/vector-icons";
import Animated, {
  FadeInDown,
  FadeInUp,
  ZoomIn,
  withRepeat,
  withSequence,
  withTiming,
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

const STARS = [
  { x: 30, y: 60, size: 10 }, { x: 310, y: 80, size: 7 },
  { x: 18, y: 240, size: 14 }, { x: 340, y: 210, size: 8 },
  { x: 75, y: 420, size: 6 }, { x: 295, y: 380, size: 12 },
];

function PulsingStar({ x, y, size }: { x: number; y: number; size: number }) {
  const scale = useSharedValue(1);
  useEffect(() => {
    scale.value = withRepeat(
      withSequence(withTiming(1.3, { duration: 1800 }), withTiming(1, { duration: 1800 })),
      -1
    );
  }, []);
  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    position: "absolute", left: x, top: y,
  }));
  return <Animated.View style={style}><Text style={{ fontSize: size, color: "rgba(255,200,50,0.4)" }}>+</Text></Animated.View>;
}

export default function SplashScreen() {
  const router = useRouter();

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.webContainer}>
          {STARS.map((s, i) => <PulsingStar key={i} x={s.x} y={s.y} size={s.size} />)}

          <View style={styles.content}>
            {/* Logo */}
            <Animated.View entering={ZoomIn.duration(400)} style={styles.logoArea}>
              <View style={styles.logoBox}>
                <Icons name="book-open" size={64} color="#FF6B35" />
              </View>
            </Animated.View>

            {/* App Name */}
            <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.nameRow}>
              <Text style={styles.nameOrange}>Vidya</Text>
              <Text style={styles.nameYellow}>Play</Text>
            </Animated.View>
            <View style={styles.nameLine} />

            {/* Tagline */}
            <Animated.View entering={FadeInDown.delay(350).duration(350)} style={styles.taglinePill}>
              <Text style={styles.taglineText}>Khelo  ·  Seekho  ·  Badho</Text>
            </Animated.View>

            {/* Headline */}
            <Animated.View entering={FadeInDown.delay(500).duration(350)} style={styles.headline}>
              <Text style={styles.headlineGray}>Ready for an</Text>
              <Text style={styles.headlineOrange}>Adventure?</Text>
            </Animated.View>

            {/* Buttons */}
            <Animated.View entering={FadeInUp.delay(700).duration(350)} style={styles.buttons}>
              <Pressable
                onPress={() => router.push("/(child)/home")}
                style={({ pressed }) => [styles.primaryBtn, pressed && styles.pressed]}
              >
                <Icons name="play" size={18} color="white" />
                <Text style={styles.primaryBtnText}>Let's Go</Text>
              </Pressable>
              <Pressable
                onPress={() => {}}
                style={({ pressed }) => [styles.secondaryBtn, pressed && styles.pressedOutline]}
              >
                <Icons name="lock" size={15} color="#FF6B35" />
                <Text style={styles.secondaryBtnText}>Parent Dashboard</Text>
              </Pressable>
            </Animated.View>

            {/* Footer */}
            <Animated.View entering={FadeInUp.delay(900)}>
              <Text style={styles.footer}>Made with care for India</Text>
            </Animated.View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFF8F0" },
  safe: { flex: 1 },
  webContainer: { flex: 1, width: "100%", maxWidth: Platform.OS === "web" ? 480 : undefined, alignSelf: "center", backgroundColor: "#FFF8F0", overflow: "hidden" },
  content: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32, paddingBottom: 32, gap: 20, zIndex: 1 },
  logoArea: { alignItems: "center" },
  logoBox: { width: 120, height: 120, borderRadius: 32, backgroundColor: "white", alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.12, shadowRadius: 20, elevation: 12 },
  nameRow: { flexDirection: "row" },
  nameOrange: { fontSize: 44, fontWeight: "800", color: "#FF6B35", letterSpacing: -1 },
  nameYellow: { fontSize: 44, fontWeight: "800", color: "#FFD23F", letterSpacing: -1 },
  nameLine: { width: 48, height: 2, backgroundColor: "#FF6B35", opacity: 0.3, borderRadius: 99 },
  taglinePill: { backgroundColor: "white", borderRadius: 999, paddingHorizontal: 20, paddingVertical: 8, borderWidth: 1.5, borderColor: "rgba(255,107,53,0.25)" },
  taglineText: { color: "#FF6B35", fontSize: 12, fontWeight: "700", letterSpacing: 2 },
  headline: { alignItems: "center", gap: 4 },
  headlineGray: { fontSize: 26, fontWeight: "700", color: "#1A1A2E", textAlign: "center" },
  headlineOrange: { fontSize: 26, fontWeight: "800", color: "#FF6B35", textAlign: "center" },
  buttons: { width: "100%", gap: 14 },
  primaryBtn: { backgroundColor: "#FF6B35", borderRadius: 20, height: 60, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 10, shadowColor: "#FF6B35", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 16, elevation: 8 },
  pressed: { transform: [{ scale: 0.96 }] },
  primaryBtnText: { color: "white", fontSize: 18, fontWeight: "800" },
  secondaryBtn: { borderRadius: 20, height: 52, alignItems: "center", justifyContent: "center", borderWidth: 1.5, borderColor: "#FF6B35", flexDirection: "row", gap: 8 },
  pressedOutline: { backgroundColor: "rgba(255,107,53,0.05)" },
  secondaryBtnText: { color: "#FF6B35", fontSize: 15, fontWeight: "700" },
  footer: { fontSize: 11, color: "#94A3B8", textAlign: "center" },
});
