import { useRef } from 'react';
import { useReveal } from '../../hooks/useReveal';
import { PARTNERS, PARTNER_CATEGORIES } from './partners';

/**
 * THE CONNECTION PLAZA — the organisations and relationships that support
 * Kwanda's ecosystem. The data lives in `partners.ts`; each partner is shown
 * with its category, relationship and (when available) a link out.
 */
export function PartnersExperience() {
  const rootRef = useRef<HTMLDivElement>(null);
  useReveal(rootRef);

  return (
    <div className="project" ref={rootRef}>
      <section className="experience-hero" aria-labelledby="partners-title">
        <p className="experience-kicker" data-reveal>
          Partners · The Connection Plaza
        </p>
        <h1 className="experience-title" id="partners-title" data-reveal>
          The Connection
          <br />
          <em>Plaza</em>
        </h1>
        <p className="experience-tagline" data-reveal>
          Meaningful technology grows through collaboration.
        </p>
        <p className="experience-lede" data-reveal>
          The organisations, businesses and technology providers that contribute
          to Kwanda&apos;s work — listed only where a real relationship exists, and
          never implied where it does not.
        </p>
      </section>

      <section className="project-section" data-reveal>
        <div className="section-index" aria-hidden="true">
          01
        </div>
        <div className="section-body">
          <h2 className="section-title">Our connections</h2>
          <div className="section-copy">
            <p>
              Partners are organised by the nature of the relationship — strategic,
              technology, infrastructure and operational — so each connection is
              understood for what it actually is.
            </p>
          </div>
        </div>
      </section>

      {PARTNERS.length === 0 ? (
        <EmptyState
          title="Connections being confirmed"
          copy="Verified partners will appear here once relationships are established and confirmed. A service provider or integration is only listed when the relationship is real."
        />
      ) : (
        <div className="partner-grid" data-reveal>
          {PARTNER_CATEGORIES.map((category) => {
            const members = PARTNERS.filter((p) => p.category === category.id);
            if (members.length === 0) return null;
            return (
              <section className="partner-group" key={category.id}>
                <h3 className="partner-group-title">{category.label}</h3>
                {members.map((partner) => (
                  <article className="partner" key={partner.id}>
                    <h4 className="partner-name">{partner.name}</h4>
                    <p className="partner-copy">{partner.description}</p>
                    <p className="partner-relationship">{partner.relationship}</p>
                    {partner.website ? (
                      <a
                        className="partner-link"
                        href={partner.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Visit ↗
                      </a>
                    ) : null}
                  </article>
                ))}
              </section>
            );
          })}
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
