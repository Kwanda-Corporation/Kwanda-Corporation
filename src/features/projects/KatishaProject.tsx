import { useEffect, useRef, useState } from 'react';
import { useReveal } from '../../hooks/useReveal';
import { MEDIA } from '../../lib/media';
import {
  ProcessArc,
  RidgeArt,
  RouteDiagram,
  StackDiagram,
  TractionChart,
} from '../experience/ExperienceArt';
import { KATISHA_URL } from './projects';

const STEPS = [
  { n: '01', title: 'Search', copy: 'Enter a route and see the journeys available, in one place.' },
  { n: '02', title: 'Compare', copy: 'Review times, routes and options side by side.' },
  { n: '03', title: 'Book', copy: 'Confirm a seat and complete the booking digitally.' },
  { n: '04', title: 'Travel', copy: 'Board with confidence, ticket in hand.' },
];

const PROBLEMS = [
  'Difficulty discovering available travel options',
  'Inconvenient physical booking processes',
  'Limited access to transport information',
  'Fragmented communication between passengers and operators',
  'Organising journeys from another location',
];

/**
 * The product film, now the living backdrop of the hero. It plays muted and
 * looped behind the copy, pauses whenever the hero is scrolled away or the
 * window loses focus, and offers one control so the motion can be stopped.
 */
function KatishaHeroFilm() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const userPausedRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const play = () => {
      if (reducedMotion || document.hidden || userPausedRef.current) return;
      void video.play().catch(() => {
        /* autoplay can be refused; the toggle below still works */
      });
    };
    const pause = () => video.pause();

    if (reducedMotion) pause();
    else play();

    const onVisibility = () => {
      if (document.hidden) pause();
      else play();
    };
    const onBlur = () => pause();
    const onFocus = () => play();

    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('blur', onBlur);
    window.addEventListener('focus', onFocus);

    // Stop decoding once the hero has left the viewport.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) play();
        else pause();
      },
      { threshold: 0.05 },
    );
    observer.observe(video);

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('focus', onFocus);
      observer.disconnect();
      video.pause();
    };
  }, [reducedMotion]);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      userPausedRef.current = false;
      void video.play().catch(() => {
        /* no gesture / unsupported codec */
      });
    } else {
      userPausedRef.current = true;
      video.pause();
    }
  };

  return (
    <>
      <div className="katisha-hero-film" aria-hidden="true">
        <video
          ref={videoRef}
          className="katisha-hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          tabIndex={-1}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        >
          <source src={MEDIA.katishaVideo} type="video/mp4" />
        </video>
        <div className="katisha-hero-scrim" />
      </div>
      <button
        type="button"
        className="katisha-film-toggle"
        onClick={toggle}
        aria-label={playing ? 'Pause the Katisha film' : 'Play the Katisha film'}
      >
        <span
          className="katisha-film-toggle-mark"
          data-playing={playing}
          aria-hidden="true"
        />
        {playing ? 'Pause film' : 'Play film'}
      </button>
    </>
  );
}

