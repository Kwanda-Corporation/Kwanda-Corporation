export function LoadingScreen() {
  return (
    <div className="loading-screen" role="status" aria-live="polite">
      <img
        className="loading-logo"
        src="/brand/kwanda-logo-light.png"
        alt="Kwanda Corporations"
        width={290}
        height={209}
      />
      <div className="loading-track" aria-hidden="true">
        <span className="loading-bar" />
      </div>
      <p className="loading-label">PREPARING THE LANDSCAPE</p>
    </div>
  );
}
