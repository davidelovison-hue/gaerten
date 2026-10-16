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
    alt: 'Grand Palais from above at dusk',
  },
  {
    src: `${BASE}ticket-ga-crowd.jpg`,
    alt: 'Friends dancing at Gärten',
  },
  {
    src: `${BASE}artist-black-coffee.jpg`,
    alt: 'Black Coffee on the decks',
  },
  {
    src: `${BASE}ticket-vip-booth.jpg`,
    alt: 'Fireworks over the night stage',
  },
  {
    src: `${BASE}ticket-vip-decks.jpg`,
    alt: 'DJ booth under the lights',
  },
  {
    src: `${BASE}hero-crowd-1.jpg`,
    alt: 'Crowd facing the night stage',
  },
  {
    src: `${BASE}abono-vipsound.jpg`,
    alt: 'Night crowd and pyro at Gärten',
  },
  {
    src: `${BASE}ticket-ga-grounds.jpg`,
    alt: 'Confetti drop over the dancefloor',
  },
  {
    src: `${BASE}hero-crowd-3.jpg`,
    alt: 'Lasers and confetti on the floor',
  },
  {
    src: `${BASE}hero-grid-2.jpg`,
    alt: 'Front row at the barrier',
  },
  {
    src: `${BASE}hero-crowd-2.jpg`,
    alt: 'Hands up under the stage lights',
  },
  {
    src: `${BASE}ticket-vip-lounge.jpg`,
    alt: 'Outdoor lounge beside the venue',
  },
  {
    src: `${BASE}hero-grid-3.jpg`,
    alt: 'Blue night over the main stage',
  },
  {
    src: `${BASE}hero-crowd-4.jpg`,
    alt: 'Crowd under purple festival lights',
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
  { label: 'Duration', value: 'Till 3AM', icon: 'duration' },
  { label: 'Start', value: '20:00', icon: 'start' },
  { label: 'End', value: '03:00', icon: 'end' },
  { label: 'Ages', value: '18+', icon: 'ages' },
  { label: 'Format', value: 'Outdoor', icon: 'format' },
  { label: 'Music', value: 'Afro House', icon: 'music' },
] as const;

export const LINEUP_TITLE = 'Lineup';

export const IMMERSIVE_EXPECT = [
  'Black Coffee at the Grand Palais is an extraordinary night of music, energy and connection, bringing one of the world’s most celebrated electronic music artists to one of Paris’s most iconic venues. Get ready for an unforgettable experience where hypnotic rhythms, powerful beats and an incredible atmosphere come together for a night like no other.',
  'From the moment you arrive, you’ll feel the energy of the crowd as Black Coffee takes you on a musical journey through his signature blend of Afro-house and electronic sounds. Surrounded by thousands of music lovers in the spectacular setting of the Grand Palais, you’ll become part of a shared celebration of music, dance and connection that will stay with you long after the final beat.',
] as const;

export const IMMERSIVE_HIGHLIGHT_CARDS = [
  {
    title: 'An Unforgettable Night with Black Coffee',
    text: 'Experience one of the world’s most celebrated electronic music artists live, bringing his signature Afro-house sound and hypnotic rhythms to Paris.',
    image: `${BASE}artist-black-coffee.jpg`,
  },
  {
    title: 'An Iconic Venue, An Extraordinary Atmosphere',
    text: 'Discover the magic of the Grand Palais, where breathtaking architecture meets powerful beats and an electrifying atmosphere for a night like no other.',
    image: `${BASE}venue-grand-palais.jpg`,
  },
  {
    title: 'Music, Energy & Connection',
    text: 'Dance, connect and lose yourself in the music alongside fellow electronic music lovers. Share an unforgettable experience that will stay with you long after the final beat.',
    image: `${BASE}ticket-ga-crowd.jpg`,
  },
] as const;

export const IMMERSIVE_DAY_STEPS: {
  time?: string;
  title: string;
  text: string;
  image: string;
}[] = [
  {
    time: 'Doors open · 20:00',
    title: 'Arrive at the Grand Palais',
    text: 'Doors open at 20:00. Make your way into the Nef and settle in as the room fills under the glass roof.',
    image: `${BASE}ticket-ga-chateau.jpg`,
  },
  {
    title: 'Food & drinks',
    text: 'Enjoy a lively atmosphere with music, bars and food on site. Cashless only.',
    image: `${BASE}ticket-vip-lounge.jpg`,
  },
  {
    title: 'Music from the best artists',
    text: 'Open-air sessions with world-class DJs — Black Coffee on the decks.',
    image: `${BASE}artist-black-coffee.jpg`,
  },
  {
    time: 'Last beat · 03:00',
    title: 'Good music, good people',
    text: 'A crowd that comes for the music. Stay with it until close.',
    image: `${BASE}ticket-ga-crowd.jpg`,
  },
];

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
} as const;
