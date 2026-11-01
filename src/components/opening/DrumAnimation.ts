import { useEffect, type RefObject } from 'react';
import { audioEngine } from '../../audio/AudioEngine';
import { STEP_DURATION, STEPS } from '../../audio/percussionPattern';

type DrummerMotionOptions = {
  swayRef: RefObject<SVGGElement>;
  armLRef: RefObject<SVGGElement>;
  armRRef: RefObject<SVGGElement>;
  headRef: RefObject<SVGGElement>;
  hits: number[];
  playing: boolean;
  animated: boolean;
  reduced: boolean;
  fallbackStart: number;
  phaseOffset?: number;
};

const SHOULDER_L = { x: -34, y: -228 };
const SHOULDER_R = { x: 34, y: -228 };
const NECK = { x: 0, y: -252 };
const HIPS = { x: 0, y: -110 };

function modulo(value: number, base: number): number {
  return ((value % base) + base) % base;
}

export function useDrummerMotion({
  swayRef,
  armLRef,
  armRRef,
  headRef,
  hits,
  playing,
  animated,
  reduced,
  fallbackStart,
  phaseOffset = 0,
}: DrummerMotionOptions): void {
  useEffect(() => {
    if (!animated) return;

    let frame = 0;
    let visible = true;
    const onVisibility = () => {
      visible = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', onVisibility);

    const tick = (now: number) => {
      frame = window.requestAnimationFrame(tick);
      if (!visible) return;

      const idleSeconds = now / 1000;
      const audioSeconds = playing ? audioEngine.getPercussionSeconds() : null;
      const fallbackSeconds = playing && fallbackStart > 0 ? (now - fallbackStart) / 1000 : null;
      const rhythmSeconds = playing
        ? Math.max(0, audioSeconds ?? fallbackSeconds ?? 0)
        : null;

      let strikeL = 0;
      let strikeR = 0;

      if (playing && rhythmSeconds !== null) {
        const stepFloat = rhythmSeconds / STEP_DURATION + phaseOffset;
        const step = modulo(Math.floor(stepFloat), STEPS);
        const phase = stepFloat - Math.floor(stepFloat);
        const hitIndex = hits.indexOf(step);

        if (hitIndex >= 0) {
          const envelope = Math.exp(-phase * 3.4) * (1 - Math.min(1, phase * 1.15));
          if (hitIndex % 2 === 0) strikeL = envelope;
          else strikeR = envelope;
        }
      }

      const amplitude = reduced ? 0.35 : 1;
      const idleSway = playing ? 0 : Math.sin(idleSeconds * 0.62 + phaseOffset) * (reduced ? 0 : 0.9);
      const idleArm = playing ? 0 : Math.sin(idleSeconds * 0.8 + phaseOffset * 1.7) * (reduced ? 0 : 1.4);

      const leftAngle = strikeL * 10.5 * amplitude + idleArm;
      const rightAngle = -strikeR * 10.5 * amplitude - idleArm;

      armLRef.current?.setAttribute(
        'transform',
        `rotate(${leftAngle.toFixed(2)} ${SHOULDER_L.x} ${SHOULDER_L.y})`,
      );
      armRRef.current?.setAttribute(
        'transform',
        `rotate(${rightAngle.toFixed(2)} ${SHOULDER_R.x} ${SHOULDER_R.y})`,
      );

      let bob = 0;
      let lean = 0;
      let headAngle = 0;

      if (playing && rhythmSeconds !== null) {
        const beatFloat = rhythmSeconds / STEP_DURATION;
        bob = Math.sin(beatFloat * Math.PI * 0.5) * 1.1 * amplitude;
        lean = (strikeL + strikeR) * 0.75 * amplitude;
        headAngle = -(strikeL + strikeR) * 1.6 * amplitude;
      } else {
        bob = idleSway;
        lean = idleSway * 0.35;
        headAngle = idleSway * 0.4;
      }

      swayRef.current?.setAttribute(
        'transform',
        `translate(0 ${bob.toFixed(2)}) rotate(${lean.toFixed(2)} ${HIPS.x} ${HIPS.y})`,
      );
      headRef.current?.setAttribute(
        'transform',
        `rotate(${headAngle.toFixed(2)} ${NECK.x} ${NECK.y})`,
      );
    };

    frame = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [
    animated,
    playing,
    reduced,
    fallbackStart,
    hits,
    phaseOffset,
    swayRef,
    armLRef,
    armRRef,
    headRef,
  ]);
}
