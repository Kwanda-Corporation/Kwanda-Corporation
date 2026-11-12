import { useRef } from 'react';
import { useReveal } from '../../hooks/useReveal';
import { OrbitDiagram, RidgeArt } from '../experience/ExperienceArt';
import { TEAM } from './team';

/**
 * THE CREATIVE STUDIO — the people behind Kwanda, presented as people rather
 * than job titles. The data lives in `team.ts`; each member is shown with
 * their name, role and a short introduction.
 */
export function TeamExperience() {
  const rootRef = useRef<HTMLDivElement>(null);
  useReveal(rootRef);

  return (
    <div className="project" ref={rootRef}>
      <section className="experience-hero" aria-labelledby="team-title">
        <div className="art-layer art-layer--br" aria-hidden="true">
          <OrbitDiagram />
        </div>
        <p className="experience-kicker" data-reveal>
          Our team · The Creative Studio
        </p>
        <h1 className="experience-title" id="team-title" data-reveal>
          The Creative
          <br />
          <em>Studio</em>
        </h1>
        <p className="experience-lede" data-reveal>
          Kwanda is made by people. Leadership sets the direction, engineering
          turns ideas into products, and operations keeps everything running —
          together, the team moves the company&apos;s work from ideas into
          functioning systems.
        </p>
      </section>

      <section className="project-section section--right" data-reveal>
        <div className="art-layer art-layer--bl" aria-hidden="true">
          <RidgeArt variant="valley" />
        </div>
        <div className="section-index" aria-hidden="true">
          01
        </div>
        <div className="section-body">
          <h2 className="section-title">The studio</h2>
          <div className="section-copy">
            <p>
              Building meaningful technology takes collaboration between people
              with different strengths. Each member below is introduced with
              their real name and role — described through what they do, without
              invented biographies or credentials.
            </p>
          </div>
        </div>
      </section>

      {TEAM.length === 0 ? (
        <EmptyState
          title="The studio is being introduced"
          copy="Team profiles will appear here as they are confirmed. Until then, the studio belongs to the people already building the work — introduced properly, one at a time."
        />
      ) : (
        <div className="team-list" data-reveal>
          {TEAM.map((member, i) => (
            <article className="member" key={member.id}>
              <span className="member-index" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="member-body">
                <h3 className="member-name">{member.name}</h3>
                <p className="member-role">{member.role}</p>
                {member.focus ? <p className="member-focus">{member.focus}</p> : null}
                <p className="member-copy">{member.intro}</p>
              </div>
            </article>
          ))}
        </div>
      )}

      <section className="about-philosophy" data-reveal aria-labelledby="team-statement">
        <div className="art-layer art-layer--full" aria-hidden="true">
          <RidgeArt variant="peaks" />
        </div>
        <div className="philosophy-grid">
          <div className="philosophy-lead">
            <div className="philosophy-index" aria-hidden="true">
              02
            </div>
            <p className="philosophy-kicker">Our team philosophy</p>
            <h2 className="philosophy-title" id="team-statement">
              Different strengths,
              <br />
              <span className="accent-word">one direction.</span>
            </h2>
          </div>
          <div className="philosophy-body">
            <p className="philosophy-copy">
              Leadership establishes direction, engineering turns ideas into
              products, and operations ensures those products and the business can
              function effectively. Kwanda values creativity, responsibility,
              technical excellence, collaboration and a shared commitment to
              building useful technology.
            </p>
          </div>
        </div>
      </section>

      <section className="about-close" data-reveal>
        <p className="about-close-line" aria-hidden="true" />
        <p className="about-close-title">The art of collaboration.</p>
        <img
          className="about-close-logo"
          src="/brand/kwanda-logo.png"
          alt="Kwanda Corporations"
          width={290}
          height={209}
        />
      </section>
    </div>
  );
}

function EmptyState({ title, copy }: { title: string; copy: string }) {
  return (
    <section className="empty-state" data-reveal>
      <p className="empty-state-mark" aria-hidden="true">
        —
      </p>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-copy">{copy}</p>
    </section>
  );
}
