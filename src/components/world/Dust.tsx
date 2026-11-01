import { useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { mulberry32 } from '../../lib/noise';
import { terrainHeight } from '../../lib/terrain';

export function Dust({ reduced }: { reduced: boolean }) {
  const points = useMemo(() => {
    const random = mulberry32(55119);
    const count = 170;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i += 1) {
      const angle = random() * Math.PI * 2;
      const radius = Math.pow(random(), 0.55) * 260;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = terrainHeight(x, z) + 2 + random() * 40;
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: new THREE.Color('#d9d5c9'),
      size: 0.6,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.22,
      depthWrite: false,
      fog: true,
    });

    return new THREE.Points(geometry, material);
  }, []);

  useEffect(() => {
    return () => {
      points.geometry.dispose();
      (points.material as THREE.Material).dispose();
    };
  }, [points]);

  useFrame((state, delta) => {
    if (reduced) return;
    points.rotation.y += delta * 0.005;
    points.position.y = Math.sin(state.clock.elapsedTime * 0.11) * 1.4;
  });

  return <primitive object={points} />;
}
