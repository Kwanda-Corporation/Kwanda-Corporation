import { useRef } from 'react';
import { DRUMMER_STEPS } from '../../audio/percussionPattern';
import { useDrummerMotion } from './DrumAnimation';

type DrummerProps = {
  x: number;
  y: number;
  scale?: number;
  rotate?: number;
  opacity?: number;
  hits: number[];
  playing: boolean;
  animated: boolean;
  reduced: boolean;
  fallbackStart: number;
  phaseOffset?: number;
};

const LACING = [
  'M -43 -143 C -37 -128 -32 -114 -29 -101',
  'M -23 -145 C -21 -131 -19 -115 -18 -99',
  'M 0 -146 L 0 -99',
  'M 23 -145 C 21 -131 19 -115 18 -99',
  'M 43 -143 C 37 -128 32 -114 29 -101',
];

const SPARKS = [
  { cx: 208, cy: 402, r: 1.5, accent: false },
  { cx: 330, cy: 268, r: 1.2, accent: true },
  { cx: 472, cy: 176, r: 1.1, accent: false },
  { cx: 702, cy: 158, r: 1.5, accent: false },
  { cx: 836, cy: 236, r: 1.3, accent: false },
  { cx: 952, cy: 320, r: 1.6, accent: true },
  { cx: 1044, cy: 452, r: 1.1, accent: false },
  { cx: 152, cy: 512, r: 1.1, accent: false },
  { cx: 620, cy: 96, r: 1.2, accent: true },
];

function Drummer({
  x,
  y,
  scale = 1,
  rotate = 0,
  opacity = 1,
  hits,
  playing,
  animated,
  reduced,
  fallbackStart,
  phaseOffset = 0,
}: DrummerProps) {
  const swayRef = useRef<SVGGElement>(null);
  const armLRef = useRef<SVGGElement>(null);
  const armRRef = useRef<SVGGElement>(null);
  const headRef = useRef<SVGGElement>(null);

  useDrummerMotion({
    swayRef,
    armLRef,
    armRRef,
    headRef,
    hits,
    playing,
    animated,
    reduced,
    fallbackStart,
    phaseOffset,
  });

  return (
    <g
      transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}
      opacity={opacity}
    >
      <g ref={swayRef}>
        {/* crossed legs */}
        <path
          className="dl"
          pathLength={1}
          d="M -24 -118 C -52 -110 -74 -90 -83 -64 C -88 -49 -82 -37 -70 -36"
        />
        <path
          className="dl"
          pathLength={1}
          d="M 24 -118 C 52 -110 74 -90 83 -64 C 88 -49 82 -37 70 -36"
        />
        <path className="dl thin" pathLength={1} d="M -84 -64 C -93 -58 -95 -45 -86 -38" />
        <path className="dl thin" pathLength={1} d="M 84 -64 C 93 -58 95 -45 86 -38" />

        {/* torso and head */}
        <path
          className="dl"
          pathLength={1}
          d="M -38 -236 C -16 -248 16 -248 38 -236"
        />
        <path className="dl" pathLength={1} d="M -38 -236 C -41 -196 -35 -156 -34 -118" />
        <path className="dl" pathLength={1} d="M 38 -236 C 41 -196 35 -156 34 -118" />
        <path className="dl faint" pathLength={1} d="M -34 -118 C -16 -108 16 -108 34 -118" />
        <path className="dl faint" pathLength={1} d="M -26 -206 C -10 -198 10 -198 26 -206" />
        <path className="dl thin" pathLength={1} d="M -9 -244 L -9 -256" />
        <path className="dl thin" pathLength={1} d="M 9 -244 L 9 -256" />

        <g ref={headRef}>
          <ellipse
            className="dl"
            pathLength={1}
            cx="0"
            cy="-283"
            rx="23"
            ry="27"
          />
          <path className="dl thin" pathLength={1} d="M -9 -282 C -3 -279 3 -279 9 -282" />
          <path
            className="dl thin"
            pathLength={1}
            d="M -20 -297 C -10 -305 10 -305 20 -297"
          />
          <circle className="dl thin" pathLength={1} cx="22" cy="-281" r="4.5" />
          <circle className="accent-dot" cx="-16" cy="-299" r="1.7" />
        </g>

        {/* djembe */}
        <path
          className="dl"
          pathLength={1}
          d="M -50 -148 C -47 -116 -32 -105 -28 -82 C -24 -58 -34 -28 -40 -4 L 40 -4 C 34 -28 24 -58 28 -82 C 32 -105 47 -116 50 -148"
        />
        <path className="dl thin" pathLength={1} d="M -40 -4 Q 0 12 40 -4" />
        <ellipse className="dl" pathLength={1} cx="0" cy="-148" rx="50" ry="13" />
        <ellipse className="dl faint" pathLength={1} cx="0" cy="-148" rx="41" ry="10" />
        {LACING.map((d) => (
          <path key={d} className="dl hairline" pathLength={1} d={d} />
        ))}
        <path className="dl faint" pathLength={1} d="M -28 -82 Q 0 -75 28 -82" />
        <path className="accent-line" pathLength={1} d="M -41 -152 A 45 12 0 0 1 41 -152" />

        {/* arms */}
        <g ref={armLRef}>
          <path className="dl" pathLength={1} d="M -34 -228 C -48 -214 -58 -200 -63 -186" />
          <path className="dl" pathLength={1} d="M -63 -186 C -57 -172 -44 -160 -30 -152" />
          <path className="dl thin" pathLength={1} d="M -33 -149 C -28 -145 -22 -147 -19 -152" />
          <circle className="accent-dot" cx="-20" cy="-153" r="2" />
        </g>
        <g ref={armRRef}>
          <path className="dl" pathLength={1} d="M 34 -228 C 48 -214 58 -200 63 -186" />
          <path className="dl" pathLength={1} d="M 63 -186 C 57 -172 44 -160 30 -152" />
          <path className="dl thin" pathLength={1} d="M 33 -149 C 28 -145 22 -147 19 -152" />
          <circle className="accent-dot" cx="20" cy="-153" r="2" />
        </g>
      </g>
    </g>
  );
}

