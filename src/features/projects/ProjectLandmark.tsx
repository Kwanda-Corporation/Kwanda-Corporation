import { useEffect, useRef, type ReactNode } from 'react';
import type * as THREE from 'three';
import { LANDMARKS, landmarkRegistry, type LandmarkId } from '../../lib/landmarks';
import { terrainHeight } from '../../lib/terrain';
import { LandmarkHalo, LandmarkMarker } from '../world/LandmarkMarker';

type ProjectLandmarkProps = {
  id: LandmarkId;
  onSelect: () => void;
  reduced: boolean;
  rotation?: number;
  haloRadius: number;
  hitbox: {
    position: [number, number, number];
    size: [number, number, number];
  };
  children: ReactNode;
};

/**
 * Shared shell for the architectural landmarks in the Innovation District.
 * Keeps placement, the pick volume, the marker and the halo in one place so a
 * new project only has to describe its own building.
 */
export function ProjectLandmark({
  id,
  onSelect,
  reduced,
  rotation = 0,
  haloRadius,
  hitbox,
  children,
}: ProjectLandmarkProps) {
  const info = LANDMARKS[id];
  const hitboxRef = useRef<THREE.Mesh>(null);
  const baseY = terrainHeight(info.position.x, info.position.z) - 0.15;

  useEffect(() => {
    const target = hitboxRef.current;
    if (!target) return undefined;
    return landmarkRegistry.register({ id, target, onSelect });
  }, [id, onSelect]);

  return (
    <group position={[info.position.x, baseY, info.position.z]} rotation-y={rotation}>
      {children}

      <LandmarkHalo id={id} radius={haloRadius} y={0.9} reduced={reduced} />
      <LandmarkMarker
        id={id}
        name={info.name}
        kicker={info.kicker}
        height={info.markerHeight}
        onSelect={onSelect}
        reduced={reduced}
      />

      <mesh
        ref={hitboxRef}
        position={hitbox.position}
        visible={false}
        frustumCulled={false}
      >
        <boxGeometry args={hitbox.size} />
        <meshBasicMaterial />
      </mesh>
    </group>
  );
}
