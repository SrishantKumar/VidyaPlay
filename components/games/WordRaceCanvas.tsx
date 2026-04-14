import React, { useEffect } from 'react';
import { useWindowDimensions } from 'react-native';
import {
  Canvas,
  Rect,
  Path,
  Circle,
  RoundedRect,
  useSharedValueEffect,
  useValue,
  Skia,
  Paint,
  Group,
  useFont,
  Text as SkiaText,
} from '@shopify/react-native-skia';
import Animated, {
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  interpolate,
  useDerivedValue,
} from 'react-native-reanimated';
import { CarState } from '@/store/gameStore';

interface WordRaceCanvasProps {
  carState: CarState;
  questionText: string;
  isSignVisible: boolean;
}

export const WordRaceCanvas: React.FC<WordRaceCanvasProps> = ({
  carState,
  questionText,
  isSignVisible,
}) => {
  const { width, height } = useWindowDimensions();
  const canvasHeight = height * 0.45;
  const roadY = canvasHeight * 0.5;
  const carX = 80;
  const carY = roadY - 20;

  // Shared values for animations
  const roadSpeed = useSharedValue(3);
  const roadOffset = useSharedValue(0);
  const carTilt = useSharedValue(0);
  const signX = useSharedValue(width + 100);
  const turboGlowOpacity = useSharedValue(0);

  // Constants
  const DASH_LENGTH = 40;
  const DASH_GAP = 30;
  const TOTAL_DASH_PERIOD = DASH_LENGTH + DASH_GAP;

  // Handle Car States
  useEffect(() => {
    switch (carState) {
      case 'boosting':
        roadSpeed.value = withSequence(
          withTiming(8, { duration: 300, easing: Easing.out(Easing.quad) }),
          withDelay(1200, withTiming(3, { duration: 500 }))
        );
        carTilt.value = withSequence(
          withTiming(5, { duration: 200 }),
          withDelay(1200, withTiming(0, { duration: 400 }))
        );
        turboGlowOpacity.value = 0;
        break;
      case 'slowing':
        roadSpeed.value = withSequence(
          withTiming(1, { duration: 300 }),
          withDelay(1500, withTiming(3, { duration: 500 }))
        );
        carTilt.value = withSequence(
          withTiming(-8, { duration: 300 }),
          withDelay(1500, withTiming(0, { duration: 500 }))
        );
        turboGlowOpacity.value = 0;
        break;
      case 'turbo':
        roadSpeed.value = withTiming(14, { duration: 500 });
        carTilt.value = 8;
        turboGlowOpacity.value = withRepeat(withTiming(0.8, { duration: 400 }), -1, true);
        break;
      default:
        roadSpeed.value = withTiming(3, { duration: 500 });
        carTilt.value = withTiming(0, { duration: 500 });
        turboGlowOpacity.value = 0;
    }
  }, [carState]);

  // Handle Sign visibility
  useEffect(() => {
    if (isSignVisible) {
      signX.value = withTiming(width * 0.65, { duration: 800, easing: Easing.out(Easing.exp) });
    } else {
      signX.value = withTiming(-300, { duration: 600, easing: Easing.in(Easing.exp) });
    }
  }, [isSignVisible]);

  // Game loop for road offset
  useEffect(() => {
    let frameId: number;
    const update = () => {
      roadOffset.value = (roadOffset.value + roadSpeed.value) % TOTAL_DASH_PERIOD;
      frameId = requestAnimationFrame(update);
    };
    frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, []);

  // Center dashed lines path
  const dashPath = useDerivedValue(() => {
    const p = Skia.Path.Make();
    const offset = roadOffset.value;
    for (let x = -TOTAL_DASH_PERIOD; x < width + TOTAL_DASH_PERIOD; x += TOTAL_DASH_PERIOD) {
      p.addRect(Skia.XYWHRect(x + offset, roadY - 2, DASH_LENGTH, 4));
    }
    return p;
  });

  return (
    <Canvas style={{ width, height: canvasHeight, backgroundColor: '#475569' }}>
      {/* Grass Borders */}
      <Rect x={0} y={0} width={width} height={40} color="#15803d" />
      <Rect x={0} y={canvasHeight - 40} width={width} height={40} color="#15803d" />
      
      {/* Center Dashes */}
      <Path path={dashPath} color="rgba(255, 255, 255, 0.4)" strokeWidth={2} style="fill" />

      {/* Turbo Glow */}
      <Group opacity={turboGlowOpacity}>
         <Rect x={carX - 20} y={carY} width={100} height={40} color="#f97316" />
      </Group>

      {/* Question Sign (Slides on post) */}
      <Group transform={useDerivedValue(() => [{ translateX: signX.value }])}>
        {/* Sign Post */}
        <Rect x={45} y={80} width={10} height={60} color="#78350f" />
        {/* Sign Board */}
        <RoundedRect x={0} y={20} width={100} height={60} r={8} color="#facc15">
           <Paint style="stroke" strokeWidth={3} color="#451a03" />
        </RoundedRect>
        {/* Sign Content (Simplified) - Placeholder for Text */}
        <Circle cx={50} cy={50} r={15} color="#451a03" />
      </Group>

      {/* Car Body with Jump-feel animations */}
      <Group
        transform={useDerivedValue(() => [
          { translateX: carX + 40 },
          { translateY: carY + 20 },
          { rotate: (carTilt.value * Math.PI) / 180 },
          { translateX: -(carX + 40) },
          { translateY: -(carY + 20) },
        ])}
      >
        {/* Main Body */}
        <RoundedRect x={carX} y={carY} width={80} height={40} r={12} color="#dc2626">
          <Paint style="stroke" strokeWidth={2} color="#991b1b" />
        </RoundedRect>
        
        {/* Windshield */}
        <RoundedRect x={carX + 50} y={carY + 5} width={25} height={15} r={4} color="#bae6fd" />
        
        {/* Left Wheels */}
        <Circle cx={carX + 20} cy={carY + 35} r={10} color="#1e293b" />
        <Circle cx={carX + 20} cy={carY + 35} r={4} color="#64748b" />
        
        {/* Right Wheels */}
        <Circle cx={carX + 60} cy={carY + 35} r={10} color="#1e293b" />
        <Circle cx={carX + 60} cy={carY + 35} r={4} color="#64748b" />

        {/* Speed lines when boosting */}
        <Group opacity={useDerivedValue(() => interpolate(roadSpeed.value, [3, 8], [0, 1]))}>
           <Rect x={carX - 40} y={carY + 10} width={30} height={2} color="#fff" />
           <Rect x={carX - 50} y={carY + 20} width={40} height={2} color="#fff" />
           <Rect x={carX - 35} y={carY + 30} width={25} height={2} color="#fff" />
        </Group>
      </Group>
    </Canvas>
  );
};
