import { useRef } from 'react';
import { useReveal } from '../../hooks/useReveal';
import { COMPANY, KATISHA_URL } from '../../lib/company';
import { TEAM } from '../../features/team/team';
import { BrandWordmark } from '../brand/BrandWordmark';

const APPROACH = [
  { id: '01', title: 'Discover', copy: 'Find the problem worth solving.' },
  { id: '02', title: 'Imagine', copy: 'Ask what is possible before what is practical.' },
  { id: '03', title: 'Design', copy: 'Shape experiences and system architecture.' },
  { id: '04', title: 'Engineer', copy: 'Build reliable, scalable software.' },
  { id: '05', title: 'Launch', copy: 'Put it in front of real people.' },
  { id: '06', title: 'Evolve', copy: 'Learn from use and keep improving.' },
];

const MILESTONES = [
  {
    date: 'Company',
    title: 'Registered in Rwanda',
    copy: 'Kwanda Corporations Ltd was established in Kigali — the legal and operational foundation for everything we build.',
  },
  {
    date: 'August 2026',
    title: 'VAT registration',
    copy: 'A professional operating structure for a digital transportation business.',
  },
  {
    date: 'Product',
    title: 'Katisha, live',
    copy: 'Real passengers, real bookings and participating transport operators across Rwanda and East Africa.',
  },
  {
    date: 'Product',
    title: 'Gerayo, in development',
    copy: 'Student transport and routing, connecting schools, parents, operators and education authorities.',
  },
];

const GALLERY = [
  {
    src: '/media/katisha-agents.jpg',
    alt: 'Katisha agents helping passengers plan bus journeys in Rwanda',
    caption: 'Katisha in the field',
    meta: 'Travel · Live product',
    width: 1600,
    height: 1067,
  },
  {
    src: '/media/gerayo-screenshot-1.jpg',
    alt: 'Gerayo school transport dashboard showing routes and student records',
    caption: 'Gerayo dashboard',
    meta: 'Product · Interface',
    width: 1600,
    height: 1067,
  },
  {
    src: '/og-image.png',
    alt: 'Kwanda Corporations brand artwork — a line-drawn African landscape at dusk',
    caption: 'Where software meets art',
    meta: 'Brand · Kigali',
    width: 1200,
    height: 630,
  },
];

const SOCIAL_PATHS: Record<string, string> = {
  linkedin:
    'M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.2h4v11.3H3V9.2Zm6.1 0h3.8v1.6h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.76v5.89h-4v-5.22c0-1.25-.03-2.85-1.82-2.85-1.82 0-2.1 1.35-2.1 2.76v5.31h-3.98V9.2Z',
  x: 'M17.2 3h3.1l-6.8 7.8L21.5 21h-6.2l-4.4-5.9L5.8 21H2.7l7.2-8.2L2.9 3h6.3l4 5.4L17.2 3Zm-1.1 16.1h1.7L7.9 4.8H6.1l10 14.3Z',
  github:
    'M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.1-1.47-1.1-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.88 1.52 2.31 1.08 2.87.82.09-.64.35-1.08.63-1.33-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z',
};

function SocialIcon({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
      <path d={SOCIAL_PATHS[id] ?? SOCIAL_PATHS.github} />
    </svg>
  );
}

