import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { LineBuilder } from '../../lib/lines';

export type TraditionalHouseSpec = {
  x: number;
  z: number;
  /** Local ground offset within the landmark group. */
  y?: number;
  radius: number;
  wallHeight?: number;
  roofHeight?: number;
  rotation?: number;
  wall?: 'plaster' | 'earth' | 'shade';
  roof?: 'thatch' | 'dark';
  door?: boolean;
};

const SIDES = 14;
const LINE_INK = new THREE.Color('#141310');

const WALL_MATERIALS = {
  plaster: new THREE.MeshStandardMaterial({
    color: '#efe8d6',
    roughness: 1,
    metalness: 0,
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1,
  }),
  earth: new THREE.MeshStandardMaterial({
    color: '#bb8455',
    roughness: 1,
    metalness: 0,
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1,
  }),
  shade: new THREE.MeshStandardMaterial({
    color: '#8f6844',
    roughness: 1,
    metalness: 0,
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1,
  }),
} as const;

const ROOF_MATERIALS = {
  thatch: new THREE.MeshStandardMaterial({
    color: '#cfa04a',
    roughness: 1,
    metalness: 0,
    flatShading: true,
    side: THREE.DoubleSide,
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1,
  }),
  dark: new THREE.MeshStandardMaterial({
    color: '#9a7229',
    roughness: 1,
    metalness: 0,
    flatShading: true,
    side: THREE.DoubleSide,
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1,
  }),
} as const;

const DOOR_MATERIAL = new THREE.MeshStandardMaterial({
  color: '#2e2115',
  roughness: 1,
  metalness: 0,
});

const PLINTH_MATERIAL = new THREE.MeshStandardMaterial({
  color: '#6d553c',
  roughness: 1,
  metalness: 0,
});

const WALL_GEOMETRY = new THREE.CylinderGeometry(0.9, 1, 1, SIDES, 1, false);
const ROOF_GEOMETRY = new THREE.ConeGeometry(1.3, 1, SIDES, 1, true);
const EAVE_GEOMETRY = new THREE.CylinderGeometry(1.3, 1.3, 1, SIDES, 1, false);
const PLINTH_GEOMETRY = new THREE.CylinderGeometry(1.04, 1.1, 1, SIDES, 1, false);
const DOOR_GEOMETRY = new THREE.BoxGeometry(1, 1, 0.16);

function houseMetrics(house: TraditionalHouseSpec): {
  radius: number;
  wallHeight: number;
  roofHeight: number;
} {
  return {
    radius: house.radius,
    wallHeight: house.wallHeight ?? Math.max(1.8, house.radius * 0.72),
    roofHeight: house.roofHeight ?? Math.max(2.6, house.radius * 1.15),
  };
}

/**
 * Draws the hand-drawn linework around a traditional rondavel: the plinth and
 * wall rings, the overhanging thatch eave, the radial grass lines up to the
 * apex, wall studs and the low doorway.
 */
function buildHouseLines(houses: TraditionalHouseSpec[]): THREE.BufferGeometry {
  const builder = new LineBuilder();

  houses.forEach((house) => {
    const { radius, wallHeight, roofHeight } = houseMetrics(house);
    const rotation = house.rotation ?? 0;
    const cos = Math.cos(rotation);
    const sin = Math.sin(rotation);
    const originY = house.y ?? 0;

    const toWorld = (lx: number, lz: number) => ({
      x: house.x + lx * cos + lz * sin,
      z: house.z - lx * sin + lz * cos,
    });

    const addRing = (y: number, r: number, dim: number) => {
      for (let s = 0; s < SIDES; s += 1) {
        const a = (s / SIDES) * Math.PI * 2;
        const b = ((s + 1) / SIDES) * Math.PI * 2;
        const p = toWorld(Math.cos(a) * r, Math.sin(a) * r);
        const q = toWorld(Math.cos(b) * r, Math.sin(b) * r);
        builder.add(p.x, originY + y, p.z, q.x, originY + y, q.z, LINE_INK, dim);
      }
    };

    const baseY = originY + 0.24;
    const wallTopY = originY + 0.2 + wallHeight;
    const eaveY = originY + 0.29 + wallHeight;
    const apexY = eaveY + roofHeight;

    addRing(0.24, radius * 1.05, 0.85);
    addRing(0.2 + wallHeight, radius * 0.9, 0.8);
    addRing(0.29 + wallHeight, radius * 1.3, 0.95);

    // Grass radials rising from the eave to the apex.
    for (let s = 0; s < SIDES; s += 1) {
      const a = (s / SIDES) * Math.PI * 2;
      const p = toWorld(Math.cos(a) * radius * 1.3, Math.sin(a) * radius * 1.3);
      builder.add(p.x, eaveY, p.z, house.x, apexY, house.z, LINE_INK, 0.7);
    }

    // Vertical wall studs.
    for (let s = 0; s < SIDES; s += 2) {
      const a = (s / SIDES) * Math.PI * 2;
      const p = toWorld(Math.cos(a) * radius, Math.sin(a) * radius);
      const q = toWorld(Math.cos(a) * radius * 0.9, Math.sin(a) * radius * 0.9);
      builder.add(p.x, baseY, p.z, q.x, wallTopY, q.z, LINE_INK, 0.45);
    }

    // Doorway on the local +Z face.
    if (house.door !== false) {
      const doorHeight = Math.min(wallHeight * 0.7, radius * 1.1);
      const half = radius * 0.27;
      const z = radius * 0.99;
      const left = toWorld(-half, z);
      const right = toWorld(half, z);
      const bottomY = originY + 0.2;
      const topY = bottomY + doorHeight;
      builder.add(left.x, bottomY, left.z, left.x, topY, left.z, LINE_INK, 1);
      builder.add(right.x, bottomY, right.z, right.x, topY, right.z, LINE_INK, 1);
      builder.add(left.x, topY, left.z, right.x, topY, right.z, LINE_INK, 1);
    }
  });

  return builder.build();
}

