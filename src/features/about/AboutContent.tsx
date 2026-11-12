import { useRef } from 'react';
import { useReveal } from '../../hooks/useReveal';
import {
  CompassRose,
  GrowthRings,
  ProcessArc,
  RidgeArt,
} from '../experience/ExperienceArt';

const VALUES = [
  {
    title: 'Creativity',
    statement: 'Approaching problems with imagination, before we ask what is practical we ask what is possible.',
    glyph: (
      <svg viewBox="0 0 40 40" aria-hidden="true">
        <circle cx="20" cy="20" r="7.5" />
        <path d="M20 2v7M20 31v7M2 20h7M31 20h7M7.3 7.3l5 5M27.7 27.7l5 5M32.7 7.3l-5 5M12.3 27.7l-5 5" />
      </svg>
    ),
  },
  {
    title: 'Engineering',
    statement: 'Transforming ideas into working solutions — code is how a concept becomes something real.',
    glyph: (
      <svg viewBox="0 0 40 40" aria-hidden="true">
        <rect x="8" y="8" width="24" height="24" />
        <path d="M8 8l24 24M32 8L8 32" />
      </svg>
    ),
  },
  {
    title: 'Purpose',
    statement: 'Building technology that addresses meaningful problems, not technology for its own sake.',
    glyph: (
      <svg viewBox="0 0 40 40" aria-hidden="true">
        <circle cx="20" cy="20" r="11" />
        <circle cx="20" cy="20" r="4.5" />
      </svg>
    ),
  },
  {
    title: 'Growth',
    statement: 'Continuously learning, improving and expanding — every product is a step toward something larger.',
    glyph: (
      <svg viewBox="0 0 40 40" aria-hidden="true">
        <path d="M20 34V16" />
        <path d="M20 26l-6-6M20 26l6-6" />
        <path d="M12 18c0-6 3-10 8-10s8 4 8 10" />
      </svg>
    ),
  },
  {
    title: 'Collaboration',
    statement: 'Creating better outcomes together — the best ideas emerge when different minds meet.',
    glyph: (
      <svg viewBox="0 0 40 40" aria-hidden="true">
        <circle cx="12" cy="14" r="4" />
        <circle cx="28" cy="14" r="4" />
        <circle cx="20" cy="27" r="4" />
        <path d="M14 17l4 6M26 17l-4 6M13 14h14" />
      </svg>
    ),
  },
];

const BELIEFS = [
  'Great technology begins with understanding real problems.',
  'Innovation should produce practical results, not just impressive demonstrations.',
  'Software should be designed around people, not the other way around.',
  'African challenges deserve world-class technological solutions.',
  'Creativity and engineering are complementary disciplines.',
  'A product is never finished — it evolves through experience and feedback.',
  'Small beginnings should never limit the scale of an idea.',
];

const APPROACH = [
  { n: '01', title: 'Discover', copy: 'Identify problems and opportunities in existing industries and communities.' },
  { n: '02', title: 'Imagine', copy: 'Explore creative approaches and develop a clear product vision.' },
  { n: '03', title: 'Design', copy: 'Transform ideas into meaningful user experiences and system architectures.' },
  { n: '04', title: 'Engineer', copy: 'Build functional, reliable and scalable software.' },
  { n: '05', title: 'Launch', copy: 'Introduce products to real users and operational environments.' },
  { n: '06', title: 'Evolve', copy: 'Learn from usage, feedback, challenges and changing needs.' },
];

