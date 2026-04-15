import React, { useMemo } from 'react';
import { useSharedValue, withSpring, SharedValue } from 'react-native-reanimated';
import { WORD_RACE_CONFIG } from '@/constants/wordRaceConfig';

const { PHYSICS } = WORD_RACE_CONFIG;

const springCfg = {
  stiffness: PHYSICS.SPRING_STIFFNESS,
  damping: PHYSICS.SPRING_DAMPING,
};

export function useRacePhysics() {
  const { PLAYER_X } = WORD_RACE_CONFIG;

  const playerX = useSharedValue<number>(PLAYER_X);
  const rival0X = useSharedValue<number>(PLAYER_X + 110);
  const rival1X = useSharedValue<number>(PLAYER_X + 210);
  
  const playerIsBoosting = useSharedValue(false);
  const ranking = useSharedValue(3); 

  const calculateRanking = () => {
    'worklet';
    let pos = 1;
    if (rival0X.value > playerX.value) pos++;
    if (rival1X.value > playerX.value) pos++;
    ranking.value = pos;
  };

  const onCorrectAnswer = (isTurbo: boolean) => {
    'worklet';
    // Massive boost to feel powerful
    const boost = isTurbo ? 220 : 160;
    playerIsBoosting.value = true;

    playerX.value = withSpring(
      Math.min(playerX.value + boost, 360), 
      springCfg,
      (finished) => { 
        if (finished) playerIsBoosting.value = false; 
      }
    );

    // Rivals FALL BACK significantly when you get it right
    rival0X.value = withSpring(rival0X.value - 70, springCfg);
    rival1X.value = withSpring(rival1X.value - 70, springCfg);
    
    calculateRanking();
  };

  const onWrongAnswer = () => {
    'worklet';
    playerX.value = withSpring(Math.max(playerX.value - 120, 20), springCfg);
    rival0X.value = withSpring(rival0X.value + 80, springCfg);
    rival1X.value = withSpring(rival1X.value + 80, springCfg);
    calculateRanking();
  };

  const applyDrift = () => {
    'worklet';
    // Very slow rival drift
    rival0X.value += 0.12;
    rival1X.value += 0.10;
    
    // Minimal player drag
    if (!playerIsBoosting.value) {
      playerX.value -= 0.05;
    }
    calculateRanking();
  };

  const reset = () => {
    'worklet';
    playerX.value = PLAYER_X;
    rival0X.value = PLAYER_X + 110;
    rival1X.value = PLAYER_X + 210;
    playerIsBoosting.value = false;
    ranking.value = 3;
  };

  return useMemo(() => ({
    playerX,
    playerIsBoosting,
    rival0X,
    rival1X,
    ranking,
    onCorrectAnswer,
    onWrongAnswer,
    applyDrift,
    reset,
  }), []);
}




