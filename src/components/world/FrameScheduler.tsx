import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { idleMilliseconds, isRenderActive } from '../../lib/renderActivity';

type FrameSchedulerProps = {
  /** Frame rate while the camera or an interaction is animating. */
  activeFps: number;
  /** Frame rate while the scene has recently been left alone. */
  idleFps: number;
  /** Frame rate once the world has been completely still for a while. */
  sleepFps?: number;
  /** Stop drawing entirely (e.g. while a destination page covers the world). */
  paused: boolean;
};

/** After this long without input, the ambient motion drops to a trickle. */
const SLEEP_AFTER_MS = 12000;

/**
 * The canvas runs in `frameloop="demand"` mode. This scheduler decides how
 * often to ask for a frame: full speed during camera movement or input, a much
 * lower cadence for the idle ambient animation, and nothing at all while the
 * tab is hidden or an editorial page covers the landscape. This is what keeps
 * the world from pinning a low-end machine's CPU/GPU around the clock.
 */
export function FrameScheduler({
  activeFps,
  idleFps,
  sleepFps = 2,
  paused,
}: FrameSchedulerProps) {
  const invalidate = useThree((state) => state.invalidate);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  // Draw one frame as soon as the world is revealed again.
  useEffect(() => {
    if (!paused) invalidate();
  }, [paused, invalidate]);

  useEffect(() => {
    let frame = 0;
    let last = 0;

    const tick = (now: number) => {
      frame = window.requestAnimationFrame(tick);

      if (pausedRef.current || document.hidden) {
        // Forget the last timestamp so the first frame after resuming is
        // drawn immediately instead of waiting out the idle interval.
        last = 0;
        return;
      }

      const fps = isRenderActive(now)
        ? activeFps
        : idleMilliseconds(now) > SLEEP_AFTER_MS
          ? sleepFps
          : idleFps;
      if (last !== 0 && now - last < 1000 / fps - 0.5) return;

      last = now;
      invalidate();
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [invalidate, activeFps, idleFps, sleepFps]);

  return null;
}
