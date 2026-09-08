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
} as const;
