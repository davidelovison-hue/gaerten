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

/** Headliner plus supporting artists. */
export const FESTIVAL_ARTISTS: FestivalArtist[] = [
  artist('black-coffee', 'Black Coffee', `${BASE}artist-black-coffee.jpg`),
  artist('keinemusik', 'Keinemusik', `${BASE}artist-keinemusik.jpg`),
  artist('dixon', 'Dixon', `${BASE}artist-dixon.jpg`),
  artist('ame', 'Âme', `${BASE}artist-ame.jpg`),
  artist('themba', 'Themba', `${BASE}artist-themba.jpg`),
  artist('da-capo', 'Da Capo', `${BASE}artist-da-capo.jpg`),
  artist('culoe-de-song', 'Culoe De Song', `${BASE}artist-culoe.jpg`),
  artist('shimza', 'Shimza', `${BASE}artist-shimza.jpg`),
  artist('jimi-jules', 'Jimi Jules', `${BASE}artist-jimi-jules.jpg`),
  artist('trikk', 'Trikk', `${BASE}artist-trikk.jpg`),
  artist('mind-against', 'Mind Against', `${BASE}artist-mind-against.jpg`),
  artist('sofiane-pamart', 'Sofiane Pamart', `${BASE}artist-pamart.jpg`),
];
