import { DetailLines, NodeRing, type DetailSegment } from '../architecture/Architecture';
import {
  TraditionalGround,
  TraditionalHouses,
  type TraditionalHouseSpec,
} from '../architecture/TraditionalHouse';
import { ProjectLandmark } from '../projects/ProjectLandmark';

/**
 * THE MILESTONE GALLERY — a traditional memory compound.
 *
 * A great round house holds the milestones, with a taller thatched granary
 * watching over the court and smaller houses for the collection. Drawn orange
 * lines mark the entry axis and the granary's summit.
 */
const HOUSES: TraditionalHouseSpec[] = [
  // The great gathering house.
  { x: 0, z: 0, radius: 6.2, wallHeight: 4, roofHeight: 5.6, rotation: -0.2 },
  // Collection houses.
  { x: 14, z: 7, radius: 3.4, wallHeight: 2.6, roofHeight: 3.8, rotation: 1.3, wall: 'earth' },
  { x: 12, z: -9, radius: 2.4, wallHeight: 2.1, roofHeight: 3, rotation: 0.4, wall: 'shade' },
  // A tall granary tower that gives the compound its landmark silhouette.
  { x: -14, z: -8, radius: 2.6, wallHeight: 7.5, roofHeight: 4.2, rotation: 0.7, roof: 'dark' },
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
  ...ring(23.6),

  // Entry axis and threshold.
  { a: [0, PAD + 0.1, -13.4], b: [0, PAD + 0.1, 16.6], accent: true },
  { a: [-7, PAD + 0.12, 16.6], b: [7, PAD + 0.12, 16.6], accent: true },

  // Granary plinth ring.
  ...ring(3.1, PAD + 0.1, 28).map<DetailSegment>((segment) => ({
    a: [segment.a[0] - 14, segment.a[1], segment.a[2] - 8],
    b: [segment.b[0] - 14, segment.b[1], segment.b[2] - 8],
  })),
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
      haloY={PAD + 0.02}
      hitbox={{ position: [0, 8, 0], size: [50, 22, 34] }}
    >
      <TraditionalGround radius={23.8} />
      <group position={[0, PAD, 0]}>
        <TraditionalHouses houses={HOUSES} />
      </group>
      <DetailLines segments={DETAILS} />

      <NodeRing x={0} z={16.5} y={PAD + 0.6} radius={1.5} opacity={0.7} />
      <NodeRing x={0} z={20} y={PAD + 0.35} radius={2.8} opacity={0.28} />
    </ProjectLandmark>
  );
}
