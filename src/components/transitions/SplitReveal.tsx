import { useEffect, useState } from 'react';

type SplitRevealProps = {
  closing: boolean;
};

/**
 * The environment split: two full-bleed panels that part vertically — the top
 * rising, the bottom falling — to reveal the destination page behind them.
 * Reverses cleanly when returning to the world.
 */
export function SplitReveal({ closing }: SplitRevealProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let raf2 = 0;
    const raf1 = window.requestAnimationFrame(() => {
      raf2 = window.requestAnimationFrame(() => setOpen(true));
    });
    return () => {
      window.cancelAnimationFrame(raf1);
      window.cancelAnimationFrame(raf2);
    };
  }, []);

  return (
    <div
      className={`split-reveal${open && !closing ? ' is-open' : ''}`}
      aria-hidden="true"
    >
      <span className="split-panel split-panel-top" />
      <span className="split-panel split-panel-bottom" />
    </div>
  );
}
