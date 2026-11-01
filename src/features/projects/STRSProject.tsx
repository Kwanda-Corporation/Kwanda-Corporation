import { useRef, useState } from 'react';
import { useReveal } from '../../hooks/useReveal';

const AUDIENCES = [
  {
    title: 'Schools',
    copy: 'A clear view of who is arriving, by which route, and when.',
  },
  {
    title: 'Parents',
    copy: 'Confidence that a journey is organised, visible and accounted for.',
  },
  {
    title: 'Transport operators',
    copy: 'Better coordination of vehicles, routes and daily demand.',
  },
  {
    title: 'Education authorities',
    copy: 'Oversight across the whole student transport network.',
  },
];

export function STRSProject() {
  const rootRef = useRef<HTMLDivElement>(null);
  const systemRef = useRef<HTMLElement>(null);
  const [focused, setFocused] = useState(false);
  useReveal(rootRef);

  const explore = () => {
    systemRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setFocused(true);
    window.setTimeout(() => setFocused(false), 2400);
  };

  return (
    <div className="project" ref={rootRef}>
      <section className="experience-hero" aria-labelledby="strs-title">
        <p className="experience-kicker" data-reveal>
          Project 02 · Education &amp; transportation technology
        </p>
        <p className="project-status" data-reveal>
          <span className="project-status-dot" aria-hidden="true" />
          Concept / Proposed system
        </p>
        <h1 className="experience-title project-title" id="strs-title" data-reveal>
          STRS
        </h1>
        <p className="experience-tagline" data-reveal>
          A connected approach to student transportation.
        </p>
        <p className="experience-lede" data-reveal>
          STRS — the Student Transport and Routing System — is a proposed system
          designed to connect the people and organisations responsible for
          getting students to school.
        </p>
      </section>

      <section className="project-section" data-reveal>
        <div className="section-index" aria-hidden="true">
          01
        </div>
        <div className="section-body">
          <h2 className="section-title">The problem</h2>
          <div className="section-copy">
            <p>
              Student transport often runs on fragmented information. Schools,
              parents and operators each hold a different piece of the picture,
              and no single view shows where a student is, whether a vehicle is
              on route, or how the day&apos;s journeys fit together.
            </p>
          </div>
        </div>
      </section>

      <section className="project-section" data-reveal>
        <div className="section-index" aria-hidden="true">
          02
        </div>
        <div className="section-body">
          <h2 className="section-title">Who it is for</h2>
          <div className="audiences">
            {AUDIENCES.map((audience) => (
              <div className="audience" key={audience.title}>
                <h3 className="audience-title">{audience.title}</h3>
                <p className="audience-copy">{audience.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className={`project-section project-system${focused ? ' is-focused' : ''}`}
        ref={systemRef}
        data-reveal
        aria-labelledby="strs-system-title"
      >
        <div className="section-index" aria-hidden="true">
          03
        </div>
        <div className="section-body">
          <h2 className="section-title" id="strs-system-title">
            The proposed system
          </h2>
          <div className="section-copy">
            <p>
              STRS is intended to improve coordination, visibility and
              organisation across student transportation and routing.
            </p>
            <ul className="system-list">
              <li>
                <strong>Coordination</strong> — bringing schools, parents,
                operators and authorities onto a shared picture of the day&apos;s
                journeys.
              </li>
              <li>
                <strong>Visibility</strong> — making routes, vehicles and
                students legible in one place.
              </li>
              <li>
                <strong>Organisation</strong> — turning daily demand into
                clearer, more reliable routing.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="project-section" data-reveal>
        <div className="section-index" aria-hidden="true">
          04
        </div>
        <div className="section-body">
          <h2 className="section-title">Potential impact</h2>
          <div className="section-copy">
            <p>
              Clearer coordination could mean safer journeys, fewer missed
              trips, and less time lost to confusion between schools, families
              and operators. The goal is simple: every student, accounted for.
            </p>
          </div>
        </div>
      </section>

      <section className="project-action" data-reveal>
        <p className="project-action-label">See the concept</p>
        <button type="button" className="btn btn-primary project-cta" onClick={explore}>
          <span className="btn-dot" aria-hidden="true" />
          Explore the project
          <span aria-hidden="true">↓</span>
        </button>
        <p className="project-note">
          STRS is presented here as a concept. No public launch, partnership,
          approval or operational adoption is claimed.
        </p>
      </section>
    </div>
  );
}
