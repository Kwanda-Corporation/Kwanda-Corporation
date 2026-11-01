import type { LandmarkId } from '../../lib/landmarks';

export type ProjectMeta = {
  id: Extract<LandmarkId, 'katisha' | 'strs'>;
  index: string;
  name: string;
  fullName?: string;
  category: string;
  tagline: string;
  status?: string;
};

export const PROJECTS: Record<Extract<LandmarkId, 'katisha' | 'strs'>, ProjectMeta> = {
  katisha: {
    id: 'katisha',
    index: '01',
    name: 'Katisha',
    category: 'Transportation Technology',
    tagline: 'Connecting journeys through technology.',
    status: 'Live product',
  },
  strs: {
    id: 'strs',
    index: '02',
    name: 'STRS',
    fullName: 'Student Transport and Routing System',
    category: 'Education & Transportation Technology',
    tagline: 'A connected approach to student transportation.',
    status: 'Concept / Proposed system',
  },
};

export const KATISHA_URL = 'https://katisha.today';
