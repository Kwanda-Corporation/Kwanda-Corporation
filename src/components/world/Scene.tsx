import { useEffect, type MutableRefObject } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { LandmarkId } from '../../lib/landmarks';
import { OriginHouse } from '../../features/about/OriginHouse';
import { MilestoneGallery } from '../../features/achievements/MilestoneGallery';
import { InnovationDistrict } from '../../features/projects/InnovationDistrict';
import { ConnectionPlaza } from '../../features/partners/ConnectionPlaza';
import { CreativeStudio } from '../../features/team/CreativeStudio';
import { CameraController, type NavigationApi } from './CameraController';
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
};

function AdaptiveQuality() {
  const { gl } = useThree();

  useEffect(() => {
    let frames = 0;
    let last = performance.now();
    let warmedUp = false;
    let downgraded = false;
    let frame = 0;

    const tick = () => {
      frame = window.requestAnimationFrame(tick);
      frames += 1;
      const now = performance.now();
      if (now - last < 3000) return;

      const fps = (frames * 1000) / (now - last);
      if (!warmedUp) {
        // Ignore shader compilation and first-frame allocation spikes.
        warmedUp = true;
        frames = 0;
        last = now;
        return;
      }

      if (!downgraded && fps < 40) {
        downgraded = true;
        gl.setPixelRatio(1);
      }
      frames = 0;
      last = now;
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [gl]);

  return null;
}

export function Scene({
  terrainRef,
  apiRef,
  reduced,
  lowPower,
  onSelectLandmark,
  onStartJourney,
  activeSignKey,
}: SceneProps) {
  return (
    <>
      <fogExp2 attach="fog" args={['#0d0c0a', 0.0021]} />
      <ambientLight intensity={1.7} color="#eef1f5" />
      <directionalLight position={[90, 150, 70]} intensity={1.9} color="#fff6ea" />
      <directionalLight position={[-80, 40, -70]} intensity={0.55} color="#dbe5f2" />
      <Terrain ref={terrainRef} segments={lowPower ? 150 : 220} />
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
      <AdaptiveQuality />
    </>
  );
}
