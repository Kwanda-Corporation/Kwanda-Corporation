import {
  Component,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useAudio } from '../../hooks/useAudio';
import { LANDMARKS, type LandmarkId } from '../../lib/landmarks';
import { JOURNEY_STOPS } from '../../lib/journey';
import { ExperienceTransition } from '../transitions/ExperienceTransition';
import { AboutExperience } from '../../features/about/AboutExperience';
import { AchievementsExperience } from '../../features/achievements/AchievementsExperience';
import { ProjectExperience } from '../../features/projects/ProjectExperience';
import { PartnersExperience } from '../../features/partners/PartnersExperience';
import { TeamExperience } from '../../features/team/TeamExperience';
import { MainInterface } from '../interface/MainInterface';
import { WebGLFallback } from '../interface/WebGLFallback';
import type { CameraView, NavigationApi } from './CameraController';
import { Scene } from './Scene';

function supportsWebGL2(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');
    if (!gl) return false;
    // Release the probe context immediately: browsers cap the number of live
    // WebGL contexts, and a throwaway one can starve the real renderer.
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch {
    return false;
  }
}

type CanvasBoundaryProps = {
  fallback: ReactNode;
  children: ReactNode;
};

type CanvasBoundaryState = {
  failed: boolean;
};

/**
 * Three.js r163+ requires WebGL2. Context creation can still fail on old
 * drivers even when the API is advertised, so keep the fallback as a safety
 * net around the whole renderer.
 */
class CanvasBoundary extends Component<CanvasBoundaryProps, CanvasBoundaryState> {
  state: CanvasBoundaryState = { failed: false };

  static getDerivedStateFromError(): CanvasBoundaryState {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    if (import.meta.env.DEV) {
      console.warn('WebGL renderer unavailable, showing the fallback.', error);
    }
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/** How long the camera spends walking up to a door before the page opens. */
const ENTER_MS = 950;

/** Routes a landmark id to its editorial experience body. */
function DestinationContent({ id }: { id: LandmarkId }) {
  switch (id) {
    case 'about':
      return <AboutExperience />;
    case 'katisha':
    case 'gerayo':
      return <ProjectExperience project={id} />;
    case 'achievements':
      return <AchievementsExperience />;
    case 'partners':
      return <PartnersExperience />;
    case 'team':
      return <TeamExperience />;
  }
}

export default function WorldCanvas() {
  const terrainRef = useRef<THREE.Mesh>(null);
  const apiRef = useRef<NavigationApi | null>(null);
  const reduced = useReducedMotion();
  const { pauseAmbience, resumeAmbience } = useAudio();
  const [ready, setReady] = useState(false);
  const [webgl] = useState(supportsWebGL2);

  const [experience, setExperience] = useState<LandmarkId | null>(null);
  const [closing, setClosing] = useState(false);
  const [entering, setEntering] = useState<LandmarkId | null>(null);
  const [scenePaused, setScenePaused] = useState(false);
  const savedView = useRef<CameraView | null>(null);
  const experienceRef = useRef<LandmarkId | null>(null);
  const enteringRef = useRef<LandmarkId | null>(null);
  const enterTimer = useRef<number | null>(null);
  const closeTimer = useRef<number | null>(null);

  const [journey, setJourney] = useState<{
    status: 'idle' | 'driving' | 'arrived';
    index: number;
  }>({ status: 'idle', index: 0 });

  const lowPower = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const cores = navigator.hardwareConcurrency ?? 4;
    return coarse || cores <= 4;
  }, []);

  const cancelEntering = useCallback(() => {
    if (enterTimer.current !== null) {
      window.clearTimeout(enterTimer.current);
      enterTimer.current = null;
    }
    enteringRef.current = null;
    setEntering(null);
  }, []);

  /** Opens the editorial sheet straight away (page-to-page navigation). */
  const openExperience = useCallback(
    (id: LandmarkId) => {
      cancelEntering();
      const api = apiRef.current;
      if (experienceRef.current === null) {
        if (api) savedView.current = api.getView();
      }
      experienceRef.current = id;
      setClosing(false);
      if (closeTimer.current !== null) {
        window.clearTimeout(closeTimer.current);
        closeTimer.current = null;
      }
      setExperience(id);
      pauseAmbience();

      const info = LANDMARKS[id];
      api?.flyTo({
        focusX: info.position.x,
        focusZ: info.position.z,
        distance: info.view.distance,
        azimuth: info.view.azimuth,
        elevation: info.view.elevation,
      });
    },
    [cancelEntering, pauseAmbience],
  );

  /**
   * Arriving at a destination is a small ritual: the camera walks up to the
   * door first (a closer, lower view of the house) while the scene dims, then
   * the editorial sheet opens over the threshold. Without this beat, clicking
   * a sign teleported the traveller straight into a white page.
   */
  const enterDestination = useCallback(
    (id: LandmarkId) => {
      // Already inside the sheet: switching destinations is a page turn.
      if (experienceRef.current !== null) {
        openExperience(id);
        return;
      }
      if (enteringRef.current === id) return;

      cancelEntering();

      const api = apiRef.current;
      if (api) savedView.current = api.getView();
      experienceRef.current = id;
      enteringRef.current = id;
      setClosing(false);
      setEntering(id);
      pauseAmbience();

      const info = LANDMARKS[id];
      // Step up to the threshold…
      api?.flyTo({
        focusX: info.position.x,
        focusZ: info.position.z,
        distance: Math.max(34, info.view.distance * 0.64),
        azimuth: info.view.azimuth,
        elevation: Math.max(0.14, info.view.elevation * 0.55),
      });

      enterTimer.current = window.setTimeout(() => {
        enterTimer.current = null;
        enteringRef.current = null;
        setEntering(null);
        setExperience(id);
        // …then settle into the composed view as the doors close behind.
        api?.flyTo({
          focusX: info.position.x,
          focusZ: info.position.z,
          distance: info.view.distance,
          azimuth: info.view.azimuth,
          elevation: info.view.elevation,
        });
      }, reduced ? 240 : ENTER_MS);
    },
    [cancelEntering, openExperience, pauseAmbience, reduced],
  );

