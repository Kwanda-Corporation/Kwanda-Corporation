import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { fbm2, lerp, mulberry32 } from '../../lib/noise';
import { terrainHeight } from '../../lib/terrain';

type RangeConfig = {
  distance: number;
  spread: number;
  count: number;
  heightMin: number;
  heightMax: number;
  baseMin: number;
  baseMax: number;
  segments: number;
};

const RANGES: RangeConfig[] = [
  {
    distance: 300,
    spread: 58,
    count: 9,
    heightMin: 36,
    heightMax: 80,
    baseMin: 52,
    baseMax: 86,
    segments: 34,
  },
  {
    distance: 402,
    spread: 66,
    count: 10,
    heightMin: 52,
    heightMax: 102,
    baseMin: 62,
    baseMax: 96,
    segments: 30,
  },
  {
    distance: 494,
    spread: 60,
    count: 10,
    heightMin: 68,
    heightMax: 122,
    baseMin: 68,
    baseMax: 96,
    segments: 28,
  },
];

const MOUNTAIN_VERTEX = /* glsl */ `
  attribute float aAccent;
  varying vec3 vWorld;
  varying vec3 vNormalWorld;
  varying float vAccent;

  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorld = worldPosition.xyz;
    vNormalWorld = normalize(mat3(modelMatrix) * normal);
    vAccent = aAccent;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const MOUNTAIN_FRAGMENT = /* glsl */ `
  precision highp float;

  uniform vec3 uFogColor;
  uniform float uFogDensity;
  uniform vec3 uLineColor;
  uniform vec3 uAccentColor;

  varying vec3 vWorld;
  varying vec3 vNormalWorld;
  varying float vAccent;

  float contour(float height, float spacing) {
    float band = height / spacing;
    float f = fract(band);
    float distanceToLine = min(f, 1.0 - f);
    float aa = max(fwidth(band), 1e-5);
    return 1.0 - smoothstep(0.0, aa * 1.15, distanceToLine);
  }

  void main() {
    vec3 normal = normalize(vNormalWorld);
    vec3 viewDirection = normalize(cameraPosition - vWorld);
    float rim = pow(1.0 - clamp(abs(dot(normal, viewDirection)), 0.0, 1.0), 2.2);
    float slope = 1.0 - clamp(abs(normal.y), 0.0, 1.0);

    float heightFactor = clamp((vWorld.y + 20.0) / 200.0, 0.0, 1.0);
    vec3 color = mix(
      vec3(0.0042, 0.0040, 0.0036),
      vec3(0.0132, 0.0120, 0.0100),
      heightFactor
    );
    color += vec3(0.0105, 0.0094, 0.0078) * smoothstep(0.15, 0.9, heightFactor) * (0.35 + slope * 0.65);

    float lines = contour(vWorld.y, 4.6);
    float major = contour(vWorld.y, 19.0);

    vec3 lineColor = mix(uLineColor, uAccentColor, vAccent * 0.85);
    color += lineColor * lines * (0.05 + rim * 0.16 + slope * 0.03);
    color += uLineColor * major * 0.06 * (0.55 + rim);
    color += uLineColor * rim * 0.055;

    float distanceToCamera = length(vWorld - cameraPosition);
    float fog = 1.0 - exp(-pow(distanceToCamera * uFogDensity, 2.0));
    color = mix(color, uFogColor, clamp(fog, 0.0, 0.96));

    gl_FragColor = vec4(color, 1.0);
    #include <colorspace_fragment>
  }
