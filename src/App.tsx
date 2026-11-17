import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { AudioProvider } from './hooks/useAudio';
import { LandingPage } from './components/landing/LandingPage';
import { LoadingScreen } from './components/interface/LoadingScreen';

const WorldCanvas = lazy(() => import('./components/world/WorldCanvas'));

function Experience() {
  const [stage, setStage] = useState<'landing' | 'world'>('landing');
  const curtainRef = useRef<HTMLDivElement>(null);

  /* The fixed landing nav lives outside React for crawlers. It belongs to the
     landing page, so hide it once the visitor steps into the world. */
  useEffect(() => {
    document.body.classList.toggle('is-world-stage', stage === 'world');
    document.body.classList.toggle('is-landing-stage', stage === 'landing');
    return () => {
      document.body.classList.remove('is-world-stage');
      document.body.classList.remove('is-landing-stage');
    };
  }, [stage]);

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

  useEffect(() => {
    if (stage === 'world') window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [stage]);

  return (
    <div className={`app ${stage === 'landing' ? 'app--landing' : 'app--world'}`}>
      {stage === 'landing' && <LandingPage onEnterWorld={handleEnterWorld} />}

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