  const closeExperience = useCallback(() => {
    cancelEntering();
    if (experienceRef.current === null) return;
    experienceRef.current = null;
    setClosing(true);
    resumeAmbience();

    const api = apiRef.current;
    const view = savedView.current;
    if (api && view) api.flyTo(view);

    closeTimer.current = window.setTimeout(() => {
      closeTimer.current = null;
      setExperience(null);
      setClosing(false);
    }, 520);
  }, [cancelEntering, resumeAmbience]);

  const startJourney = useCallback(() => {
    const api = apiRef.current;
    if (!api) return;
    setJourney({ status: 'driving', index: 0 });
    api.drive(JOURNEY_STOPS[0].t, JOURNEY_STOPS[1].t, {
      onDone: () => setJourney({ status: 'arrived', index: 1 }),
      onCancel: () => setJourney({ status: 'idle', index: 0 }),
    });
  }, []);

  const continueJourney = useCallback(() => {
    const api = apiRef.current;
    if (!api) return;
    const from = journey.index;
    const to = from + 1;
    if (to >= JOURNEY_STOPS.length) return;
    setJourney({ status: 'driving', index: from });
    api.drive(JOURNEY_STOPS[from].t, JOURNEY_STOPS[to].t, {
      onDone: () => setJourney({ status: 'arrived', index: to }),
      // Stopping a leg early must not throw away the progress already made:
      // restore the stop the traveller set out from so the button keeps
      // offering "Continue" instead of falling back to "Begin journey".
      onCancel: () =>
        setJourney({ status: from > 0 ? 'arrived' : 'idle', index: from }),
    });
  }, [journey.index]);

  const restartJourney = useCallback(() => {
    apiRef.current?.reset();
    setJourney({ status: 'idle', index: 0 });
  }, []);

  useEffect(
    () => () => {
      if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
      if (enterTimer.current !== null) window.clearTimeout(enterTimer.current);
    },
    [],
  );

  // The destination sheet is opaque, so there is nothing to draw behind it.
  // Stop the WebGL loop once the opening transition has settled, and resume as
  // soon as the sheet starts to close.
  useEffect(() => {
    if (experience === null || closing) {
      setScenePaused(false);
      return;
    }
    const timer = window.setTimeout(() => setScenePaused(true), 700);
    return () => window.clearTimeout(timer);
  }, [experience, closing]);

  if (!webgl) return <WebGLFallback />;

  // Only the sign the traveller is approaching is shown, so the road reveals
  // one destination at a time instead of pointing in every direction at once.
  const activeIndex =
    journey.status === 'idle' ? 0 : journey.status === 'driving' ? journey.index + 1 : journey.index;
  const activeSignKey = JOURNEY_STOPS[activeIndex]?.key ?? JOURNEY_STOPS[0].key;

  return (
    <div className={`world${entering ? ' is-entering' : ''}`}>
      <CanvasBoundary fallback={<WebGLFallback />}>
        <Canvas
          frameloop="demand"
          dpr={[1, lowPower ? 1 : 1.5]}
          gl={{
            antialias: true,
            alpha: true,
            stencil: false,
            depth: true,
            powerPreference: 'default',
          }}
          camera={{ fov: 48, near: 0.4, far: 2200, position: [28, 0, -210] }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
            if (import.meta.env.DEV) {
              (globalThis as typeof globalThis & { __kwandaRenderer?: typeof gl }).__kwandaRenderer = gl;
            }
            setReady(true);
          }}
        >
          <Scene
            terrainRef={terrainRef}
            apiRef={apiRef}
            reduced={reduced}
            lowPower={lowPower}
            onSelectLandmark={enterDestination}
            onStartJourney={startJourney}
            activeSignKey={activeSignKey}
            paused={scenePaused}
          />
        </Canvas>
      </CanvasBoundary>
      {ready && (
        <MainInterface
          apiRef={apiRef}
          onNavigate={enterDestination}
          journey={journey}
          onStartJourney={startJourney}
          onContinueJourney={continueJourney}
          onRestartJourney={restartJourney}
        />
      )}
      {entering && (
        <div className="threshold" aria-hidden="true">
          <span className="threshold-door" />
          <div className="threshold-copy">
            <span className="threshold-kicker">{LANDMARKS[entering].kicker}</span>
            <span className="threshold-name">{LANDMARKS[entering].name}</span>
            <span className="threshold-cue">Entering</span>
          </div>
        </div>
      )}
      {experience && (
        <ExperienceTransition
          active={experience}
          onNavigate={openExperience}
          onClose={closeExperience}
          closing={closing}
        >
          <DestinationContent id={experience} />
        </ExperienceTransition>
      )}
    </div>
  );
}
