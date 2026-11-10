import { useRef, useState } from 'react';
import { useReveal } from '../../hooks/useReveal';
import { MEDIA } from '../../lib/media';
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
 * The product film, framed as a phone. No poster image: the video's first
 * frame stands in as the cover until the play button is pressed.
 */
function KatishaFilm() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const play = () => {
    const video = videoRef.current;
    if (!video) return;
    void video.play().catch(() => {
      /* the browser will retry on the next gesture */
    });
  };

  return (
    <div className="katisha-hero-media" data-reveal>
      <div className="katisha-phone">
        <span className="katisha-phone-notch" aria-hidden="true" />
        <div className="katisha-phone-screen">
          <video
            ref={videoRef}
            className="katisha-phone-video"
            playsInline
            preload="auto"
            controls={playing}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={() => {
              setPlaying(false);
              if (videoRef.current) videoRef.current.currentTime = 0;
            }}
            aria-label="Katisha product film"
          >
            <source src={MEDIA.katishaVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          {!playing && (
            <button
              type="button"
              className="katisha-phone-play"
              onClick={play}
              aria-label="Play the Katisha film"
            >
              <span className="katisha-phone-play-ring" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
      <p className="katisha-phone-caption">Katisha — the journey, in motion.</p>
    </div>
  );
}

export function KatishaProject() {
  const rootRef = useRef<HTMLDivElement>(null);
  useReveal(rootRef);

  return (
    <div className="project" ref={rootRef}>
      <section className="experience-hero katisha-hero" aria-labelledby="katisha-title">
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

        <KatishaFilm />
      </section>

      <section className="project-section" data-reveal>
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

      <section className="project-section" data-reveal>
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

      <section className="project-section" data-reveal>
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

      <section className="project-section" data-reveal>
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

      <section className="project-section" data-reveal>
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
        <div className="philosophy-index" aria-hidden="true">
          06
        </div>
        <p className="philosophy-kicker">The ambition</p>
        <h2 className="philosophy-title" id="katisha-ambition">
          East African travel,
          <br />
          <span className="accent-word">booked in seconds.</span>
        </h2>
        <p className="philosophy-copy">
          Katisha&apos;s broader vision is to make East African travel accessible
          from anywhere — a connected travel ecosystem that makes regional
          mobility easier through technology.
        </p>
      </section>

      <section className="project-action" data-reveal>
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
