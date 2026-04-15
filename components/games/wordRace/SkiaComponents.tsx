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

const { COLORS, CAR, LANE_MARK_W, LANE_MARK_H, LANE_MARK_GAP } = WORD_RACE_CONFIG;

interface RoadProps {
  width: number;
  height: number;
  scrollOffset: SharedValue<number>;
}

export const Road: React.FC<RoadProps> = ({ width, height, scrollOffset }) => {
  const { LANES } = WORD_RACE_CONFIG;
  const grassT = 20;
  const divider1Y = (LANES.TOP + LANES.MIDDLE) / 2;
  const divider2Y = (LANES.MIDDLE + LANES.BOTTOM) / 2;
  const period = LANE_MARK_W + LANE_MARK_GAP;

  const dashPath = useDerivedValue(() => {
    const path = Skia.Path.Make();
    const offset = ((scrollOffset.value % period) + period) % period;
    
    // Draw far more than needed to ensure no flickering
    for (let x = -period; x < width + period; x += period) {
      const actualX = x + (period - offset);
      path.addRect(Skia.XYWHRect(actualX, divider1Y - LANE_MARK_H / 2, LANE_MARK_W, LANE_MARK_H));
      path.addRect(Skia.XYWHRect(actualX, divider2Y - LANE_MARK_H / 2, LANE_MARK_W, LANE_MARK_H));
    }
    return path;
  });

  return (
    <Group>
      {/* Background */}
      <Rect x={0} y={0} width={width} height={height} color={COLORS.ROAD_EDGE} />
      <Rect x={0} y={0} width={width} height={grassT} color={COLORS.GRASS} />
      <Rect x={0} y={height - grassT} width={width} height={grassT} color={COLORS.GRASS} />
      <Rect x={0} y={grassT} width={width} height={height - grassT * 2} color={COLORS.ROAD} />
      
      {/* Edge Lines */}
      <Rect x={0} y={grassT} width={width} height={2} color={COLORS.LANE_LINE} opacity={0.6} />
      <Rect x={0} y={height - grassT - 2} width={width} height={2} color={COLORS.LANE_LINE} opacity={0.6} />
      
      {/* Lane Dividers */}
      <Path path={dashPath} color={COLORS.LANE_LINE} opacity={0.4} />
    </Group>
  );
};


interface CarProps {
  x: number | SharedValue<number>;
  laneCenterY: number;
  color: string;
  isBoosting: boolean;
  isTurbo?: boolean;
}

export const Car: React.FC<CarProps> = ({ x, laneCenterY, color, isBoosting, isTurbo }) => {
  const w = CAR.WIDTH;
  const h = CAR.HEIGHT;
  const cy = laneCenterY - h / 2;
  const wheelColor = "#1a1a1a";
  const glassColor = "rgba(135, 206, 250, 0.8)";

  const matrix = useDerivedValue(() => {
    const mat = Skia.Matrix();
    const xVal = typeof x === 'number' ? x : x.value;
    mat.translate(xVal, cy);
    return mat;
  });

  return (
    <Group matrix={matrix}>
      {(isBoosting || isTurbo) && (
        <Circle 
          cx={w * 0.3} 
          cy={h * 0.5} 
          r={w * 0.6} 
          color={isTurbo ? COLORS.TURBO_GLOW : COLORS.BOOST_GLOW} 
          opacity={0.6}
        />
      )}
      <Ellipse cx={w / 2} cy={h + 2} rx={w * 0.5} ry={4} color="rgba(0,0,0,0.3)" />
      
      {/* Car Body */}
      <RoundedRect x={0} y={h * 0.4} width={w} height={h * 0.6} r={8} color={color} />
      <Path path={`M ${w * 0.2} ${h * 0.4} L ${w * 0.35} 0 L ${w * 0.65} 0 L ${w * 0.8} ${h * 0.4} Z`} color={color} />
      
      {/* Windows */}
      <Path path={`M ${w * 0.25} ${h * 0.35} L ${w * 0.38} ${h * 0.05} L ${w * 0.5} ${h * 0.05} L ${w * 0.5} ${h * 0.35} Z`} color={glassColor} />
      <Path path={`M ${w * 0.55} ${h * 0.35} L ${w * 0.55} ${h * 0.05} L ${w * 0.65} ${h * 0.05} L ${w * 0.75} ${h * 0.35} Z`} color={glassColor} />
      
      {/* Side Mirror */}
      <Rect x={-5} y={h * 0.1} width={15} height={4} color={color} />
      
      {/* Wheels */}
      <Circle cx={w * 0.2} cy={h} r={CAR.WHEEL_R} color={wheelColor} />
      <Circle cx={w * 0.2} cy={h} r={CAR.WHEEL_R * 0.5} color="#666" />
      <Circle cx={w * 0.8} cy={h} r={CAR.WHEEL_R} color={wheelColor} />
      <Circle cx={w * 0.8} cy={h} r={CAR.WHEEL_R * 0.5} color="#666" />
      
      {/* Lights */}
      <Rect x={w - 4} y={h * 0.5} width={4} height={10} color="#ffeb3b" />
      <Rect x={0} y={h * 0.5} width={3} height={8} color="#f44336" />
    </Group>
  );
};

const Ellipse: React.FC<{ cx: number; cy: number; rx: number; ry: number; color: string }> = ({ cx, cy, rx, ry, color }) => {
  const path = Skia.Path.Make();
  path.addOval(Skia.XYWHRect(cx - rx, cy - ry, rx * 2, ry * 2));
  return <Path path={path} color={color} />;
};

export const Exhaust: React.FC<{ particles: Particle[] }> = ({ particles }) => (
  <Group>
    {particles.map((p, i) => (
      <Circle key={i} cx={p.x} cy={p.y} r={p.size} color={`rgba(200,200,200,${p.opacity})`} />
    ))}
  </Group>
);

export const SpeedLines: React.FC<{ canvasWidth: number; canvasHeight: number; opacity: number | SharedValue<number> }> = ({ canvasWidth, canvasHeight, opacity }) => {
  const derivedOpacity = useDerivedValue(() => typeof opacity === 'number' ? opacity : opacity.value);
  return (
    <Group opacity={derivedOpacity}>
      {[0.1, 0.4, 0.7, 0.9].map((yFrac, i) => (
        <Rect key={i} x={-100} y={canvasHeight * yFrac} width={canvasWidth + 200} height={1} color="rgba(255,255,255,0.3)" />
      ))}
    </Group>
  );
};


