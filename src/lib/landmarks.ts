import type * as THREE from 'three';

export type LandmarkId =
  | 'about'
  | 'katisha'
  | 'strs'
  | 'achievements'
  | 'partners'
  | 'team';

export type LandmarkView = {
  distance: number;
  azimuth: number;
  elevation: number;
};

export type LandmarkInfo = {
  id: LandmarkId;
  /** Architectural / display name used in the world. */
  name: string;
  /** Short label used in navigation menus. */
  navLabel: string;
  kicker: string;
  position: { x: number; z: number };
  /** Height of the marker anchor above the local ground. */
  markerHeight: number;
  /** Focus distance at which the landmark begins to feel present. */
  nearRadius: number;
  view: LandmarkView;
};

export const LANDMARKS: Record<LandmarkId, LandmarkInfo> = {
  about: {
    id: 'about',
    name: 'The Origin House',
    navLabel: 'Origin House',
    kicker: 'About us',
    // Western plateau — a pavilion on its own, reached across the valley.
    position: { x: -150, z: -40 },
    markerHeight: 21,
    nearRadius: 48,
    // Aligned with the pavilion's entry axis for a symmetric approach.
    view: { distance: 58, azimuth: 0.58, elevation: 0.3 },
  },
  katisha: {
    id: 'katisha',
    name: 'Katisha',
    navLabel: 'Katisha',
    kicker: 'Transportation technology',
    // Northern reach of the play area, a long trek from the starting valley.
    position: { x: 30, z: -150 },
    markerHeight: 22,
    nearRadius: 48,
    view: { distance: 58, azimuth: -0.3, elevation: 0.3 },
  },
  strs: {
    id: 'strs',
    name: 'STRS',
    navLabel: 'STRS',
    kicker: 'Student transport & routing',
    // South-eastern plains, the third distinct quarter of the landscape.
    position: { x: 120, z: 100 },
    markerHeight: 23,
    nearRadius: 48,
    view: { distance: 56, azimuth: 4.1, elevation: 0.32 },
  },
  achievements: {
    id: 'achievements',
    name: 'The Milestone Gallery',
    navLabel: 'Achievements',
    kicker: 'Achievements',
    // Eastern reach of the play area — a gallery on its own plateau.
    position: { x: 150, z: 0 },
    markerHeight: 24,
    nearRadius: 52,
    view: { distance: 58, azimuth: 0.5, elevation: 0.3 },
  },
  partners: {
    id: 'partners',
    name: 'The Connection Plaza',
    navLabel: 'Partners',
    kicker: 'Partners',
    // South-western plains — an open plaza for collaboration.
    position: { x: -140, z: 130 },
    markerHeight: 24,
    nearRadius: 54,
    view: { distance: 58, azimuth: 0.9, elevation: 0.3 },
  },
  team: {
    id: 'team',
    name: 'The Creative Studio',
    navLabel: 'Our Team',
    kicker: 'Our team',
    // Southern hills — the studio where the work happens.
    position: { x: 0, z: 170 },
    markerHeight: 24,
    nearRadius: 50,
    view: { distance: 58, azimuth: 0.3, elevation: 0.3 },
  },
};

export const LANDMARK_LIST: LandmarkInfo[] = [
  LANDMARKS.about,
  LANDMARKS.katisha,
  LANDMARKS.strs,
  LANDMARKS.achievements,
  LANDMARKS.partners,
  LANDMARKS.team,
];

export type LandmarkPick = {
  id: LandmarkId;
  target: THREE.Object3D;
  onSelect: () => void;
};

/**
 * A tiny external store shared by the Three.js scene, the camera controller and
 * the DOM overlays. Camera/pointer updates happen imperatively and only publish
 * when a value actually changes, so React never re-renders on camera movement.
 */
class LandmarkRegistry {
  readonly picks = new Map<LandmarkId, LandmarkPick>();

  hovered: LandmarkId | null = null;

  near = new Set<LandmarkId>();

  private listeners = new Set<() => void>();

  private version = 0;

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  getVersion = (): number => this.version;

  getServerSnapshot = (): number => 0;

  isActive(id: LandmarkId): boolean {
    return this.hovered === id || this.near.has(id);
  }

  register(pick: LandmarkPick): () => void {
    this.picks.set(pick.id, pick);
    return () => {
      if (this.picks.get(pick.id) === pick) this.picks.delete(pick.id);
    };
  }

  setHovered(id: LandmarkId | null): void {
    if (this.hovered === id) return;
    this.hovered = id;
    this.commit();
  }

  setNear(id: LandmarkId, value: boolean): void {
    const present = this.near.has(id);
    if (present === value) return;
    if (value) this.near.add(id);
    else this.near.delete(id);
    this.commit();
  }

  private commit(): void {
    this.version += 1;
    this.listeners.forEach((listener) => listener());
  }
}

export const landmarkRegistry = new LandmarkRegistry();
