export function LoadingScreen() {
  return (
    <div className="loading-screen" role="status" aria-live="polite">
      <p className="loading-brand">KWANDA</p>
      <div className="loading-track" aria-hidden="true">
        <span className="loading-bar" />
      </div>
      <p className="loading-label">PREPARING THE LANDSCAPE</p>
    </div>
  );
}
