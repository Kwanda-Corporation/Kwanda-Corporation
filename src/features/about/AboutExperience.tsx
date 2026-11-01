import { AboutContent } from './AboutContent';

/**
 * Thin entry point for the Origin House presentation. The shell (top bar, nav
 * and return-to-world) lives in ExperienceTransition; this only supplies the
 * editorial body.
 */
export function AboutExperience() {
  return <AboutContent />;
}
