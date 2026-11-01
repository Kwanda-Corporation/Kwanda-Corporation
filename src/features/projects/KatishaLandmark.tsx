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
 * KATISHA — a contemporary transport terminal.
 *
 * Reading the building from the approach: a low deck, a colonnade holding a
 * long drop-off canopy, a glazed hall under a butterfly roof, and a slender
 * control tower marked in orange. The K monogram is drawn as linework on the
 * tower rather than applied as a texture, keeping the whole district light.
 */
const VOLUMES: ArchitectureVolume[] = [
  // Site deck and approach.
  { x: 0, y: -2.2, z: 0, w: 34, h: 5.2, d: 24, tone: 'shade' },
  { x: 0, y: 0.4, z: 0, w: 33, h: 0.8, d: 21, tone: 'white' },
  { x: 0, y: -1.2, z: 12.8, w: 11, h: 4.4, d: 5, tone: 'shade' },
  { x: 0, y: -0.2, z: 15.6, w: 13, h: 1.6, d: 2.4, tone: 'white' },

  // Main hall with a black glazed band.
  { x: 0, y: 4.2, z: -2, w: 25, h: 6.8, d: 12, tone: 'white' },
  { x: -5.5, y: 5, z: 4.06, w: 10, h: 2.2, d: 0.16, tone: 'ink' },
  { x: 6, y: 2.9, z: 4.06, w: 6.5, h: 3.4, d: 0.16, tone: 'ink' },

  // Butterfly roof: two plates dipping into a central valley.
  { x: -6.4, y: 8.5, z: -2, w: 12.8, h: 0.32, d: 13, rz: -0.1, tone: 'white' },
  { x: 6.4, y: 8.5, z: -2, w: 12.8, h: 0.32, d: 13, rz: 0.1, tone: 'white' },
  { x: 0, y: 7.98, z: -2, w: 0.3, h: 0.5, d: 13, tone: 'white' },

  // Drop-off canopy and its colonnade.
  { x: 0, y: 7, z: 7.2, w: 27, h: 0.34, d: 6.5, tone: 'white' },
  { x: -10, y: 3.7, z: 6.5, w: 0.3, h: 6.4, d: 0.3, tone: 'white' },
  { x: -5, y: 3.7, z: 6.5, w: 0.3, h: 6.4, d: 0.3, tone: 'white' },
  { x: 0, y: 3.7, z: 6.5, w: 0.3, h: 6.4, d: 0.3, tone: 'white' },
  { x: 5, y: 3.7, z: 6.5, w: 0.3, h: 6.4, d: 0.3, tone: 'white' },
  { x: 10, y: 3.7, z: 6.5, w: 0.3, h: 6.4, d: 0.3, tone: 'white' },

  // Ticket kiosk under the canopy.
  { x: -8.2, y: 2.1, z: 8.6, w: 4.2, h: 2.6, d: 3, tone: 'white' },
  { x: -8.2, y: 2.2, z: 10.12, w: 3.1, h: 1.1, d: 0.12, tone: 'ink' },

  // Control tower and sign arm.
  { x: 13.4, y: 7.6, z: -7, w: 2.6, h: 15.2, d: 2.6, tone: 'white' },
  { x: 7.4, y: 14.2, z: -7, w: 12.2, h: 0.36, d: 0.5, tone: 'white' },
  { x: 1.2, y: 13.8, z: -7, w: 0.36, h: 1.2, d: 0.5, tone: 'ink' },

  // Western flag mast.
  { x: -13.6, y: 5.6, z: -7, w: 0.36, h: 10.4, d: 0.36, tone: 'white' },
];

const ACCENTS: ArchitectureVolume[] = [
  { x: 13.4, y: 8.4, z: -5.62, w: 0.42, h: 9.2, d: 0.14 },
  { x: 0, y: 7.18, z: 10.42, w: 27, h: 0.14, d: 0.14 },
  { x: 0, y: 0.9, z: 12.2, w: 30, h: 0.08, d: 0.18 },
  { x: 0, y: 13.98, z: -6.72, w: 11.4, h: 0.14, d: 0.14 },
  { x: -13.6, y: 10.9, z: -7, w: 0.5, h: 0.5, d: 0.5 },
];

const DETAILS: DetailSegment[] = [
  // Deck edges.
  { a: [-16.4, 0.86, -10.4], b: [16.4, 0.86, -10.4] },
  { a: [-16.4, 0.86, 10.4], b: [16.4, 0.86, 10.4] },
  { a: [-16.4, 0.86, -10.4], b: [-16.4, 0.86, 10.4] },
  { a: [16.4, 0.86, -10.4], b: [16.4, 0.86, 10.4] },

  // Hall outline on the deck.
  { a: [-12.5, 0.9, -8], b: [12.5, 0.9, -8] },
  { a: [-12.5, 0.9, 4], b: [12.5, 0.9, 4] },
  { a: [-12.5, 0.9, -8], b: [-12.5, 0.9, 4] },
  { a: [12.5, 0.9, -8], b: [12.5, 0.9, 4] },

  // Canopy outline.
  { a: [-13.5, 7.19, 3.95], b: [13.5, 7.19, 3.95] },
  { a: [-13.5, 7.19, 10.45], b: [13.5, 7.19, 10.45] },
  { a: [-13.5, 7.19, 3.95], b: [-13.5, 7.19, 10.45] },
  { a: [13.5, 7.19, 3.95], b: [13.5, 7.19, 10.45] },

  // Bus-bay markings.
  ...[0, 1, 2, 3, 4, 5, 6, 7, 8].map<DetailSegment>((i) => ({
    a: [-14 + i * 3.4, 0.95, 11.2],
    b: [-11.2 + i * 3.4, 0.95, 11.2],
  })),

  // K monogram on the tower face.
  { a: [12.75, 10.1, -5.62], b: [12.75, 13.1, -5.62], accent: true },
  { a: [12.75, 11.6, -5.62], b: [14.15, 13.1, -5.62], accent: true },
  { a: [12.75, 11.6, -5.62], b: [14.15, 10.1, -5.62], accent: true },

  // Threshold line at the foot of the approach.
  { a: [-6.5, 0.72, 16.8], b: [6.5, 0.72, 16.8], accent: true },
];

export function KatishaLandmark({
  onSelect,
  reduced,
}: {
  onSelect: () => void;
  reduced: boolean;
}) {
  return (
    <ProjectLandmark
      id="katisha"
      onSelect={onSelect}
      reduced={reduced}
      rotation={-0.3}
      haloRadius={22}
      hitbox={{ position: [0, 7.5, 0], size: [36, 22, 32] }}
    >
      <Volumes volumes={VOLUMES} />
      <VolumeEdges volumes={VOLUMES} />
      <Accents volumes={ACCENTS} />
      <DetailLines segments={DETAILS} />

      <NodeRing x={0} z={14.2} y={0.75} radius={1.4} opacity={0.7} />
      <NodeRing x={0} z={19} y={0.4} radius={2.4} opacity={0.28} />
      <NodeRing x={-13.6} z={-7} y={0.6} radius={1.1} opacity={0.4} />
    </ProjectLandmark>
  );
}
