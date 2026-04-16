import React from 'react';
import {
  Group,
  Rect,
  RoundedRect,
  Circle,
  Path,
  Skia,
} from '@shopify/react-native-skia';
import { useDerivedValue, SharedValue } from 'react-native-reanimated';
import { WORD_RACE_CONFIG } from '@/constants/wordRaceConfig';
import type { Particle } from './ParticleSystem';

const { COLORS, CAR, LANE_MARK_W, LANE_MARK_H, LANE_MARK_GAP, LANES } = WORD_RACE_CONFIG;

// ─── Road ─────────────────────────────────────────────────────────────
interface RoadProps {
  width: number;
  height: number;
  scrollOffset: SharedValue<number>;
}

export const Road: React.FC<RoadProps> = ({ width, height, scrollOffset }) => {
  const grassH = 20;
  const roadY = grassH;
  const roadH = height - grassH * 2;
  const divYa = (LANES.TOP + LANES.MIDDLE) / 2;
  const divYb = (LANES.MIDDLE + LANES.BOTTOM) / 2;
  const period = LANE_MARK_W + LANE_MARK_GAP;

  // Animated dashes: offset scrolls so the road appears to move
  const dashPath = useDerivedValue(() => {
    const path = Skia.Path.Make();
    // phase: scroll position modulo one period (keeps animation looping)
    const phase = ((scrollOffset.value % period) + period) % period;

    for (let x = -period; x < width + period; x += period) {
      const rx = x - phase;
      path.addRect(Skia.XYWHRect(rx, divYa - LANE_MARK_H / 2, LANE_MARK_W, LANE_MARK_H));
      path.addRect(Skia.XYWHRect(rx, divYb - LANE_MARK_H / 2, LANE_MARK_W, LANE_MARK_H));
    }
    return path;
  });

  return (
    <Group>
      {/* Full background */}
      <Rect x={0} y={0} width={width} height={height} color={COLORS.ROAD_EDGE} />
      {/* Grass strips */}
      <Rect x={0} y={0} width={width} height={grassH} color={COLORS.GRASS} />
      <Rect x={0} y={height - grassH} width={width} height={grassH} color={COLORS.GRASS} />
      {/* Road surface */}
      <Rect x={0} y={roadY} width={width} height={roadH} color={COLORS.ROAD} />
      {/* Edge lines */}
      <Rect x={0} y={roadY} width={width} height={2} color={COLORS.LANE_LINE} opacity={0.4} />
      <Rect x={0} y={roadY + roadH - 2} width={width} height={2} color={COLORS.LANE_LINE} opacity={0.4} />
      {/* Animated dashed dividers */}
      <Path path={dashPath} color={COLORS.LANE_LINE} opacity={0.3} />
    </Group>
  );
};

// ─── Car ──────────────────────────────────────────────────────────────
interface CarProps {
  x: SharedValue<number>;
  laneCenterY: number;
  color: string;
  isBoosting: boolean;
  isTurbo?: boolean;
}

export const Car: React.FC<CarProps> = ({ x, laneCenterY, color, isBoosting, isTurbo }) => {
  const w = CAR.WIDTH;
  const h = CAR.HEIGHT;
  const cy = laneCenterY - h / 2;
  const wheelColor = '#1e293b';
  const wheelAccent = '#475569';
  const glassColor = 'rgba(186,230,253,0.75)';

  const matrix = useDerivedValue(() => {
    const mat = Skia.Matrix();
    mat.translate(x.value, cy);
    return mat;
  });

  return (
    <Group matrix={matrix}>
      {/* Shadow ellipse */}
      <SkiaEllipse cx={w / 2} cy={h + 5} rx={w * 0.48} ry={5} color="rgba(0,0,0,0.3)" />

      {/* Body */}
      <RoundedRect x={0} y={h * 0.38} width={w} height={h * 0.62} r={9} color={color} />

      {/* Cabin */}
      <SkiaPath
        d={`M ${w * 0.22} ${h * 0.38} L ${w * 0.38} 5 L ${w * 0.65} 5 L ${w * 0.8} ${h * 0.38} Z`}
        color={color}
      />

      {/* Windows */}
      <SkiaPath
        d={`M ${w * 0.27} ${h * 0.33} L ${w * 0.4} 9 L ${w * 0.52} 9 L ${w * 0.52} ${h * 0.33} Z`}
        color={glassColor}
      />
      <SkiaPath
        d={`M ${w * 0.56} ${h * 0.33} L ${w * 0.56} 9 L ${w * 0.65} 9 L ${w * 0.76} ${h * 0.33} Z`}
        color={glassColor}
      />

      {/* Turbo spoiler */}
      {isTurbo && <Rect x={-7} y={h * 0.2} width={13} height={6} color={color} />}

      {/* Wheels */}
      <Circle cx={w * 0.22} cy={h * 0.88} r={CAR.WHEEL_R} color={wheelColor} />
      <Circle cx={w * 0.22} cy={h * 0.88} r={CAR.WHEEL_R * 0.5} color={wheelAccent} />
      <Circle cx={w * 0.78} cy={h * 0.88} r={CAR.WHEEL_R} color={wheelColor} />
      <Circle cx={w * 0.78} cy={h * 0.88} r={CAR.WHEEL_R * 0.5} color={wheelAccent} />

      {/* Headlights */}
      <Rect x={w - 4} y={h * 0.5} width={4} height={12} color="#fef08a" />
      {/* Taillights */}
      <Rect x={0} y={h * 0.5} width={3} height={10} color="#f87171" />

      {/* Neon underglow when boosting */}
      {isBoosting && (
        <Rect x={w * 0.15} y={h + 1} width={w * 0.7} height={3} color={color} opacity={0.8} />
      )}
    </Group>
  );
};

// ─── Small helpers (avoid external dep on Skia Ellipse/Path primitives) ──
function SkiaEllipse({
  cx, cy, rx, ry, color,
}: { cx: number; cy: number; rx: number; ry: number; color: string }) {
  const path = Skia.Path.Make();
  path.addOval(Skia.XYWHRect(cx - rx, cy - ry, rx * 2, ry * 2));
  return <Path path={path} color={color} />;
}

function SkiaPath({ d, color }: { d: string; color: string }) {
  const path = Skia.Path.MakeFromSVGString(d);
  if (!path) return null;
  return <Path path={path} color={color} />;
}

// ─── Exhaust particles ────────────────────────────────────────────────
export const Exhaust: React.FC<{ particles: Particle[] }> = ({ particles }) => (
  <Group>
    {particles.map((p, i) => (
      <Circle
        key={i}
        cx={p.x}
        cy={p.y}
        r={p.size}
        color={`rgba(200,200,200,${(p.opacity * 0.3).toFixed(2)})`}
      />
    ))}
  </Group>
);

// ─── Speed lines (fixed on screen) ───────────────────────────────────
export const SpeedLines: React.FC<{
  canvasWidth: number;
  canvasHeight: number;
  opacity: number;
}> = ({ canvasWidth, canvasHeight, opacity }) => {
  if (opacity <= 0) return null;
  return (
    <Group opacity={opacity}>
      {[0.18, 0.45, 0.72, 0.88].map((yf, i) => (
        <Rect
          key={i}
          x={0}
          y={canvasHeight * yf}
          width={canvasWidth}
          height={i % 2 === 0 ? 1 : 0.5}
          color="rgba(255,255,255,0.15)"
        />
      ))}
    </Group>
  );
};