`;

type Bump = { x: number; z: number; radius: number; height: number };

function buildMountains(): THREE.BufferGeometry {
  const random = mulberry32(913771);
  const positions: number[] = [];
  const accents: number[] = [];
  const indices: number[] = [];

  RANGES.forEach((range, rangeIndex) => {
    const offset = random() * Math.PI * 2;

    for (let index = 0; index < range.count; index += 1) {
      const angle =
        offset + (index / range.count) * Math.PI * 2 + (random() - 0.5) * 0.42;
      const distance = range.distance + (random() - 0.5) * range.spread;
      const centerX = Math.cos(angle) * distance;
      const centerZ = Math.sin(angle) * distance;

      const height = lerp(range.heightMin, range.heightMax, random());
      const baseRadius = lerp(range.baseMin, range.baseMax, random());
      const baseY = terrainHeight(centerX, centerZ) - 13;
      const accent = random() < 0.14 ? 1 : 0;
      const noiseSeed = 911 + index * 37 + rangeIndex * 101;

      const bumps: Bump[] = [
        { x: 0, z: 0, radius: baseRadius, height: 1 },
      ];

      const bumpCount = 1 + Math.floor(random() * 2);
      for (let bump = 0; bump < bumpCount; bump += 1) {
        const bumpAngle = random() * Math.PI * 2;
        const bumpDistance = baseRadius * (0.16 + random() * 0.22);
        bumps.push({
          x: Math.cos(bumpAngle) * bumpDistance,
          z: Math.sin(bumpAngle) * bumpDistance,
          radius: baseRadius * (0.46 + random() * 0.16),
          height: 0.66 + random() * 0.3,
        });
      }

      const segments = range.segments;
      const start = positions.length / 3;

      for (let iz = 0; iz <= segments; iz += 1) {
        for (let ix = 0; ix <= segments; ix += 1) {
          const ox = (ix / segments - 0.5) * 2 * baseRadius;
          const oz = (iz / segments - 0.5) * 2 * baseRadius;

          let summit = 0;
          for (let bump = 0; bump < bumps.length; bump += 1) {
            const spec = bumps[bump];
            const dx = ox - spec.x;
            const dz = oz - spec.z;
            const distanceToBump = Math.hypot(dx, dz) / spec.radius;
            if (distanceToBump >= 1) continue;
            const value =
              spec.height *
              Math.pow(1 - distanceToBump * distanceToBump, 1.25);
            summit = Math.max(summit, value);
          }

          const ridgeNoise =
            1 -
            Math.abs(
              2 *
                fbm2(
                  (centerX + ox) * 0.017 + noiseSeed * 0.13,
                  (centerZ + oz) * 0.017 - noiseSeed * 0.07,
                  noiseSeed,
                  4,
                ) -
                1,
            );
          const detail =
            fbm2(
              (centerX + ox) * 0.055 + noiseSeed,
              (centerZ + oz) * 0.055,
              noiseSeed + 17,
              3,
            ) - 0.5;

          let elevation =
            height * summit * (0.84 + ridgeNoise * 0.26 + detail * 0.05);
          elevation = Math.max(0, elevation);

          positions.push(centerX + ox, baseY + elevation, centerZ + oz);
          accents.push(accent);
        }
      }

      const row = segments + 1;
      for (let iz = 0; iz < segments; iz += 1) {
        for (let ix = 0; ix < segments; ix += 1) {
          const a = start + iz * row + ix;
          const b = a + 1;
          const c = a + row;
          const d = c + 1;
          indices.push(a, c, b, b, c, d);
        }
      }
    }
  });

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    'position',
    new THREE.BufferAttribute(new Float32Array(positions), 3),
  );
  geometry.setAttribute(
    'aAccent',
    new THREE.BufferAttribute(new Float32Array(accents), 1),
  );
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();

  return geometry;
}

export function Mountains() {
  const mesh = useMemo(() => {
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uFogColor: { value: new THREE.Color('#0d0c0a') },
        uFogDensity: { value: 0.0021 },
        uLineColor: { value: new THREE.Color('#f5f5f0') },
        uAccentColor: { value: new THREE.Color('#e87532') },
      },
      vertexShader: MOUNTAIN_VERTEX,
      fragmentShader: MOUNTAIN_FRAGMENT,
      side: THREE.DoubleSide,
    });

    return new THREE.Mesh(buildMountains(), material);
  }, []);

  useEffect(() => {
    return () => {
      mesh.geometry.dispose();
      (mesh.material as THREE.Material).dispose();
    };
  }, [mesh]);

  return <primitive object={mesh} />;
}
