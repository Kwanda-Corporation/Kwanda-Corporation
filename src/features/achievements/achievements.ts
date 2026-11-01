export type MilestoneCategory = 'company' | 'product' | 'technology' | 'growth';

export type Milestone = {
  id: string;
  category: MilestoneCategory;
  title: string;
  /** Verified date or year only — leave undefined rather than estimating. */
  date?: string;
  description: string;
  why: string;
  /** Optional supporting image or screenshot URL. */
  image?: string;
};

export const MILESTONE_CATEGORIES: ReadonlyArray<{ id: MilestoneCategory; label: string }> = [
  { id: 'company', label: 'Company journey' },
  { id: 'product', label: 'Product development' },
  { id: 'technology', label: 'Technology & engineering' },
  { id: 'growth', label: 'Growth & recognition' },
];

/**
 * Verified milestones only. Each entry needs a confirmed title, date (or
 * year) and source. Leave the array empty rather than inventing achievements,
 * awards, funding, revenue or user numbers.
 */
export const MILESTONES: Milestone[] = [];
