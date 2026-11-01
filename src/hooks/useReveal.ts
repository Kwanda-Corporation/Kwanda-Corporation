import { useEffect, type RefObject } from 'react';

/**
 * Adds a `.is-inview` class to every `[data-reveal]` descendant of `scope`
 * once it scrolls into view inside the `.experience-scroll` well. Elements are
 * revealed once and left visible.
 */
export function useReveal(scope: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const root = scope.current;
    if (!root) return;

    const scroller = root.closest<HTMLElement>('.experience-scroll');
    const elements = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'));

    if (typeof IntersectionObserver === 'undefined') {
      elements.forEach((el) => el.classList.add('is-inview'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-inview');
          observer.unobserve(entry.target);
        });
      },
      { root: scroller ?? null, threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [scope]);
}
