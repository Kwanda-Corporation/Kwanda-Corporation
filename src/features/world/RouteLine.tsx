import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { terrainHeight } from '../../lib/terrain';

export type RoutePoint = { x: number; z: number };

function toVectors(points: RoutePoint[], lift: number): THREE.Vector3[] {
  return points.map(
    (point) => new THREE.Vector3(point.x, terrainHeight(point.x, point.z) + lift, point.z),
  );
}

/** A dashed ground route that follows the terrain, like a drawn survey line. */
export function RouteLine({
  points,
  color = '#e87532',
  opacity = 0.45,
  dash = 2.1,
  gap = 2.4,
  lift = 0.55,
}: {
  points: RoutePoint[];
  color?: string;
  opacity?: number;
  dash?: number;
  gap?: number;
  lift?: number;
}) {
  const line = useMemo(() => {
    const geometry = new THREE.BufferGeometry().setFromPoints(toVectors(points, lift));
    const material = new THREE.LineDashedMaterial({
      color,
      transparent: true,
      opacity,
      dashSize: dash,
      gapSize: gap,
      depthWrite: false,
      toneMapped: false,
    });
    const object = new THREE.Line(geometry, material);
    object.computeLineDistances();
    object.frustumCulled = false;
    return object;
  }, [points, color, opacity, dash, gap, lift]);

  useEffect(
    () => () => {
      line.geometry.dispose();
      (line.material as THREE.Material).dispose();
    },
    [line],
  );

  return <primitive object={line} />;
}

/** A route node sitting on the terrain, used to punctuate the district paths. */
export function RouteNode({
  x,
  z,
  radius = 1.0,
  opacity = 0.7,
  lift = 0.62,
}: {
  x: number;
  z: number;
  radius?: number;
  opacity?: number;
  lift?: number;
}) {
  return (
    <mesh
      position={[x, terrainHeight(x, z) + lift, z]}
      rotation-x={-Math.PI / 2}
    >
      <ringGeometry args={[radius * 0.78, radius, 20]} />
      <meshBasicMaterial
        color="#e87532"
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}
