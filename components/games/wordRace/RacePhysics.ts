import { useSharedValue, withSpring, withSequence, withTiming, runOnUI } from 'react-native-reanimated';
import { WORD_RACE_CONFIG } from '@/constants/wordRaceConfig';

const { PHYSICS } = WORD_RACE_CONFIG;
const springCfg = { stiffness: PHYSICS.SPRING_STIFFNESS, damping: PHYSICS.SPRING_DAMPING };

export function useRacePhysics() {
  const { PLAYER_X, CAMERA_OFFSET_X } = WORD_RACE_CONFIG;

  // World position of each car (horizontal)
  const playerX   = useSharedValue(PLAYER_X);
  const rival0X   = useSharedValue(PLAYER_X + 160);
  const rival1X   = useSharedValue(PLAYER_X + 300);

  // Camera tracks the player
  const cameraX       = useSharedValue(0);
  const shake         = useSharedValue(0);
  const flash         = useSharedValue(0);
  const flashIsSuccess= useSharedValue(1); // 1=green, 0=red
  const ranking       = useSharedValue(3);

  // ── UI-thread helpers (called from worklets) ───────────────────────
  function _calcRanking() {
    'worklet';
    let pos = 1;
    if (rival0X.value > playerX.value) pos++;
    if (rival1X.value > playerX.value) pos++;
    ranking.value = pos;
  }

  // ── Public API — runs on UI thread via runOnUI ─────────────────────
  const triggerBoost = (isTurbo: boolean) => {
    runOnUI(() => {
      'worklet';
      const boost = isTurbo ? PHYSICS.BOOST_DISTANCE * 1.6 : PHYSICS.BOOST_DISTANCE;
      playerX.value = withSpring(playerX.value + boost, springCfg);
      rival0X.value = withSpring(rival0X.value - PHYSICS.RIVAL_FALLBACK * 0.6, springCfg);
      rival1X.value = withSpring(rival1X.value - PHYSICS.RIVAL_FALLBACK * 0.4, springCfg);

      flashIsSuccess.value = 1;
      flash.value = withSequence(withTiming(0.9, { duration: 80 }), withTiming(0, { duration: 400 }));
      shake.value = 6;
      _calcRanking();
    })();
  };

  const triggerSlowdown = () => {
    runOnUI(() => {
      'worklet';
      playerX.value = withSpring(playerX.value - 120, springCfg);
      rival0X.value = withSpring(rival0X.value + PHYSICS.RIVAL_ADVANCE, springCfg);
      rival1X.value = withSpring(rival1X.value + PHYSICS.RIVAL_ADVANCE, springCfg);

      flashIsSuccess.value = 0;
      flash.value = withSequence(withTiming(0.9, { duration: 80 }), withTiming(0, { duration: 500 }));
      shake.value = 16;
      _calcRanking();
    })();
  };

  // ── Per-frame update — called inside useFrameCallback (already worklet) ──
  const tickFrame = () => {
    'worklet';
    // Rivals always drift forward (simulate them racing)
    rival0X.value += PHYSICS.RIVAL_DRIFT_PER_FRAME;
    rival1X.value += PHYSICS.RIVAL_DRIFT_PER_FRAME * 0.85;
    // Player slowly decelerates too — creates tension
    playerX.value += 0.15;

    // Camera smoothly follows player
    const target = playerX.value - CAMERA_OFFSET_X;
    cameraX.value += (target - cameraX.value) * PHYSICS.CAMERA_LERP;

    // Shake decay
    if (shake.value > 0.2) {
      shake.value *= PHYSICS.SHAKE_DECAY;
    } else {
      shake.value = 0;
    }

    _calcRanking();
  };

  const reset = () => {
    runOnUI(() => {
      'worklet';
      playerX.value  = PLAYER_X;
      rival0X.value  = PLAYER_X + 160;
      rival1X.value  = PLAYER_X + 300;
      cameraX.value  = 0;
      shake.value    = 0;
      flash.value    = 0;
      ranking.value  = 3;
    })();
  };

  return {
    playerX, rival0X, rival1X,
    cameraX, shake, flash, flashIsSuccess, ranking,
    triggerBoost, triggerSlowdown, tickFrame, reset,
  };
}
