export type TeamMember = {
  id: string;
  name: string;
  role: string;
  intro: string;
  focus?: string;
};

/**
 * Verified team members only — real names and real roles, described through
 * their responsibilities rather than invented biographies or qualifications.
 */
export const TEAM: TeamMember[] = [
  {
    id: 'manzi-alpe',
    name: 'Manzi Alpe',
    role: 'Chief Executive Officer',
    intro:
      'Founder and Chief Executive Officer. Manzi sets Kwanda\u2019s strategic direction and leads its entrepreneurial and product vision — identifying opportunities, guiding business strategy, coordinating development and building the relationships that support the company\u2019s growth.',
    focus: 'Leadership, strategy, business development & product vision',
  },
  {
    id: 'ashraf-tuyubahe',
    name: 'Ashraf Tuyubahe',
    role: 'Chief Technology Officer',
    intro:
      'As Chief Technology Officer, Ashraf owns Kwanda\u2019s technical direction and the engineering foundations behind its products — guiding architecture, engineering standards and the technology decisions that keep the systems reliable as they grow.',
    focus: 'Technical leadership, software architecture & engineering strategy',
  },
  {
    id: 'ntwali-josue',
    name: 'Ntwali Josue',
    role: 'Lead Software Engineer',
    intro:
      'Lead Software Engineer. Ntwali turns product requirements into working software — coordinating implementation, maintaining code quality and supporting the development of reliable digital systems across the product portfolio.',
    focus: 'Software development leadership, implementation & product engineering',
  },
  {
    id: 'gatare-jean-marie',
    name: 'Gatare Jean Marie',
    role: 'Operations Manager',
    intro:
      'As Operations Manager, Gatare keeps the day-to-day running of the business aligned with strategy — coordinating the processes that keep products and operations moving, and connecting objectives with execution.',
    focus: 'Operations management, coordination & business execution',
  },
];
