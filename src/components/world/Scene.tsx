import { type MutableRefObject } from 'react';
import * as THREE from 'three';
import type { LandmarkId } from '../../lib/landmarks';
import { OriginHouse } from '../../features/about/OriginHouse';
import { MilestoneGallery } from '../../features/achievements/MilestoneGallery';
import { InnovationDistrict } from '../../features/projects/InnovationDistrict';
import { ConnectionPlaza } from '../../features/partners/ConnectionPlaza';
import { CreativeStudio } from '../../features/team/CreativeStudio';
import { CameraController, type NavigationApi } from './CameraController';
import { FrameScheduler } from './FrameScheduler';
import { Dust } from './Dust';
import { Flora } from './Flora';
import { Mountains } from './Mountains';
import { Settlement } from './Settlement';
import { Terrain } from './Terrain';
import { Road } from './Road';
import { JourneySigns } from './JourneySigns';

type SceneProps = {
  terrainRef: MutableRefObject<THREE.Mesh | null>;
  apiRef: MutableRefObject<NavigationApi | null>;
  reduced: boolean;
  lowPower: boolean;
  onSelectLandmark: (id: LandmarkId) => void;
  onStartJourney: () => void;
  activeSignKey: string;
  /** True while a destination page covers the landscape. */
  paused: boolean;
};

export function Scene({
  terrainRef,
  apiRef,
  reduced,
  lowPower,
  onSelectLandmark,
  onStartJourney,
  activeSignKey,
  paused,
}: SceneProps) {
  return (
    <>
      <fogExp2 attach="fog" args={['#0d0c0a', 0.0021]} />
      <ambientLight intensity={1.7} color="#eef1f5" />
      <directionalLight position={[90, 150, 70]} intensity={1.9} color="#fff6ea" />
      <directionalLight position={[-80, 40, -70]} intensity={0.55} color="#dbe5f2" />
      <Terrain ref={terrainRef} segments={lowPower ? 128 : 190} />
      <Mountains />
      <Road />
      <Flora />
      <Settlement reduced={reduced} />
      <OriginHouse onSelect={() => onSelectLandmark('about')} reduced={reduced} />
      <InnovationDistrict
        onSelect={onSelectLandmark}
        reduced={reduced}
      />
      <MilestoneGallery onSelect={() => onSelectLandmark('achievements')} reduced={reduced} />
      <ConnectionPlaza onSelect={() => onSelectLandmark('partners')} reduced={reduced} />
      <CreativeStudio onSelect={() => onSelectLandmark('team')} reduced={reduced} />
      <JourneySigns onSelect={onSelectLandmark} onStart={onStartJourney} activeKey={activeSignKey} />
      <Dust reduced={reduced} />
      <CameraController terrainRef={terrainRef} apiRef={apiRef} reduced={reduced} />
      <FrameScheduler
        activeFps={lowPower ? 30 : 60}
        idleFps={lowPower ? 20 : 30}
        paused={paused}
      />
    </>
  );
}
