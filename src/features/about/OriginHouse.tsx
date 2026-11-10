import { useEffect, useRef } from 'react';
import type * as THREE from 'three';
import { DetailLines, NodeRing, type DetailSegment } from '../architecture/Architecture';
import {
  TraditionalGround,
  TraditionalHouses,
  type TraditionalHouseSpec,
} from '../architecture/TraditionalHouse';
import { LANDMARKS, landmarkRegistry } from '../../lib/landmarks';
import { terrainHeight } from '../../lib/terrain';
import { LandmarkHalo, LandmarkMarker } from '../world/LandmarkMarker';

const INFO = LANDMARKS.about;
const BASE_Y = terrainHeight(INFO.position.x, INFO.position.z) - 0.15;

/**
 * THE ORIGIN HOUSE
 * The ancestral compound: a great thatched rondavel with a ring of smaller
 * houses around an open court. Drawn linework gives the walls, roofs and
 * threshold the same language as the rest of the landscape.
 */
const HOUSES: TraditionalHouseSpec[] = [
  // The great house.
  { x: -2, z: -1, radius: 7.2, wallHeight: 4.2, roofHeight: 6.4, rotation: 0.58 },
  // Family houses around the court.
  { x: 12, z: 8, radius: 3.4, wallHeight: 2.6, roofHeight: 3.8, rotation: 1.7, wall: 'earth' },
  { x: -14, z: 7, radius: 3, wallHeight: 2.4, roofHeight: 3.4, rotation: 0.2, wall: 'shade' },
  { x: 1, z: -13, radius: 2.8, wallHeight: 2.2, roofHeight: 3.1, rotation: 1.1 },
  { x: 13, z: -9, radius: 2.2, wallHeight: 2, roofHeight: 2.8, rotation: 2.4, wall: 'earth' },
];

const PAD = 1.8;

function ring(radius: number, y = PAD + 0.06, count = 52): DetailSegment[] {
  return Array.from({ length: count }, (_, i) => {
    const a = (i / count) * Math.PI * 2;
    const b = ((i + 1) / count) * Math.PI * 2;
    return {
      a: [Math.cos(a) * radius, y, Math.sin(a) * radius] as [number, number, number],
      b: [Math.cos(b) * radius, y, Math.sin(b) * radius] as [number, number, number],
    };
  });
}

const DETAILS: DetailSegment[] = [
  // Compound perimeter.
  ...ring(20.6),

  // Entry axis and threshold.
  { a: [0, PAD + 0.1, -16.4], b: [0, PAD + 0.1, 18.6], accent: true },
  { a: [-6, PAD + 0.12, 18.6], b: [6, PAD + 0.12, 18.6], accent: true },

  // Court ring at the heart of the compound.
  ...ring(9.4, PAD + 0.1, 40),
];

export function OriginHouse({
  onSelect,
  reduced,
}: {
  onSelect: () => void;
  reduced: boolean;
}) {
  const hitboxRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    const target = hitboxRef.current;
    if (!target) return undefined;
    return landmarkRegistry.register({ id: 'about', target, onSelect });
  }, [onSelect]);

  return (
    <group position={[INFO.position.x, BASE_Y, INFO.position.z]} rotation-y={0.58}>
      <TraditionalGround radius={20.8} />
      <group position={[0, PAD, 0]}>
        <TraditionalHouses houses={HOUSES} />
      </group>
      <DetailLines segments={DETAILS} />

      <NodeRing x={0} z={16.4} y={PAD + 0.55} radius={1.4} opacity={0.72} />
      <NodeRing x={0} z={20} y={PAD + 0.35} radius={2.6} opacity={0.3} />

      <LandmarkHalo id="about" radius={29} y={PAD + 0.02} reduced={reduced} />
      <LandmarkMarker
        id="about"
        name={INFO.name}
        kicker={INFO.kicker}
        height={INFO.markerHeight}
        onSelect={onSelect}
        reduced={reduced}
      />

      <mesh ref={hitboxRef} position={[0, 7, 0]} visible={false}>
        <boxGeometry args={[46, 19, 44]} />
        <meshBasicMaterial />
      </mesh>
    </group>
  );
}
