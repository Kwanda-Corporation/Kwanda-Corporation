import { useEffect, type MutableRefObject } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { CameraController, type NavigationApi } from './CameraController';
import { Dust } from './Dust';
import { Flora } from './Flora';
import { Mountains } from './Mountains';
import { Settlement } from './Settlement';
import { Terrain } from './Terrain';
import { Trail } from './Trail';

type SceneProps = {
  terrainRef: MutableRefObject<THREE.Mesh | null>;
  apiRef: MutableRefObject<NavigationApi | null>;
  reduced: boolean;
  lowPower: boolean;
};

function AdaptiveQuality() {
  const { gl } = useThree();

  useEffect(() => {
    let frames = 0;
    let last = performance.now();
    let downgraded = false;
    let frame = 0;

    const tick = () => {
      frame = window.requestAnimationFrame(tick);
      frames += 1;
      const now = performance.now();
      if (now - last < 2500) return;

      const fps = (frames * 1000) / (now - last);
      if (!downgraded && fps < 42) {
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

export function Scene({ terrainRef, apiRef, reduced, lowPower }: SceneProps) {
  return (
    <>
      <fogExp2 attach="fog" args={['#0d0c0a', 0.0021]} />
      <Terrain ref={terrainRef} segments={lowPower ? 150 : 220} />
      <Mountains />
      <Trail />
      <Flora />
      <Settlement reduced={reduced} />
      <Dust reduced={reduced} />
      <CameraController terrainRef={terrainRef} apiRef={apiRef} reduced={reduced} />
      <AdaptiveQuality />
    </>
  );
}
