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
 * THE MILESTONE GALLERY — a contemporary art & technology museum.
 *
 * A wide white exhibition hall under a floating canopy, a tall gallery tower,
 * and a glass datum band over the threshold. Black hairlines draw the volumes;
 * orange marks the entrance axis and the tower's summit.
 */
const VOLUMES: ArchitectureVolume[] = [
  // Plinth and steps.
  { x: 0, y: -2, z: 0, w: 46, h: 4, d: 28, tone: 'shade' },
  { x: 0, y: 0.6, z: 0, w: 44, h: 1.2, d: 26, tone: 'white' },
  // Main exhibition hall.
  { x: 0, y: 4.6, z: -2, w: 36, h: 8.4, d: 20, tone: 'white' },
  // East gallery wing.
  { x: 18, y: 3.6, z: 6, w: 10, h: 6, d: 12, tone: 'white' },
  // Gallery tower.
  { x: -14, y: 8, z: -8, w: 7, h: 22, d: 7, tone: 'white' },
  // Floating canopy over the approach.
  { x: 0, y: 12.6, z: 8, w: 30, h: 0.6, d: 9, tone: 'white' },
  // Canopy colonnade.
  { x: -11, y: 7.2, z: 8, w: 0.4, h: 11, d: 0.4, tone: 'white' },
  { x: 11, y: 7.2, z: 8, w: 0.4, h: 11, d: 0.4, tone: 'white' },
  // Glazed datum band over the threshold.
  { x: 0, y: 7.6, z: 8.2, w: 20, h: 2.6, d: 0.2, tone: 'ink' },
];

const ACCENTS: ArchitectureVolume[] = [
  { x: 0, y: 13.0, z: 8, w: 30, h: 0.14, d: 0.14 },
  { x: -14, y: 19.6, z: -8, w: 7.1, h: 0.14, d: 0.14 },
  { x: 0, y: 1.3, z: 13.2, w: 16, h: 0.1, d: 0.16 },
];

const DETAILS: DetailSegment[] = [
  // Plinth outline.
  { a: [-22, 1.25, -13.1], b: [22, 1.25, -13.1] },
  { a: [-22, 1.25, 13.1], b: [22, 1.25, 13.1] },
  { a: [-22, 1.25, -13.1], b: [-22, 1.25, 13.1] },
  { a: [22, 1.25, -13.1], b: [22, 1.25, 13.1] },
  // Canopy outline.
  { a: [-15, 12.95, 3.5], b: [15, 12.95, 3.5] },
  { a: [-15, 12.95, 12.5], b: [15, 12.95, 12.5] },
  // Threshold axis.
  { a: [0, 1.25, -12.9], b: [0, 1.25, 13.2], accent: true },
];

export function MilestoneGallery({
  onSelect,
  reduced,
}: {
  onSelect: () => void;
  reduced: boolean;
}) {
  return (
    <ProjectLandmark
      id="achievements"
      onSelect={onSelect}
      reduced={reduced}
      haloRadius={30}
      hitbox={{ position: [0, 11, 0], size: [50, 28, 32] }}
    >
      <Volumes volumes={VOLUMES} />
      <VolumeEdges volumes={VOLUMES} />
      <Accents volumes={ACCENTS} />
      <DetailLines segments={DETAILS} />

      <NodeRing x={0} z={16.5} y={1.1} radius={1.5} opacity={0.7} />
      <NodeRing x={0} z={20} y={0.5} radius={2.8} opacity={0.28} />
    </ProjectLandmark>
  );
}
