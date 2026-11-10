import { DetailLines, NodeRing, type DetailSegment } from '../architecture/Architecture';
import {
  TraditionalGround,
  TraditionalHouses,
  type TraditionalHouseSpec,
} from '../architecture/TraditionalHouse';
import { ProjectLandmark } from '../projects/ProjectLandmark';

/**
 * THE CONNECTION PLAZA — a traditional meeting compound.
 *
 * Four family houses sit at the corners of an open earth court, gathered around
 * a central meeting house. Thin orange lines drawn between the structures
 * suggest the connections that hold the ecosystem together.
 */
const HOUSES: TraditionalHouseSpec[] = [
  // Corner family houses.
  { x: -20, z: -14, radius: 4.6, wallHeight: 3, roofHeight: 4.4, rotation: 0.6 },
  { x: 20, z: -14, radius: 4.6, wallHeight: 3, roofHeight: 4.4, rotation: -0.9 },
  { x: -20, z: 14, radius: 4.4, wallHeight: 2.9, roofHeight: 4.2, rotation: 2.1, wall: 'earth' },
  { x: 20, z: 14, radius: 4.4, wallHeight: 2.9, roofHeight: 4.2, rotation: 1.4, wall: 'earth' },
  // The meeting house at the centre.
  { x: 0, z: 0, radius: 3.2, wallHeight: 2.4, roofHeight: 3.6, rotation: 0.2, wall: 'shade' },
];

const PAD = 1.8;

function ring(radius: number, y = PAD + 0.06, count = 56): DetailSegment[] {
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
  // Plaza perimeter.
  ...ring(30.4),

  // Connection lines from the centre to each house.
  { a: [0, PAD + 0.1, 0], b: [-20, PAD + 0.1, -14], accent: true },
  { a: [0, PAD + 0.1, 0], b: [20, PAD + 0.1, -14], accent: true },
  { a: [0, PAD + 0.1, 0], b: [-20, PAD + 0.1, 14], accent: true },
  { a: [0, PAD + 0.1, 0], b: [20, PAD + 0.1, 14], accent: true },

  // Entry threshold.
  { a: [-5, PAD + 0.12, -18], b: [5, PAD + 0.12, -18], accent: true },
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
      haloY={PAD + 0.02}
      hitbox={{ position: [0, 5, 0], size: [62, 14, 50] }}
    >
      <TraditionalGround radius={30.6} />
      <group position={[0, PAD, 0]}>
        <TraditionalHouses houses={HOUSES} />
      </group>
      <DetailLines segments={DETAILS} />

      <NodeRing x={0} z={0} y={PAD + 0.5} radius={7} opacity={0.55} />
      <NodeRing x={-20} z={-14} y={PAD + 0.35} radius={1.6} opacity={0.4} />
      <NodeRing x={20} z={-14} y={PAD + 0.35} radius={1.6} opacity={0.4} />
      <NodeRing x={-20} z={14} y={PAD + 0.35} radius={1.6} opacity={0.4} />
      <NodeRing x={20} z={14} y={PAD + 0.35} radius={1.6} opacity={0.4} />
    </ProjectLandmark>
  );
}
