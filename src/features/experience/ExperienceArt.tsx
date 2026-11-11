/**
 * Decorative artwork used behind the editorial destination pages.
 *
 * The world itself is drawn with thin ink lines over a dark ground, so the
 * pages echo that language: layered mountain ridges, drafting hairlines and
 * section-specific diagrams, all rendered as static SVG so they cost nothing
 * while the WebGL landscape is paused behind the sheet.
 *
 * Everything here is purely presentational — every consumer marks the wrapper
 * `aria-hidden`, and no diagram carries text that a reader needs.
 */

type ArtProps = {
  variant?: 'range' | 'peaks' | 'valley' | 'dunes';
};

/** Layered terrain silhouettes, in the spirit of the world's wireframe hills. */
export function RidgeArt({ variant = 'range' }: ArtProps) {
  return (
    <svg
      className="exp-art-svg"
      viewBox="0 0 1200 420"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      focusable="false"
    >
      {variant === 'range' ? (
        <>
          <g className="art-thin">
            <path d="M0 318 118 246 214 292 330 196 446 272 566 178 688 262 806 190 924 280 1042 220 1200 300" />
            <path d="M0 348 140 286 268 330 392 246 520 320 648 236 776 322 906 258 1036 326 1200 268" />
            <path d="M330 196 392 246M566 178 648 236M806 190 906 258" />
            <path d="M352 214 410 232M586 196 640 216M826 210 892 232" />
          </g>
          <g className="art-ink">
            <path d="M0 384 156 300 286 352 414 262 550 338 682 258 812 344 942 274 1078 342 1200 292" />
            <path d="M0 412H1200" />
            <path d="M414 262 470 292M682 258 730 292M942 274 1002 302" />
          </g>
          <g className="art-accent">
            <circle cx="946" cy="118" r="30" />
            <path d="M946 74v-18M946 162v18M902 118h-18M990 118h18" />
          </g>
          <g className="art-thin">
            <path d="M120 120h72M108 136h46M186 104h34M1010 196h64M1030 210h30" />
          </g>
          <g className="art-fill">
            <path d="M0 384 156 300 286 352 414 262 550 338 682 258 812 344 942 274 1078 342 1200 292V420H0Z" />
          </g>
        </>
      ) : null}

      {variant === 'peaks' ? (
        <>
          <g className="art-ink">
            <path d="M60 372 226 158 392 372Z" />
            <path d="M292 372 500 116 708 372Z" />
            <path d="M612 372 806 186 1000 372Z" />
            <path d="M900 372 1046 224 1192 372Z" />
            <path d="M226 158 500 116M500 116 806 186M806 186 1046 224" />
          </g>
          <g className="art-thin">
            <path d="M226 158 168 372M226 158 260 372M226 158 300 372M226 158 340 372M226 158 384 372" />
            <path d="M500 116 384 372M500 116 436 372M500 116 500 372M500 116 566 372M500 116 640 372" />
            <path d="M500 116 612 372M500 116 690 372M806 186 700 372M806 186 760 372M806 186 812 372" />
            <path d="M806 186 860 372M806 186 920 372M806 186 980 372" />
            <path d="M1046 224 1000 372M1046 224 1060 372M1046 224 1116 372M1046 224 1170 372" />
            <path d="M226 274h152M500 247h208M806 286h194" />
          </g>
          <g className="art-accent">
            <path d="M60 384H1192" />
            <circle cx="500" cy="116" r="4" />
          </g>
          <g className="art-fill">
            <path d="M60 372 226 158 392 372ZM292 372 500 116 708 372ZM612 372 806 186 1000 372ZM900 372 1046 224 1192 372Z" />
          </g>
        </>
      ) : null}

      {variant === 'valley' ? (
        <>
          <g className="art-thin">
            <path d="M600 206 0 420M600 206 160 420M600 206 320 420M600 206 480 420M600 206 720 420M600 206 880 420M600 206 1040 420M600 206 1200 420" />
            <path d="M450 206h300M500 244h200M540 282h120" />
          </g>
          <g className="art-ink">
            <path d="M600 196 40 412M600 196 250 412M600 196 600 420M600 196 950 412M600 196 1160 412" />
            <path d="M600 168v-56M582 132h36M600 96v-24" />
            <path d="M0 206h442M758 206h442" />
          </g>
          <g className="art-accent">
            <circle cx="600" cy="206" r="7" />
            <path d="M600 232v78" strokeDasharray="3 7" />
          </g>
          <g className="art-fill">
            <path d="M0 421 600 196 1200 421Z" />
          </g>
        </>
      ) : null}

      {variant === 'dunes' ? (
        <>
          <g className="art-thin">
            <path d="M0 300c150-64 250 34 400 6s250-96 400-48 250 58 400 16" />
            <path d="M0 342c150-56 260 40 410 6s240-92 390-44 250 56 400 12" />
            <path d="M0 388c160-52 250 32 400 2s260-86 400-40 250 54 400 10" />
          </g>
          <g className="art-ink">
            <path d="M0 250c170-84 270 40 430 10s250-104 410-52 240 64 360 24" />
            <path d="M0 408c180-44 280 22 420 4s270-70 400-32 240 44 380 4" />
            <path d="M0 418H1200" />
          </g>
          <g className="art-accent">
            <circle cx="222" cy="120" r="22" />
            <path d="M0 250c170-84 270 40 430 10" strokeDasharray="4 8" />
          </g>
          <g className="art-fill">
            <path d="M0 250c170-84 270 40 430 10s250-104 410-52 240 64 360 24V420H0Z" />
          </g>
        </>
      ) : null}
    </svg>
  );
}

