import { GALLERY_IMAGES, POSTER_IMAGE } from '../data/festivalConfig';

export const FESTIVAL_EVENT_ID = 'artbat-fontainebleau-2026';

export const FESTIVAL_LOGO_SRC = `${import.meta.env.BASE_URL}festival-logo.png`;

export const FESTIVAL_EVENT = {
  id: FESTIVAL_EVENT_ID,
  title: 'ARTBAT @ Château de Fontainebleau',
  image: GALLERY_IMAGES[0]?.src ?? POSTER_IMAGE,
  venue: 'Château de Fontainebleau — Paris',
  dateLine: 'Saturday 12 September 2026',
};

export function getFestivalEvent(eventId: string) {
  if (eventId === FESTIVAL_EVENT_ID) return FESTIVAL_EVENT;
  return null;
}
