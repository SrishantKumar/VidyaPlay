export const WORD_RACE_CONFIG = {
  // Canvas dimensions
  CANVAS_HEIGHT_RATIO: 0.42, // percentage of window height

  // Lane system — Y positions (Horizontal road, grass at top/bottom)
  LANES: {
    TOP: 60,     // Y center for top lane
    MIDDLE: 140, // Y center for middle lane (player)
    BOTTOM: 220, // Y center for bottom lane
  },

  LANE_MARK_W: 30, // Dash length
  LANE_MARK_H: 4,  // Dash thickness
  LANE_MARK_GAP: 20,

  // Car dimensions (Side Profile)
  CAR: {
    WIDTH: 90,
    HEIGHT: 45,
    WHEEL_R: 10,
    WINDOW_H: 15,
    SPOILER_H: 6,
  },

  // Race positions — horizontal X coordinates
  PLAYER_X: 60,
  RIVAL_START_OFFSET: 140, // Closer start

  // Physics
  PHYSICS: {
    BOOST_DISTANCE: 140,
    RIVAL_FALLBACK: 120,    // Bigger fallback
    RIVAL_ADVANCE: 80,
    RIVAL_DRIFT_PER_FRAME: 0.35,
    SPRING_STIFFNESS: 60,   // Softer spring for smoother transition
    SPRING_DAMPING: 18,
    MAX_POSITION: 400,
    MIN_POSITION: -100,
  },


  // Timing (ms)
  BOOST_DURATION: 1400,

  // Scoring
  COINS_PER_CORRECT: 10,
  COINS_PER_STREAK: 5,
  TURBO_MULTIPLIER: 2,
  STREAK_FOR_TURBO: 3,

  // Colors
  COLORS: {
    SKY: '#1a1a2e',
    ROAD: '#2d3561',
    ROAD_EDGE: '#1a1a2e',
    GRASS: '#1e6b3e',
    LANE_LINE: '#e2e8f0',
    PLAYER_CAR: '#FF6B35',
    RIVAL_1_CAR: '#e74c3c',
    RIVAL_2_CAR: '#3498db',
    EXHAUST: 'rgba(160,160,160,0.55)',
    BOOST_GLOW: 'rgba(255,107,53,0.35)',
    TURBO_GLOW: 'rgba(255,220,0,0.45)',
  },
} as const;

export type WordRaceConfig = typeof WORD_RACE_CONFIG;
