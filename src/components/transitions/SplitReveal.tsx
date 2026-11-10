type SplitRevealProps = {
  /** Whether the two environment panels are parted (revealing the sheet). */
  open: boolean;
};

/**
 * The environment split: two full-bleed panels that part vertically — the top
 * rising, the bottom falling — to reveal a destination page behind them.
 * Controlled from `ExperienceTransition`, which closes the panels over the old
 * page, swaps the content, then reopens them for a clean "break" between
 * destinations.
 */
export function SplitReveal({ open }: SplitRevealProps) {
  return (
    <div
      className={`split-reveal${open ? ' is-open' : ''}`}
      aria-hidden="true"
    >
      <span className="split-panel split-panel-top" />
      <span className="split-panel split-panel-bottom" />
    </div>
  );
}
