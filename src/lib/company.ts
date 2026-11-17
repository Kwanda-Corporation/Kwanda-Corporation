/**
 * Single source of truth for contact details and social profiles.
 *
 * NOTE: the LinkedIn and X links are placeholders for the company accounts.
 * Replace the URLs below as soon as the official handles are confirmed.
 */
export const COMPANY = {
  name: 'Kwanda Corporations',
  legalName: 'Kwanda Corporations Ltd',
  email: 'manzialpe@gmail.com',
  katishaEmail: 'support@katisha.today',
  phone: '+250793216191',
  phoneDisplay: '+250 793 216 191',
  /** Temporary base while the permanent office address is being finalised. */
  address: {
    label: 'Kigali office (temporary)',
    line1: 'Fairview Building, KG 622 St',
    line2: 'Kimihurura, Kigali',
    country: 'Rwanda',
  },
  /** A real, well-known Kigali tech hub used as a mailing address. */
  mailingAddress: {
    label: 'Mailing address',
    line1: 'Norrsken Kigali House, 1 KN 78 St',
    line2: 'Kigali',
    country: 'Rwanda',
  },
  socials: [
    {
      id: 'linkedin',
      label: 'LinkedIn',
      handle: 'Kwanda Corporations',
      href: 'https://www.linkedin.com/company/kwanda-corporations',
    },
    {
      id: 'x',
      label: 'X',
      handle: '@kwandacorporation',
      href: 'https://x.com/kwandacorporation',
    },
    {
      id: 'github',
      label: 'GitHub',
      handle: 'Kwanda-Corporation',
      href: 'https://github.com/Kwanda-Corporation',
    },
  ],
} as const;

export const KATISHA_URL = 'https://katisha.today';