export function AboutContent() {
  const rootRef = useRef<HTMLDivElement>(null);
  useReveal(rootRef);

  return (
    <div className="about" ref={rootRef}>
      <section className="experience-hero" aria-labelledby="about-title">
        <div className="art-layer art-layer--hero" aria-hidden="true">
          <RidgeArt variant="range" />
        </div>
        <div className="experience-hero-art" aria-hidden="true">
          <PavilionArt />
        </div>
        <p className="experience-kicker" data-reveal>
          About us · The Origin House
        </p>
        <h1 className="experience-title" id="about-title" data-reveal>
          Where art
          <br />
          <em>meets</em> software.
        </h1>
        <p className="experience-lede" data-reveal>
          Kwanda Corporations is a Rwanda-origin technology company focused on
          designing, developing and building digital products, software systems
          and technology-driven solutions that address real-world challenges.
        </p>
      </section>

      <section className="about-section section--right" data-reveal>
        <div className="art-layer art-layer--bl" aria-hidden="true">
          <RidgeArt variant="dunes" />
        </div>
        <div className="section-index" aria-hidden="true">
          01
        </div>
        <div className="section-body">
          <h2 className="section-title">Who we are</h2>
          <div className="section-copy">
            <p>
              Founded on the belief that technology should serve people and solve
              meaningful problems, Kwanda Corporations brings together software
              engineering, creativity, innovation and entrepreneurship to
              transform ideas into practical products.
            </p>
            <p>
              We are a product-oriented technology company — interested in
              identifying problems, developing solutions, launching products,
              learning from real users, and continuously improving the systems we
              build. Our work is aimed at building technology that can grow
              beyond its initial market, serve communities and contribute to the
              digital transformation of Africa.
            </p>
          </div>
        </div>
      </section>

      <section className="about-section section--split" data-reveal>
        <div className="art-layer art-layer--bl" aria-hidden="true">
          <GrowthRings />
        </div>
        <div className="section-index" aria-hidden="true">
          02
        </div>
        <div className="section-body">
          <h2 className="section-title">The meaning of Kwanda</h2>
          <div className="story">
            <p className="story-lede">
              The name Kwanda comes from the Kinyarwanda word for expanding,
              growing and increasing.
            </p>
            <p>
              That meaning reflects the company&apos;s philosophy: growth should not
              be limited to the company itself. Technology should expand
              opportunities, improve access to services, connect people and
              create possibilities that did not previously exist.
            </p>
            <p>
              It represents an ambition to grow from Rwanda into a company whose
              products and innovations can serve the wider African market — and
              eventually international markets.
            </p>
          </div>
        </div>
      </section>

      <section className="about-section section--right" data-reveal>
        <div className="art-layer art-layer--lc" aria-hidden="true">
          <CompassRose />
        </div>
        <div className="section-index" aria-hidden="true">
          03
        </div>
        <div className="section-body">
          <h2 className="section-title">Vision &amp; mission</h2>
          <div className="story">
            <p className="story-lede">Our vision</p>
            <p>
              To become a leading African technology company known for creating
              innovative digital products, intelligent systems and technological
              solutions that improve how people live, work, travel, learn and
              interact with the world.
            </p>
            <p className="story-lede">Our mission</p>
            <p>
              To identify meaningful challenges, combine creativity with
              engineering, and build accessible, reliable and scalable technology
              products that create lasting value for individuals, businesses and
              communities.
            </p>
          </div>
        </div>
      </section>

      <section className="about-philosophy" data-reveal aria-labelledby="philosophy-title">
        <div className="art-layer art-layer--full" aria-hidden="true">
          <RidgeArt variant="peaks" />
        </div>
        <div className="philosophy-grid">
          <div className="philosophy-lead">
            <div className="philosophy-index" aria-hidden="true">
              04
            </div>
            <p className="philosophy-kicker">Our philosophy</p>
            <h2 className="philosophy-title" id="philosophy-title">
              Where art
              <br />
              meets software.
            </h2>
          </div>
          <div className="philosophy-body">
            <p className="philosophy-copy">
              Exceptional technology requires more than writing code. It requires
              imagination, thoughtful design, engineering discipline and an
              understanding of the people who will use the final product.
            </p>
            <ul className="philosophy-beliefs">
              {BELIEFS.map((belief) => (
                <li key={belief}>{belief}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="about-section about-values section--center" data-reveal>
        <div className="art-layer art-layer--br" aria-hidden="true">
          <ProcessArc />
        </div>
        <div className="section-index" aria-hidden="true">
          05
        </div>
        <div className="section-body">
          <h2 className="section-title">Our approach</h2>
          <p className="approach-intro">
            Kwanda follows a product-oriented approach — building real products
            that people can actually use.
          </p>
          <div className="approach">
            {APPROACH.map((step) => (
              <div className="approach-step" key={step.n}>
                <span className="approach-n" aria-hidden="true">
                  {step.n}
                </span>
                <h3 className="approach-title">{step.title}</h3>
                <p className="approach-copy">{step.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-section about-values section--offset" data-reveal>
        <div className="art-layer art-layer--br" aria-hidden="true">
          <RidgeArt variant="peaks" />
        </div>
        <div className="section-index" aria-hidden="true">
          06
        </div>
        <div className="section-body">
          <h2 className="section-title">Our values</h2>
          <div className="values">
            {VALUES.map((value, i) => (
              <article
                className="value"
                key={value.title}
                tabIndex={0}
                aria-label={`${value.title} — ${value.statement}`}
              >
                <span className="value-index" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="value-title">{value.title}</h3>
                <p className="value-statement">{value.statement}</p>
                <span className="value-glyph" aria-hidden="true">
                  {value.glyph}
                </span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-close" data-reveal>
        <p className="about-close-line" aria-hidden="true" />
        <p className="about-close-title">The art of expansion.</p>
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

function PavilionArt() {
  return (
    <svg viewBox="0 0 640 360" className="pavilion-art" aria-hidden="true">
      <g className="pa-ink">
        <path d="M120 260h400" />
        <path d="M120 260h-40l40-18 40 18" />
        <path d="M520 260h40l-40-18-40 18" />
        <path d="M160 260v-96M480 260v-96" />
        <path d="M160 164h320" />
        <path d="M200 164l-60 96M440 164l60 96" />
        <path d="M200 164l60-34 60 34 60-34 60 34" />
        <path d="M320 130v-56" />
        <path d="M320 74h-30M320 74h30" />
      </g>
      <g className="pa-thin">
        <path d="M160 210h320M160 236h320" />
        <path d="M240 260v-96M400 260v-96" />
      </g>
      <g className="pa-accent">
        <path d="M320 260v-48" />
        <rect x="306" y="258" width="28" height="4" />
      </g>
    </svg>
  );
}
