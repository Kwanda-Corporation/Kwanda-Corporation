import { useRef, useState } from 'react';
import { useReveal } from '../../hooks/useReveal';
import { MEDIA } from '../../lib/media';

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

const SCREENSHOTS = [
  { src: MEDIA.strsScreenshot1, caption: 'Student transport, organised in one place.' },
  { src: MEDIA.strsScreenshot2, caption: 'Routes and coordination, made legible.' },
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
        <h1 className="experience-title" id="strs-title" data-reveal>
          Every student,
          <br />
          <em>accounted for.</em>
        </h1>
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
              Student transport involves schools, parents, operators, students
              and education administrators. When those parties depend on
              disconnected communication and manual processes, coordinating
              transport becomes difficult.
            </p>
            <p>
              Schools struggle to manage arrangements, parents have limited
              visibility into transportation activity, and operators find it
              hard to coordinate routes and student movements efficiently.
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
              STRS is intended to bring together schools, parents, transport
              operators and relevant education stakeholders onto a shared,
              digitally connected picture of student transportation.
            </p>
            <ul className="system-list">
              <li>
                <strong>Coordination</strong> — bringing schools, parents,
                operators and authorities onto one connected system.
              </li>
              <li>
                <strong>Visibility</strong> — making routes, vehicles and
                students legible in a single place.
              </li>
              <li>
                <strong>Organisation</strong> — turning daily demand into
                clearer, more reliable routing.
              </li>
              <li>
                <strong>Communication</strong> — improving the flow of
                information between parents and schools.
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
          <h2 className="section-title">The concept</h2>
          <div className="section-copy">
            <p>
              A developing Kwanda initiative — early views of the system
              exploring how student transport could be organised and made
              visible. These are concepts, not yet an operational launch.
            </p>
          </div>
          <div className="media-stack media-grid">
            {SCREENSHOTS.map((shot) => (
              <figure className="media-figure" key={shot.src}>
                <img src={shot.src} alt={shot.caption} loading="lazy" />
                <figcaption>{shot.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="project-section" data-reveal>
        <div className="section-index" aria-hidden="true">
          05
        </div>
        <div className="section-body">
          <h2 className="section-title">Long-term vision</h2>
          <div className="section-copy">
            <p>
              STRS represents Kwanda&apos;s interest in technology that extends
              beyond commercial applications into public and social
              infrastructure — supporting more organised student transportation
              and contributing to the broader digital transformation of
              education-related services.
            </p>
          </div>
        </div>
      </section>

      <section className="about-philosophy" data-reveal aria-labelledby="strs-ambition">
        <div className="philosophy-index" aria-hidden="true">
          06
        </div>
        <p className="philosophy-kicker">The ambition</p>
        <h2 className="philosophy-title" id="strs-ambition">
          Coordination,
          <br />
          <span className="accent-word">made visible.</span>
        </h2>
        <p className="philosophy-copy">
          The goal is simple: clearer coordination could mean safer journeys,
          fewer missed trips, and less time lost to confusion between schools,
          families and operators.
        </p>
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
          approval or operational adoption is claimed — proposed capabilities
          are described as intentions, not finished features.
        </p>
      </section>

      <section className="about-close" data-reveal>
        <p className="about-close-line" aria-hidden="true" />
        <p className="about-close-title">The art of coordination.</p>
        <p className="about-close-sub">KWANDA CORPORATIONS</p>
      </section>
    </div>
  );
}
