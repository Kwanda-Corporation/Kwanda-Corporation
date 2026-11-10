import { DetailLines, NodeRing, type DetailSegment } from '../architecture/Architecture';
import {
  TraditionalGround,
  TraditionalHouses,
  type TraditionalHouseSpec,
} from '../architecture/TraditionalHouse';
import { ProjectLandmark } from '../projects/ProjectLandmark';

/**
 * THE CREATIVE STUDIO — a traditional makers' compound.
 *
 * A large thatched studio and a ring of smaller work houses open onto a shared
 * court. Orange details mark the compound edge and the entrance.
 */
const HOUSES: TraditionalHouseSpec[] = [
  // Main studio house.
  { x: -2, z: -4, radius: 6.2, wallHeight: 4, roofHeight: 5.8, rotation: 0.3 },
  // Work houses.
  { x: 15, z: 6, radius: 3.4, wallHeight: 2.6, roofHeight: 3.8, rotation: 1.2, wall: 'earth' },
  { x: -15, z: 5, radius: 3, wallHeight: 2.4, roofHeight: 3.4, rotation: -0.8, wall: 'shade' },
  { x: 2, z: 9.5, radius: 2.4, wallHeight: 2, roofHeight: 3, rotation: 0.4 },
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
  ...ring(21.6),

  // Court outline.
  ...ring(10.4, PAD + 0.1, 40),

  // Threshold.
  { a: [-4, PAD + 0.12, 12.2], b: [4, PAD + 0.12, 12.2], accent: true },
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
      haloY={PAD + 0.02}
      hitbox={{ position: [0, 5.5, 0], size: [44, 16, 32] }}
    >
      <TraditionalGround radius={21.8} />
      <group position={[0, PAD, 0]}>
        <TraditionalHouses houses={HOUSES} />
      </group>
      <DetailLines segments={DETAILS} />

      <NodeRing x={0} z={14} y={PAD + 0.6} radius={1.4} opacity={0.7} />
      <NodeRing x={0} z={17.5} y={PAD + 0.35} radius={2.4} opacity={0.28} />
    </ProjectLandmark>
  );
}
