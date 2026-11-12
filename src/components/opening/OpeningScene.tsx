import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useAudio } from '../../hooks/useAudio';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { DrummerIllustration } from './DrummerIllustration';

type OpeningSceneProps = {
  onEnterWorld: () => void;
};

const DRUM_INTRO_MS = 5000;

export function OpeningScene({ onEnterWorld }: OpeningSceneProps) {
  const reduced = useReducedMotion();
  const { beginPercussion, enterWorld, enableAmbience, muted, setMuted } = useAudio();

  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [fallbackStart, setFallbackStart] = useState(0);

  const rootRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const poemLayerRef = useRef<HTMLDivElement>(null);
  const poemRef = useRef<HTMLParagraphElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const taglineLayerRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
  const enteredRef = useRef(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const lines = Array.from(root.querySelectorAll<SVGGeometryElement>('.dl'));
    const dots = Array.from(root.querySelectorAll<SVGCircleElement>('.backdrop-dot, .accent-dot'));

    const ctx = gsap.context(() => {
      gsap.set([brandRef.current, controlsRef.current], { autoAlpha: 0 });
      gsap.set([poemRef.current, actionsRef.current], { opacity: 0, y: 12 });
      gsap.set(taglineLayerRef.current, { autoAlpha: 0 });
      gsap.set(skipRef.current, { autoAlpha: 0 });
      gsap.set(dots, { opacity: 0 });

      gsap.to(lines, {
        strokeDashoffset: 0,
        duration: reduced ? 0.01 : 0.95,
        stagger: reduced ? 0 : { each: 0.0032, from: 'start' },
        delay: reduced ? 0 : 0.15,
        ease: 'power2.out',
        onComplete: () => setReady(true),
      });

      gsap.to(dots, {
        opacity: 0.75,
        duration: 1.4,
        delay: reduced ? 0 : 1.1,
        stagger: 0.05,
        ease: 'power1.out',
      });

      gsap.to([brandRef.current, controlsRef.current], {
        autoAlpha: 1,
        duration: 1,
        delay: reduced ? 0 : 0.5,
        ease: 'power1.out',
      });

      gsap.to(poemRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.3,
        delay: reduced ? 0.1 : 1.05,
        ease: 'power2.out',
      });

      gsap.to(actionsRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: reduced ? 0.2 : 1.85,
        ease: 'power2.out',
      });

      gsap.to(skipRef.current, {
        autoAlpha: 1,
        duration: 0.8,
        delay: reduced ? 0.3 : 2.1,
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  const goToWorld = useCallback(() => {
    if (enteredRef.current) return;
    enteredRef.current = true;
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    enterWorld();
    onEnterWorld();
  }, [enterWorld, onEnterWorld]);

  useEffect(
    () => () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    },
    [],
  );

  const handleBegin = useCallback(() => {
    if (playing || enteredRef.current) return;
    setPlaying(true);
    setFallbackStart(performance.now());
    void beginPercussion();

    gsap.to([poemRef.current, actionsRef.current], {
      opacity: 0,
      y: -10,
      duration: 0.55,
      ease: 'power2.in',
      onComplete: () => {
        if (actionsRef.current) actionsRef.current.style.display = 'none';
      },
    });

    gsap.to(taglineLayerRef.current, {
      autoAlpha: 1,
      duration: 1.3,
      delay: 0.4,
      ease: 'power2.out',
    });

    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null;
      goToWorld();
    }, DRUM_INTRO_MS);
  }, [beginPercussion, goToWorld, playing]);

  const handleSkip = useCallback(() => {
    if (enteredRef.current) return;
    void enableAmbience();
    goToWorld();
  }, [enableAmbience, goToWorld]);

  return (
    <div className="opening" ref={rootRef}>
      <div className="opening-art">
        <DrummerIllustration
          playing={playing}
          reduced={reduced}
          fallbackStart={fallbackStart}
        />
      </div>

      <div className="opening-scrim" aria-hidden="true" />

      <div className="opening-brand" ref={brandRef}>
        <img
          className="opening-brand-logo"
          src="/brand/kwanda-logo-light.png"
          alt="Kwanda Corporations"
          width={290}
          height={209}
        />
      </div>

      <div className="opening-controls" ref={controlsRef}>
        <button
          type="button"
          className="icon-button sound-button"
          onClick={() => setMuted(!muted)}
          aria-pressed={!muted}
          aria-label={muted ? 'Enable sound' : 'Mute sound'}
          title={muted ? 'Enable sound' : 'Mute sound'}
        >
          {muted ? <SoundOffIcon /> : <SoundOnIcon />}
          <span className="sound-label">{muted ? 'SOUND OFF' : 'SOUND ON'}</span>
        </button>
      </div>

      <button
        type="button"
        className="opening-skip"
        ref={skipRef}
        onClick={handleSkip}
        tabIndex={ready ? 0 : -1}
      >
        Skip intro
      </button>

      <div className="opening-caption">
        <div className="opening-layer" ref={poemLayerRef}>
          <p className="opening-poem" ref={poemRef}>
            Ideas have no boundaries.
          </p>
          <div className="opening-actions" ref={actionsRef}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleBegin}
              tabIndex={ready ? 0 : -1}
            >
              <span className="btn-dot" aria-hidden="true" />
              Enter the world
            </button>
            <a className="opening-text-link" href="#site-text">
              Text version
            </a>
          </div>
        </div>

        <div className="opening-layer" ref={taglineLayerRef}>
          <p className="opening-tagline">
            <span>KWANDA</span>
            <span className="tagline-rule" aria-hidden="true" />
            <span>WHERE SOFTWARE MEETS ART.</span>
          </p>
        </div>
      </div>

      <div className="opening-cue" aria-hidden="true">
        <span className="cue-line" />
        <span>AN INTERACTIVE LANDSCAPE</span>
      </div>
    </div>
  );
}

function SoundOnIcon() {
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true" fill="none">
      <path d="M3 7.5h3l4-3.2v11.4l-4-3.2H3z" stroke="currentColor" strokeWidth="1.2" />
      <path d="M13 7.2a4 4 0 0 1 0 5.6M15.2 5a7 7 0 0 1 0 10" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function SoundOffIcon() {
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true" fill="none">
      <path d="M3 7.5h3l4-3.2v11.4l-4-3.2H3z" stroke="currentColor" strokeWidth="1.2" />
      <path d="M13.2 7.4l4.2 5.2M17.4 7.4l-4.2 5.2" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