export function LandingSections() {
  const rootRef = useRef<HTMLDivElement>(null);
  useReveal(rootRef);

  return (
    <div className="landing-content" id="landing-content" ref={rootRef}>
      {/* ---------------------------------------------------------- manifesto */}
      <section className="landing-section landing-intro" aria-labelledby="landing-about">
        <div className="landing-wrap">
          <p className="landing-kicker" data-reveal>
            <span className="landing-rule" aria-hidden="true" />
            Kigali · Rwanda
          </p>
          <h2 className="landing-statement" id="landing-about" data-reveal>
            A product company building software that
            <em> expands what people can reach.</em>
          </h2>
          <div className="landing-intro-grid">
            <p className="landing-lede" data-reveal>
              <strong>Kwanda Corporations</strong> designs, develops and builds digital
              products and software systems — then stays with them through launch, use and
              continuous improvement. Our work spans transportation, education, digital
              payments and cloud infrastructure.
            </p>
            <dl className="landing-stats" data-reveal>
              <div>
                <dt>Based in</dt>
                <dd>Kigali, Rwanda</dd>
              </div>
              <div>
                <dt>Products</dt>
                <dd>Katisha · Gerayo</dd>
              </div>
              <div>
                <dt>Working across</dt>
                <dd>East Africa</dd>
              </div>
            </dl>
          </div>
          <div className="landing-links" data-reveal>
            <a className="landing-button" href="/about/" target="_blank" rel="noopener noreferrer">
              About the company
              <ArrowIcon />
            </a>
            <a
              className="landing-button landing-button--ghost"
              href="/team/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Meet the team
              <ArrowIcon />
            </a>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- products */}
      <section className="landing-section landing-products" aria-labelledby="landing-products-title">
        <div className="landing-wrap">
          <div className="landing-head" data-reveal>
            <p className="landing-kicker">01 / Products</p>
            <h2 id="landing-products-title">Two products. One product discipline.</h2>
          </div>

          <div className="landing-product-grid">
            <article className="landing-product" data-reveal>
              <a
                className="landing-product-media"
                href="/katisha/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Read about Katisha"
              >
                <img
                  src="/media/katisha-agents.jpg"
                  alt="Katisha agents assisting passengers with bus journeys"
                  width={896}
                  height={1200}
                  loading="lazy"
                />
                <span className="landing-badge">Live product</span>
              </a>
              <div className="landing-product-copy">
                <span className="landing-meta">Travel booking · East Africa</span>
                <h3>Katisha</h3>
                <p>
                  Search a route, compare journeys, book a seat and travel with a digital QR
                  ticket. Katisha connects passengers with real bus operators and brings
                  mobile money payments into one platform.
                </p>
                <div className="landing-product-actions">
                  <a className="landing-text-link" href="/katisha/" target="_blank" rel="noopener noreferrer">
                    Read the Katisha story <ArrowIcon />
                  </a>
                  <a className="landing-text-link" href={KATISHA_URL} target="_blank" rel="noopener noreferrer">
                    Book at katisha.today <ArrowIcon />
                  </a>
                </div>
              </div>
            </article>

            <article className="landing-product" data-reveal>
              <a
                className="landing-product-media"
                href="/gerayo/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Read about Gerayo"
              >
                <img
                  src="/media/gerayo-screenshot-1.jpg"
                  alt="Gerayo student transport and routing interface"
                  width={1920}
                  height={888}
                  loading="lazy"
                />
                <span className="landing-badge landing-badge--muted">In development</span>
              </a>
              <div className="landing-product-copy">
                <span className="landing-meta">Education · Student transport</span>
                <h3>Gerayo</h3>
                <p>
                  A connected way for schools, parents, transport operators and education
                  authorities to organise, route and account for student journeys — making
                  the school run visible and dependable.
                </p>
                <div className="landing-product-actions">
                  <a className="landing-text-link" href="/gerayo/" target="_blank" rel="noopener noreferrer">
                    Explore Gerayo <ArrowIcon />
                  </a>
                  <a
                    className="landing-text-link"
                    href="/contact/?topic=Gerayo"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Discuss a school pilot <ArrowIcon />
                  </a>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ approach */}
      <section className="landing-section landing-approach" aria-labelledby="landing-approach-title">
        <div className="landing-wrap">
          <div className="landing-head" data-reveal>
            <p className="landing-kicker">02 / How we work</p>
            <h2 id="landing-approach-title">From a real problem to a working product.</h2>
          </div>
          <ol className="landing-steps">
            {APPROACH.map((step) => (
              <li className="landing-step" key={step.id} data-reveal>
                <span className="landing-step-id">{step.id}</span>
                <span className="landing-step-title">{step.title}</span>
                <span className="landing-step-copy">{step.copy}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------------------------------------------------------- milestones */}
      <section className="landing-section landing-milestones" aria-labelledby="landing-milestones-title">
        <div className="landing-wrap">
          <div className="landing-head" data-reveal>
            <p className="landing-kicker">03 / Milestones</p>
            <h2 id="landing-milestones-title">Built quietly, milestone by milestone.</h2>
          </div>
          <div className="landing-milestone-grid">
            {MILESTONES.map((item) => (
              <article className="landing-milestone" key={item.title} data-reveal>
                <span className="landing-meta">{item.date}</span>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
          <p className="landing-aside" data-reveal>
            The full record lives on the{' '}
            <a href="/about/" target="_blank" rel="noopener noreferrer">
              about page
            </a>
            .
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------- gallery */}
      <section className="landing-section landing-gallery" aria-labelledby="landing-gallery-title">
        <div className="landing-wrap">
          <div className="landing-head landing-head--split" data-reveal>
            <div>
              <p className="landing-kicker">04 / In the field</p>
              <h2 id="landing-gallery-title">Software where the work happens.</h2>
            </div>
            <p className="landing-head-note">
              Product and field imagery from Katisha and Gerayo. More photography is being
              added as the company grows.
            </p>
          </div>
          <div className="landing-gallery-grid">
            {GALLERY.map((item) => (
              <figure className="landing-shot" key={item.src} data-reveal>
                <img
                  src={item.src}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                  loading="lazy"
                />
                <figcaption>
                  <strong>{item.caption}</strong>
                  <span>{item.meta}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- team */}
      <section className="landing-section landing-team" aria-labelledby="landing-team-title">
        <div className="landing-wrap">
          <div className="landing-head" data-reveal>
            <p className="landing-kicker">05 / People</p>
            <h2 id="landing-team-title">A small team, close to the product.</h2>
          </div>
          <div className="landing-team-grid">
            {TEAM.map((member) => (
              <article className="landing-person" key={member.id} data-reveal>
                <img src={member.photo} alt={`Portrait of ${member.name}`} loading="lazy" />
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </article>
            ))}
          </div>
          <div className="landing-links" data-reveal>
            <a className="landing-button landing-button--ghost" href="/team/" target="_blank" rel="noopener noreferrer">
              More about the team
              <ArrowIcon />
            </a>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------- contact */}
      <section className="landing-section landing-contact" id="contact" aria-labelledby="landing-contact-title">
        <div className="landing-wrap">
          <div className="landing-contact-grid">
            <div data-reveal>
              <p className="landing-kicker">06 / Contact</p>
              <h2 id="landing-contact-title">
                Let&rsquo;s build something <em>useful.</em>
              </h2>
              <p className="landing-lede">
                A product question, a partnership, a school pilot or a media enquiry — write
                to us and we&rsquo;ll reply by email.
              </p>
              <div className="landing-links">
                <a className="landing-button" href="/contact/" target="_blank" rel="noopener noreferrer">
                  Send a message
                  <ArrowIcon />
                </a>
                <a className="landing-button landing-button--ghost" href={`mailto:${COMPANY.email}`}>
                  {COMPANY.email}
                </a>
              </div>
            </div>

            <div className="landing-contact-card" data-reveal>
              <div className="landing-contact-block">
                <span className="landing-meta">{COMPANY.address.label}</span>
                <address>
                  {COMPANY.address.line1}
                  <br />
                  {COMPANY.address.line2}
                  <br />
                  {COMPANY.address.country}
                </address>
                <span className="landing-note">
                  Visits by appointment while we finalise our permanent office.
                </span>
              </div>
              <div className="landing-contact-block">
                <span className="landing-meta">Talk to us</span>
                <a href={`tel:${COMPANY.phone}`}>{COMPANY.phoneDisplay}</a>
                <a href={`mailto:${COMPANY.katishaEmail}`}>{COMPANY.katishaEmail}</a>
                <span className="landing-note">Katisha bookings and support.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------- footer */}
      <footer className="landing-footer">
        <div className="landing-wrap">
          <div className="landing-footer-top">
            <div>
              <BrandWordmark className="landing-footer-logo" />
              <p className="landing-footer-line">Where software meets art.</p>
            </div>
            <nav className="landing-footer-nav" aria-label="Footer">
              <a href="/about/" target="_blank" rel="noopener noreferrer">About</a>
              <a href="/katisha/" target="_blank" rel="noopener noreferrer">Katisha</a>
              <a href="/gerayo/" target="_blank" rel="noopener noreferrer">Gerayo</a>
              <a href="/team/" target="_blank" rel="noopener noreferrer">Team</a>
              <a href="/faq/" target="_blank" rel="noopener noreferrer">FAQ</a>
              <a href="/contact/" target="_blank" rel="noopener noreferrer">Contact</a>
            </nav>
            <div className="landing-socials">
              {COMPANY.socials.map((social) => (
                <a
                  key={social.id}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${COMPANY.name} on ${social.label}`}
                >
                  <SocialIcon id={social.id} />
                  <span>{social.label}</span>
                </a>
              ))}
            </div>
          </div>
          <p className="landing-footer-legal">
            © {new Date().getFullYear()} {COMPANY.legalName} · Kigali, Rwanda
          </p>
        </div>
      </footer>
    </div>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 14 14" width="11" height="11" fill="none" aria-hidden="true">
      <path d="M3 11 11 3M4.4 3H11v6.6" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
