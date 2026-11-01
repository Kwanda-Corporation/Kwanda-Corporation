import {
  Accents,
  DetailLines,
  NodeRing,
  VolumeEdges,
  Volumes,
  type ArchitectureVolume,
  type DetailSegment,
} from '../architecture/Architecture';
import { ProjectLandmark } from './ProjectLandmark';

/**
 * STRS — an education and routing campus.
 *
 * Four white bars frame a sunken courtyard whose floor carries a drawn routing
 * network: a hub, a set of stops, and the journeys between them. A slender
 * tower with an orange beacon watches over the whole, and a folded canopy marks
 * the entry. The route network is the story — coordination made visible.
 */
const VOLUMES: ArchitectureVolume[] = [
  // Site deck.
  { x: 0, y: -2.2, z: 0, w: 34, h: 5.2, d: 26, tone: 'shade' },
  { x: 0, y: 0.4, z: 0, w: 32, h: 0.8, d: 23, tone: 'white' },
  { x: 0, y: -0.3, z: 1, w: 15, h: 0.3, d: 11, tone: 'shade' },

  // Classroom bars around the courtyard.
  { x: 0, y: 4.4, z: -8, w: 28, h: 7, d: 6.5, tone: 'white' },
  { x: -10, y: 3.8, z: 1, w: 6, h: 5.6, d: 14, tone: 'white' },
  { x: 10, y: 3.8, z: 1, w: 6, h: 5.6, d: 14, tone: 'white' },
  { x: 0, y: 2.8, z: 9.5, w: 16, h: 4.6, d: 5, tone: 'white' },

  // Glazed bands.
  { x: -10, y: 4.2, z: 7.96, w: 6.1, h: 2, d: 0.12, tone: 'ink' },
  { x: 10, y: 4.2, z: -5.96, w: 6.1, h: 2, d: 0.12, tone: 'ink' },
  { x: 0, y: 3.2, z: 12.04, w: 12, h: 1.6, d: 0.12, tone: 'ink' },

  // Covered walkways crossing the courtyard.
  { x: 0, y: 5.2, z: 1, w: 10, h: 0.22, d: 16, tone: 'white' },
  { x: 0, y: 5.32, z: 1, w: 15, h: 0.22, d: 8, tone: 'white' },
  { x: -4.5, y: 3.1, z: 1, w: 0.24, h: 4.2, d: 0.24, tone: 'white' },
  { x: 4.5, y: 3.1, z: 1, w: 0.24, h: 4.2, d: 0.24, tone: 'white' },

  // Folded entry canopy.
  { x: -4.6, y: 3.4, z: 12.6, w: 9.2, h: 0.24, d: 4.2, rz: -0.09, tone: 'white' },
  { x: 4.6, y: 3.4, z: 12.6, w: 9.2, h: 0.24, d: 4.2, rz: 0.09, tone: 'white' },
  { x: 0, y: 4.9, z: 12.6, w: 0.24, h: 1.4, d: 0.24, tone: 'white' },
  { x: -2.6, y: 3.3, z: 14.6, w: 0.3, h: 6.4, d: 0.3, tone: 'white' },
  { x: 2.6, y: 3.3, z: 14.6, w: 0.3, h: 6.4, d: 0.3, tone: 'white' },

  // Bus shelter on the east edge.
  { x: 9.5, y: 2.4, z: 12.6, w: 6, h: 3, d: 2.4, tone: 'white' },
  { x: 9.5, y: 4.2, z: 12.6, w: 7, h: 0.2, d: 3, tone: 'white' },
  { x: 6.4, y: 2.7, z: 13.4, w: 0.24, h: 3, d: 0.24, tone: 'white' },
  { x: 12.6, y: 2.7, z: 13.4, w: 0.24, h: 3, d: 0.24, tone: 'white' },

  // Observation tower.
  { x: 13.6, y: 9, z: -9, w: 3, h: 18, d: 3, tone: 'white' },
  { x: 13.6, y: 6.6, z: -7.44, w: 1.8, h: 3.2, d: 0.12, tone: 'ink' },
];

const ACCENTS: ArchitectureVolume[] = [
  { x: 13.6, y: 18.2, z: -9, w: 0.7, h: 0.7, d: 0.7 },
  { x: 13.6, y: 9.6, z: -7.44, w: 0.4, h: 10, d: 0.12 },
  { x: 0, y: 1.06, z: 12.2, w: 12, h: 0.08, d: 0.16 },
  { x: 0, y: 3.54, z: 14.7, w: 9.2, h: 0.1, d: 0.1 },
];

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
    a: [ROUTE_HUB[0], 1.02, ROUTE_HUB[1]],
    b: [x, 1.02, z],
    accent: true,
  })),
  ...ROUTE_NODES.map<DetailSegment>(([x, z], i) => {
    const next = ROUTE_NODES[(i + 1) % ROUTE_NODES.length];
    return { a: [x, 1.02, z], b: [next[0], 1.02, next[1]], accent: true };
  }),
];

const DETAILS: DetailSegment[] = [
  // Deck edges.
  { a: [-16, 0.86, -11.5], b: [16, 0.86, -11.5] },
  { a: [-16, 0.86, 11.5], b: [16, 0.86, 11.5] },
  { a: [-16, 0.86, -11.5], b: [-16, 0.86, 11.5] },
  { a: [16, 0.86, -11.5], b: [16, 0.86, 11.5] },

  // Building outlines.
  { a: [-14, 0.9, -11.2], b: [14, 0.9, -11.2] },
  { a: [-13, 0.9, 5.75], b: [-7, 0.9, 5.75] },
  { a: [7, 0.9, 5.75], b: [13, 0.9, 5.75] },
  { a: [-8, 0.9, 12], b: [8, 0.9, 12] },
  { a: [-13, 0.9, -3.75], b: [-13, 0.9, 5.75] },
  { a: [-7, 0.9, -3.75], b: [-7, 0.9, 5.75] },
  { a: [7, 0.9, -3.75], b: [7, 0.9, 5.75] },
  { a: [13, 0.9, -3.75], b: [13, 0.9, 5.75] },

  // Entry threshold.
  { a: [-6, 0.72, 15.9], b: [6, 0.72, 15.9], accent: true },

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
      hitbox={{ position: [0, 7.5, 0], size: [36, 24, 32] }}
    >
      <Volumes volumes={VOLUMES} />
      <VolumeEdges volumes={VOLUMES} />
      <Accents volumes={ACCENTS} />
      <DetailLines segments={DETAILS} />

      <NodeRing x={ROUTE_HUB[0]} z={ROUTE_HUB[1]} y={1.02} radius={1.2} opacity={0.85} />
      {ROUTE_NODES.map(([x, z], i) => (
        <NodeRing key={i} x={x} z={z} y={1.02} radius={0.7} opacity={0.6} />
      ))}
      <NodeRing x={0} z={16} y={0.42} radius={2.4} opacity={0.28} />
    </ProjectLandmark>
  );
}
