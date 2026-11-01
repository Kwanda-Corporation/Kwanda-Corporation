import { useRef } from 'react';
import { useReveal } from '../../hooks/useReveal';
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
        <p className="experience-kicker" data-reveal>
          Our team · The Creative Studio
        </p>
        <h1 className="experience-title" id="team-title" data-reveal>
          The Creative
          <br />
          <em>Studio</em>
        </h1>
        <p className="experience-tagline" data-reveal>
          The people who imagine, design and build.
        </p>
        <p className="experience-lede" data-reveal>
          Kwanda is made by people — the individuals who turn ideas into
          products. Each person here is introduced as themselves, not just a
          role on an org chart.
        </p>
      </section>

      <section className="project-section" data-reveal>
        <div className="section-index" aria-hidden="true">
          01
        </div>
        <div className="section-body">
          <h2 className="section-title">The studio</h2>
          <div className="section-copy">
            <p>
              Team members are presented as they are confirmed — real names,
              real roles, real people. The studio is kept honest: no role is
              filled on paper until a person actually holds it.
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
                <p className="member-copy">{member.intro}</p>
              </div>
            </article>
          ))}
        </div>
      )}
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
