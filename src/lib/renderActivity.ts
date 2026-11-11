/**
 * A tiny shared clock used to tell the WebGL renderer when it needs to run at
 * full speed. Continuous rendering is what keeps a laptop's fans spinning and
 * its CPU/GPU pinned; the world is mostly still, so we only ask for a high
 * frame rate while the camera or a marker is actually moving, and let the
 * ambient animation settle to an occasional frame after a quiet spell.
 */
let activeUntil = 0;
let lastActivity = 0;

/** Keep the canvas rendering at full rate for a short while. */
export function noteRenderActivity(durationMs = 400): void {
  if (typeof performance === 'undefined') return;
  const now = performance.now();
  lastActivity = now;
  const until = now + durationMs;
  if (until > activeUntil) activeUntil = until;
}

export function isRenderActive(now: number): boolean {
  return now < activeUntil;
}

/** How long the scene has been left completely alone. */
export function idleMilliseconds(now: number): number {
  return lastActivity === 0 ? Number.POSITIVE_INFINITY : now - lastActivity;
}
