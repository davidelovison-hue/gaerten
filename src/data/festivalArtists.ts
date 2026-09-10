import { GALLERY_IMAGES } from './festivalConfig';

export type FestivalArtist = {
  id: string;
  name: string;
  image: string;
  fallbackImage: string;
  day?: string;
};

const BASE = import.meta.env.BASE_URL;

export const LINEUP_FALLBACK_IMAGE = GALLERY_IMAGES[0]?.src ?? `${BASE}festival-poster.jpg`;

function artist(id: string, name: string, image: string): FestivalArtist {
  return { id, name, image, fallbackImage: LINEUP_FALLBACK_IMAGE };
}

/** Headliner plus Gärten Project collection artists. */
export const FESTIVAL_ARTISTS: FestivalArtist[] = [
  artist('artbat', 'ARTBAT', `${BASE}festival-poster.jpg`),
  artist('solomun', 'Solomun', `${BASE}artist-solomun.jpg`),
  artist('sofiane-pamart', 'Sofiane Pamart', `${BASE}artist-pamart.jpg`),
  artist('carl-cox', 'Carl Cox', `${BASE}hero-grid-4.jpg`),
  artist('mau-p', 'Mau P', `${BASE}hero-grid-3.jpg`),
  artist('black-coffee', 'Black Coffee', `${BASE}merch-black-coffee.jpg`),
  artist('mind-against', 'Mind Against', `${BASE}artist-eiffel.jpg`),
  artist('ludovico-einaudi', 'Ludovico Einaudi', `${BASE}hero-grid-1.jpg`),
  artist('mathame', 'Mathame', `${BASE}hero-grid-2.jpg`),
  artist('stephan-bodzin', 'Stephan Bodzin', `${BASE}hero-crowd-1.jpg`),
  artist('agents-of-time', 'Agents of Time', `${BASE}hero-crowd-2.jpg`),
  artist('nto', 'NTO', `${BASE}hero-crowd-3.jpg`),
  artist('yuksek', 'Yuksek', `${BASE}hero-crowd-4.jpg`),
];