/** A round, thatched traditional house rendered as meshes plus drawn lines. */
export function TraditionalHouses({ houses }: { houses: TraditionalHouseSpec[] }) {
  const lines = useMemo(() => buildHouseLines(houses), [houses]);

  useEffect(() => () => lines.dispose(), [lines]);

  return (
    <group>
      {houses.map((house, index) => {
        const { radius, wallHeight, roofHeight } = houseMetrics(house);
        const wallMaterial = WALL_MATERIALS[house.wall ?? 'plaster'];
        const roofMaterial = ROOF_MATERIALS[house.roof ?? 'thatch'];
        const doorHeight = Math.min(wallHeight * 0.7, radius * 1.1);

        return (
          <group
            key={index}
            position={[house.x, house.y ?? 0, house.z]}
            rotation-y={house.rotation ?? 0}
          >
            <mesh
              geometry={PLINTH_GEOMETRY}
              material={PLINTH_MATERIAL}
              position={[0, 0.12, 0]}
              scale={[radius, 0.24, radius]}
              dispose={null}
            />
            <mesh
              geometry={WALL_GEOMETRY}
              material={wallMaterial}
              position={[0, 0.2 + wallHeight / 2, 0]}
              scale={[radius, wallHeight, radius]}
              dispose={null}
            />
            <mesh
              geometry={EAVE_GEOMETRY}
              material={roofMaterial}
              position={[0, 0.29 + wallHeight, 0]}
              scale={[radius, 0.18, radius]}
              dispose={null}
            />
            <mesh
              geometry={ROOF_GEOMETRY}
              material={roofMaterial}
              position={[0, 0.38 + wallHeight + roofHeight / 2, 0]}
              scale={[radius, roofHeight, radius]}
              dispose={null}
            />
            {house.door !== false && (
              <mesh
                geometry={DOOR_GEOMETRY}
                material={DOOR_MATERIAL}
                position={[0, 0.2 + doorHeight / 2, radius * 0.97]}
                scale={[radius * 0.54, doorHeight, 1]}
                dispose={null}
              />
            )}
          </group>
        );
      })}

      <lineSegments geometry={lines} renderOrder={2}>
        <lineBasicMaterial color="#141310" transparent opacity={0.72} depthWrite={false} />
      </lineSegments>
    </group>
  );
}

/**
 * A raised earthen platform that unifies a compound of rondavels and keeps them
 * clear of the rolling terrain.
 */
export function TraditionalGround({
  radius,
  top = 1.8,
  color = '#2b2119',
}: {
  radius: number;
  top?: number;
  color?: string;
}) {
  const height = top + 2.4;
  return (
    <mesh position={[0, top - height / 2, 0]}>
      <cylinderGeometry args={[radius, radius * 1.015, height, 56]} />
      <meshStandardMaterial
        color={color}
        roughness={1}
        metalness={0}
        polygonOffset
        polygonOffsetFactor={1}
        polygonOffsetUnits={1}
      />
    </mesh>
  );
}
