/**
 * Festival-specific branding and copy for BIGSOUND Valencia 2027.
 */

export type PlanCategory = {
  id: string;
  title: string;
};

export const PLAN_CATEGORIES: PlanCategory[] = [
  { id: 'overview', title: 'Overview' },
  { id: 'abonos', title: 'Abonos' },
  { id: 'addons', title: 'Add-ons' },
];

/** Default plan tab (weekend abonos). */
export const DEFAULT_PLAN_TAB = 'abonos';

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
    alt: 'BIGSOUND Festival 2027 — Parc Central, Torrent',
  },
  {
    src: HERO_GRID_IMAGES[0],
    alt: 'Crowd at BIGSOUND Festival',
  },
  {
    src: HERO_GRID_IMAGES[1],
    alt: 'Main stage at BIGSOUND',
  },
  {
    src: HERO_GRID_IMAGES[2],
    alt: 'Night concert at BIGSOUND Valencia',
  },
  {
    src: HERO_GRID_IMAGES[3],
    alt: 'Festival crowd under the lights',
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

export const AVATAR_URL =
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=96&h=96&q=80';

export const VENUE_IMAGE = `${BASE}hero-grid-1.jpg`;

export const HERO_FACTS = [
  { label: 'Date', value: '18–19 Jun' },
  { label: 'Duration', value: '2 days' },
  { label: 'Format', value: 'Outdoor' },
  { label: 'City', value: 'Torrent' },
] as const;

export const OVERVIEW_INFO = [
  {
    icon: '📅',
    label: 'Date',
    text: '18–19 June 2027 (Friday–Saturday). Doors 16:00–02:00 both days.',
  },
  {
    icon: '📍',
    label: 'Location',
    text: 'Parc Central de Torrent — Avinguda del Rei Joan Carles I, 22, 46900 Torrent, Valencia',
  },
  {
    icon: '🔞',
    label: 'Age',
    text: 'Under 16 must be with a parent or legal guardian. Ages 16–17 need a signed authorization. Children up to 6 enter free with an adult (one child per ticket).',
  },
  {
    icon: '♿',
    label: 'Accessibility',
    text: 'Contact ventas@enterticket.es for access requirements before the event.',
  },
];

export const FESTIVAL_CURRENCY = {
  locale: 'es-ES',
  currency: 'EUR',
} as const;

export const FESTIVAL_COPY = {
  intro:
    'BIGSOUND is Valencia’s urban music festival — two days of pop, urbano and live hits at Parc Central de Torrent. The 2027 edition lands on 18 and 19 June, with more stages and more space for the biggest weekend of the summer.',
  introCta: 'Abonos 2027 are on sale now!',
  ticketTabs:
    'Browse Abonos and Add-ons in the tabs above. Tickets are nominative and swapped for a cashless wristband at accreditation.',
  supportEmail: 'ventas@enterticket.es',
  privacyUrl: 'https://feverup.com',
  officialSiteUrl: 'https://bigsoundfestival.com/valencia/abonos',
  officialSiteLabel: 'bigsoundfestival.com',
  marketingBrand: 'BIGSOUND Festival',
  venue: {
    name: 'Parc Central de Torrent',
    text: 'An open-air park about 8 km from Valencia city, with Metrovalencia to Torrent Avinguda (~300 m from the gate), shuttle buses, and more than 4,000 public parking spaces.',
  },
  gettingThere: {
    name: 'Parc Central',
    address: 'Avinguda del Rei Joan Carles I, 22\n46900 Torrent, Valencia\nSpain',
    mapQuery: 'Parc Central Torrent Valencia',
  },
} as const;
