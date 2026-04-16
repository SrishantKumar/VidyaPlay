import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, useWindowDimensions, Platform } from 'react-native';
import {
  Canvas,
  Skia,
  Rect,
  Group,
} from '@shopify/react-native-skia';
import {
  useFrameCallback,
  useAnimatedReaction,
  useSharedValue,
  runOnJS,
  useDerivedValue,
} from 'react-native-reanimated';
import { Road, Car, Exhaust, SpeedLines } from './wordRace/SkiaComponents';
import { useRacePhysics } from './wordRace/RacePhysics';
import { ParticleSystem } from './wordRace/ParticleSystem';
import { WORD_RACE_CONFIG } from '@/constants/wordRaceConfig';
import type { CarState } from '@/store/gameStore';

const { LANES, COLORS, CANVAS_HEIGHT_RATIO } = WORD_RACE_CONFIG;

export interface WordRaceCanvasProps {
  carState?: CarState;
  onRankingChange?: (rank: number) => void;
}

export const WordRaceCanvas: React.FC<WordRaceCanvasProps> = ({
  carState = 'normal',
  onRankingChange,
}) => {
  const { width: CANVAS_W, height: windowH } = useWindowDimensions();
  const CANVAS_H = windowH * CANVAS_HEIGHT_RATIO;
  const [skiaReady, setSkiaReady] = useState(Platform.OS !== 'web');

  useEffect(() => {
    if (Platform.OS === 'web') {
      const check = () => {
        try { if (Skia?.Path?.Make()) { setSkiaReady(true); return; } } catch {}
        setTimeout(check, 100);
      };
      check();
    }
  }, []);

  const physics = useRacePhysics();

  // Particles live on JS thread
  const playerFx = useRef(new ParticleSystem());
  const rival0Fx = useRef(new ParticleSystem());
  const rival1Fx = useRef(new ParticleSystem());
  const [playerPfx, setPlayerPfx] = useState<any[]>([]);
  const [rival0Pfx, setRival0Pfx] = useState<any[]>([]);
  const [rival1Pfx, setRival1Pfx] = useState<any[]>([]);

  // Watch carState and trigger physics effects
  const prevState = useRef<CarState>('normal');
  useEffect(() => {
    if (carState === prevState.current) return;
    prevState.current = carState;
    if (carState === 'boosting')  physics.triggerBoost(false);
    else if (carState === 'turbo')  physics.triggerBoost(true);
    else if (carState === 'slowing') physics.triggerSlowdown();
  }, [carState]);

  // Sync ranking to parent
  useAnimatedReaction(
    () => physics.ranking.value,
    (cur, prev) => {
      if (cur !== prev && onRankingChange) runOnJS(onRankingChange)(cur);
    }
  );

  // JS-side refs to receive car positions from UI thread
  const playerXJS  = useRef(physics.playerX.value);
  const rival0XJS  = useRef(physics.rival0X.value);
  const rival1XJS  = useRef(physics.rival1X.value);
  const carStateRef = useRef(carState);
  carStateRef.current = carState;

  // JS callback for particle update
  const updateParticles = useCallback((px: number, r0: number, r1: number) => {
    playerXJS.current  = px;
    rival0XJS.current  = r0;
    rival1XJS.current  = r1;

    const boosting = carStateRef.current === 'boosting' || carStateRef.current === 'turbo';
    playerFx.current.emit(px,  LANES.MIDDLE, 10, boosting);
    rival0Fx.current.emit(r0,  LANES.TOP,    10, false);
    rival1Fx.current.emit(r1,  LANES.BOTTOM, 10, false);
    playerFx.current.update();
    rival0Fx.current.update();
    rival1Fx.current.update();
    setPlayerPfx([...playerFx.current.getParticles()]);
    setRival0Pfx([...rival0Fx.current.getParticles()]);
    setRival1Pfx([...rival1Fx.current.getParticles()]);
  }, []);

  // Shared counter for frame throttling (safe in worklets)
  const frameCount = useSharedValue(0);

  // Main game loop
  useFrameCallback(() => {
    physics.tickFrame();
    frameCount.value = (frameCount.value + 1) % 300;
    if (frameCount.value % 3 === 0) {
      runOnJS(updateParticles)(
        physics.playerX.value,
        physics.rival0X.value,
        physics.rival1X.value
      );
    }
  });

  const playerIsBoosting = carState === 'boosting' || carState === 'turbo';
  const speedOpacity = carState === 'turbo' ? 0.8 : carState === 'boosting' ? 0.4 : 0;

  // Camera viewport matrix
  const viewportMatrix = useDerivedValue(() => {
    'worklet';
    const mat = Skia.Matrix();
    const sx = (Math.random() - 0.5) * physics.shake.value * 2;
    const sy = (Math.random() - 0.5) * physics.shake.value * 0.8;
    mat.translate(-physics.cameraX.value + sx, sy);
    return mat;
  });

  // Flash colour
  const flashColor = useDerivedValue(() => {
    'worklet';
    return physics.flashIsSuccess.value === 1
      ? COLORS.SUCCESS_FLASH
      : COLORS.DANGER_FLASH;
  });

  if (!skiaReady) {
    return <View style={{ width: CANVAS_W, height: CANVAS_H, backgroundColor: COLORS.SKY }} />;
  }

  return (
    <View style={{ height: CANVAS_H, overflow: 'hidden' }}>
      <Canvas style={{ width: CANVAS_W, height: CANVAS_H }}>
        {/* Sky */}
        <Rect x={0} y={0} width={CANVAS_W} height={CANVAS_H} color={COLORS.SKY} />

        {/* World group — moves with camera */}
        <Group matrix={viewportMatrix}>
          <Road width={CANVAS_W * 20} height={CANVAS_H} scrollOffset={physics.cameraX} />
          <Exhaust particles={rival0Pfx} />
          <Exhaust particles={rival1Pfx} />
          <Exhaust particles={playerPfx} />
          <Car x={physics.rival0X} laneCenterY={LANES.TOP}    color={COLORS.RIVAL_1_CAR} isBoosting={false} />
          <Car x={physics.rival1X} laneCenterY={LANES.BOTTOM} color={COLORS.RIVAL_2_CAR} isBoosting={false} />
          <Car x={physics.playerX} laneCenterY={LANES.MIDDLE} color={COLORS.PLAYER_CAR}  isBoosting={playerIsBoosting} isTurbo={carState === 'turbo'} />
        </Group>

        {/* Speed lines (fixed on screen) */}
        <SpeedLines canvasWidth={CANVAS_W} canvasHeight={CANVAS_H} opacity={speedOpacity} />

        {/* Flash overlay */}
        <Rect x={0} y={0} width={CANVAS_W} height={CANVAS_H} color={flashColor} opacity={physics.flash} />
      </Canvas>
    </View>
  );
};

export default WordRaceCanvas;
