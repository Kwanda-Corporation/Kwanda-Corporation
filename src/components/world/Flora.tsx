import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { LineBuilder } from '../../lib/lines';
import { mulberry32 } from '../../lib/noise';
import { pathPoint, terrainHeight } from '../../lib/terrain';

const VILLAGE_T = 0.645;

function villageCenter(): { x: number; z: number } {
  const point = pathPoint(VILLAGE_T);
  return { x: point.x + 12, z: point.z };
}

function buildFlora(): THREE.BufferGeometry {
  const random = mulberry32(90210);
  const builder = new LineBuilder();
  const white = new THREE.Color('#f5f5f0');
  const village = villageCenter();

  for (let i = 0; i < 320; i += 1) {
    const angle = random() * Math.PI * 2;
    const radius = Math.pow(random(), 0.6) * 290;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;

    if (Math.hypot(x - village.x, z - village.z) < 24) continue;

    const ground = terrainHeight(x, z);
    const blades = 2 + Math.floor(random() * 3);
    const height = 1.4 + random() * 2.8;

    for (let b = 0; b < blades; b += 1) {
      const spread = (random() - 0.5) * 1.9;
      const tipX = x + spread + (random() - 0.5) * 1.1;
      const tipZ = z + spread * 0.7 + (random() - 0.5) * 1.1;
      const tipY = ground + height * (0.6 + random() * 0.55);
      builder.add(x, ground + 0.1, z, tipX, tipY, tipZ, white, 0.18 + random() * 0.16);
    }
  }

  for (let i = 0; i < 22; i += 1) {
    const angle = random() * Math.PI * 2;
    const radius = 55 + random() * 250;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    if (Math.hypot(x - village.x, z - village.z) < 26) continue;

    const ground = terrainHeight(x, z);
    const trunkHeight = 7 + random() * 6;
    const topX = x + (random() - 0.5) * 2.4;
    const topZ = z + (random() - 0.5) * 2.4;
    const topY = ground + trunkHeight;
    const rotation = random() * Math.PI;
    const canopyRadius = 5.5 + random() * 4.5;
    const canopyHeight = 1.6 + random() * 1.3;
    const tilt = 0.6 + random() * 0.8;

    builder.add(x, ground, z, topX, topY, topZ, white, 0.5);
    builder.add(
      x + (random() - 0.5) * 0.8,
      ground + trunkHeight * 0.45,
      z + (random() - 0.5) * 0.8,
      topX + Math.cos(rotation + tilt) * canopyRadius * 0.85,
      topY - canopyHeight * 1.4,
      topZ + Math.sin(rotation + tilt) * canopyRadius * 0.85,
      white,
      0.34,
    );
    builder.add(
      x + (random() - 0.5) * 0.8,
      ground + trunkHeight * 0.52,
      z + (random() - 0.5) * 0.8,
      topX + Math.cos(rotation - tilt) * canopyRadius * 0.8,
      topY - canopyHeight * 1.2,
      topZ + Math.sin(rotation - tilt) * canopyRadius * 0.8,
      white,
      0.34,
    );

    const segments = 18;
    let previous: { x: number; y: number; z: number } | null = null;
    for (let segment = 0; segment <= segments; segment += 1) {
      const a = (segment / segments) * Math.PI * 2;
      const lobe = 1 + 0.12 * Math.sin(a * 3 + rotation * 2) + 0.06 * Math.sin(a * 7);
      const px = topX + Math.cos(a) * canopyRadius * lobe * Math.cos(rotation);
      const pz = topZ + Math.cos(a) * canopyRadius * lobe * Math.sin(rotation);
      const py = topY + Math.sin(a) * canopyHeight * lobe;
      const point = { x: px, y: py, z: pz };
      if (previous) {
        builder.add(
          previous.x,
          previous.y,
          previous.z,
          point.x,
          point.y,
          point.z,
          white,
          0.46,
        );
      }
      previous = point;
    }
  }

  return builder.build();
}

export function Flora() {
  const line = useMemo(() => {
    const material = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      fog: true,
    });
    return new THREE.LineSegments(buildFlora(), material);
  }, []);

  useEffect(() => {
    return () => {
      line.geometry.dispose();
      (line.material as THREE.Material).dispose();
    };
  }, [line]);

  return <primitive object={line} frustumCulled={false} />;
}
