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
 * THE CONNECTION PLAZA — an open architectural plaza of collaboration.
 *
 * A broad white plinth ringed by four low pavilions, a central installation,
 * and thin orange lines drawn between the structures to suggest the
 * connections that hold the ecosystem together.
 */
const VOLUMES: ArchitectureVolume[] = [
  // Broad plaza plinth.
  { x: 0, y: -1.4, z: 0, w: 58, h: 2.6, d: 44, tone: 'shade' },
  { x: 0, y: 0.2, z: 0, w: 56, h: 0.6, d: 42, tone: 'white' },
  // Four perimeter pavilions.
  { x: -20, y: 2.4, z: -14, w: 12, h: 4.6, d: 10, tone: 'white' },
  { x: 20, y: 2.4, z: -14, w: 12, h: 4.6, d: 10, tone: 'white' },
  { x: -20, y: 2.4, z: 14, w: 12, h: 4.6, d: 10, tone: 'white' },
  { x: 20, y: 2.4, z: 14, w: 12, h: 4.6, d: 10, tone: 'white' },
  // Central collaboration installation.
  { x: 0, y: 4, z: 0, w: 4, h: 12, d: 4, tone: 'white' },
  { x: 0, y: 12.4, z: 0, w: 14, h: 0.5, d: 14, tone: 'white' },
  // Two entry markers.
  { x: -4, y: 1.6, z: -18, w: 1.6, h: 3.4, d: 1.6, tone: 'white' },
  { x: 4, y: 1.6, z: -18, w: 1.6, h: 3.4, d: 1.6, tone: 'white' },
];

const ACCENTS: ArchitectureVolume[] = [
  { x: 0, y: 12.8, z: 0, w: 14, h: 0.12, d: 0.12 },
  { x: -20, y: 4.9, z: -14, w: 12.1, h: 0.1, d: 0.1 },
  { x: 20, y: 4.9, z: -14, w: 12.1, h: 0.1, d: 0.1 },
  { x: -20, y: 4.9, z: 14, w: 12.1, h: 0.1, d: 0.1 },
  { x: 20, y: 4.9, z: 14, w: 12.1, h: 0.1, d: 0.1 },
];

const DETAILS: DetailSegment[] = [
  // Plaza outline.
  { a: [-28, 0.55, -21], b: [28, 0.55, -21] },
  { a: [-28, 0.55, 21], b: [28, 0.55, 21] },
  { a: [-28, 0.55, -21], b: [-28, 0.55, 21] },
  { a: [28, 0.55, -21], b: [28, 0.55, 21] },
  // Connection lines from the centre to each pavilion.
  { a: [0, 0.6, 0], b: [-20, 0.6, -14], accent: true },
  { a: [0, 0.6, 0], b: [20, 0.6, -14], accent: true },
  { a: [0, 0.6, 0], b: [-20, 0.6, 14], accent: true },
  { a: [0, 0.6, 0], b: [20, 0.6, 14], accent: true },
];

export function ConnectionPlaza({
  onSelect,
  reduced,
}: {
  onSelect: () => void;
  reduced: boolean;
}) {
  return (
    <ProjectLandmark
      id="partners"
      onSelect={onSelect}
      reduced={reduced}
      haloRadius={34}
      hitbox={{ position: [0, 6, 0], size: [62, 16, 48] }}
    >
      <Volumes volumes={VOLUMES} />
      <VolumeEdges volumes={VOLUMES} />
      <Accents volumes={ACCENTS} />
      <DetailLines segments={DETAILS} />

      <NodeRing x={0} z={0} y={0.7} radius={7} opacity={0.55} />
      <NodeRing x={-20} z={-14} y={0.5} radius={1.6} opacity={0.4} />
      <NodeRing x={20} z={-14} y={0.5} radius={1.6} opacity={0.4} />
      <NodeRing x={-20} z={14} y={0.5} radius={1.6} opacity={0.4} />
      <NodeRing x={20} z={14} y={0.5} radius={1.6} opacity={0.4} />
    </ProjectLandmark>
  );
}
