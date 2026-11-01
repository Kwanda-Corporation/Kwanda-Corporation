import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { LineBuilder } from '../../lib/lines';

export type ArchitectureTone = 'white' | 'shade' | 'ink';

export type ArchitectureVolume = {
  x: number;
  y: number;
  z: number;
  w: number;
  h: number;
  d: number;
  ry?: number;
  rz?: number;
  tone?: ArchitectureTone;
};

export type DetailSegment = {
  a: [number, number, number];
  b: [number, number, number];
  accent?: boolean;
};

const UNIT_BOX = new THREE.BoxGeometry(1, 1, 1);

const WHITE = '#f4f1e8';
const SHADE = '#d5d0c4';
const INK = '#171614';
const ORANGE = '#e87532';
const LINE_INK = '#141310';

const TONE_MATERIALS: Record<ArchitectureTone, THREE.MeshStandardMaterial> = {
  white: new THREE.MeshStandardMaterial({
    color: WHITE,
    roughness: 0.92,
    metalness: 0,
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1,
  }),
  shade: new THREE.MeshStandardMaterial({
    color: SHADE,
    roughness: 0.95,
    metalness: 0,
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1,
  }),
  ink: new THREE.MeshStandardMaterial({
    color: INK,
    roughness: 0.9,
    metalness: 0,
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1,
  }),
};

const ACCENT_MATERIAL = new THREE.MeshBasicMaterial({
  color: ORANGE,
  toneMapped: false,
});

const DETAIL_MATERIAL = new THREE.LineBasicMaterial({
  vertexColors: true,
  transparent: true,
  opacity: 0.9,
  depthWrite: false,
});

const CORNERS: Array<[number, number, number]> = [
  [-0.5, -0.5, -0.5],
  [0.5, -0.5, -0.5],
  [-0.5, 0.5, -0.5],
  [0.5, 0.5, -0.5],
  [-0.5, -0.5, 0.5],
  [0.5, -0.5, 0.5],
  [-0.5, 0.5, 0.5],
  [0.5, 0.5, 0.5],
];

const EDGE_PAIRS: Array<[number, number]> = [
  [0, 1],
  [1, 5],
  [5, 4],
  [4, 0],
  [2, 3],
  [3, 7],
  [7, 6],
  [6, 2],
  [0, 2],
  [1, 3],
  [4, 6],
  [5, 7],
];

function buildEdges(volumes: ArchitectureVolume[]): THREE.BufferGeometry {
  const builder = new LineBuilder();
  const color = new THREE.Color(LINE_INK);

  volumes.forEach((volume) => {
    const rotation = new THREE.Matrix4().makeRotationFromEuler(
      new THREE.Euler(0, volume.ry ?? 0, volume.rz ?? 0, 'XYZ'),
    );
    const corners = CORNERS.map(([x, y, z]) => {
      const point = new THREE.Vector3(x * volume.w, y * volume.h, z * volume.d);
      point.applyMatrix4(rotation);
      return point.set(point.x + volume.x, point.y + volume.y, point.z + volume.z);
    });

    EDGE_PAIRS.forEach(([start, end]) => {
      const a = corners[start];
      const b = corners[end];
      builder.add(a.x, a.y, a.z, b.x, b.y, b.z, color, 1);
    });
  });

  return builder.build();
}

export function Volumes({ volumes }: { volumes: ArchitectureVolume[] }) {
  return (
    <group>
      {volumes.map((volume, index) => (
        <mesh
          key={index}
          geometry={UNIT_BOX}
          material={TONE_MATERIALS[volume.tone ?? 'white']}
          position={[volume.x, volume.y, volume.z]}
          rotation={[0, volume.ry ?? 0, volume.rz ?? 0]}
          scale={[volume.w, volume.h, volume.d]}
          dispose={null}
        />
      ))}
    </group>
  );
}

export function VolumeEdges({
  volumes,
  opacity = 0.68,
}: {
  volumes: ArchitectureVolume[];
  opacity?: number;
}) {
  const geometry = useMemo(() => buildEdges(volumes), [volumes]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <lineSegments geometry={geometry} renderOrder={2} dispose={null}>
      <lineBasicMaterial
        color={LINE_INK}
        transparent
        opacity={opacity}
        depthWrite={false}
      />
    </lineSegments>
  );
}

export function Accents({ volumes }: { volumes: ArchitectureVolume[] }) {
  return (
    <group>
      {volumes.map((volume, index) => (
        <mesh
          key={index}
          geometry={UNIT_BOX}
          material={ACCENT_MATERIAL}
          position={[volume.x, volume.y, volume.z]}
          rotation={[0, volume.ry ?? 0, volume.rz ?? 0]}
          scale={[volume.w, volume.h, volume.d]}
          dispose={null}
          renderOrder={3}
        />
      ))}
    </group>
  );
}

export function DetailLines({ segments }: { segments: DetailSegment[] }) {
  const geometry = useMemo(() => {
    const builder = new LineBuilder();
    const ink = new THREE.Color(LINE_INK);
    const accent = new THREE.Color(ORANGE);
    segments.forEach((segment) => {
      builder.add(
        segment.a[0],
        segment.a[1],
        segment.a[2],
        segment.b[0],
        segment.b[1],
        segment.b[2],
        segment.accent ? accent : ink,
        segment.accent ? 1 : 0.85,
      );
    });
    return builder.build();
  }, [segments]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  return <lineSegments geometry={geometry} material={DETAIL_MATERIAL} renderOrder={3} />;
}

/** Flat tripwire-style ring used for route nodes and thresholds. */
export function NodeRing({
  x,
  z,
  y = 0.35,
  radius = 1.1,
  opacity = 0.8,
}: {
  x: number;
  z: number;
  y?: number;
  radius?: number;
  opacity?: number;
}) {
  return (
    <mesh position={[x, y, z]} rotation-x={-Math.PI / 2}>
      <ringGeometry args={[radius * 0.82, radius, 24]} />
      <meshBasicMaterial
        color={ORANGE}
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}
