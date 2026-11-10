import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { LineBuilder } from '../../lib/lines';
import { mulberry32 } from '../../lib/noise';
import { pathPoint, terrainHeight } from '../../lib/terrain';

const VILLAGE_T = 0.645;

// Warm palette for the grass village: plaster walls and thatched roofs, in the
// same drawn-line language as the rest of the landscape.
const WALL = new THREE.Color('#efe8d6');
const ROOF = new THREE.Color('#cfa04a');
const ROOF_DARK = new THREE.Color('#9a7229');
const DOOR = new THREE.Color('#2e2115');

function villageCenter(): { x: number; z: number } {
  const point = pathPoint(VILLAGE_T);
  return { x: point.x + 12, z: point.z };
}

type Pt = { x: number; y: number; z: number };

/**
 * Build a traditional African grass house (a round, thatched-roof rondavel).
 * The walls form a slightly tapered cylinder; the roof is a broad cone of
 * thatch with an overhanging eave, drawn with radial grass lines and stacked
 * thatch bands. A low doorway faces the village centre.
 */
function buildSettlement(): { huts: THREE.BufferGeometry; fires: Float32Array } {
  const random = mulberry32(4417);
  const center = villageCenter();
  const builder = new LineBuilder();
  const firePositions: number[] = [];

  const hutCount = 9;
  for (let i = 0; i < hutCount; i += 1) {
    const angle = (i / hutCount) * Math.PI * 2 + random() * 0.4;
    const distance = 8 + random() * 12;
    const x = center.x + Math.cos(angle) * distance;
    const z = center.z + Math.sin(angle) * distance;
    const ground = terrainHeight(x, z) - 0.4;

    const baseRadius = 2.3 + random() * 1.1;
    const wallHeight = 1.5 + random() * 0.6;
    const roofHeight = 2.6 + random() * 1.4;
    const eaveRadius = baseRadius * (1.16 + random() * 0.08);
    const sides = 9;
    const rotation = random() * Math.PI * 2;

    const wallTop = ground + wallHeight;
    const apexY = wallTop + roofHeight;
    const apex: Pt = { x, y: apexY, z };

    const base: Pt[] = [];
    const top: Pt[] = [];
    const eave: Pt[] = [];
    for (let s = 0; s < sides; s += 1) {
      const a = rotation + (s / sides) * Math.PI * 2;
      base.push({
        x: x + Math.cos(a) * baseRadius,
        y: ground + 0.12,
        z: z + Math.sin(a) * baseRadius,
      });
      top.push({
        x: x + Math.cos(a) * baseRadius * 0.94,
        y: wallTop,
        z: z + Math.sin(a) * baseRadius * 0.94,
      });
      eave.push({
        x: x + Math.cos(a) * eaveRadius,
        y: wallTop + 0.08,
        z: z + Math.sin(a) * eaveRadius,
      });
    }

    // Plaster walls: base and top rings, plus the vertical studs between them.
    for (let s = 0; s < sides; s += 1) {
      const n = (s + 1) % sides;
      builder.add(base[s].x, base[s].y, base[s].z, base[n].x, base[n].y, base[n].z, WALL, 0.9);
      builder.add(top[s].x, top[s].y, top[s].z, top[n].x, top[n].y, top[n].z, WALL, 0.82);
      builder.add(base[s].x, base[s].y, base[s].z, top[s].x, top[s].y, top[s].z, WALL, 0.62);
    }

    // Thatched roof: overhanging eave ring and grass radials rising to the apex.
    for (let s = 0; s < sides; s += 1) {
      const n = (s + 1) % sides;
      builder.add(eave[s].x, eave[s].y, eave[s].z, eave[n].x, eave[n].y, eave[n].z, ROOF, 0.95);
      builder.add(eave[s].x, eave[s].y, eave[s].z, apex.x, apex.y, apex.z, ROOF, 0.78);
    }

    // Stacked thatch bands around the cone suggest the layered grass bundles.
    const bandLevels = [0.32, 0.6, 0.84];
    for (const t of bandLevels) {
      const bandY = wallTop + 0.08 + (apexY - (wallTop + 0.08)) * t;
      const bandR = eaveRadius * (1 - t);
      for (let s = 0; s < sides; s += 1) {
        const a = rotation + (s / sides) * Math.PI * 2;
        const b = rotation + ((s + 1) / sides) * Math.PI * 2;
        builder.add(
          x + Math.cos(a) * bandR,
          bandY,
          z + Math.sin(a) * bandR,
          x + Math.cos(b) * bandR,
          bandY,
          z + Math.sin(b) * bandR,
          ROOF_DARK,
          0.66,
        );
      }
    }

    // Low doorway facing the village centre.
    {
      const doorAngle = Math.atan2(center.z - z, center.x - x);
      const doorWidth = baseRadius * 0.52;
      const doorHeight = wallHeight * 0.7;
      const doorCenterX = x + Math.cos(doorAngle) * baseRadius * 0.82;
      const doorCenterZ = z + Math.sin(doorAngle) * baseRadius * 0.82;
      const perp = doorAngle + Math.PI / 2;
      const half = doorWidth / 2;
      const lx = doorCenterX + Math.cos(perp) * half;
      const lz = doorCenterZ + Math.sin(perp) * half;
      const rx = doorCenterX - Math.cos(perp) * half;
      const rz = doorCenterZ - Math.sin(perp) * half;
      const y0 = ground + 0.12;
      const y1 = ground + doorHeight;
      builder.add(lx, y0, lz, lx, y1, lz, DOOR, 0.9);
      builder.add(rx, y0, rz, rx, y1, rz, DOOR, 0.9);
      builder.add(lx, y1, lz, rx, y1, rz, DOOR, 0.9);
      builder.add(lx, y0, lz, rx, y0, rz, DOOR, 0.55);
    }

    if (i % 3 === 1) {
      firePositions.push(x + (random() - 0.5) * 3, ground + 0.9, z + (random() - 0.5) * 3);
    }
  }

  const fireGround = terrainHeight(center.x, center.z);
  firePositions.push(center.x, fireGround + 1.1, center.z);

  // Community ring at the heart of the village.
  const segments = 20;
  for (let i = 0; i < segments; i += 1) {
    const a = (i / segments) * Math.PI * 2;
    const b = ((i + 1) / segments) * Math.PI * 2;
    const ax = center.x + Math.cos(a) * 2.6;
    const az = center.z + Math.sin(a) * 2.6;
    const bx = center.x + Math.cos(b) * 2.6;
    const bz = center.z + Math.sin(b) * 2.6;
    builder.add(
      ax,
      terrainHeight(ax, az) + 0.35,
      az,
      bx,
      terrainHeight(bx, bz) + 0.35,
      bz,
      WALL,
      0.32,
    );
  }

  return {
    huts: builder.build(),
    fires: new Float32Array(firePositions),
  };
}

export function Settlement({ reduced }: { reduced: boolean }) {
  const { huts, fires } = useMemo(buildSettlement, []);
  const material = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.92,
        depthWrite: false,
        fog: true,
      }),
    [],
  );
  const fireMaterialRef = useRef<THREE.PointsMaterial>(null);

  useFrame((state) => {
    const materialRef = fireMaterialRef.current;
    if (materialRef) {
      materialRef.opacity = reduced
        ? 0.7
        : 0.62 + Math.sin(state.clock.elapsedTime * 1.8) * 0.16;
    }
  });

  useEffect(() => {
    return () => {
      huts.dispose();
      material.dispose();
    };
  }, [huts, material]);

  return (
    <group>
      <lineSegments geometry={huts} material={material} frustumCulled={false} />
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[fires, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={fireMaterialRef}
          color="#e87532"
          size={2.1}
          sizeAttenuation
          transparent
          opacity={0.72}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          fog
        />
      </points>
    </group>
  );
}
