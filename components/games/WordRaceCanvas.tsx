import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, StyleSheet, useWindowDimensions, Platform } from 'react-native';
import {
  Canvas,
  Skia,
} from '@shopify/react-native-skia';
import { Road, Car, Exhaust, SpeedLines } from './wordRace/SkiaComponents';
import { useRacePhysics } from './wordRace/RacePhysics';
import { ParticleSystem } from './wordRace/ParticleSystem';
import { WORD_RACE_CONFIG } from '@/constants/wordRaceConfig';
import type { CarState } from '@/store/gameStore';

const { LANES, COLORS, PLAYER_X, CANVAS_HEIGHT_RATIO } = WORD_RACE_CONFIG;

export interface WordRaceCanvasProps {
  carState?: CarState;
  questionText?: string;
  isSignVisible?: boolean;
}

export const WordRaceCanvas: React.FC<WordRaceCanvasProps> = ({
  carState = 'normal',
}) => {
  const { width: CANVAS_W, height: windowH } = useWindowDimensions();
  const CANVAS_H = windowH * CANVAS_HEIGHT_RATIO;
  const [skiaReady, setSkiaReady] = useState(Platform.OS !== 'web');
  
  useEffect(() => {
    if (Platform.OS === 'web') {
      const checkSkia = () => {
        try {
          if (Skia?.Path?.Make()) { setSkiaReady(true); return; }
        } catch { /* retry */ }
        setTimeout(checkSkia, 100);
      };
      checkSkia();
    }
  }, []);

  const physics = useRacePhysics();
  const [roadScroll, setRoadScroll] = useState(0);
  const playerFx = useRef(new ParticleSystem());
  const rival0Fx = useRef(new ParticleSystem());
  const rival1Fx = useRef(new ParticleSystem());
  const [playerPfx, setPlayerPfx] = useState<any[]>([]);
  const [rival0Pfx, setRival0Pfx] = useState<any[]>([]);
  const [rival1Pfx, setRival1Pfx] = useState<any[]>([]);
  const [rival0Pos, setRival0Pos] = useState(PLAYER_X + WORD_RACE_CONFIG.RIVAL_START_OFFSET);
  const [rival1Pos, setRival1Pos] = useState(PLAYER_X + WORD_RACE_CONFIG.RIVAL_START_OFFSET + 40);

  const prevCarState = useRef<CarState>('normal');
  useEffect(() => {
    if (carState === prevCarState.current) return;
    prevCarState.current = carState;
    if (carState === 'boosting') physics.onCorrectAnswer(false);
    else if (carState === 'turbo') physics.onCorrectAnswer(true);
    else if (carState === 'slowing') physics.onWrongAnswer();
  }, [carState]);

  const rafRef = useRef<number | null>(null);
  const frameCountRef = useRef(0);

  const tick = useCallback(() => {
    frameCountRef.current += 1;
    const speed = carState === 'turbo' ? 14 : carState === 'boosting' ? 10 : 6;
    setRoadScroll(prev => prev + speed);
    physics.applyDrift();
    if (frameCountRef.current % 2 === 0) {
      const isBoosting = carState === 'boosting' || carState === 'turbo';
      playerFx.current.emit(PLAYER_X, LANES.MIDDLE - 5, 10, isBoosting);
      rival0Fx.current.emit(physics.rival0X.value, LANES.TOP - 5, 10, false);
      rival1Fx.current.emit(physics.rival1X.value, LANES.BOTTOM - 5, 10, false);
      playerFx.current.update();
      rival0Fx.current.update();
      rival1Fx.current.update();
      setPlayerPfx([...playerFx.current.getParticles()]);
      setRival0Pfx([...rival0Fx.current.getParticles()]);
      setRival1Pfx([...rival1Fx.current.getParticles()]);
    }
    setRival0Pos(physics.rival0X.value);
    setRival1Pos(physics.rival1X.value);
    rafRef.current = requestAnimationFrame(tick);
  }, [carState]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [tick]);

  const speedOpacity = carState === 'turbo' ? 0.8 : carState === 'boosting' ? 0.4 : 0;
  const playerIsBoosting = carState === 'boosting' || carState === 'turbo';

  if (!skiaReady) {
    return <View style={{ width: CANVAS_W, height: CANVAS_H, backgroundColor: COLORS.SKY }} />;
  }

  return (
    <View style={{ height: CANVAS_H, overflow: 'hidden' }}>
      <Canvas style={{ width: CANVAS_W, height: CANVAS_H }}>
        <Road width={CANVAS_W} height={CANVAS_H} scrollOffset={roadScroll} />
        <SpeedLines canvasWidth={CANVAS_W} canvasHeight={CANVAS_H} opacity={speedOpacity} />
        <Exhaust particles={rival0Pfx} />
        <Exhaust particles={rival1Pfx} />
        <Exhaust particles={playerPfx} />
        <Car x={rival0Pos} laneCenterY={LANES.TOP} color={COLORS.RIVAL_1_CAR} isBoosting={false} />
        <Car x={rival1Pos} laneCenterY={LANES.BOTTOM} color={COLORS.RIVAL_2_CAR} isBoosting={false} />
        <Car x={PLAYER_X} laneCenterY={LANES.MIDDLE} color={COLORS.PLAYER_CAR} isBoosting={playerIsBoosting} isTurbo={carState === 'turbo'} />
      </Canvas>
    </View>
  );
};

export default WordRaceCanvas;
