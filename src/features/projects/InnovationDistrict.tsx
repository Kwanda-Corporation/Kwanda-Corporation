import { RouteLine, RouteNode } from '../world/RouteLine';
import { KatishaLandmark } from './KatishaLandmark';
import { STRSLandmark } from './STRSLandmark';

type InnovationDistrictProps = {
  onSelect: (id: 'katisha' | 'strs') => void;
  reduced: boolean;
};

const KATISHA_APPROACH = { x: 26, z: -136 };
const STRS_ENTRY = { x: 107, z: 91 };

export function InnovationDistrict({ onSelect, reduced }: InnovationDistrictProps) {
  return (
    <group>
      {/* The district spine: a single drawn route between the two projects. */}
      <RouteLine
        points={[
          KATISHA_APPROACH,
          { x: 55, z: -70 },
          { x: 80, z: -22 },
          { x: 100, z: 30 },
          STRS_ENTRY,
        ]}
        color="#e87532"
        opacity={0.5}
        dash={2.2}
        gap={2.6}
      />

      <RouteNode x={55} z={-70} />
      <RouteNode x={80} z={-22} />
      <RouteNode x={100} z={30} />

      <KatishaLandmark onSelect={() => onSelect('katisha')} reduced={reduced} />
      <STRSLandmark onSelect={() => onSelect('strs')} reduced={reduced} />
    </group>
  );
}
