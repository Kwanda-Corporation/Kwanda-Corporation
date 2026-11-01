import { fbm2, smoothstep } from './noise';

export const WORLD_SIZE = 1200;
export const PLAY_RADIUS = 170;
export const START_FOCUS = { x: -14, z: 26 };

export function terrainHeight(x: number, z: number): number {
  const radius = Math.hypot(x, z);
  const basin = 0.38 + 0.62 * smoothstep(20, 230, radius);

  const rolling = fbm2(x * 0.0031 + 11.3, z * 0.0031 - 4.7, 3, 4);
  const detail = fbm2(x * 0.0105 + 31.7, z * 0.0105 + 8.1, 9, 3);
  const ridgeNoise = fbm2(x * 0.0062 - 5.5, z * 0.0062 + 2.2, 21, 3);
  const ridge = 1 - Math.abs(ridgeNoise * 2 - 1);

  let height = (rolling - 0.5) * 64 * basin;
  height += (detail - 0.5) * 7;
  height += ridge * 8 * smoothstep(110, 330, radius);
  height += 8 * smoothstep(120, 400, radius);

  return height;
}

export function terrainNormal(
  x: number,
  z: number,
  out: { set: (x: number, y: number, z: number) => unknown },
): void {
  const e = 0.9;
  const left = terrainHeight(x - e, z);
  const right = terrainHeight(x + e, z);
  const down = terrainHeight(x, z - e);
  const up = terrainHeight(x, z + e);
  out.set(left - right, 2 * e, down - up);
}

export function pathPoint(t: number): { x: number; z: number } {
  const z = -190 + t * 380;
  const x = Math.sin(t * Math.PI * 1.7 + 0.35) * 82 + Math.sin(t * Math.PI * 4.3 + 1.1) * 21;
  return { x, z };
}

export function trailPoints(count = 180): Array<{ x: number; z: number; y: number }> {
  const points: Array<{ x: number; z: number; y: number }> = [];
  for (let i = 0; i <= count; i += 1) {
    const t = i / count;
    const { x, z } = pathPoint(t);
    points.push({ x, z, y: terrainHeight(x, z) + 0.45 });
  }
  return points;
}

export function clampToPlayArea(x: number, z: number): { x: number; z: number } {
  const radius = Math.hypot(x, z);
  if (radius <= PLAY_RADIUS) return { x, z };
  const scale = PLAY_RADIUS / radius;
  return { x: x * scale, z: z * scale };
}
