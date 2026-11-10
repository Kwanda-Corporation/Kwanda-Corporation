import { DetailLines, NodeRing, type DetailSegment } from '../architecture/Architecture';
import {
  TraditionalGround,
  TraditionalHouses,
  type TraditionalHouseSpec,
} from '../architecture/TraditionalHouse';
import { ProjectLandmark } from './ProjectLandmark';

/**
 * KATISHA — a traditional East African travel compound.
 *
 * A great thatched rondavel gathers the compound, ringed by smaller houses for
 * ticketing, waiting and the station kiosk. Drawn orange lines mark the entry
 * threshold and the bus bays on the earth, so the transport story stays legible
 * without any of the modern architecture that used to stand here.
 */
const HOUSES: TraditionalHouseSpec[] = [
  // The great hall at the heart of the compound.
  { x: 0, z: -2, radius: 7.4, wallHeight: 4.2, roofHeight: 6.4, rotation: 0.2 },
  // Ticketing and waiting houses flanking the court.
  { x: -11, z: 4.5, radius: 3.6, wallHeight: 2.8, roofHeight: 3.8, rotation: 0.8, wall: 'earth' },
  { x: 11, z: 4.2, radius: 3.4, wallHeight: 2.6, roofHeight: 3.6, rotation: -0.4 },
  { x: -8.5, z: -11, radius: 2.8, wallHeight: 2.2, roofHeight: 3.1, rotation: 1.4, wall: 'shade' },
  { x: 9, z: -11, radius: 2.6, wallHeight: 2.1, roofHeight: 3, rotation: 2.1, wall: 'earth' },
  // The station kiosk facing the approach.
  { x: -2.5, z: 12.5, radius: 2.6, wallHeight: 2.4, roofHeight: 3.2, rotation: 0.1 },
];

const PAD = 1.8;

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
  // Compound perimeter.
  ...ring(17.4),

  // Bus-bay markings on the approach apron.
  ...[0, 1, 2, 3, 4, 5, 6, 7, 8].map<DetailSegment>((i) => ({
    a: [-14 + i * 3.4, PAD + 0.08, 14.4],
    b: [-11.2 + i * 3.4, PAD + 0.08, 14.4],
  })),

  // Threshold and entry axis at the foot of the approach.
  { a: [-6.5, PAD + 0.1, 16.8], b: [6.5, PAD + 0.1, 16.8], accent: true },
  { a: [0, PAD + 0.1, 13.2], b: [0, PAD + 0.1, 16.8], accent: true },
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
      haloY={PAD + 0.02}
      hitbox={{ position: [0, 5.5, 0], size: [38, 15, 36] }}
    >
      <TraditionalGround radius={17.6} />
      <group position={[0, PAD, 0]}>
        <TraditionalHouses houses={HOUSES} />
      </group>
      <DetailLines segments={DETAILS} />

      <NodeRing x={0} z={14.2} y={PAD + 0.75} radius={1.4} opacity={0.7} />
      <NodeRing x={0} z={19} y={PAD + 0.4} radius={2.4} opacity={0.28} />
      <NodeRing x={-13.6} z={-7} y={PAD + 0.6} radius={1.1} opacity={0.4} />
    </ProjectLandmark>
  );
}
