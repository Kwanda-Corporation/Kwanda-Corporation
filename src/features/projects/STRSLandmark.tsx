import { DetailLines, NodeRing, type DetailSegment } from '../architecture/Architecture';
import {
  TraditionalGround,
  TraditionalHouses,
  type TraditionalHouseSpec,
} from '../architecture/TraditionalHouse';
import { ProjectLandmark } from './ProjectLandmark';

/**
 * STRS — a traditional learning compound.
 *
 * Class rondavels frame a central courtyard whose earth carries a drawn routing
 * network: a hub, a set of stops, and the journeys between them. The route
 * network is the story — coordination made visible in a village setting.
 */
const HOUSES: TraditionalHouseSpec[] = [
  // Classroom houses around the open courtyard.
  { x: 0, z: -8, radius: 4.8, wallHeight: 3.2, roofHeight: 4.8, rotation: 0.3 },
  { x: -11, z: 0, radius: 3.6, wallHeight: 2.6, roofHeight: 3.8, rotation: 1.1, wall: 'earth' },
  { x: 11, z: 0, radius: 3.6, wallHeight: 2.6, roofHeight: 3.8, rotation: -0.7 },
  { x: 0, z: 13, radius: 3.2, wallHeight: 2.5, roofHeight: 3.6, rotation: 0.6 },
  { x: 12.5, z: -9, radius: 2.4, wallHeight: 2.1, roofHeight: 3, rotation: 1.9, wall: 'shade' },
  { x: -12.5, z: -9, radius: 2.2, wallHeight: 2, roofHeight: 2.8, rotation: 0.5, wall: 'earth' },
];

const PAD = 1.8;

const ROUTE_HUB: [number, number] = [0, 1.5];
const ROUTE_NODES: Array<[number, number]> = [
  [-7, 4.5],
  [0, 8],
  [7, 4.5],
  [4.5, -3],
  [0, -4.5],
  [-4.5, -3],
];

const ROUTE_LINES: DetailSegment[] = [
  ...ROUTE_NODES.map<DetailSegment>(([x, z]) => ({
    a: [ROUTE_HUB[0], PAD + 0.12, ROUTE_HUB[1]],
    b: [x, PAD + 0.12, z],
    accent: true,
  })),
  ...ROUTE_NODES.map(([x, z], i) => {
    const next = ROUTE_NODES[(i + 1) % ROUTE_NODES.length];
    return {
      a: [x, PAD + 0.12, z] as [number, number, number],
      b: [next[0], PAD + 0.12, next[1]] as [number, number, number],
      accent: true,
    };
  }),
];

function ring(radius: number, y = PAD + 0.06, count = 48): DetailSegment[] {
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
  ...ring(17.4),

  // Entry threshold.
  { a: [-6, PAD + 0.1, 16.4], b: [6, PAD + 0.1, 16.4], accent: true },

  ...ROUTE_LINES,
];

export function STRSLandmark({
  onSelect,
  reduced,
}: {
  onSelect: () => void;
  reduced: boolean;
}) {
  return (
    <ProjectLandmark
      id="strs"
      onSelect={onSelect}
      reduced={reduced}
      rotation={4.1}
      haloRadius={22}
      haloY={PAD + 0.02}
      hitbox={{ position: [0, 5.5, 0], size: [36, 15, 34] }}
    >
      <TraditionalGround radius={17.6} />
      <group position={[0, PAD, 0]}>
        <TraditionalHouses houses={HOUSES} />
      </group>
      <DetailLines segments={DETAILS} />

      <NodeRing x={ROUTE_HUB[0]} z={ROUTE_HUB[1]} y={PAD + 0.12} radius={1.2} opacity={0.85} />
      {ROUTE_NODES.map(([x, z], i) => (
        <NodeRing key={i} x={x} z={z} y={PAD + 0.12} radius={0.7} opacity={0.6} />
      ))}
      <NodeRing x={0} z={16} y={PAD + 0.4} radius={2.4} opacity={0.28} />
    </ProjectLandmark>
  );
}
