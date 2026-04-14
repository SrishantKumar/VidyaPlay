import React, { useEffect, useState } from 'react';
import { View, Text, Platform, useWindowDimensions } from "react-native";
import {
  Canvas,
  Rect,
  Path,
  Group,
  RoundedRect,
  Paint,
  Circle,
  Skia,
} from '@shopify/react-native-skia';
import {
  useSharedValue,
  withTiming,
  withRepeat,
  Easing,
  useDerivedValue,
  interpolate,
  withSequence,
} from 'react-native-reanimated';
import { useGameStore } from '@/store/gameStore';

export const WordRaceCanvas = () => {
  const { width } = useWindowDimensions();
  const canvasHeight = 180;
  const roadY = canvasHeight / 2;
  const carX = 40;
  const carY = roadY - 20;

  const { carState } = useGameStore();

  const roadSpeed = useSharedValue(12);
  const roadOffset = useSharedValue(0);
  const carTilt = useSharedValue(0);
  const signX = useSharedValue(width + 100);
  const turboGlowOpacity = useSharedValue(0);

  // Robust initialization check for Web
  const [isSkiaInitialized, setIsSkiaInitialized] = useState(Platform.OS !== 'web');

  useEffect(() => {
    if (Platform.OS === 'web') {
      let timeout: NodeJS.Timeout;
      const checkSkia = () => {
        // We check for Skia.Path.Make because it exists once the internal JSI bridge is ready
        try {
          if (Skia && Skia.Path && Skia.Path.Make()) {
            setIsSkiaInitialized(true);
          } else {
            timeout = setTimeout(checkSkia, 100);
          }
        } catch (e) {
          timeout = setTimeout(checkSkia, 100);
        }
      };
      checkSkia();
      return () => clearTimeout(timeout);
    }
  }, []);

  // Parallax / Movement Logic
  useEffect(() => {
    if (carState === 'boosting') {
        roadSpeed.value = withTiming(30, { duration: 500 });
        carTilt.value = withSequence(withTiming(-5, { duration: 100 }), withTiming(0, { duration: 400 }));
    } else if (carState === 'slowing') {
        roadSpeed.value = withTiming(4, { duration: 800 });
        carTilt.value = withSequence(withTiming(5, { duration: 200 }), withTiming(0, { duration: 600 }));
    } else if (carState === 'turbo') {
        roadSpeed.value = withTiming(45, { duration: 1000 });
        turboGlowOpacity.value = withRepeat(withTiming(0.4, { duration: 500 }), -1, true);
    } else {
        roadSpeed.value = withTiming(12, { duration: 1000 });
        turboGlowOpacity.value = withTiming(0);
    }
  }, [carState]);

  // Constant road movement
  useEffect(() => {
    let frameId: number;
    let lastTime = Date.now();
    const update = () => {
      const now = Date.now();
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      roadOffset.value = (roadOffset.value - roadSpeed.value * 20 * dt) % 60;
      frameId = requestAnimationFrame(update);
    };
    frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    signX.value = withRepeat(withTiming(-150, { duration: 3000, easing: Easing.linear }), -1, false);
  }, []);

  const DASH_LENGTH = 30;
  const DASH_GAP = 30;
  const TOTAL_DASH_PERIOD = DASH_LENGTH + DASH_GAP;

  // Defensive path calculation
  const dashPath = useDerivedValue(() => {
    // Only attempt path generation if Skia is confirmed ready via state
    if (!isSkiaInitialized) return null;
    try {
      const p = Skia.Path.Make();
      const offset = roadOffset.value;
      for (let x = -TOTAL_DASH_PERIOD; x < width + TOTAL_DASH_PERIOD; x += TOTAL_DASH_PERIOD) {
        p.addRect(Skia.XYWHRect(x + offset, roadY - 2, DASH_LENGTH, 4));
      }
      return p;
    } catch (e) {
      return null;
    }
  }, [isSkiaInitialized]); // Added dependency to force recalculation once initialized

  // Top level guard for web initialization
  if (!isSkiaInitialized) {
    return <View style={{ width, height: canvasHeight, backgroundColor: '#475569' }} />;
  }

  return (
    <Canvas style={{ width, height: canvasHeight, backgroundColor: '#475569' }}>
      {/* Grass Borders */}
      <Rect x={0} y={0} width={width} height={40} color="#15803d" />
      <Rect x={0} y={canvasHeight - 40} width={width} height={40} color="#15803d" />
      
      {/* Center Dashes */}
      {dashPath.value && <Path path={dashPath as any} color="rgba(255, 255, 255, 0.4)" strokeWidth={2} style="fill" />}

      {/* Turbo Glow */}
      <Group opacity={turboGlowOpacity}>
         <Rect x={carX - 20} y={carY} width={100} height={40} color="#f97316" />
      </Group>

      {/* Question Sign */}
      <Group transform={useDerivedValue(() => [{ translateX: signX.value }])}>
        <Rect x={45} y={80} width={10} height={60} color="#78350f" />
        <RoundedRect x={0} y={20} width={100} height={60} r={8} color="#facc15">
           <Paint style="stroke" strokeWidth={3} color="#451a03" />
        </RoundedRect>
        <Circle cx={50} cy={50} r={15} color="#451a03" />
      </Group>

      {/* Car Body */}
      <Group
        transform={useDerivedValue(() => [
          { translateX: carX + 40 },
          { translateY: carY + 20 },
          { rotate: (carTilt.value * Math.PI) / 180 },
          { translateX: -(carX + 40) },
          { translateY: -(carY + 20) },
        ])}
      >
        <RoundedRect x={carX} y={carY} width={80} height={40} r={12} color="#dc2626">
          <Paint style="stroke" strokeWidth={2} color="#991b1b" />
        </RoundedRect>
        <RoundedRect x={carX + 50} y={carY + 5} width={25} height={15} r={4} color="#bae6fd" />
        <Circle cx={carX + 20} cy={carY + 35} r={10} color="#1e293b" />
        <Circle cx={carX + 20} cy={carY + 35} r={4} color="#64748b" />
        <Circle cx={carX + 60} cy={carY + 35} r={10} color="#1e293b" />
        <Circle cx={carX + 60} cy={carY + 35} r={4} color="#64748b" />

        <Group opacity={useDerivedValue(() => interpolate(roadSpeed.value, [12, 45], [0, 1]))}>
           <Rect x={carX - 40} y={carY + 10} width={30} height={2} color="#fff" />
           <Rect x={carX - 50} y={carY + 20} width={40} height={2} color="#fff" />
           <Rect x={carX - 35} y={carY + 30} width={25} height={2} color="#fff" />
        </Group>
      </Group>
    </Canvas>
  );
};
