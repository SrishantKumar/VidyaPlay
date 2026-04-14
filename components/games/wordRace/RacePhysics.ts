import { useSharedValue, withSpring, SharedValue } from 'react-native-reanimated';
import { WORD_RACE_CONFIG } from '@/constants/wordRaceConfig';

const { PHYSICS } = WORD_RACE_CONFIG;

const springCfg = {
  stiffness: PHYSICS.SPRING_STIFFNESS,
  damping: PHYSICS.SPRING_DAMPING,
};

export interface CarPhysics {
  /** Horizontal race position offset (positive = ahead) */
  raceX: SharedValue<number>;
  isBoosting: SharedValue<boolean>;
}

/**
 * Race physics engine.
 *
 * Conceptually, the race is a 1-D track.
 * raceX represents the **offset from the player's fixed screen position**.
 *   - Player.raceX is always 0 (the canvas draws it at PLAYER_X).
 *   - Rival.raceX starts at +RIVAL_START_OFFSET (ahead of player).
 *
 * On correct answer  → rivals' raceX decreases (falls back visually).
 * On wrong answer    → rivals' raceX increases (advances).
 * Per-frame drift    → rivals' raceX slowly increases (AI pressure).
 */
export function useRacePhysics() {
  const { PLAYER_X, RIVAL_START_OFFSET } = WORD_RACE_CONFIG;

  // Player always renders at fixed PLAYER_X; track "logical" position to
  // optionally show progress overlay later.
  const playerIsBoosting = useSharedValue(false);
  const playerRaceX = useSharedValue(0); // unused for drawing but useful for state

  // Rivals' raceX is their pixel offset from player reference = screen X
  const rival0X = useSharedValue(PLAYER_X + RIVAL_START_OFFSET);
  const rival1X = useSharedValue(PLAYER_X + RIVAL_START_OFFSET + 40);
  const rival0Boosting = useSharedValue(false);
  const rival1Boosting = useSharedValue(false);

  function onCorrectAnswer(isTurbo: boolean) {
    const fallback = isTurbo
      ? PHYSICS.RIVAL_FALLBACK * WORD_RACE_CONFIG.TURBO_MULTIPLIER
      : PHYSICS.RIVAL_FALLBACK;

    playerIsBoosting.value = true;

    rival0X.value = withSpring(
      Math.max(
        PLAYER_X + 30,
        rival0X.value - fallback
      ),
      springCfg,
      () => { playerIsBoosting.value = false; }
    );

    rival1X.value = withSpring(
      Math.max(
        PLAYER_X + 30,
        rival1X.value - (fallback * 0.85)
      ),
      springCfg
    );
  }

  function onWrongAnswer() {
    rival0X.value = withSpring(
      Math.min(PHYSICS.MAX_POSITION, rival0X.value + PHYSICS.RIVAL_ADVANCE),
      springCfg
    );
    rival1X.value = withSpring(
      Math.min(PHYSICS.MAX_POSITION, rival1X.value + PHYSICS.RIVAL_ADVANCE * 0.9),
      springCfg
    );
  }

  /** Call every animation frame to apply AI drift pressure */
  function applyDrift() {
    if (rival0X.value < PHYSICS.MAX_POSITION) {
      rival0X.value = rival0X.value + PHYSICS.RIVAL_DRIFT_PER_FRAME;
    }
    if (rival1X.value < PHYSICS.MAX_POSITION) {
      rival1X.value = rival1X.value + PHYSICS.RIVAL_DRIFT_PER_FRAME;
    }
  }

  function reset() {
    const { PLAYER_X: px, RIVAL_START_OFFSET: offset } = WORD_RACE_CONFIG;
    rival0X.value = px + offset;
    rival1X.value = px + offset + 40;
    playerIsBoosting.value = false;
  }

  return {
    playerIsBoosting,
    rival0X,
    rival1X,
    rival0Boosting,
    rival1Boosting,
    onCorrectAnswer,
    onWrongAnswer,
    applyDrift,
    reset,
  };
}
