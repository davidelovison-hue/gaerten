/**
 * Festival-specific branding and copy for Gärten Project —
 * ARTBAT @ Château de Fontainebleau, 12 September 2026.
 */

export type PlanCategory = {
  id: string;
  title: string;
};

export const PLAN_CATEGORIES: PlanCategory[] = [
  { id: 'overview', title: 'Overview' },
  { id: 'entry', title: 'Entry pass' },
  { id: 'merch', title: 'Merch' },
  { id: 'addons', title: 'Bar' },
  { id: 'shuttle', title: 'Shuttle' },
];

/** Default plan tab (entry passes). */
export const DEFAULT_PLAN_TAB = 'entry';

const BASE = import.meta.env.BASE_URL;

export const HERO_GRID_IMAGES = [
  `${BASE}hero-grid-1.jpg`,
  `${BASE}hero-grid-2.jpg`,
  `${BASE}hero-grid-3.jpg`,
  `${BASE}hero-grid-4.jpg`,
] as const;

export const GALLERY_IMAGES = [
  {
    src: `${BASE}festival-poster.jpg`,
    alt: 'ARTBAT @ Château de Fontainebleau — Gärten Project',
  },
  {
    src: HERO_GRID_IMAGES[0],
    alt: 'ARTBAT at Château de Fontainebleau',
  },
  {
    src: HERO_GRID_IMAGES[1],
    alt: 'Gärten Project night at a French château',
  },
  {
    src: HERO_GRID_IMAGES[2],
    alt: 'Crowd at a Gärten Project château night',
  },
  {
    src: HERO_GRID_IMAGES[3],
    alt: 'Gärten Project — Carl Cox & Mau P at Chantilly',
  },
];

export const FESTIVAL_HERO_VIDEO = `${BASE}hero-video-festival.mp4`;

export const FESTIVAL_MEDIA_HERO = {
  video: FESTIVAL_HERO_VIDEO,
  videoPoster: `${BASE}hero-video-poster.jpg`,
  grid: GALLERY_IMAGES.slice(1, 5).map((image) => image.src) as [string, string, string, string],
};

export const GALLERY_IMAGE_URLS = GALLERY_IMAGES.map((image) => image.src);

export const POSTER_IMAGE = `${BASE}festival-poster.jpg`;

export const AVATAR_URL = `${BASE}favicon.png`;

export const VENUE_IMAGE = `${BASE}hero-grid-1.jpg`;

export const HERO_FACTS = [
  { label: 'Date', value: '12 Sep' },
  { label: 'Doors', value: '19:00' },
  { label: 'Format', value: 'Outdoor' },
  { label: 'City', value: 'Fontainebleau' },
] as const;

export const LINEUP_TITLE = 'Lineup';
export const LINEUP_HINT = 'Saturday 12 September 2026';

export const IMMERSIVE_EXPECT = [
  'We are proud to present ARTBAT at the Château de Fontainebleau — Paris, this Saturday 12 September 2026. An intimate evening blending power, elegance and emotion at the heart of a jewel of French heritage.',
  'Produced by Gärten: the first luxury musical events brand. Entry passes from €49, with VIP next to the DJ booth, a cashless bar, and a limited return shuttle to Paris-Bercy.',
] as const;

export const IMMERSIVE_HIGHLIGHT_CARDS = [
  {
    title: 'ARTBAT at a French château',
    text: 'An intimate Gärten Project night with ARTBAT in the grounds of the Château de Fontainebleau — power, elegance, and emotion in a UNESCO setting.',
    image: `${BASE}hero-grid-1.jpg`,
  },
  {
    title: 'A lineup built to be felt',
    text: 'Solomun, Carl Cox, Black Coffee, Sofiane Pamart and more — electronic and live artists across one outdoor evening.',
    image: `${BASE}hero-grid-2.jpg`,
  },
  {
    title: 'Heritage after dark',
    text: 'Cutting-edge music in the château grounds: French luxury, a unique venue, and an outdoor night under the Fontainebleau sky.',
    image: `${BASE}hero-grid-3.jpg`,
  },
  {
    title: 'VIP, bar, and the way home',
    text: 'VIP beside the DJ booth with private WC and bottle service. Cashless bar on site. A limited shuttle runs back to Paris-Bercy.',
    image: `${BASE}hero-grid-4.jpg`,
  },
] as const;

