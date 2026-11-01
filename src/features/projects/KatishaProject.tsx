import { useRef } from 'react';
import { useReveal } from '../../hooks/useReveal';
import { KATISHA_URL } from './projects';

const STEPS = [
  { n: '01', title: 'Search', copy: 'Enter a route and see the journeys available.' },
  { n: '02', title: 'Compare', copy: 'Review times, routes and options side by side.' },
  { n: '03', title: 'Book', copy: 'Confirm a seat and complete the booking.' },
  { n: '04', title: 'Travel', copy: 'Board with confidence, ticket in hand.' },
];

export function KatishaProject() {
  const rootRef = useRef<HTMLDivElement>(null);
  useReveal(rootRef);

  return (
    <div className="project" ref={rootRef}>
      <section className="experience-hero" aria-labelledby="katisha-title">
        <p className="experience-kicker" data-reveal>
          Project 01 · Transportation technology
        </p>
        <h1 className="experience-title project-title" id="katisha-title" data-reveal>
          Katisha
        </h1>
        <p className="experience-tagline" data-reveal>
          Connecting journeys through technology.
        </p>
        <p className="experience-lede" data-reveal>
          Katisha is a digital transportation booking platform designed to make
          discovering and booking journeys easier.
        </p>
      </section>

      <section className="project-section" data-reveal>
        <div className="section-index" aria-hidden="true">
          01
        </div>
        <div className="section-body">
          <h2 className="section-title">What it does</h2>
          <div className="section-copy">
            <p>
              Katisha brings transport options into one place, so a traveller
              can see what is available, compare journeys and complete a booking
              without leaving the platform.
            </p>
          </div>
        </div>
      </section>

      <section className="project-section" data-reveal>
        <div className="section-index" aria-hidden="true">
          02
        </div>
        <div className="section-body">
          <h2 className="section-title">The problem</h2>
          <div className="section-copy">
            <p>
              Finding and booking transport is often fragmented across operators,
              phone calls and cash payments. Katisha organises that process into
              a single, clear booking journey.
            </p>
          </div>
        </div>
      </section>

      <section className="project-section" data-reveal>
        <div className="section-index" aria-hidden="true">
          03
        </div>
        <div className="section-body">
          <h2 className="section-title">The booking experience</h2>
          <div className="steps">
            {STEPS.map((step) => (
              <div className="step" key={step.n}>
                <span className="step-n" aria-hidden="true">
                  {step.n}
                </span>
                <div>
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-copy">{step.copy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="project-section" data-reveal>
        <div className="section-index" aria-hidden="true">
          04
        </div>
        <div className="section-body">
          <h2 className="section-title">The ecosystem</h2>
          <div className="section-copy">
            <p>
              Katisha connects travellers with the operators, routes and
              schedules that serve their journeys — turning a scattered process
              into one connected, accessible experience.
            </p>
          </div>
        </div>
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
    </div>
  );
}
