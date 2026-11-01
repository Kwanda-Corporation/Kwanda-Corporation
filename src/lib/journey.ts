import type { LandmarkId } from './landmarks';
import { pathPoint } from './terrain';

export type JourneyStop = {
  key: string;
  /** Position along the road, 0..1. */
  t: number;
  kind: 'start' | 'destination';
  label: string;
  kicker: string;
  destination?: LandmarkId;
};

/**
 * The guided road trip. Stops are ordered along `pathPoint` (the road) so the
 * camera can travel forward and meet one sign at a time: the welcome sign,
 * then About Us, Katisha and STRS.
 */
export const JOURNEY_STOPS: JourneyStop[] = [
  {
    key: 'start',
    t: 0.03,
    kind: 'start',
    label: 'Start your journey',
    kicker: 'Kwanda group',
  },
  {
    key: 'about',
    t: 0.28,
    kind: 'destination',
    label: 'About Us',
    kicker: 'The Origin House',
    destination: 'about',
  },
  {
    key: 'katisha',
    t: 0.5,
    kind: 'destination',
    label: 'Katisha',
    kicker: 'Transportation technology',
    destination: 'katisha',
  },
  {
    key: 'strs',
    t: 0.72,
    kind: 'destination',
    label: 'STRS',
    kicker: 'Student transport & routing',
    destination: 'strs',
  },
  {
    key: 'achievements',
    t: 0.82,
    kind: 'destination',
    label: 'Achievements',
    kicker: 'The Milestone Gallery',
    destination: 'achievements',
  },
  {
    key: 'partners',
    t: 0.9,
    kind: 'destination',
    label: 'Partners',
    kicker: 'The Connection Plaza',
    destination: 'partners',
  },
  {
    key: 'team',
    t: 0.98,
    kind: 'destination',
    label: 'Our Team',
    kicker: 'The Creative Studio',
    destination: 'team',
  },
];

export const JOURNEY_START_T = JOURNEY_STOPS[0].t;

// A low, road-level "driver's view" shared by the opening camera and the
// guided journey so travelling feels like moving between the mountains.
export const DRIVE_DISTANCE = 46;
export const DRIVE_ELEVATION = 0.16;
export const DRIVE_DURATION_MS = 4200;

export type DriveView = {
  focusX: number;
  focusZ: number;
  distance: number;
  azimuth: number;
  elevation: number;
};

function tangentAt(t: number): { x: number; z: number } {
  const e = 0.001;
  const a = pathPoint(t - e);
  const b = pathPoint(t + e);
  const dx = b.x - a.x;
  const dz = b.z - a.z;
  const len = Math.hypot(dx, dz) || 1;
  return { x: dx / len, z: dz / len };
}

/** Azimuth that orients the camera along the direction of travel at `t`. */
export function driveAzimuthAt(t: number): number {
  const d = tangentAt(t);
  return Math.atan2(-d.x, -d.z);
}

export function driveViewAt(t: number): DriveView {
  const p = pathPoint(t);
  return {
    focusX: p.x,
    focusZ: p.z,
    distance: DRIVE_DISTANCE,
    azimuth: driveAzimuthAt(t),
    elevation: DRIVE_ELEVATION,
  };
}

/** The opening/home view: standing at the start of the road facing the first sign. */
export function homeView(): DriveView {
  return driveViewAt(JOURNEY_START_T);
}
