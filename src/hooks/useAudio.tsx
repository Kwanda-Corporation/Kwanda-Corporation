import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { audioEngine } from '../audio/AudioEngine';

type AudioContextValue = {
  started: boolean;
  muted: boolean;
  volume: number;
  beginPercussion: () => Promise<boolean>;
  enterWorld: () => void;
  enableAmbience: () => Promise<void>;
  disableAudio: () => void;
  pauseAmbience: () => void;
  resumeAmbience: () => void;
  setMuted: (muted: boolean) => void;
  setVolume: (volume: number) => void;
};

const AudioCtx = createContext<AudioContextValue | null>(null);

const STORAGE_KEY = 'kwanda.audio.preferences';

function readPreferences(): { muted: boolean; volume: number } {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { muted: false, volume: 0.62 };
    const parsed = JSON.parse(raw) as { muted?: unknown; volume?: unknown };
    return {
      muted: parsed.muted === true,
      volume: typeof parsed.volume === 'number' ? Math.min(1, Math.max(0, parsed.volume)) : 0.62,
    };
  } catch {
    return { muted: false, volume: 0.62 };
  }
}

export function AudioProvider({ children }: { children: ReactNode }) {
  const [prefs] = useState(readPreferences);
  const [started, setStarted] = useState(false);
  const [muted, setMutedState] = useState(prefs.muted);
  const [volume, setVolumeState] = useState(prefs.volume);

  useEffect(() => {
    audioEngine.setMuted(prefs.muted);
    audioEngine.setVolume(prefs.volume);
  }, [prefs]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ muted, volume }));
    } catch {
      /* storage may be unavailable */
    }
  }, [muted, volume]);

  // Do not keep synthesising audio (or scheduling drum nodes) while the page is
  // hidden or the user has switched to another window. This is what stops the
  // score from carrying on over whatever else is on screen.
  useEffect(() => {
    const sync = () => audioEngine.setPageHidden(document.hidden || !document.hasFocus());
    document.addEventListener('visibilitychange', sync);
    window.addEventListener('blur', sync);
    window.addEventListener('focus', sync);
    return () => {
      document.removeEventListener('visibilitychange', sync);
      window.removeEventListener('blur', sync);
      window.removeEventListener('focus', sync);
    };
  }, []);

  const setMuted = useCallback((next: boolean) => {
    setMutedState(next);
    audioEngine.setMuted(next);
  }, []);

  const setVolume = useCallback((next: number) => {
    const clamped = Math.min(1, Math.max(0, next));
    setVolumeState(clamped);
    audioEngine.setVolume(clamped);
  }, []);

  const beginPercussion = useCallback(async () => {
    const ok = await audioEngine.startPercussion();
    if (ok) setStarted(true);
    return ok;
  }, []);

  const enterWorld = useCallback(() => {
    if (audioEngine.isStarted()) {
      void audioEngine.enterWorld();
    }
  }, []);

  const enableAmbience = useCallback(async () => {
    const ok = await audioEngine.enableAmbience();
    if (ok) {
      setStarted(true);
      setMutedState(false);
      audioEngine.setMuted(false);
    }
  }, []);

  const disableAudio = useCallback(() => {
    audioEngine.stopAll();
    setStarted(false);
  }, []);

  const pauseAmbience = useCallback(() => {
    audioEngine.pauseAmbience();
  }, []);

  const resumeAmbience = useCallback(() => {
    audioEngine.resumeAmbience();
  }, []);

  const value = useMemo<AudioContextValue>(
    () => ({
      started,
      muted,
      volume,
      beginPercussion,
      enterWorld,
      enableAmbience,
      disableAudio,
      pauseAmbience,
      resumeAmbience,
      setMuted,
      setVolume,
    }),
    [
      started,
      muted,
      volume,
      beginPercussion,
      enterWorld,
      enableAmbience,
      disableAudio,
      pauseAmbience,
      resumeAmbience,
      setMuted,
      setVolume,
    ],
  );

  return <AudioCtx.Provider value={value}>{children}</AudioCtx.Provider>;
}

export function useAudio(): AudioContextValue {
  const context = useContext(AudioCtx);
  if (!context) throw new Error('useAudio must be used inside AudioProvider');
  return context;
}
