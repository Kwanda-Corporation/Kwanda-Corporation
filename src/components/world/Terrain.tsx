import { forwardRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { terrainHeight, WORLD_SIZE } from '../../lib/terrain';

type TerrainProps = {
  segments?: number;
};

export const Terrain = forwardRef<THREE.Mesh, TerrainProps>(function Terrain(
  { segments = 200 },
  ref,
) {
  const geometry = useMemo(() => {
    const count = Math.max(48, Math.round(segments));
    const vertexCount = (count + 1) * (count + 1);
    const positions = new Float32Array(vertexCount * 3);
    const indices = new Uint32Array(count * count * 6);

    let p = 0;
    for (let iz = 0; iz <= count; iz += 1) {
      const z = (iz / count - 0.5) * WORLD_SIZE;
      for (let ix = 0; ix <= count; ix += 1) {
        const x = (ix / count - 0.5) * WORLD_SIZE;
        positions[p] = x;
        positions[p + 1] = terrainHeight(x, z);
        positions[p + 2] = z;
        p += 3;
      }
    }

    let i = 0;
    for (let iz = 0; iz < count; iz += 1) {
      for (let ix = 0; ix < count; ix += 1) {
        const a = iz * (count + 1) + ix;
        const b = a + 1;
        const c = a + count + 1;
        const d = c + 1;
        indices[i] = a;
        indices[i + 1] = c;
        indices[i + 2] = b;
        indices[i + 3] = b;
        indices[i + 4] = c;
        indices[i + 5] = d;
        i += 6;
      }
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geom.setIndex(new THREE.BufferAttribute(indices, 1));
    geom.computeBoundingSphere();
    return geom;
  }, [segments]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uFogColor: { value: new THREE.Color('#0d0c0a') },
          uFogDensity: { value: 0.0021 },
          uLineColor: { value: new THREE.Color('#f5f5f0') },
          uAccentColor: { value: new THREE.Color('#e87532') },
        },
        vertexShader: /* glsl */ `
          varying vec3 vWorld;
          varying float vHeight;

          void main() {
            vec4 worldPosition = modelMatrix * vec4(position, 1.0);
            vWorld = worldPosition.xyz;
            vHeight = position.y;
            gl_Position = projectionMatrix * viewMatrix * worldPosition;
          }
        `,
        fragmentShader: /* glsl */ `
          precision highp float;

          uniform vec3 uFogColor;
          uniform float uFogDensity;
          uniform vec3 uLineColor;
          uniform vec3 uAccentColor;

          varying vec3 vWorld;
          varying float vHeight;

          float hash21(vec2 p) {
            p = fract(p * vec2(123.34, 345.45));
            p += dot(p, p + 34.345);
            return fract(p.x * p.y);
          }

          float contour(float height, float spacing) {
            float band = height / spacing;
            float f = fract(band);
            float distanceToLine = min(f, 1.0 - f);
            float aa = max(fwidth(band), 1e-5);
            return 1.0 - smoothstep(0.0, aa * 1.15, distanceToLine);
          }

          void main() {
            vec3 normal = normalize(cross(dFdx(vWorld), dFdy(vWorld)));
            float slope = 1.0 - clamp(abs(normal.y), 0.0, 1.0);

            float heightFactor = clamp((vHeight + 24.0) / 80.0, 0.0, 1.0);
            vec3 color = mix(
              vec3(0.0032, 0.0031, 0.0029),
              vec3(0.0155, 0.0142, 0.0118),
              heightFactor
            );

            float major = contour(vHeight, 2.9);
            float minor = contour(vHeight, 1.05);
            color += uLineColor * major * (0.11 + slope * 0.24);
            color += uLineColor * minor * 0.022;

            float accent = contour(vHeight, 18.0) * smoothstep(0.55, 0.85, slope);
            color += uAccentColor * accent * 0.032;

            color += (hash21(gl_FragCoord.xy) - 0.5) * 0.0035;

            float distanceToCamera = length(vWorld - cameraPosition);
            float fog = 1.0 - exp(-pow(distanceToCamera * uFogDensity, 2.0));
            color = mix(color, uFogColor, clamp(fog, 0.0, 0.94));

            gl_FragColor = vec4(color, 1.0);
            #include <colorspace_fragment>
          }
        `,
      }),
    [],
  );

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  return (
    <mesh
      ref={ref}
      geometry={geometry}
      material={material}
      frustumCulled
      receiveShadow={false}
      castShadow={false}
    />
  );
});
