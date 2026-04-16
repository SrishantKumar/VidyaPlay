export const WORD_RACE_CONFIG = {
  // Canvas dimensions
  CANVAS_HEIGHT_RATIO: 0.45, // percentage of window height

  // Lane system — Y positions
  LANES: {
    TOP: 65,     // Y center for top lane
    MIDDLE: 145, // Y center for middle lane (player)
    BOTTOM: 225, // Y center for bottom lane
  },

  LANE_MARK_W: 40,   // Dash length
  LANE_MARK_H: 3,    // Dash thickness
  LANE_MARK_GAP: 30,

  // Car dimensions
  CAR: {
    WIDTH: 95,
    HEIGHT: 48,
    WHEEL_R: 11,
    WINDOW_H: 16,
    SPOILER_H: 8,
  },

  // Race positions
  PLAYER_X: 80,
  CAMERA_OFFSET_X: 120, // Keep player roughly at 1/3 of the screen

  // Physics
  PHYSICS: {
    BOOST_DISTANCE: 180,
    RIVAL_FALLBACK: 140,
    RIVAL_ADVANCE: 90,
    RIVAL_DRIFT_PER_FRAME: 0.4,
    SPRING_STIFFNESS: 45,   // Smoother
    SPRING_DAMPING: 15,
    CAMERA_LERP: 0.08,      // How fast camera follows
    SHAKE_DECAY: 0.9,       // How fast shake dies down
  },

  // Colors - CYBER RACING THEME
  COLORS: {
    SKY: '#020617',         // Slate 950
    ROAD: '#0f172a',        // Slate 900
    ROAD_EDGE: '#020617',
    GRASS: '#064e3b',       // Deep forest green
    LANE_LINE: '#38bdf8',   // Sky-400 neon
    PLAYER_CAR: '#f97316',  // Orange-500 neon
    RIVAL_1_CAR: '#ef4444', // Red-500
    RIVAL_2_CAR: '#8b5cf6', // Violet-500
    EXHAUST: 'rgba(255, 255, 255, 0.2)',
    BOOST_GLOW: 'rgba(249, 115, 22, 0.4)',
    TURBO_GLOW: 'rgba(234, 179, 8, 0.5)',
    SUCCESS_FLASH: 'rgba(34, 197, 94, 0.3)',
    DANGER_FLASH: 'rgba(239, 68, 68, 0.3)',
  },
} as const;

export type WordRaceConfig = typeof WORD_RACE_CONFIG;