export const IMMERSIVE_DAY_STEPS = [
  {
    title: 'Arrive a little early',
    text: 'Doors at 19:00. Come through, grab a cashless top-up at the bar, and settle in before ARTBAT.',
    tone: 'violet' as const,
  },
  {
    title: 'Take your place',
    text: 'General access across the château grounds, or VIP next to the DJ booth with private WC and bottle service.',
    tone: 'orange' as const,
  },
  {
    title: 'Stay for the last record',
    text: 'An outdoor night through to the close, then a limited return shuttle to Paris-Bercy.',
    tone: 'blue' as const,
  },
] as const;

export const IMMERSIVE_FAQS = [
  {
    q: 'Where can I find my ticket?',
    a: 'Your ticket is in the confirmation email after checkout, and in your account if you booked while logged in. Bring it on your phone at the gate.',
  },
  {
    q: 'Can I change my ticket?',
    a: 'Subject to availability, contact help@feverup.com with your order details. No refunds are permitted. See our Privacy Policy and terms on gartenproject.com.',
  },
  {
    q: 'What time do doors open?',
    a: 'Doors open at 19:00 on Saturday 12 September 2026.',
  },
  {
    q: 'Is there an age requirement?',
    a: 'This night is 18+. Access is restricted to persons aged 18 and over.',
  },
  {
    q: 'Is the bar cashless?',
    a: 'Yes. On site is cashless only — card and mobile payments. No outside food or drinks.',
  },
  {
    q: 'How do I get back to Paris?',
    a: 'A limited return shuttle runs to Paris-Bercy after the night. Add it in the Shuttle tab when you book.',
  },
  {
    q: 'What does VIP include?',
    a: 'VIP is next to the DJ booth, with private WC, bottle service, and fast-track entry. Valid for 1 person.',
  },
] as const;

export const OVERVIEW_INFO = [
  {
    icon: '📅',
    label: 'Date',
    text: 'Saturday 12 September 2026 at the Château de Fontainebleau. An intimate evening produced by Gärten.',
  },
  {
    icon: '📍',
    label: 'Location',
    text: 'Château de Fontainebleau, 77300 Fontainebleau, France',
  },
  {
    icon: '🔞',
    label: 'Age',
    text: '18+. Access is restricted to persons aged 18 and over.',
  },
  {
    icon: '♿',
    label: 'On site',
    text: 'Cashless only — card and mobile payments. No outside food or drinks. VIP includes a private WC and bottle service.',
  },
];

export const FESTIVAL_CURRENCY = {
  locale: 'fr-FR',
  currency: 'EUR',
} as const;

export const FESTIVAL_COPY = {
  intro:
    'We are proud to present ARTBAT at the Château de Fontainebleau — Paris, this Saturday 12 September 2026. An intimate evening blending power, elegance and emotion at the heart of a jewel of French heritage. Produced by Gärten: the first luxury musical events brand.',
  introCta: 'Entry passes from €49.',
  ticketTabs:
    'Browse Entry pass, Merch, Bar, and Shuttle. General access and VIP are sold in waves. Bar is cashless. A limited return shuttle runs to Paris-Bercy after the night.',
  supportEmail: 'help@feverup.com',
  privacyUrl: 'https://www.gartenproject.com/privacy-policy',
  officialSiteUrl: 'https://www.gartenproject.com/',
  officialSiteLabel: 'gartenproject.com',
  marketingBrand: 'Gärten Project',
  venue: {
    name: 'Château de Fontainebleau',
    text: 'A UNESCO jewel of French heritage. Gärten brings cutting-edge electronic music into the château grounds — a blend of French luxury, unique venues, and an intimate night with ARTBAT.',
  },
  gettingThere: {
    name: 'Château de Fontainebleau',
    address: 'Château de Fontainebleau\n77300 Fontainebleau\nFrance',
    mapQuery: 'Château de Fontainebleau',
  },
  accessibility:
    'Please contact the organiser for access needs. 18+ event. Cashless only on site.',
} as const;
