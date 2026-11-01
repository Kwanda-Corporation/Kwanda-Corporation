import { useMemo, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { MainInterface } from '../interface/MainInterface';
import { WebGLFallback } from '../interface/WebGLFallback';
import type { NavigationApi } from './CameraController';
import { Scene } from './Scene';

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl2') || canvas.getContext('webgl')),
    );
  } catch {
    return false;
  }
}

export default function WorldCanvas() {
  const terrainRef = useRef<THREE.Mesh>(null);
  const apiRef = useRef<NavigationApi | null>(null);
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [webgl] = useState(supportsWebGL);

  const lowPower = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const cores = navigator.hardwareConcurrency ?? 4;
    return coarse || cores <= 4;
  }, []);

  if (!webgl) return <WebGLFallback />;

  return (
    <div className="world">
      <Canvas
        dpr={[1, lowPower ? 1.35 : 1.75]}
        gl={{
          antialias: true,
          alpha: true,
          stencil: false,
          depth: true,
          powerPreference: 'high-performance',
        }}
        camera={{ fov: 48, near: 0.4, far: 2200, position: [62, 84, 152] }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
          setReady(true);
        }}
      >
        <Scene
          terrainRef={terrainRef}
          apiRef={apiRef}
          reduced={reduced}
          lowPower={lowPower}
        />
      </Canvas>
      {ready && <MainInterface apiRef={apiRef} />}
    </div>
  );
}