/** Concentric growth rings — the meaning of "Kwanda": expanding outward. */
export function GrowthRings() {
  return (
    <svg
      className="exp-art-svg"
      viewBox="0 0 400 400"
      aria-hidden="true"
      focusable="false"
    >
      <g className="art-thin">
        <circle cx="200" cy="240" r="150" />
        <circle cx="200" cy="240" r="120" />
        <circle cx="200" cy="240" r="90" />
        <circle cx="200" cy="240" r="60" />
        <path d="M200 240 350 240M200 240 306 306M200 240 94 306M200 240 50 240M200 240 94 174M200 240 306 174" />
      </g>
      <g className="art-ink">
        <path d="M20 380H380M200 380V40" />
        <path d="M200 240 260 148 296 168" />
        <circle cx="200" cy="240" r="30" />
        <path d="M350 240a150 150 0 0 1-44 106" />
      </g>
      <g className="art-accent">
        <path d="M296 168l16-22M296 168l26 8" />
        <circle cx="200" cy="240" r="4" />
        <path d="M20 380h60M320 380h60" />
      </g>
    </svg>
  );
}

/** A wayfinding compass — vision and mission, direction. */
export function CompassRose() {
  return (
    <svg
      className="exp-art-svg"
      viewBox="0 0 400 400"
      aria-hidden="true"
      focusable="false"
    >
      <g className="art-thin">
        <circle cx="200" cy="200" r="150" />
        <circle cx="200" cy="200" r="118" />
        <circle cx="200" cy="200" r="66" />
        <path d="M200 30v40M200 330v40M30 200h40M330 200h40" />
        <path d="M80 80l28 28M320 80l-28 28M80 320l28-28M320 320l-28-28" />
      </g>
      <g className="art-ink">
        <path d="M200 200 268 116 232 214Z" />
        <path d="M200 200 132 284 168 186Z" />
        <path d="M200 50v24M200 326v24M50 200h24M326 200h24" />
      </g>
      <g className="art-accent">
        <circle cx="200" cy="200" r="5" />
        <path d="M200 200 268 116" />
        <path d="M256 150a146 146 0 0 1 40 76" strokeDasharray="4 7" />
        <path d="M330 200h28" />
      </g>
    </svg>
  );
}

