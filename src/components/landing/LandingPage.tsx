import { useEffect } from 'react';
import { OpeningScene } from '../opening/OpeningScene';
import { LandingSections } from './LandingSections';

type LandingPageProps = {
  onEnterWorld: () => void;
};

/**
 * The scrollable company landing page. The opening scene is the hero; the
 * company story, products, milestones, people and contact details follow as
 * ordinary scrollable sections so the page carries the whole introduction
 * without forcing a visit to the 3D world.
 */
export function LandingPage({ onEnterWorld }: LandingPageProps) {
  /* Give the fixed nav a legible backdrop once the hero is behind us. */
  useEffect(() => {
    const sync = () => {
      document.body.classList.toggle('is-scrolled', window.scrollY > 40);
    };

    sync();
    window.addEventListener('scroll', sync, { passive: true });

    return () => {
      window.removeEventListener('scroll', sync);
      document.body.classList.remove('is-scrolled');
    };
  }, []);

  return (
    <div className="landing">
      <div className="landing-progress" aria-hidden="true" />
      <section className="landing-hero" aria-label="Kwanda Corporations — where software meets art">
        <OpeningScene onEnterWorld={onEnterWorld} />
        <a className="landing-scroll" href="#landing-content">
          <span className="landing-scroll-line" aria-hidden="true" />
          <span>Scroll to explore</span>
        </a>
      </section>
      <LandingSections />
    </div>
  );
}
