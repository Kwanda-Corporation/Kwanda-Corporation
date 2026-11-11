import { lazy, Suspense, useCallback, useRef, useState } from 'react';
import gsap from 'gsap';
import { AudioProvider } from './hooks/useAudio';
import { OpeningScene } from './components/opening/OpeningScene';
import { LoadingScreen } from './components/interface/LoadingScreen';

const WorldCanvas = lazy(() => import('./components/world/WorldCanvas'));

function Experience() {
  const [stage, setStage] = useState<'opening' | 'world'>('opening');
  const curtainRef = useRef<HTMLDivElement>(null);

  const handleEnterWorld = useCallback(() => {
    setStage('world');

    const curtain = curtainRef.current;
    if (!curtain) return;

    const line = curtain.querySelector('.curtain-line');
    gsap.killTweensOf([curtain, line]);
    gsap.set(curtain, { opacity: 1 });
    gsap.to(curtain, {
      opacity: 0,
      duration: 1.8,
      delay: 0.5,
      ease: 'power2.inOut',
    });
    gsap.fromTo(
      line,
      { opacity: 0, scaleX: 0.12 },
      { opacity: 1, scaleX: 1, duration: 0.9, delay: 0.25, ease: 'power3.out' },
    );
    gsap.to(line, { opacity: 0, duration: 0.9, delay: 1.25, ease: 'power2.in' });
  }, []);

  return (
    <div className="app">
      {stage === 'opening' && <OpeningScene onEnterWorld={handleEnterWorld} />}

      {stage === 'world' && (
        <Suspense fallback={<LoadingScreen />}>
          <WorldCanvas />
        </Suspense>
      )}

      <div className="curtain" ref={curtainRef} aria-hidden="true">
        <span className="curtain-line" />
      </div>
    </div>
  );
}

export function App() {
  return (
    <AudioProvider>
      <Experience />
    </AudioProvider>
  );
}
