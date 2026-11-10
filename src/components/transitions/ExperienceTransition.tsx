import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
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
 * Milliseconds the split panels take to close over the outgoing page before the
 * incoming page is swapped in and the panels part again. Matches the 0.5s
 * panel transition so the cut lands exactly at the seam.
 */
const BREAK_MS = 520;

/**
 * The white editorial sheet that wraps every destination. It owns the top bar
 * (brand, destination nav, return-to-world), the scroll well, focus trapping,
 * the Escape shortcut and the split reveal — including the "break" transition
 * used when travelling between destinations without returning to the world.
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

  // The destination currently on screen. It lags one beat behind `active` so
  // the panels can close over the outgoing page before the new one appears.
  const [view, setView] = useState<{ id: LandmarkId; content: ReactNode }>({
    id: active,
    content: children,
  });
  const [open, setOpen] = useState(false);
  const prevActive = useRef(active);
  const childrenRef = useRef(children);
  childrenRef.current = children;

  // Reset scroll to the top whenever the shown destination changes.
  useLayoutEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [view.id]);

  // First reveal: part the panels once the sheet has mounted.
  useEffect(() => {
    const raf1 = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setOpen(true));
    });
    return () => window.cancelAnimationFrame(raf1);
  }, []);

  // Page-to-page navigation: close over the outgoing page, swap, then reopen.
  useEffect(() => {
    if (prevActive.current === active) return;
    prevActive.current = active;
    setOpen(false);
    const timer = window.setTimeout(() => {
      setView({ id: active, content: childrenRef.current });
      setOpen(true);
    }, BREAK_MS);
    return () => window.clearTimeout(timer);
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
      <SplitReveal open={open && !closing} />
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
          <div className="experience-content" key={view.id}>
            {view.content}
          </div>
        </div>
      </div>
    </>
  );
}
