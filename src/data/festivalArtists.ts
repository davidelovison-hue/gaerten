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

function artist(
  id: string,
  name: string,
  day: string,
  image: string,
): FestivalArtist {
  return { id, name, image, fallbackImage: LINEUP_FALLBACK_IMAGE, day };
}

/** Headliner plus Gärten Project collection artists. */
export const FESTIVAL_ARTISTS: FestivalArtist[] = [
  artist('artbat', 'ARTBAT', 'Sat 12 Sep', `${BASE}festival-poster.jpg`),
  artist('solomun', 'Solomun', 'Gärten', `${BASE}artist-solomun.jpg`),
  artist('sofiane-pamart', 'Sofiane Pamart', 'Gärten', `${BASE}artist-pamart.jpg`),
  artist('carl-cox', 'Carl Cox', 'Gärten', `${BASE}hero-grid-4.jpg`),
  artist('black-coffee', 'Black Coffee', 'Gärten', `${BASE}merch-black-coffee.jpg`),
  artist('mind-against', 'Mind Against', 'Gärten', `${BASE}artist-eiffel.jpg`),
];
