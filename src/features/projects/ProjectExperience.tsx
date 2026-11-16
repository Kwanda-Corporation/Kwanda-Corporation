import { KatishaProject } from './KatishaProject';
import { GerayoProject } from './GerayoProject';

export function ProjectExperience({ project }: { project: 'katisha' | 'gerayo' }) {
  return project === 'katisha' ? <KatishaProject /> : <GerayoProject />;
}
