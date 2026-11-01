import { useEffect, useRef } from 'react';
import type * as THREE from 'three';
import {
  Accents,
  DetailLines,
  NodeRing,
  VolumeEdges,
  Volumes,
  type ArchitectureVolume,
  type DetailSegment,
} from '../architecture/Architecture';
import { LANDMARKS, landmarkRegistry } from '../../lib/landmarks';
import { terrainHeight } from '../../lib/terrain';
import { LandmarkHalo, LandmarkMarker } from '../world/LandmarkMarker';

const INFO = LANDMARKS.about;
const BASE_Y = terrainHeight(INFO.position.x, INFO.position.z) - 0.15;

/**
 * THE ORIGIN HOUSE
 * A white pavilion composed as an architectural exhibition: a raised plinth,
 * two offset galleries, a tall service tower, a floating canopy held by a
 * colonnade, and a still reflecting court. Black hairlines draw the volumes;
 * orange marks the threshold, the vertical slot and the entry datum.
 */
const VOLUMES: ArchitectureVolume[] = [
  // Terrace + steps that tie the pavilion into the slope.
  { x: 0, y: -2.1, z: 0, w: 40, h: 6.4, d: 32, tone: 'shade' },
  { x: 0, y: 1.0, z: 0, w: 41, h: 1.7, d: 31, tone: 'white' },
  { x: 0, y: -1.4, z: 18, w: 24, h: 6.4, d: 7, tone: 'shade' },
  { x: 0, y: 0.55, z: 18.4, w: 22, h: 1.1, d: 3.4, tone: 'white' },
  { x: 0, y: 1.05, z: 16.6, w: 20, h: 1.5, d: 2.4, tone: 'white' },

  // Two galleries, deliberately offset in plan and height.
  { x: -10.5, y: 6.6, z: -2, w: 11, h: 9.6, d: 15, tone: 'white' },
  { x: 10, y: 5.6, z: -5.5, w: 8, h: 7.6, d: 11, tone: 'white' },
  { x: 0, y: 5.6, z: -14, w: 26, h: 7.6, d: 1.1, tone: 'white' },

  // Service tower and its vertical void.
  { x: 0, y: 11, z: -8.5, w: 6, h: 18.4, d: 6, tone: 'white' },

  // Floating roof plane over the courtyard.
  { x: 0, y: 13.1, z: 3, w: 30, h: 0.7, d: 17, tone: 'white' },
  { x: 0, y: 7.4, z: 2.5, w: 12, h: 0.4, d: 10, tone: 'white' },

  // Colonnade holding the canopy.
  { x: -13, y: 7.4, z: 9.5, w: 0.34, h: 11.2, d: 0.34, tone: 'white' },
  { x: 13, y: 7.4, z: 9.5, w: 0.34, h: 11.2, d: 0.34, tone: 'white' },
  { x: -13, y: 7.4, z: -2.5, w: 0.34, h: 11.2, d: 0.34, tone: 'white' },
  { x: 13, y: 7.4, z: -2.5, w: 0.34, h: 11.2, d: 0.34, tone: 'white' },
  { x: -6.5, y: 7.4, z: 9.5, w: 0.34, h: 11.2, d: 0.34, tone: 'white' },
  { x: 6.5, y: 7.4, z: 9.5, w: 0.34, h: 11.2, d: 0.34, tone: 'white' },

  // Slatted screen along the west gallery.
  { x: -15.1, y: 5.8, z: 5.75, w: 0.3, h: 8, d: 0.42, tone: 'white' },
  { x: -13.8, y: 5.8, z: 5.75, w: 0.3, h: 8, d: 0.42, tone: 'white' },
  { x: -12.5, y: 5.8, z: 5.75, w: 0.3, h: 8, d: 0.42, tone: 'white' },
  { x: -11.2, y: 5.8, z: 5.75, w: 0.3, h: 8, d: 0.42, tone: 'white' },
  { x: -9.9, y: 5.8, z: 5.75, w: 0.3, h: 8, d: 0.42, tone: 'white' },
  { x: -8.6, y: 5.8, z: 5.75, w: 0.3, h: 8, d: 0.42, tone: 'white' },
  { x: -7.3, y: 5.8, z: 5.75, w: 0.3, h: 8, d: 0.42, tone: 'white' },
  { x: -6.0, y: 5.8, z: 5.75, w: 0.3, h: 8, d: 0.42, tone: 'white' },

  // Reflecting court.
  { x: 4, y: 1.9, z: 7.5, w: 11.5, h: 0.16, d: 4.6, tone: 'shade' },
];

const ACCENTS: ArchitectureVolume[] = [
  { x: 0, y: 11.2, z: -5.42, w: 0.5, h: 13, d: 0.16 },
  { x: 0, y: 13.48, z: 11.55, w: 29, h: 0.14, d: 0.14 },
  { x: 0, y: 1.86, z: 13.5, w: 20, h: 0.1, d: 0.16 },
  { x: 0, y: 4.2, z: -13.35, w: 0.16, h: 5.6, d: 0.16 },
];

const DETAILS: DetailSegment[] = [
  // Podium threshold.
  { a: [-18.5, 1.86, 13.5], b: [18.5, 1.86, 13.5] },
  { a: [-18.5, 1.86, 13.5], b: [-18.5, 1.86, -13.5] },
  { a: [18.5, 1.86, 13.5], b: [18.5, 1.86, -13.5] },
  { a: [-18.5, 1.86, -13.5], b: [18.5, 1.86, -13.5] },

  // Canopy outline.
  { a: [-14.8, 13.5, 11.5], b: [14.8, 13.5, 11.5] },
  { a: [-14.8, 13.5, -5.4], b: [14.8, 13.5, -5.4] },
  { a: [-14.8, 13.5, -5.4], b: [-14.8, 13.5, 11.5] },
  { a: [14.8, 13.5, -5.4], b: [14.8, 13.5, 11.5] },

  // Courtyard axis.
  { a: [0, 1.87, -13.4], b: [0, 1.87, 12.4] },

  // Reflecting court rim.
  { a: [-1.75, 2.0, 7.5], b: [9.75, 2.0, 7.5], accent: true },
  { a: [-1.75, 2.0, 7.5], b: [-1.75, 2.0, 9.8], accent: true },
  { a: [9.75, 2.0, 7.5], b: [9.75, 2.0, 9.8], accent: true },
  { a: [-1.75, 2.0, 9.8], b: [9.75, 2.0, 9.8], accent: true },
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
      <Volumes volumes={VOLUMES} />
      <VolumeEdges volumes={VOLUMES} />
      <Accents volumes={ACCENTS} />
      <DetailLines segments={DETAILS} />

      <NodeRing x={0} z={16.4} y={2.0} radius={1.4} opacity={0.72} />
      <NodeRing x={0} z={20.0} y={0.55} radius={2.6} opacity={0.3} />

      <LandmarkHalo id="about" radius={29} y={1.2} reduced={reduced} />
      <LandmarkMarker
        id="about"
        name={INFO.name}
        kicker={INFO.kicker}
        height={INFO.markerHeight}
        onSelect={onSelect}
        reduced={reduced}
      />

      <mesh ref={hitboxRef} position={[0, 11, 1]} visible={false}>
        <boxGeometry args={[46, 28, 42]} />
        <meshBasicMaterial />
      </mesh>
    </group>
  );
}
