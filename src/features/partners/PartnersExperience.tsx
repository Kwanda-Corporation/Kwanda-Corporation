import { useRef } from 'react';
import { useReveal } from '../../hooks/useReveal';
import { NetworkDiagram, RidgeArt } from '../experience/ExperienceArt';
import { PARTNERS, PARTNER_CATEGORIES, type Partner } from './partners';

/**
 * THE CONNECTION PLAZA — the organisations and relationships that support
 * Kwanda's ecosystem. Each partner is shown with its logo (or a clean wordmark
 * when no logo is bundled), category, relationship and a link out.
 */
export function PartnersExperience() {
  const rootRef = useRef<HTMLDivElement>(null);
  useReveal(rootRef);

  return (
    <div className="project" ref={rootRef}>
      <section className="experience-hero" aria-labelledby="partners-title">
        <div className="art-layer art-layer--br" aria-hidden="true">
          <NetworkDiagram />
        </div>
        <p className="experience-kicker" data-reveal>
          Partners · The Connection Plaza
        </p>
        <h1 className="experience-title" id="partners-title" data-reveal>
          The Connection
          <br />
          <em>Plaza</em>
        </h1>
        <p className="experience-lede" data-reveal>
          Meaningful technology grows through collaboration. The institutions,
          transport operators and technology providers that contribute to
          Kwanda&apos;s work — each listed for what the relationship actually is,
          and never overstated.
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
          <h2 className="section-title">Our connections</h2>
          <div className="section-copy">
            <p>
              Partners are organised by the nature of the relationship — the
              institutions and regulators that shape the ecosystem, the operators
              Katisha serves, and the technology platforms that underpin the work.
            </p>
          </div>
        </div>
      </section>

      {PARTNERS.length === 0 ? (
        <EmptyState
          title="Connections being confirmed"
          copy="Verified partners will appear here once relationships are established and confirmed."
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
                  <PartnerCard key={partner.id} partner={partner} />
                ))}
              </section>
            );
          })}
        </div>
      )}

      <section className="about-philosophy" data-reveal aria-labelledby="partners-statement">
        <div className="art-layer art-layer--full" aria-hidden="true">
          <RidgeArt variant="range" />
        </div>
        <div className="philosophy-grid">
          <div className="philosophy-lead">
            <div className="philosophy-index" aria-hidden="true">
              02
            </div>
            <p className="philosophy-kicker">Our partnership principle</p>
            <h2 className="philosophy-title" id="partners-statement">
              Build relationships that create
              <br />
              <span className="accent-word">measurable value.</span>
            </h2>
          </div>
          <div className="philosophy-body">
            <p className="philosophy-copy">
              Kwanda is interested in working with organisations that share an
              interest in innovation, digital transformation and solving practical
              challenges — across transportation, digital payments, infrastructure,
              education and beyond.
            </p>
          </div>
        </div>
      </section>

      <section className="about-close" data-reveal>
        <p className="about-close-line" aria-hidden="true" />
        <p className="about-close-title">The art of connection.</p>
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

function PartnerCard({ partner }: { partner: Partner }) {
  return (
    <article className="partner">
      <div className="partner-logo" aria-hidden="true">
        {partner.logo ? (
          <img src={partner.logo} alt="" loading="lazy" decoding="async" />
        ) : (
          <span className="partner-monogram">{monogram(partner.name)}</span>
        )}
      </div>
      <div className="partner-body">
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
      </div>
    </article>
  );
}

function monogram(name: string): string {
  const words = name.split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
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
