export type PartnerCategory = 'strategic' | 'technology' | 'payment' | 'operational';

export type Partner = {
  id: string;
  name: string;
  category: PartnerCategory;
  description: string;
  relationship: string;
  initiative?: string;
  website?: string;
  logo?: string;
};

export const PARTNER_CATEGORIES: ReadonlyArray<{ id: PartnerCategory; label: string }> = [
  { id: 'strategic', label: 'Strategic partners' },
  { id: 'technology', label: 'Technology partners' },
  { id: 'payment', label: 'Payment & infrastructure' },
  { id: 'operational', label: 'Business & operational' },
];

/**
 * Verified relationships only. A technology dependency or service provider is
 * not automatically a strategic partner — keep the list honest and leave it
 * empty rather than implying partnerships or endorsements without evidence.
 */
export const PARTNERS: Partner[] = [];