export function KatishaProject() {
  const rootRef = useRef<HTMLDivElement>(null);
  useReveal(rootRef);

  return (
    <div className="project" ref={rootRef}>
      <section className="experience-hero katisha-hero" aria-labelledby="katisha-title">
        <KatishaHeroFilm />
        <div className="katisha-hero-copy">
          <p className="experience-kicker" data-reveal>
            Project 01 · Travel technology
          </p>
          <p className="project-status" data-reveal>
            <span className="project-status-dot" aria-hidden="true" />
            Live product
          </p>
          <h1 className="experience-title" id="katisha-title" data-reveal>
            Travel,
            <br />
            <em>booked.</em>
          </h1>
          <p className="experience-lede" data-reveal>
            Katisha is a digital travel booking platform originating in Rwanda —
            designed to make travelling across East Africa easier, more accessible
            and more convenient, without a trip to the bus station.
          </p>
        </div>
      </section>

      <section className="project-section section--split" data-reveal>
        <div className="art-layer art-layer--bl" aria-hidden="true">
          <RouteDiagram broken />
        </div>
        <div className="section-index" aria-hidden="true">
          01
        </div>
        <div className="section-body">
          <h2 className="section-title">The problem</h2>
          <div className="section-copy">
            <p>
              Travel booking across parts of East Africa remains fragmented.
              Passengers often depend on physical bus stations, telephone calls
              and individual operators to organise their journeys.
            </p>
            <ul className="system-list">
              {PROBLEMS.map((problem) => (
                <li key={problem}>{problem}.</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="project-section section--center" data-reveal>
        <div className="art-layer art-layer--br" aria-hidden="true">
          <ProcessArc />
        </div>
        <div className="section-index" aria-hidden="true">
          02
        </div>
        <div className="section-body">
          <h2 className="section-title">The solution</h2>
          <div className="section-copy">
            <p>
              Katisha connects passengers with transportation operators and
              simplifies discovering and booking bus journeys — bringing digital
              discovery, online booking, operator integration and digital
              payments into one platform.
            </p>
          </div>
          <div className="steps">
            {STEPS.map((step) => (
              <div className="step" key={step.n}>
                <span className="step-n" aria-hidden="true">
                  {step.n}
                </span>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-copy">{step.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="project-section section--media" data-reveal>
        <div className="section-index" aria-hidden="true">
          03
        </div>
        <div className="section-body">
          <h2 className="section-title">The product</h2>
          <div className="section-copy">
            <p>
              The platform in action — the booking experience Katisha is building
              for travellers, and the operators it connects them with.
            </p>
          </div>
          <div className="media-stack">
            <figure className="media-figure media-figure-short">
              <img
                src={MEDIA.katishaAgents}
                alt="Katisha bus station agents"
                loading="lazy"
              />
              <figcaption>
                Working alongside bus station agents to connect the physical and
                digital journeys.
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="project-section section--split" data-reveal>
        <div className="art-layer art-layer--bl" aria-hidden="true">
          <TractionChart />
        </div>
        <div className="section-index" aria-hidden="true">
          04
        </div>
        <div className="section-body">
          <h2 className="section-title">Growth &amp; traction</h2>
          <div className="section-copy">
            <p>
              Katisha has progressed beyond the idea stage into a real product —
              with passengers using the platform, bookings being processed,
              transportation operators participating, and digital payment
              infrastructure in place.
            </p>
            <p>
              The company has also worked through the operational, regulatory and
              technical requirements of building a transportation technology
              business — the less visible work that makes the product sustainable.
            </p>
          </div>
        </div>
      </section>

      <section className="project-section section--right" data-reveal>
        <div className="art-layer art-layer--lc" aria-hidden="true">
          <StackDiagram />
        </div>
        <div className="section-index" aria-hidden="true">
          05
        </div>
        <div className="section-body">
          <h2 className="section-title">Building it</h2>
          <div className="section-copy">
            <p>
              Under the hood, Katisha runs on modern, production-grade
              infrastructure: a Node.js and TypeScript backend, MongoDB Atlas for
              the database, Docker-based deployment on OVH cloud, pawaPay for
              payments, and mobile and web experiences. These are implementation
              details — the story that matters is the problem Katisha solves and
              the experience it is building for travellers.
            </p>
          </div>
        </div>
      </section>

      <section className="about-philosophy" data-reveal aria-labelledby="katisha-ambition">
        <div className="art-layer art-layer--full" aria-hidden="true">
          <RidgeArt variant="peaks" />
        </div>
        <div className="philosophy-grid">
          <div className="philosophy-lead">
            <div className="philosophy-index" aria-hidden="true">
              06
            </div>
            <p className="philosophy-kicker">The ambition</p>
            <h2 className="philosophy-title" id="katisha-ambition">
              East African travel,
              <br />
              <span className="accent-word">booked in seconds.</span>
            </h2>
          </div>
          <div className="philosophy-body">
            <p className="philosophy-copy">
              Katisha&apos;s broader vision is to make East African travel accessible
              from anywhere — a connected travel ecosystem that makes regional
              mobility easier through technology.
            </p>
          </div>
        </div>
      </section>

      <section className="project-action project-action--center" data-reveal>
        <p className="project-action-label">Visit the product</p>
        <a
          className="btn btn-primary project-cta"
          href={KATISHA_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="btn-dot" aria-hidden="true" />
          Open project
          <span aria-hidden="true">↗</span>
        </a>
        <p className="project-note">
          Katisha is a live product — booking happens on katisha.today. This
          presentation is only a doorway to it.
        </p>
      </section>

      <section className="about-close" data-reveal>
        <p className="about-close-line" aria-hidden="true" />
        <p className="about-close-title">The art of the journey.</p>
        <p className="about-close-sub">KWANDA CORPORATIONS</p>
      </section>
    </div>
  );
}
