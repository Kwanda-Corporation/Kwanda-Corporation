import { MEDIA } from '../../lib/media';

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
  /** Short caption shown under an attached image. */
  imageCaption?: string;
};

export const MILESTONE_CATEGORIES: ReadonlyArray<{ id: MilestoneCategory; label: string }> = [
  { id: 'company', label: 'Company journey' },
  { id: 'product', label: 'Product development' },
  { id: 'technology', label: 'Technology & engineering' },
  { id: 'growth', label: 'Growth & recognition' },
];

/**
 * Verified milestones only. Each entry reflects something the company has
 * actually done — dated only where the date is certain, and never padded with
 * awards, funding rounds, revenue figures or invented user statistics.
 */
export const MILESTONES: Milestone[] = [
  {
    id: 'registered-business',
    category: 'company',
    title: 'Registered in Rwanda',
    description:
      'Kwanda Corporations Ltd was established as a registered business in Kigali, Rwanda — the legal and operational foundation for everything the company builds.',
    why: 'Turning an ambition into a company — the step that lets products be built, run and scaled properly.',
  },
  {
    id: 'vat-registration',
    category: 'company',
    title: 'VAT registration',
    date: '17 August 2026',
    description:
      'Obtained VAT registration, effective August 17, 2026, as part of establishing the professional operating structure for a digital transportation business.',
    why: 'A quieter but essential milestone: the operational groundwork that makes a product a real business.',
  },
  {
    id: 'data-controller-certificate',
    category: 'company',
    title: 'Data protection & privacy registration',
    description:
      'Obtained a Data Protection and Privacy registration for the company\u2019s data-controller responsibilities — formalising Kwanda\u2019s commitment to handling passenger and customer data responsibly.',
    why: 'Trust is part of the product. Registering as a data controller makes that responsibility concrete.',
    image: MEDIA.certificate,
    imageCaption: 'Kwanda Corporations\u2019 data controller certificate.',
  },
  {
    id: 'katisha-conceived',
    category: 'product',
    title: 'Katisha conceived and developed',
    description:
      'Identified the fragmentation in East African bus travel booking and set out to solve it — conceiving, designing and engineering Katisha as a digital booking platform.',
    why: 'The founding product: an idea about travel, turned into a working system.',
  },
  {
    id: 'katisha-live',
    category: 'product',
    title: 'Katisha in real-world use',
    description:
      'Moved beyond the idea stage into a live product — real passengers using the platform, real bookings being processed, and transportation operators participating.',
    why: 'The moment a product stops being a demo and starts serving people.',
  },
  {
    id: 'strs-initiated',
    category: 'product',
    title: 'STRS initiated',
    description:
      'Began development direction on STRS — the Student Transport and Routing System — extending Kwanda\u2019s work from commercial travel into education-related digital infrastructure.',
    why: 'Proof that the company\u2019s approach travels beyond a single industry.',
  },
  {
    id: 'payment-infrastructure',
    category: 'technology',
    title: 'Digital payment integration',
    description:
      'Built payment integration capabilities — including pawaPay — so bookings can be completed digitally rather than through cash at a station.',
    why: 'Payments are where convenience actually happens; without them, a booking is only half digital.',
  },
  {
    id: 'engineering-foundations',
    category: 'technology',
    title: 'Built for real use, not demonstrations',
    description:
      'Established modern engineering foundations: backend services, a cloud database, cloud deployment and mobile and web experiences intended for production traffic.',
    why: 'Reliable infrastructure is invisible when it works — and essential when it matters.',
  },
  {
    id: 'operator-network',
    category: 'growth',
    title: 'A growing operator network',
    description:
      'Established working relationships with transportation operators — including Trinity, Simba and others — to connect passengers with real, scheduled services.',
    why: 'A booking platform is only as useful as the network behind it.',
  },
];
