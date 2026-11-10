import { useRef } from 'react';
import { useReveal } from '../../hooks/useReveal';
import { MILESTONES, MILESTONE_CATEGORIES } from './achievements';

/**
 * THE MILESTONE GALLERY — an editorial timeline of Kwanda's verified progress.
 * The data lives in `achievements.ts`; each milestone is shown chronologically
 * with its category, title, date (when verified) and why it mattered.
 */
export function AchievementsExperience() {
  const rootRef = useRef<HTMLDivElement>(null);
  useReveal(rootRef);

  return (
    <div className="project" ref={rootRef}>
      <section className="experience-hero" aria-labelledby="achievements-title">
        <p className="experience-kicker" data-reveal>
          Achievements · The Milestone Gallery
        </p>
        <h1 className="experience-title" id="achievements-title" data-reveal>
          The Milestone
          <br />
          <em>Gallery</em>
        </h1>
        <p className="experience-lede" data-reveal>
          Our journey, recorded milestone by milestone — a growing archive of
          Kwanda&apos;s real progress. The moments, products and achievements that
          mark how far the work has come, published only as they are verified.
        </p>
      </section>

      <section className="project-section" data-reveal>
        <div className="section-index" aria-hidden="true">
          01
        </div>
        <div className="section-body">
          <h2 className="section-title">The timeline</h2>
          <div className="section-copy">
            <p>
              Each milestone below is confirmed before it is published. Dates are
              shown only when they are known for certain — nothing is described
              as an achievement until it has actually happened.
            </p>
          </div>
        </div>
      </section>

      {MILESTONES.length === 0 ? (
        <EmptyState
          title="Milestones being curated"
          copy="Verified milestones will appear here as they are confirmed. This gallery is deliberately honest — nothing is published as an achievement until it has actually happened."
        />
      ) : (
        <div className="timeline" data-reveal>
          {MILESTONES.map((milestone, i) => (
            <article className="milestone" key={milestone.id}>
              <span className="milestone-index" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="milestone-body">
                <p className="milestone-category">
                  {MILESTONE_CATEGORIES.find((c) => c.id === milestone.category)?.label}
                </p>
                <h3 className="milestone-title">{milestone.title}</h3>
                {milestone.date ? <p className="milestone-date">{milestone.date}</p> : null}
                <p className="milestone-copy">{milestone.description}</p>
                {milestone.image ? (
                  <figure className="milestone-figure">
                    <img
                      src={milestone.image}
                      alt={milestone.imageCaption ?? milestone.title}
                      loading="lazy"
                    />
                    {milestone.imageCaption ? (
                      <figcaption>{milestone.imageCaption}</figcaption>
                    ) : null}
                  </figure>
                ) : null}
                <p className="milestone-why">{milestone.why}</p>
              </div>
            </article>
          ))}
        </div>
      )}

      <section className="about-philosophy" data-reveal aria-labelledby="achievements-statement">
        <div className="philosophy-index" aria-hidden="true">
          02
        </div>
        <p className="philosophy-kicker">Our definition of achievement</p>
        <h2 className="philosophy-title" id="achievements-statement">
          An idea,
          <br />
          <span className="accent-word">in use.</span>
        </h2>
        <p className="philosophy-copy">
          For Kwanda, one of the most important achievements is seeing an idea
          become something people can actually use. Meaningful innovation is a
          continuous process — of experimentation, engineering, persistence and
          learning.
        </p>
      </section>

      <section className="about-close" data-reveal>
        <p className="about-close-line" aria-hidden="true" />
        <p className="about-close-title">The art of progress.</p>
        <p className="about-close-sub">KWANDA CORPORATIONS</p>
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
