/**
 * Festival-specific branding and copy for Gärten —
 * Black Coffee @ Grand Palais, 15 May 2027.
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
  `${BASE}venue-grand-palais.jpg`,
  `${BASE}hero-grid-2.jpg`,
  `${BASE}hero-grid-3.jpg`,
  `${BASE}hero-grid-4.jpg`,
] as const;

export const GALLERY_IMAGES = [
  {
    src: `${BASE}venue-grand-palais.jpg`,
    alt: 'Black Coffee @ Grand Palais — Gärten',
  },
  {
    src: HERO_GRID_IMAGES[1],
    alt: 'Gärten night under the lights',
  },
  {
    src: HERO_GRID_IMAGES[2],
    alt: 'Crowd at a Gärten night',
  },
  {
    src: HERO_GRID_IMAGES[3],
    alt: 'Gärten — electronic music in Paris',
  },
  {
    src: `${BASE}abono-vipsound.jpg`,
    alt: 'Night at a Gärten event',
  },
];

export const FESTIVAL_HERO_VIDEO = `${BASE}hero-video-festival.mp4`;

export const FESTIVAL_MEDIA_HERO = {
  video: FESTIVAL_HERO_VIDEO,
  videoPoster: `${BASE}hero-video-poster.jpg`,
  grid: HERO_GRID_IMAGES,
};

export const GALLERY_IMAGE_URLS = GALLERY_IMAGES.map((image) => image.src);

export const POSTER_IMAGE = `${BASE}festival-poster.jpg`;

export const AVATAR_URL = `${BASE}favicon.png`;

export const VENUE_IMAGE = `${BASE}venue-grand-palais.jpg`;

export const HERO_FACTS = [
  { label: 'Date', value: '15 May' },
  { label: 'Doors', value: '20:00' },
  { label: 'Format', value: 'Indoor' },
  { label: 'City', value: 'Paris' },
] as const;

export const LINEUP_TITLE = 'Lineup';
export const LINEUP_HINT = 'Saturday 15 May 2027';

export const IMMERSIVE_EXPECT = [
  'We are proud to present Black Coffee at the Grand Palais, Paris, on Saturday 15 May 2027. A night of deep, soulful house beneath the largest glass roof in Europe, where French heritage meets cutting-edge electronic music.',
  'Produced by Gärten: the first luxury musical events brand. Entry passes from €69, with VIP next to the DJ booth, a cashless bar, and Metro access at Champs-Élysées – Clemenceau.',
] as const;

export const IMMERSIVE_HIGHLIGHT_CARDS = [
  {
    title: 'Black Coffee at the Grand Palais',
    text: 'A Gärten night with Black Coffee under the largest glass roof in Europe — deep, soulful house in one of the most spectacular rooms in Paris.',
    image: `${BASE}venue-grand-palais.jpg`,
  },
  {
    title: 'A lineup built to be felt',
    text: 'Keinemusik, Dixon, Âme, Themba, Sofiane Pamart and more — house and electronic artists across one indoor evening.',
    image: `${BASE}hero-grid-2.jpg`,
  },
  {
    title: 'Heritage after dark',
    text: 'Cutting-edge electronic music in the Nef: French luxury, a unique venue, and one night under steel and glass.',
    image: `${BASE}hero-grid-3.jpg`,
  },
  {
    title: 'VIP, bar, and the way in',
    text: 'VIP beside the DJ booth with private WC and bottle service. Cashless bar on site. Metro lines 1 and 13 at Champs-Élysées – Clemenceau.',
    image: `${BASE}hero-grid-4.jpg`,
  },
] as const;

export const IMMERSIVE_DAY_STEPS = [
  {
    title: 'Arrive a little early',
    text: 'Doors at 20:00. Come through, grab a cashless top-up at the bar, and settle in before Black Coffee.',
    tone: 'violet' as const,
  },
  {
    title: 'Take your place',
    text: 'General access in the Nef, or VIP next to the DJ booth with private WC and bottle service.',
    tone: 'orange' as const,
  },
  {
    title: 'Stay for the last record',
    text: 'An indoor night through to the close, under the glass roof of the Grand Palais.',
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
    a: 'Doors open at 20:00 on Saturday 15 May 2027.',
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
    q: 'How do I get there?',
    a: 'Grand Palais, Avenue Winston Churchill, 75008 Paris. Metro: Champs-Élysées – Clemenceau (lines 1 and 13).',
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
    text: 'Saturday 15 May 2027 at the Grand Palais. An evening produced by Gärten.',
  },
  {
    icon: '📍',
    label: 'Location',
    text: 'Grand Palais, Avenue Winston Churchill, 75008 Paris, France',
  },
  {
    icon: '🔞',
    label: 'Age',
    text: '18+. Access is restricted to persons aged 18 and over.',
  },
  {
    icon: '♿',
    label: 'On site',
    text: 'Cashless only, card and mobile payments. No outside food or drinks. VIP includes a private WC and bottle service.',
  },
];

export const FESTIVAL_CURRENCY = {
  locale: 'fr-FR',
  currency: 'EUR',
} as const;

export const FESTIVAL_COPY = {
  intro:
    'We are proud to present Black Coffee at the Grand Palais, Paris, on Saturday 15 May 2027. A night of deep, soulful house beneath the largest glass roof in Europe, where French heritage meets cutting-edge electronic music. Produced by Gärten: the first luxury musical events brand.',
  introCta: 'Entry passes from €69.',
  ticketTabs:
    'Browse Entry pass, Merch, Bar, and Shuttle. General access and VIP are sold in waves. Bar is cashless. Metro: Champs-Élysées – Clemenceau (lines 1 and 13).',
  supportEmail: 'help@feverup.com',
  privacyUrl: 'https://www.gartenproject.com/privacy-policy',
  officialSiteUrl: 'https://www.gartenproject.com/',
  officialSiteLabel: 'gartenproject.com',
  marketingBrand: 'Gärten',
  venue: {
    name: 'Grand Palais',
    text: 'Built for the 1900 World’s Fair and crowned by the largest glass roof in Europe, the Nef is one of the most spectacular rooms in Paris. Gärten brings cutting-edge electronic music under its steel and glass canopy, for one night, with Black Coffee.',
  },
  gettingThere: {
    name: 'Grand Palais',
    address:
      'Grand Palais\nAvenue Winston Churchill\n75008 Paris, France\nMetro: Champs-Élysées – Clemenceau (lines 1 and 13)',
    mapQuery: 'Grand Palais, Avenue Winston Churchill, 75008 Paris',
  },
  accessibility:
    'Please contact the organiser for access needs. 18+ event. Cashless only on site.',
} as const;
