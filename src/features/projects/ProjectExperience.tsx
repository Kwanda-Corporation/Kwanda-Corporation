import { KatishaProject } from './KatishaProject';
import { STRSProject } from './STRSProject';

export function ProjectExperience({ project }: { project: 'katisha' | 'strs' }) {
  return project === 'katisha' ? <KatishaProject /> : <STRSProject />;
}
