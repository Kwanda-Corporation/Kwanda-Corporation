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

/** Routes a landmark id to its editorial experience body. */
function DestinationContent({ id }: { id: LandmarkId }) {
  switch (id) {
    case 'about':
      return <AboutExperience />;
    case 'katisha':
    case 'strs':
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
  const [scenePaused, setScenePaused] = useState(false);
  const savedView = useRef<CameraView | null>(null);
  const experienceRef = useRef<LandmarkId | null>(null);
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

  const openExperience = useCallback((id: LandmarkId) => {
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
  }, [pauseAmbience]);

  const closeExperience = useCallback(() => {
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
  }, [resumeAmbience]);

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
      onCancel: () => setJourney({ status: 'idle', index: from }),
    });
  }, [journey.index]);

  const restartJourney = useCallback(() => {
    apiRef.current?.reset();
    setJourney({ status: 'idle', index: 0 });
  }, []);

  useEffect(
    () => () => {
      if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
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
    <div className="world">
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
            onSelectLandmark={openExperience}
            onStartJourney={startJourney}
            activeSignKey={activeSignKey}
            paused={scenePaused}
          />
        </Canvas>
      </CanvasBoundary>
      {ready && (
        <MainInterface
          apiRef={apiRef}
          onNavigate={openExperience}
          journey={journey}
          onStartJourney={startJourney}
          onContinueJourney={continueJourney}
          onRestartJourney={restartJourney}
        />
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
