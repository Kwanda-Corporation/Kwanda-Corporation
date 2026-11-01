import { Html } from '@react-three/drei';
import { useMemo } from 'react';
import type { LandmarkId } from '../../lib/landmarks';
import { pathPoint, terrainHeight } from '../../lib/terrain';

const POST_HEIGHT = 5;
const BOARD_Y = POST_HEIGHT + 0.3;

type RoadSignProps = {
  t: number;
  label: string;
  kicker: string;
  destination?: LandmarkId;
  visible: boolean;
  onSelect?: (id: LandmarkId) => void;
  onStart?: () => void;
};

let cachedWood: string | null = null;

/**
 * Draws a single shared wooden signboard face once, then reuses it as a data
 * URL for every sign. The lettering stays DOM (crisp and accessible); the
 * grain, frame and nails give the board its timber look.
 */
function woodTexture(): string {
  if (cachedWood) return cachedWood;
  if (typeof document === 'undefined') return '';

  const w = 512;
  const h = 320;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Warm base tone.
  ctx.fillStyle = '#7a4a24';
  ctx.fillRect(0, 0, w, h);

  // Four planks with vertical grain streaks.
  const planks = 4;
  const plankH = h / planks;
  for (let p = 0; p < planks; p += 1) {
    const y0 = p * plankH;
    for (let i = 0; i < 70; i += 1) {
      const x = Math.random() * w;
      const y = y0 + Math.random() * plankH;
      const len = 24 + Math.random() * 70;
      ctx.strokeStyle = Math.random() < 0.5 ? '#3f2410' : '#a06a35';
      ctx.globalAlpha = 0.05 + Math.random() * 0.1;
      ctx.lineWidth = 0.6 + Math.random() * 1.3;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.bezierCurveTo(
        x + (Math.random() - 0.5) * 9,
        y + len * 0.4,
        x + (Math.random() - 0.5) * 9,
        y + len * 0.7,
        x + (Math.random() - 0.5) * 7,
        y + len,
      );
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#2f1a0a';
    ctx.fillRect(0, y0 + plankH - 2, w, 2);
  }

  // Knots.
  for (let k = 0; k < 3; k += 1) {
    const x = 50 + Math.random() * (w - 100);
    const y = 24 + Math.random() * (h - 48);
    ctx.globalAlpha = 0.26;
    ctx.fillStyle = '#3f2410';
    ctx.beginPath();
    ctx.ellipse(x, y, 6 + Math.random() * 5, 4 + Math.random() * 3, Math.random() * 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 0.2;
    ctx.strokeStyle = '#2f1a0a';
    ctx.lineWidth = 1;
    for (let r = 0; r < 3; r += 1) {
      ctx.beginPath();
      ctx.ellipse(x, y, 8 + r * 4, 5 + r * 2.5, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
  ctx.globalAlpha = 1;

  // Frame.
  ctx.strokeStyle = '#2f1a0a';
  ctx.lineWidth = 12;
  ctx.strokeRect(6, 6, w - 12, h - 12);
  ctx.strokeStyle = '#4a2c14';
  ctx.lineWidth = 4;
  ctx.strokeRect(15, 15, w - 30, h - 30);

  // Corner nails.
  ctx.fillStyle = '#241309';
  const nail = (x: number, y: number) => {
    ctx.beginPath();
    ctx.arc(x, y, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0f0803';
    ctx.beginPath();
    ctx.arc(x + 1.2, y + 1.2, 1.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#241309';
  };
  [[22, 22], [w - 22, 22], [22, h - 22], [w - 22, h - 22]].forEach(([x, y]) => nail(x, y));

  cachedWood = canvas.toDataURL('image/png');
  return cachedWood;
}

/**
 * A wooden signpost planted on the road. The post is real timber geometry and
 * the board is a projected timber face, so it reads like a physical sign the
 * traveller meets as they move between the mountains.
 */
export function RoadSign({
  t,
  label,
  kicker,
  destination,
  visible,
  onSelect,
  onStart,
}: RoadSignProps) {
  const { x, z } = useMemo(() => pathPoint(t), [t]);
  const ground = useMemo(() => terrainHeight(x, z), [x, z]);
  const wood = useMemo(() => woodTexture(), []);

  const handleClick = () => {
    if (destination) onSelect?.(destination);
    else onStart?.();
  };

  if (!visible) return null;

  return (
    <group position={[x, ground, z]}>
      <mesh position={[0, POST_HEIGHT / 2, 0]} castShadow>
        <boxGeometry args={[0.5, POST_HEIGHT, 0.5]} />
        <meshStandardMaterial color="#5d3a1e" roughness={0.9} />
      </mesh>

      <Html
        position={[0, BOARD_Y, 0]}
        center
        zIndexRange={[9, 2]}
        wrapperClass="road-sign-wrap"
        style={{ pointerEvents: 'auto' }}
      >
        <button
          type="button"
          className={destination ? 'road-sign is-destination' : 'road-sign'}
          style={wood ? { backgroundImage: `url(${wood})` } : undefined}
          onClick={handleClick}
          aria-label={label}
        >
          <span className="road-sign-kicker">{kicker}</span>
          <span className="road-sign-label">{label}</span>
          {destination ? <span className="road-sign-enter">Enter →</span> : null}
        </button>
      </Html>
    </group>
  );
}
