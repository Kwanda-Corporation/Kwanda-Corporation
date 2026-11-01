import type { LandmarkId } from '../../lib/landmarks';
import { JOURNEY_STOPS } from '../../lib/journey';
import { RoadSign } from './RoadSign';

type JourneySignsProps = {
  onSelect: (id: LandmarkId) => void;
  onStart: () => void;
  /** Key of the only sign currently shown, so the road reveals one stop at a time. */
  activeKey: string;
};

/** All of the road signs, planted in order along the road. */
export function JourneySigns({ onSelect, onStart, activeKey }: JourneySignsProps) {
  return (
    <group>
      {JOURNEY_STOPS.map((stop) => (
        <RoadSign
          key={stop.key}
          t={stop.t}
          label={stop.label}
          kicker={stop.kicker}
          destination={stop.destination}
          visible={stop.key === activeKey}
          onSelect={onSelect}
          onStart={stop.kind === 'start' ? onStart : undefined}
        />
      ))}
    </group>
  );
}
