import { GALLERY_IMAGES, POSTER_IMAGE } from '../data/festivalConfig';

export const FESTIVAL_EVENT_ID = 'black-coffee-grand-palais-2027';

export const FESTIVAL_LOGO_SRC = `${import.meta.env.BASE_URL}festival-logo.png`;

export const FESTIVAL_EVENT = {
  id: FESTIVAL_EVENT_ID,
  title: 'Black Coffee @ Grand Palais',
  image: GALLERY_IMAGES[0]?.src ?? POSTER_IMAGE,
  venue: 'Grand Palais, Paris',
  dateLine: 'Saturday 15 May 2027',
};

export function getFestivalEvent(eventId: string) {
  if (eventId === FESTIVAL_EVENT_ID) return FESTIVAL_EVENT;
  return null;
}
