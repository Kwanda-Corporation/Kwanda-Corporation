import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { trailPoints } from '../../lib/terrain';

export function Trail() {
  const line = useMemo(() => {
    const points = trailPoints(220).map(
      (point) => new THREE.Vector3(point.x, point.y + 0.35, point.z),
    );
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineDashedMaterial({
      color: new THREE.Color('#b8b5aa'),
      transparent: true,
      opacity: 0.42,
      dashSize: 2.4,
      gapSize: 2.1,
      depthWrite: false,
      fog: true,
    });
    const object = new THREE.Line(geometry, material);
    object.computeLineDistances();
    return object;
  }, []);

  useEffect(() => {
    return () => {
      line.geometry.dispose();
      (line.material as THREE.Material).dispose();
    };
  }, [line]);

  return <primitive object={line} />;
}
