import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { LineBuilder } from '../../lib/lines';
import { mulberry32 } from '../../lib/noise';
import { pathPoint, terrainHeight } from '../../lib/terrain';

const VILLAGE_T = 0.645;

function villageCenter(): { x: number; z: number } {
  const point = pathPoint(VILLAGE_T);
  return { x: point.x + 12, z: point.z };
}

function buildSettlement(): { huts: THREE.BufferGeometry; fires: Float32Array } {
  const random = mulberry32(4417);
  const center = villageCenter();
  const builder = new LineBuilder();
  const white = new THREE.Color('#f5f5f0');
  const firePositions: number[] = [];

  const hutCount = 9;
  for (let i = 0; i < hutCount; i += 1) {
    const angle = (i / hutCount) * Math.PI * 2 + random() * 0.4;
    const distance = 6 + random() * 12;
    const x = center.x + Math.cos(angle) * distance;
    const z = center.z + Math.sin(angle) * distance;
    const ground = terrainHeight(x, z) - 0.4;

    const baseRadius = 2.4 + random() * 1.6;
    const height = 2.8 + random() * 1.9;
    const sides = 7;
    const rotation = random() * Math.PI * 2;
    const midHeight = ground + height * 0.62;

    const base: Array<{ x: number; y: number; z: number }> = [];
    const mid: Array<{ x: number; y: number; z: number }> = [];

    for (let side = 0; side < sides; side += 1) {
      const a = rotation + (side / sides) * Math.PI * 2;
      base.push({
        x: x + Math.cos(a) * baseRadius,
        y: ground + 0.15,
        z: z + Math.sin(a) * baseRadius,
      });
      mid.push({
        x: x + Math.cos(a) * baseRadius * 0.42,
        y: midHeight,
        z: z + Math.sin(a) * baseRadius * 0.42,
      });
    }

    const apex = { x, y: ground + height, z };
    const dim = 0.5 + random() * 0.2;

    for (let side = 0; side < sides; side += 1) {
      const next = (side + 1) % sides;
      builder.add(
        base[side].x,
        base[side].y,
        base[side].z,
        base[next].x,
        base[next].y,
        base[next].z,
        white,
        dim * 0.8,
      );
      builder.add(
        mid[side].x,
        mid[side].y,
        mid[side].z,
        mid[next].x,
        mid[next].y,
        mid[next].z,
        white,
        dim,
      );
      builder.add(
        base[side].x,
        base[side].y,
        base[side].z,
        mid[side].x,
        mid[side].y,
        mid[side].z,
        white,
        dim * 0.85,
      );
      if (side % 2 === 0) {
        builder.add(
          mid[side].x,
          mid[side].y,
          mid[side].z,
          apex.x,
          apex.y,
          apex.z,
          white,
          dim,
        );
      }
    }

    if (i % 3 === 1) {
      firePositions.push(x + (random() - 0.5) * 3, ground + 0.9, z + (random() - 0.5) * 3);
    }
  }

  const fireGround = terrainHeight(center.x, center.z);
  firePositions.push(center.x, fireGround + 1.1, center.z);

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
      white,
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
        opacity: 0.88,
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