/** A six-node loop — the product approach, discover to evolve. */
export function ProcessArc() {
  const nodes = [
    [200, 46],
    [312, 108],
    [346, 232],
    [268, 336],
    [132, 340],
    [50, 220],
  ];
  return (
    <svg
      className="exp-art-svg"
      viewBox="0 0 400 400"
      aria-hidden="true"
      focusable="false"
    >
      <g className="art-thin">
        <circle cx="200" cy="200" r="150" />
        <path d="M200 50a150 150 0 0 1 146 184" />
        <path d="M200 350a150 150 0 0 1-146-184" />
      </g>
      <g className="art-ink">
        {nodes.map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="16" />
        ))}
        <path d="M200 46h84M312 108l64 58M346 232l-22 92M268 336h-92M132 340l-66-82M50 220l62-116" strokeDasharray="3 8" />
        <path d="M200 200 312 108M200 200 132 340" strokeDasharray="3 8" />
      </g>
      <g className="art-accent">
        <circle cx="200" cy="200" r="7" />
        <circle cx="312" cy="108" r="5" />
        <path d="M330 92l14-16M330 92l18 4" />
      </g>
    </svg>
  );
}

/** A curving route with stops — travel, booking, journeys. */
export function RouteDiagram({ broken = false }: { broken?: boolean }) {
  return (
    <svg
      className="exp-art-svg"
      viewBox="0 0 400 400"
      aria-hidden="true"
      focusable="false"
    >
      <g className="art-thin">
        <path d="M40 360h320M40 360V40" />
        <path d="M40 300h320M40 240h320M40 180h320M40 120h320" />
        <path d="M100 360v-40M160 360v-40M220 360v-40M280 360v-40" />
        <path d="M40 100h320M40 60h320" />
      </g>
      <g className="art-ink">
        <path
          d="M60 340C120 340 128 260 188 252s44-108 112-116"
          strokeDasharray={broken ? '8 10' : undefined}
        />
        <circle cx="60" cy="340" r="11" />
        <circle cx="188" cy="252" r="11" />
        <circle cx="300" cy="136" r="11" />
      </g>
      {broken ? (
        <g className="art-accent">
          <path d="M96 330c36-6 44-40 66-58" strokeDasharray="4 6" />
          <path d="M264 190c26-14 30-34 36-54" strokeDasharray="4 6" />
          <path d="M212 316l32-32M212 316l6 44" />
        </g>
      ) : (
        <g className="art-accent">
          <path d="M60 340C120 340 128 260 188 252s44-108 112-116" strokeDasharray="4 9" />
          <circle cx="60" cy="340" r="4" />
          <circle cx="188" cy="252" r="4" />
          <circle cx="300" cy="136" r="4" />
          <rect x="236" y="186" width="34" height="20" rx="3" />
          <path d="M243 206v8M263 206v8" />
        </g>
      )}
    </svg>
  );
}

/** Nodes and connections — partners, ecosystems, coordination. */
export function NetworkDiagram({ variant = 'full' }: { variant?: 'full' | 'fragmented' }) {
  return (
    <svg
      className="exp-art-svg"
      viewBox="0 0 400 400"
      aria-hidden="true"
      focusable="false"
    >
      <g className="art-thin">
        <circle cx="200" cy="200" r="158" />
        <circle cx="200" cy="200" r="96" />
        <path d="M200 200 60 120M200 200 340 120M200 200 48 260M200 200 348 276M200 200 148 352M200 200 268 354M200 200 200 42" strokeDasharray={variant === 'fragmented' ? '3 12' : '3 7'} />
      </g>
      <g className="art-ink">
        <circle cx="200" cy="200" r="26" />
        <circle cx="60" cy="120" r="14" />
        <circle cx="340" cy="120" r="10" />
        <circle cx="48" cy="260" r="10" />
        <circle cx="348" cy="276" r="14" />
        <circle cx="148" cy="352" r="10" />
        <circle cx="268" cy="354" r="10" />
        <circle cx="200" cy="42" r="14" />
      </g>
      <g className="art-accent">
        <circle cx="200" cy="200" r="5" />
        <circle cx="340" cy="120" r="4" />
        {variant === 'fragmented' ? (
          <>
            <path d="M84 264l22-22M84 264l-2 30" />
            <path d="M292 316l18-18M292 316l2 26" />
          </>
        ) : (
          <path d="M200 42V18M200 382v-24" />
        )}
      </g>
    </svg>
  );
}

