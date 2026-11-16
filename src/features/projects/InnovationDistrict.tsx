import { RouteLine, RouteNode } from '../world/RouteLine';
import { KatishaLandmark } from './KatishaLandmark';
import { GerayoLandmark } from './GerayoLandmark';

type InnovationDistrictProps = {
  onSelect: (id: 'katisha' | 'gerayo') => void;
  reduced: boolean;
};

const KATISHA_APPROACH = { x: 26, z: -136 };
const GERAYO_ENTRY = { x: 107, z: 91 };

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
          GERAYO_ENTRY,
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
      <GerayoLandmark onSelect={() => onSelect('gerayo')} reduced={reduced} />
    </group>
  );
}
