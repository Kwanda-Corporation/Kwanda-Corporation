import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, useSyncExternalStore } from 'react';
import type * as THREE from 'three';
import { landmarkRegistry, type LandmarkId } from '../../lib/landmarks';
import { noteRenderActivity } from '../../lib/renderActivity';

type LandmarkMarkerProps = {
  id: LandmarkId;
  name: string;
  kicker: string;
  height: number;
  onSelect: () => void;
  reduced: boolean;
};

/**
 * A vertical survey mark and a projected label. The label is always readable,
 * but hovering it (or bringing the camera close) reveals the destination and
 * the entry cue. Only the hover/proximity booleans re-render React; all of the
 * continuous glow work happens imperatively in useFrame.
 */
export function LandmarkMarker({
  id,
  name,
  kicker,
  height,
  onSelect,
  reduced,
}: LandmarkMarkerProps) {
  const diamondRef = useRef<THREE.Mesh>(null);
  const lineRef = useRef<THREE.MeshBasicMaterial>(null);
  const diamondMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const glowRef = useRef(0);

  const active = useSyncExternalStore(
    landmarkRegistry.subscribe,
    () => landmarkRegistry.isActive(id),
    () => false,
  );
  const hovered = useSyncExternalStore(
    landmarkRegistry.subscribe,
    () => landmarkRegistry.hovered === id,
    () => false,
  );

  useFrame((state, delta) => {
    const dt = Math.min(0.05, delta);
    const target = active ? 1 : 0;
    glowRef.current += (target - glowRef.current) * Math.min(1, dt * 5);
    const glow = glowRef.current;
    if (Math.abs(target - glow) > 0.01) noteRenderActivity(240);

    if (lineRef.current) lineRef.current.opacity = 0.16 + glow * 0.6;
    if (diamondMaterialRef.current) diamondMaterialRef.current.opacity = 0.35 + glow * 0.65;
    if (diamondRef.current) {
      diamondRef.current.position.y =
        height + 0.9 + (reduced ? 0 : Math.sin(state.clock.elapsedTime * 1.4) * 0.18);
      if (!reduced) diamondRef.current.rotation.y += dt * 0.35;
    }
  });

  return (
    <group>
      <mesh position={[0, height - 3.1, 0]} renderOrder={4}>
        <cylinderGeometry args={[0.055, 0.055, 4.6, 4, 1, true]} />
        <meshBasicMaterial
          ref={lineRef}
          color="#e87532"
          transparent
          opacity={0.2}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      <mesh ref={diamondRef} position={[0, height + 0.9, 0]} renderOrder={4}>
        <octahedronGeometry args={[0.5, 0]} />
        <meshBasicMaterial
          ref={diamondMaterialRef}
          color="#e87532"
          transparent
          opacity={0.5}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      <Html
        position={[0, height + 2.1, 0]}
        center
        zIndexRange={[9, 2]}
        wrapperClass="landmark-label-wrap"
        style={{ pointerEvents: 'auto' }}
      >
        <button
          type="button"
          className={
            hovered
              ? 'landmark-label is-hovered'
              : active
                ? 'landmark-label is-active'
                : 'landmark-label'
          }
          onClick={onSelect}
          onPointerEnter={() => landmarkRegistry.setHovered(id)}
          onPointerLeave={() => {
            if (landmarkRegistry.hovered === id) landmarkRegistry.setHovered(null);
          }}
          aria-label={`Enter ${name}`}
        >
          <span className="landmark-label-dot" aria-hidden="true" />
          <span className="landmark-label-copy">
            <span className="landmark-label-kicker">{kicker}</span>
            <span className="landmark-label-name">{name}</span>
          </span>
          <span className="landmark-label-enter" aria-hidden="true">
            Enter
          </span>
        </button>
      </Html>
    </group>
  );
}

/** A terrain-level halo that fades in as the camera focus approaches. */
export function LandmarkHalo({
  id,
  radius,
  y,
  reduced,
}: {
  id: LandmarkId;
  radius: number;
  y: number;
  reduced: boolean;
}) {
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const glowRef = useRef(0);

  useFrame((state, delta) => {
    const dt = Math.min(0.05, delta);
    const target = landmarkRegistry.isActive(id) ? 1 : 0;
    glowRef.current += (target - glowRef.current) * Math.min(1, dt * 4.2);
    if (Math.abs(target - glowRef.current) > 0.01) noteRenderActivity(240);
    if (materialRef.current) {
      const breathe = reduced ? 1 : 0.86 + Math.sin(state.clock.elapsedTime * 1.1) * 0.14;
      materialRef.current.opacity = glowRef.current * 0.34 * breathe;
    }
  });

  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, y, 0]}>
      <ringGeometry args={[radius - 0.55, radius, 84]} />
      <meshBasicMaterial
        ref={materialRef}
        color="#e87532"
        transparent
        opacity={0}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}