/** Isometric layers — the stack a product is built on. */
export function StackDiagram() {
  return (
    <svg
      className="exp-art-svg"
      viewBox="0 0 400 400"
      aria-hidden="true"
      focusable="false"
    >
      <g className="art-thin">
        <path d="M200 70 340 146 200 222 60 146Z" />
        <path d="M200 118 340 194 200 270 60 194Z" />
        <path d="M200 166 340 242 200 318 60 242Z" />
      </g>
      <g className="art-ink">
        <path d="M200 70 340 146 200 222 60 146Z" />
        <path d="M60 146v22l140 76 140-76v-22" />
        <path d="M60 194v22l140 76 140-76v-22" />
        <path d="M60 242v22l140 76 140-76v-22" />
      </g>
      <g className="art-accent">
        <path d="M200 70v-34M186 50h28" />
        <path d="M60 146 200 222l140-76" strokeDasharray="4 8" />
        <circle cx="200" cy="222" r="4" />
      </g>
    </svg>
  );
}

/** A measured arc with milestones — progress over time. */
export function TimelineArc() {
  return (
    <svg
      className="exp-art-svg"
      viewBox="0 0 400 400"
      aria-hidden="true"
      focusable="false"
    >
      <g className="art-thin">
        <path d="M20 300a180 180 0 0 1 360 0" />
        <path d="M50 300a150 150 0 0 1 300 0" />
        <path d="M20 340h360M20 300v40M380 300v40" />
        <path d="M110 300V262M200 300V246M290 300V262" />
      </g>
      <g className="art-ink">
        <path d="M20 380h360" />
        <path d="M80 300h240" />
        <path d="M140 268v32M200 254v46M260 268v32" strokeDasharray="4 6" />
      </g>
      <g className="art-accent">
        <path d="M20 300a180 180 0 0 1 360 0" strokeDasharray="4 8" />
        <circle cx="110" cy="300" r="5" />
        <circle cx="200" cy="300" r="5" />
        <circle cx="290" cy="300" r="5" />
        <path d="M348 258l12-14M348 258l16 4" />
      </g>
    </svg>
  );
}

/** People in orbit around a shared centre — the studio. */
export function OrbitDiagram() {
  return (
    <svg
      className="exp-art-svg"
      viewBox="0 0 400 400"
      aria-hidden="true"
      focusable="false"
    >
      <g className="art-thin">
        <ellipse cx="200" cy="200" rx="170" ry="86" />
        <ellipse cx="200" cy="200" rx="170" ry="86" transform="rotate(60 200 200)" />
        <ellipse cx="200" cy="200" rx="170" ry="86" transform="rotate(120 200 200)" />
      </g>
      <g className="art-ink">
        <circle cx="200" cy="200" r="34" />
        <circle cx="370" cy="200" r="11" />
        <circle cx="115" cy="53" r="9" />
        <circle cx="115" cy="347" r="9" />
        <circle cx="285" cy="53" r="9" />
        <circle cx="285" cy="347" r="9" />
        <path d="M200 166v68M166 200h68" />
      </g>
      <g className="art-accent">
        <circle cx="200" cy="200" r="5" />
        <circle cx="370" cy="200" r="4" />
        <path d="M30 200a170 86 0 0 1 28-46" strokeDasharray="4 7" />
        <path d="M370 200h20" />
      </g>
    </svg>
  );
}

/** An ascending Line — traction and growth. */
export function TractionChart() {
  return (
    <svg
      className="exp-art-svg"
      viewBox="0 0 400 400"
      aria-hidden="true"
      focusable="false"
    >
      <g className="art-thin">
        <path d="M40 340h330M40 340V40" />
        <path d="M40 280h330M40 220h330M40 160h330M40 100h330" />
        <path d="M110 340V40M180 340V40M250 340V40M320 340V40" />
      </g>
      <g className="art-ink">
        <path d="M40 320 320 90" strokeDasharray="4 8" />
        <circle cx="90" cy="300" r="7" />
        <circle cx="160" cy="256" r="7" />
        <circle cx="230" cy="196" r="7" />
        <circle cx="300" cy="118" r="7" />
        <path d="M40 340h60" />
      </g>
      <g className="art-accent">
        <path d="M40 320 90 300 160 256 230 196 300 118" />
        <path d="M300 118l-2 26M300 118l-26 2" />
        <circle cx="300" cy="118" r="4" />
      </g>
      <g className="art-fill">
        <path d="M40 320 90 300 160 256 230 196 300 118V340H40Z" />
      </g>
    </svg>
  );
}
