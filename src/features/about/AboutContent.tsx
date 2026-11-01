import { useRef } from 'react';
import { useReveal } from '../../hooks/useReveal';

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

export function AboutContent() {
  const rootRef = useRef<HTMLDivElement>(null);
  useReveal(rootRef);

  return (
    <div className="about" ref={rootRef}>
      <section className="experience-hero" aria-labelledby="about-title">
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
          KWANDA CORPORATIONS is a technology company focused on creating
          meaningful digital products and solutions.
        </p>
      </section>

      <section className="about-section" data-reveal>
        <div className="section-index" aria-hidden="true">
          01
        </div>
        <div className="section-body">
          <h2 className="section-title">Who we are</h2>
          <div className="section-copy">
            <p>
              KWANDA CORPORATIONS is a technology company focused on creating
              meaningful digital products and solutions.
            </p>
            <p>
              We bring together creativity, engineering and problem-solving to
              build technology that addresses real-world challenges.
            </p>
          </div>
        </div>
      </section>

      <section className="about-section" data-reveal>
        <div className="section-index" aria-hidden="true">
          02
        </div>
        <div className="section-body">
          <h2 className="section-title">Our story</h2>
          <div className="story">
            <p className="story-lede">
              Kwanda exists to turn ideas into things people can actually use.
            </p>
            <p>
              We set out to build digital products, and to treat the craft of
              building them as part of the product itself. Behind every screen is
              a series of choices about how something should feel, how it should
              be understood and how it should serve the person using it.
            </p>
            <p>
              The journey is rarely a straight line. Ideas begin as sketches and
              questions, pass through prototypes and dead ends, and only become
              solutions through patient engineering and a willingness to keep
              listening.
            </p>
            <p>
              We are guided by a simple ambition — to expand what technology can
              make possible for the people who use it. That story is still being
              written.
            </p>
          </div>
        </div>
      </section>

      <section className="about-philosophy" data-reveal aria-labelledby="philosophy-title">
        <div className="philosophy-index" aria-hidden="true">
          03
        </div>
        <p className="philosophy-kicker">Our philosophy</p>
        <h2 className="philosophy-title" id="philosophy-title">
          Where art
          <br />
          meets software.
        </h2>
        <p className="philosophy-copy">
          We believe technology is not only about functionality. It is also
          about imagination, design, creativity and the experience people have
          when they interact with it.
        </p>
      </section>

      <section className="about-section about-values" data-reveal>
        <div className="section-index" aria-hidden="true">
          04
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
        <p className="about-close-sub">KWANDA CORPORATIONS</p>
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
