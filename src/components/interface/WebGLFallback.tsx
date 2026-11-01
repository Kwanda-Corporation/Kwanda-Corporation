export function WebGLFallback() {
  return (
    <div className="webgl-fallback">
      <div className="fallback-brand">
        <span className="brand-mark" aria-hidden="true" />
        <span>KWANDA</span>
      </div>

      <div className="fallback-art" aria-hidden="true">
        <svg viewBox="0 0 900 360" preserveAspectRatio="xMidYMid meet">
          <g fill="none" stroke="#f5f5f0" strokeWidth="1.1" strokeLinejoin="round">
            <path d="M20 300 L120 196 L176 238 L268 108 L354 232 L430 168 L516 258 L606 138 L696 246 L778 182 L880 300" />
            <path d="M52 300 L126 234 L186 266 L268 164 L342 258 L430 210 L512 278 L604 188 L688 268 L772 226 L852 300" opacity="0.42" />
            <path d="M132 300 L188 268 L238 288 L298 224 L360 282 L428 250 L498 292 L578 238 L652 284 L730 254 L812 300" opacity="0.2" />
            <path d="M0 320 C 150 312 250 324 380 318 C 520 312 640 324 900 316" opacity="0.5" />
            <path d="M0 340 C 180 334 300 344 460 338 C 620 332 740 342 900 336" opacity="0.2" />
          </g>
          <circle cx="450" cy="300" r="3" fill="#e87532" />
        </svg>
      </div>

      <div className="fallback-copy">
        <p className="fallback-title">A LANDSCAPE DRAWN IN LINES</p>
        <p className="fallback-text">
          This experience needs WebGL to render the world. Please try a current
          browser with hardware acceleration enabled.
        </p>
      </div>

      <p className="fallback-foot">KWANDA GROUP · THE ART OF EXPANSION</p>
    </div>
  );
}
