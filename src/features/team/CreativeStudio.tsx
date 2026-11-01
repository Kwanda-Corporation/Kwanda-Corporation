import {
  Accents,
  DetailLines,
  NodeRing,
  VolumeEdges,
  Volumes,
  type ArchitectureVolume,
  type DetailSegment,
} from '../architecture/Architecture';
import { ProjectLandmark } from '../projects/ProjectLandmark';

/**
 * THE CREATIVE STUDIO — a minimalist creative technology studio.
 *
 * White walls and open volumes, a wide glazed front that reads as a large
 * window, and orange details marking the studio's edge and entrance.
 */
const VOLUMES: ArchitectureVolume[] = [
  // Site plinth.
  { x: 0, y: -1.6, z: 0, w: 40, h: 3.2, d: 26, tone: 'shade' },
  { x: 0, y: 0.3, z: 0, w: 38, h: 0.8, d: 24, tone: 'white' },
  // Main studio block.
  { x: 0, y: 4, z: -4, w: 32, h: 7.6, d: 16, tone: 'white' },
  // Wide glazed front.
  { x: 0, y: 4.6, z: 4.2, w: 24, h: 6.4, d: 0.2, tone: 'ink' },
  // Side studio wing.
  { x: 17, y: 3.4, z: 6, w: 7, h: 5.6, d: 10, tone: 'white' },
  // Rooftop volume.
  { x: -8, y: 9.6, z: -4, w: 14, h: 3, d: 10, tone: 'white' },
  // Entrance canopy.
  { x: 0, y: 8.4, z: 10, w: 12, h: 0.4, d: 5, tone: 'white' },
];

const ACCENTS: ArchitectureVolume[] = [
  { x: 0, y: 8.7, z: 10, w: 12, h: 0.12, d: 0.12 },
  { x: -8, y: 11.2, z: -4, w: 14, h: 0.1, d: 0.1 },
  { x: 0, y: 1.0, z: 12.1, w: 8, h: 0.1, d: 0.16 },
];

const DETAILS: DetailSegment[] = [
  // Plinth outline.
  { a: [-19, 0.75, -12.1], b: [19, 0.75, -12.1] },
  { a: [-19, 0.75, 12.1], b: [19, 0.75, 12.1] },
  { a: [-19, 0.75, -12.1], b: [-19, 0.75, 12.1] },
  { a: [19, 0.75, -12.1], b: [19, 0.75, 12.1] },
  // Glazed front outline.
  { a: [-12, 1.0, 4.2], b: [12, 1.0, 4.2] },
  // Threshold.
  { a: [-4, 1.0, 12.2], b: [4, 1.0, 12.2], accent: true },
];

export function CreativeStudio({
  onSelect,
  reduced,
}: {
  onSelect: () => void;
  reduced: boolean;
}) {
  return (
    <ProjectLandmark
      id="team"
      onSelect={onSelect}
      reduced={reduced}
      haloRadius={26}
      hitbox={{ position: [0, 7, 0], size: [44, 20, 30] }}
    >
      <Volumes volumes={VOLUMES} />
      <VolumeEdges volumes={VOLUMES} />
      <Accents volumes={ACCENTS} />
      <DetailLines segments={DETAILS} />

      <NodeRing x={0} z={14} y={0.8} radius={1.4} opacity={0.7} />
      <NodeRing x={0} z={17.5} y={0.4} radius={2.4} opacity={0.28} />
    </ProjectLandmark>
  );
}