type DrummerIllustrationProps = {
  playing: boolean;
  reduced: boolean;
  fallbackStart: number;
};

export function DrummerIllustration({
  playing,
  reduced,
  fallbackStart,
}: DrummerIllustrationProps) {
  return (
    <svg
      className="opening-svg"
      viewBox="0 0 1200 760"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
    >
      <g className="scene-backdrop">
        <circle className="dl backdrop" pathLength={1} cx="600" cy="428" r="296" />
        <circle className="dl backdrop thin" pathLength={1} cx="600" cy="428" r="332" />
        <path
          className="dl backdrop thin"
          pathLength={1}
          d="M 40 690 C 170 680 262 696 384 690 C 500 684 556 694 660 690 C 780 686 846 696 964 690 C 1046 686 1108 690 1160 686"
        />
        <path
          className="dl backdrop hairline"
          pathLength={1}
          d="M 96 716 C 240 708 352 720 468 714 C 590 708 674 718 792 714 C 908 710 1010 716 1104 710"
        />
        {SPARKS.map((spark) => (
          <circle
            key={`${spark.cx}-${spark.cy}`}
            className={spark.accent ? 'backdrop-dot accent-dot' : 'backdrop-dot'}
            cx={spark.cx}
            cy={spark.cy}
            r={spark.r}
          />
        ))}
      </g>

      <Drummer
        x={150}
        y={694}
        scale={0.42}
        rotate={-3}
        opacity={0.26}
        hits={DRUMMER_STEPS[1]}
        playing={playing}
        animated={false}
        reduced={reduced}
        fallbackStart={fallbackStart}
      />

      <Drummer
        x={372}
        y={690}
        scale={0.72}
        rotate={-2.5}
        opacity={0.8}
        hits={DRUMMER_STEPS[1]}
        playing={playing}
        animated
        reduced={reduced}
        fallbackStart={fallbackStart}
        phaseOffset={0.15}
      />

      <Drummer
        x={600}
        y={690}
        scale={1}
        opacity={1}
        hits={DRUMMER_STEPS[0]}
        playing={playing}
        animated
        reduced={reduced}
        fallbackStart={fallbackStart}
      />

      <Drummer
        x={838}
        y={690}
        scale={0.8}
        rotate={2.5}
        opacity={0.86}
        hits={DRUMMER_STEPS[2]}
        playing={playing}
        animated
        reduced={reduced}
        fallbackStart={fallbackStart}
        phaseOffset={0.3}
      />

      <Drummer
        x={1052}
        y={692}
        scale={0.46}
        rotate={3}
        opacity={0.28}
        hits={DRUMMER_STEPS[2]}
        playing={playing}
        animated={false}
        reduced={reduced}
        fallbackStart={fallbackStart}
      />
    </svg>
  );
}
