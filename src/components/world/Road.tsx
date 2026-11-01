import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { pathPoint, terrainHeight } from '../../lib/terrain';

const ROAD_WIDTH = 6;
const LIFT = 0.55;
// One texture tile covers two bricks along the road and two across it.
const TILE_LEN = 4;
const TILE_WID = 2;
const SAMPLES = 480;

function tangentAt(t: number): { x: number; z: number } {
  const e = 0.001;
  const a = pathPoint(t - e);
  const b = pathPoint(t + e);
  const dx = b.x - a.x;
  const dz = b.z - a.z;
  const len = Math.hypot(dx, dz) || 1;
  return { x: dx / len, z: dz / len };
}

/**
 * A seamless running-bond brick texture: warm terracotta pavers with sandy
 * mortar, subtle per-brick variation and a soft bevel so it reads as a real
 * brick road rather than a flat ribbon.
 */
function brickTexture(): THREE.CanvasTexture {
  const w = 256;
  const h = 128;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const mortar = 6;
  const brickW = 122;
  const brickH = 58;
  const pitchX = brickW + mortar;
  const pitchY = brickH + mortar;

  ctx.fillStyle = '#a89b80';
  ctx.fillRect(0, 0, w, h);

  const hash = (a: number, b: number) => {
    const x = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
    return x - Math.floor(x);
  };

  const paintBrick = (x: number, y: number, color: string) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, brickW, brickH);
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.fillRect(x, y, brickW, 2.5);
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.fillRect(x, y + brickH - 2.5, brickW, 2.5);
  };

  for (let row = 0; row < h / pitchY; row += 1) {
    const by = row * pitchY;
    const offset = (row % 2) * (pitchX / 2);
    for (let bx = offset; bx < w; bx += pitchX) {
      const t = hash(Math.round(bx), by);
      const r = Math.round(150 + t * 26);
      const g = Math.round(84 + t * 14);
      const b = Math.round(52 + t * 10);
      const color = `rgb(${r}, ${g}, ${b})`;
      paintBrick(bx, by, color);
      if (bx + brickW > w) paintBrick(bx - w, by, color);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function buildRoadGeometry(): THREE.BufferGeometry {
  const half = ROAD_WIDTH / 2;
  const positions = new Float32Array((SAMPLES + 1) * 2 * 3);
  const uvs = new Float32Array((SAMPLES + 1) * 2 * 2);
  const indices: number[] = [];

  let arc = 0;
  let prev = pathPoint(0);
  for (let i = 0; i <= SAMPLES; i += 1) {
    const t = i / SAMPLES;
    const p = pathPoint(t);
    if (i > 0) {
      arc += Math.hypot(p.x - prev.x, p.z - prev.z);
      prev = p;
    }

    const d = tangentAt(t);
    const nx = -d.z;
    const nz = d.x;
    const lx = p.x + nx * half;
    const lz = p.z + nz * half;
    const rx = p.x - nx * half;
    const rz = p.z - nz * half;

    const v = i * 2;
    positions[v * 3] = lx;
    positions[v * 3 + 1] = terrainHeight(lx, lz) + LIFT;
    positions[v * 3 + 2] = lz;
    positions[(v + 1) * 3] = rx;
    positions[(v + 1) * 3 + 1] = terrainHeight(rx, rz) + LIFT;
    positions[(v + 1) * 3 + 2] = rz;

    const u = arc / TILE_LEN;
    uvs[v * 2] = u;
    uvs[v * 2 + 1] = 0;
    uvs[(v + 1) * 2] = u;
    uvs[(v + 1) * 2 + 1] = ROAD_WIDTH / TILE_WID;

    if (i > 0) {
      const a = v - 2;
      const b = v - 1;
      const c = v;
      const d = v + 1;
      indices.push(a, c, b, b, c, d);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

/** The journey road: a brick ribbon that winds along the path with the terrain. */
export function Road() {
  const { geometry, material } = useMemo(() => {
    const geometry = buildRoadGeometry();
    const map = brickTexture();
    const material = new THREE.MeshStandardMaterial({
      map,
      roughness: 0.94,
      metalness: 0,
    });
    return { geometry, material };
  }, []);

  useEffect(
    () => () => {
      geometry.dispose();
      (material.map as THREE.Texture | null)?.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  return (
    <mesh geometry={geometry} material={material} frustumCulled={false} receiveShadow={false} />
  );
}
