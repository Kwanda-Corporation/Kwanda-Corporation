type BrandWordmarkProps = {
  /** Extra class for context-specific sizing. */
  className?: string;
  /** `light` for dark surfaces, `ink` for light surfaces. */
  tone?: 'light' | 'ink';
};

/**
 * The Kwanda brand lockup: the logo icon on the left, followed by the wordmark
 * with "Kwanda" and "Corporations" separated by a thin rule.
 */
export function BrandWordmark({ className, tone = 'light' }: BrandWordmarkProps) {
  return (
    <span
      className={`brand-wordmark brand-wordmark--${tone}${className ? ` ${className}` : ''}`}
      role="img"
      aria-label="Kwanda Corporations"
    >
      <img
        className="brand-wordmark-icon"
        src="/brand/logo-icon.png"
        alt=""
        aria-hidden="true"
        width={247}
        height={55}
      />
      <span className="brand-wordmark-text">
        <span className="brand-wordmark-name" aria-hidden="true">Kwanda</span>
        <span className="brand-wordmark-divider" aria-hidden="true" />
        <span className="brand-wordmark-suffix" aria-hidden="true">Corporations</span>
      </span>
    </span>
  );
}
