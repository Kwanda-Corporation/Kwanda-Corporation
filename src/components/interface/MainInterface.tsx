import { useCallback, useEffect, useState, type MutableRefObject } from 'react';
import { useIsTouch } from '../../hooks/useReducedMotion';
import { AudioControls } from '../audio/AudioControls';
import type { NavigationApi } from '../world/CameraController';

type MainInterfaceProps = {
  apiRef: MutableRefObject<NavigationApi | null>;
};

export function MainInterface({ apiRef }: MainInterfaceProps) {
  const touch = useIsTouch();
  const [fullscreen, setFullscreen] = useState(false);
  const [canFullscreen, setCanFullscreen] = useState(false);

  useEffect(() => {
    setCanFullscreen(Boolean(document.fullscreenEnabled));
    const onChange = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await document.documentElement.requestFullscreen();
      }
    } catch {
      /* fullscreen can be blocked by the browser */
    }
  }, []);

  return (
    <div className="world-ui">
      <header className="ui-brand">
        <span className="brand-mark" aria-hidden="true" />
        <div>
          <p className="ui-brand-word">KWANDA</p>
          <p className="ui-brand-sub">THE ART OF EXPANSION</p>
        </div>
      </header>

      <div className="ui-top-right">
        <AudioControls />
        {canFullscreen && (
          <button
            type="button"
            className="ui-button ui-button-square"
            onClick={() => {
              void toggleFullscreen();
            }}
            aria-label={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            title={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {fullscreen ? <CollapseIcon /> : <ExpandIcon />}
          </button>
        )}
      </div>

      <div className="ui-bottom-left">
        <span className="hint-dot" aria-hidden="true" />
        <div>
          <p className="hint-main">{touch ? 'Tap anywhere to explore' : 'Click anywhere to explore'}</p>
          <p className="hint-sub">
            {touch ? 'Drag to look · Pinch to zoom' : 'Drag to look · Scroll to zoom'}
          </p>
        </div>
      </div>

      <div className="ui-bottom-right" aria-label="View controls">
        <button
          type="button"
          className="zoom-button"
          onClick={() => apiRef.current?.zoomIn()}
          aria-label="Zoom in"
          title="Zoom in"
        >
          <PlusIcon />
        </button>
        <button
          type="button"
          className="zoom-button"
          onClick={() => apiRef.current?.zoomOut()}
          aria-label="Zoom out"
          title="Zoom out"
        >
          <MinusIcon />
        </button>
        <button
          type="button"
          className="zoom-button"
          onClick={() => apiRef.current?.reset()}
          aria-label="Reset view"
          title="Reset view"
        >
          <ResetIcon />
        </button>
      </div>

      <footer className="ui-footer" aria-hidden="true">
        <span>THOUSAND HILLS</span>
        <span className="footer-rule" />
        <span>RWANDA</span>
      </footer>
    </div>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" fill="none">
      <path d="M8 2.5v11M2.5 8h11" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" fill="none">
      <path d="M2.5 8h11" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}

function ResetIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" fill="none">
      <circle cx="8" cy="8" r="2.1" stroke="currentColor" strokeWidth="1.1" />
      <path
        d="M8 1.6v2.3M8 12.1v2.3M1.6 8h2.3M12.1 8h2.3"
        stroke="currentColor"
        strokeWidth="1.1"
      />
    </svg>
  );
}

function ExpandIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" fill="none">
      <path
        d="M6 2H2v4M10 2h4v4M6 14H2v-4M10 14h4v-4"
        stroke="currentColor"
        strokeWidth="1.1"
      />
    </svg>
  );
}

function CollapseIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" fill="none">
      <path
        d="M2 6h4V2M14 6h-4V2M2 10h4v4M14 10h-4v4"
        stroke="currentColor"
        strokeWidth="1.1"
      />
    </svg>
  );
}
