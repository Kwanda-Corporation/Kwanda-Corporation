import { useCallback, useEffect, useRef, useState } from 'react';
import { useAudio } from '../../hooks/useAudio';

export function AudioControls() {
  const { started, muted, volume, enableAmbience, setMuted, setVolume } = useAudio();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const closeOnOutside = useCallback((event: PointerEvent) => {
    if (!rootRef.current) return;
    if (!rootRef.current.contains(event.target as Node)) setOpen(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', closeOnOutside);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutside);
      document.removeEventListener('keydown', onKey);
    };
  }, [closeOnOutside, open]);

  const soundIsOff = muted || !started;

  return (
    <div className="sound" ref={rootRef}>
      <button
        type="button"
        className={open ? 'ui-button is-open' : 'ui-button'}
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label="Sound settings"
        title="Sound"
      >
        {soundIsOff ? <SpeakerOffIcon /> : <SpeakerOnIcon />}
        <span className="ui-button-label">SOUND</span>
      </button>

      {open && (
        <div className="sound-panel" role="dialog" aria-label="Sound settings">
          <div className="sound-panel-header">
            <span>AMBIENCE</span>
            <span className={started && !muted ? 'status-on' : 'status-off'}>
              {started ? (muted ? 'MUTED' : 'ON') : 'OFF'}
            </span>
          </div>

          {started ? (
            <button
              type="button"
              className="panel-action"
              onClick={() => setMuted(!muted)}
            >
              {muted ? 'Resume ambience' : 'Mute ambience'}
            </button>
          ) : (
            <button
              type="button"
              className="panel-action"
              onClick={() => {
                void enableAmbience();
              }}
            >
              Start ambience
            </button>
          )}

          <label className="volume-row">
            <span>VOLUME</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(event) => setVolume(Number(event.target.value))}
              aria-label="Ambience volume"
            />
            <span className="volume-value">{Math.round(volume * 100)}</span>
          </label>

          <p className="sound-hint">
            Original percussion and ambience, generated in your browser. No
            recordings, no tracking.
          </p>
        </div>
      )}
    </div>
  );
}

function SpeakerOnIcon() {
  return (
    <svg viewBox="0 0 20 20" width="15" height="15" aria-hidden="true" fill="none">
      <path d="M3 7.5h3l4-3.2v11.4l-4-3.2H3z" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M13 7.2a4 4 0 0 1 0 5.6M15.2 5a7 7 0 0 1 0 10"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  );
}

function SpeakerOffIcon() {
  return (
    <svg viewBox="0 0 20 20" width="15" height="15" aria-hidden="true" fill="none">
      <path d="M3 7.5h3l4-3.2v11.4l-4-3.2H3z" stroke="currentColor" strokeWidth="1.2" />
      <path d="M13.2 7.4l4.2 5.2M17.4 7.4l-4.2 5.2" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
