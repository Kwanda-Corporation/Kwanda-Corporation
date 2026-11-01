import {
  useEffect,
  useLayoutEffect,
  useRef,
  type ReactNode,
} from 'react';
import { LANDMARKS, LANDMARK_LIST, type LandmarkId } from '../../lib/landmarks';
import { SplitReveal } from './SplitReveal';

type ExperienceTransitionProps = {
  active: LandmarkId;
  onNavigate: (id: LandmarkId) => void;
  onClose: () => void;
  closing: boolean;
  children: ReactNode;
};

const FOCUSABLE =
  'button, a[href], input, textarea, select, [tabindex]:not([tabindex="-1"])';

/**
 * The white editorial sheet that wraps every destination. It owns the top bar
 * (brand, destination nav, return-to-world), the scroll well, focus trapping and
 * the Escape shortcut so the individual experiences only have to describe their
 * own content.
 */
export function ExperienceTransition({
  active,
  onNavigate,
  onClose,
  closing,
  children,
}: ExperienceTransitionProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset scroll to the top whenever the destination changes.
  useLayoutEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [active]);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;

    const focusables = () =>
      Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null,
      );

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const current = document.activeElement as HTMLElement | null;

      if (event.shiftKey && (current === first || !node.contains(current))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && current === last) {
        event.preventDefault();
        first.focus();
      }
    };

    // Move focus into the sheet when it opens.
    const returnButton = node.querySelector<HTMLElement>('.experience-return');
    (returnButton ?? node.querySelector<HTMLElement>('.experience-nav button'))?.focus();

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <>
      <SplitReveal closing={closing} />
      <div
        ref={rootRef}
        className={`experience${closing ? ' is-closing' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={LANDMARKS[active].name}
      >
        <header className="experience-bar">
          <button
            type="button"
            className="experience-brand"
            onClick={() => onNavigate('about')}
            aria-label="Open the Origin House"
          >
            <span className="experience-brand-mark" aria-hidden="true" />
            <span className="experience-brand-word">KWANDA</span>
            <span className="experience-brand-sub">CORPORATIONS</span>
          </button>

          <nav className="experience-nav" aria-label="Destinations">
            {LANDMARK_LIST.map((info) => (
              <button
                key={info.id}
                type="button"
                className={info.id === active ? 'is-current' : undefined}
                aria-current={info.id === active ? 'page' : undefined}
                onClick={() => onNavigate(info.id)}
              >
                {info.navLabel}
              </button>
            ))}
          </nav>

          <button type="button" className="experience-return" onClick={onClose}>
            <span>Return to world</span>
            <span className="experience-return-mark" aria-hidden="true" />
          </button>
        </header>

        <div className="experience-scroll" ref={scrollRef}>
          <div className="experience-content" key={active}>
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
