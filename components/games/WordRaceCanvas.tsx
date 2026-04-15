import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, StyleSheet, useWindowDimensions, Platform } from 'react-native';
import {
  Canvas,
  Skia,
} from '@shopify/react-native-skia';
import { useSharedValue, useFrameCallback, useAnimatedReaction, runOnJS } from 'react-native-reanimated';
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
  onRankingChange?: (rank: number) => void;
}

export const WordRaceCanvas: React.FC<WordRaceCanvasProps> = ({
  carState = 'normal',
  onRankingChange,
}) => {
  const { width: CANVAS_W, height: windowH } = useWindowDimensions();
  const CANVAS_H = windowH * CANVAS_HEIGHT_RATIO;
  const [skiaReady, setSkiaReady] = useState(Platform.OS !== 'web');
  
  // ... (keep useEffect for Skia ready)
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
  const roadScroll = useSharedValue(0);
  
  const playerFx = useRef(new ParticleSystem());
  const rival0Fx = useRef(new ParticleSystem());
  const rival1Fx = useRef(new ParticleSystem());
  
  const [playerPfx, setPlayerPfx] = useState<any[]>([]);
  const [rival0Pfx, setRival0Pfx] = useState<any[]>([]);
  const [rival1Pfx, setRival1Pfx] = useState<any[]>([]);

  // Sync ranking to parent
  useAnimatedReaction(
    () => physics.ranking.value,
    (current, prev) => {
      if (current !== prev && onRankingChange) {
        runOnJS(onRankingChange)(current);
      }
    }
  );

  // Use refs for values needed in frame callback
  const carStateRef = useRef<CarState>(carState);
  useEffect(() => { carStateRef.current = carState; }, [carState]);

  const prevCarState = useRef<CarState>('normal');
  useEffect(() => {
    if (carState === prevCarState.current) return;
    prevCarState.current = carState;
    if (carState === 'boosting') physics.onCorrectAnswer(false);
    else if (carState === 'turbo') physics.onCorrectAnswer(true);
    else if (carState === 'slowing') physics.onWrongAnswer();
  }, [carState]);

  const updateGameLogic = useCallback((timestamp: number) => {
    const currentCarState = carStateRef.current;
    const isBoosting = currentCarState === 'boosting' || currentCarState === 'turbo';
    
    // Apply drift
    physics.applyDrift();

    // Emit and update particles
    if (Math.floor(timestamp / 16) % 2 === 0) {
      playerFx.current.emit(physics.playerX.value, LANES.MIDDLE, 10, isBoosting);
      rival0Fx.current.emit(physics.rival0X.value, LANES.TOP, 10, false);
      rival1Fx.current.emit(physics.rival1X.value, LANES.BOTTOM, 10, false);
      
      playerFx.current.update();
      rival0Fx.current.update();
      rival1Fx.current.update();
      
      setPlayerPfx([...playerFx.current.getParticles()]);
      setRival0Pfx([...rival0Fx.current.getParticles()]);
      setRival1Pfx([...rival1Fx.current.getParticles()]);
    }
  }, [physics]);

  useFrameCallback((frameInfo) => {
    if (!frameInfo.timeSinceFirstFrame) return;
    
    const currentCarState = carStateRef.current;
    const speed = currentCarState === 'turbo' ? 22 : currentCarState === 'boosting' ? 14 : 7;
    
    // Update road scroll
    roadScroll.value = roadScroll.value + speed;
    
    // Update logic on JS
    runOnJS(updateGameLogic)(frameInfo.timestamp);
  });

  const playerIsBoosting = carState === 'boosting' || carState === 'turbo';
  const speedOpacity = carState === 'turbo' ? 0.9 : carState === 'boosting' ? 0.5 : 0;

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
        
        <Car x={physics.rival0X} laneCenterY={LANES.TOP} color={COLORS.RIVAL_1_CAR} isBoosting={false} />
        <Car x={physics.rival1X} laneCenterY={LANES.BOTTOM} color={COLORS.RIVAL_2_CAR} isBoosting={false} />
        <Car x={physics.playerX} laneCenterY={LANES.MIDDLE} color={COLORS.PLAYER_CAR} isBoosting={playerIsBoosting} isTurbo={carState === 'turbo'} />
      </Canvas>
    </View>
  );
};


export default WordRaceCanvas;

