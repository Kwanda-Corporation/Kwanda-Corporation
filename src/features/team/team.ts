export type TeamMember = {
  id: string;
  name: string;
  role: string;
  intro: string;
  expertise?: string;
  links?: ReadonlyArray<{ label: string; url: string }>;
  photo?: string;
};

/**
 * Verified team members only — real names, roles and photographs. Do not
 * invent people or qualifications; present a small honest team rather than
 * filling roles that are not yet confirmed.
 */
export const TEAM: TeamMember[] = [];
