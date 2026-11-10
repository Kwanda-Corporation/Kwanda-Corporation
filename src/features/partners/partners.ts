export type PartnerCategory = 'strategic' | 'technology' | 'operational';

export type Partner = {
  id: string;
  name: string;
  category: PartnerCategory;
  description: string;
  relationship: string;
  initiative?: string;
  website?: string;
  /** Local logo path under `/media/logos`. Falls back to a wordmark when absent. */
  logo?: string;
};

export const PARTNER_CATEGORIES: ReadonlyArray<{ id: PartnerCategory; label: string }> = [
  { id: 'strategic', label: 'Institutional & regulatory partners' },
  { id: 'operational', label: 'Transportation operators' },
  { id: 'technology', label: 'Technology & infrastructure' },
];

/**
 * Real, verifiable relationships only. Each partner is described at the level
 * of commitment the company can stand behind: institutional and regulatory
 * bodies, the transport operators Katisha works with, and the technology
 * platforms that underpin the products — no invented endorsements.
 */
export const PARTNERS: Partner[] = [
  {
    id: 'minict',
    name: 'MINICT',
    category: 'strategic',
    description:
      'The Ministry of ICT and Innovation of Rwanda — the government body responsible for ICT policy, digital transformation and the national innovation agenda.',
    relationship:
      'Institutional partner within Rwanda\u2019s technology and innovation ecosystem.',
    website: 'https://www.minict.gov.rw',
    logo: '/media/logos/minict.png',
  },
  {
    id: 'rura',
    name: 'RURA',
    category: 'strategic',
    description:
      'The Rwanda Utilities Regulatory Authority — the multi-sector regulator for ICT, postal services, energy, water, sanitation and transport.',
    relationship:
      'Regulatory authority for the transport and communications sectors Katisha operates within.',
    website: 'https://www.rura.rw',
    logo: '/media/logos/rura.png',
  },
  {
    id: 'trinity-express',
    name: 'Trinity Express',
    category: 'operational',
    description:
      'A cross-border bus and courier operator based in Kigali, connecting Rwanda with Kenya, Uganda, South Sudan and DR Congo.',
    relationship:
      'Transport operator working with Katisha to connect passengers with scheduled journeys.',
    website: 'https://trinityexpress.rw',
    logo: '/media/logos/trinity.png',
  },
  {
    id: 'simba-coaches',
    name: 'Simba Coaches',
    category: 'operational',
    description:
      'An East African intercity bus operator running long-distance routes across Kenya, Uganda and Rwanda.',
    relationship:
      'Transport operator working with Katisha on regional passenger journeys.',
    website: 'https://safarishare.com/operators/simbacoches',
    logo: '/media/logos/simba.png',
  },
  {
    id: 'pawapay',
    name: 'pawaPay',
    category: 'technology',
    description:
      'Mobile-money payment infrastructure powering digital transactions for Katisha bookings.',
    relationship: 'Digital payment infrastructure provider.',
    website: 'https://www.pawapay.com',
  },
  {
    id: 'ovhcloud',
    name: 'OVHcloud',
    category: 'technology',
    description:
      'Cloud and server infrastructure hosting Katisha\u2019s backend and deployment.',
    relationship: 'Cloud infrastructure provider.',
    website: 'https://www.ovhcloud.com',
  },
  {
    id: 'mongodb-atlas',
    name: 'MongoDB Atlas',
    category: 'technology',
    description:
      'Cloud database infrastructure underpinning Katisha\u2019s data layer.',
    relationship: 'Database infrastructure provider.',
    website: 'https://www.mongodb.com/atlas',
  },
  {
    id: 'app-stores',
    name: 'Google Play & App Store',
    category: 'technology',
    description:
      'Mobile application distribution for Katisha\u2019s Android and iOS experiences.',
    relationship: 'Mobile distribution ecosystem.',
  },
];
