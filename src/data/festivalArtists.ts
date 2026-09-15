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
  artist('artbat', 'ARTBAT', `${BASE}artist-artbat.jpg`),
  artist('solomun', 'Solomun', `${BASE}artist-solomun.jpg`),
  artist('sofiane-pamart', 'Sofiane Pamart', `${BASE}artist-pamart.jpg`),
  artist('carl-cox', 'Carl Cox', `${BASE}artist-carl-cox.jpg`),
  artist('mau-p', 'Mau P', `${BASE}artist-mau-p.jpg`),
  artist('black-coffee', 'Black Coffee', `${BASE}artist-black-coffee.jpg`),
  artist('mind-against', 'Mind Against', `${BASE}artist-mind-against.jpg`),
  artist('mathame', 'Mathame', `${BASE}artist-mathame.jpg`),
  artist('stephan-bodzin', 'Stephan Bodzin', `${BASE}artist-bodzin.jpg`),
  artist('agents-of-time', 'Agents of Time', `${BASE}artist-agents-of-time.jpg`),
  artist('nto', 'NTO', `${BASE}artist-nto.jpg`),
  artist('yuksek', 'Yuksek', `${BASE}artist-yuksek.jpg`),
];
