import { GALLERY_IMAGES, POSTER_IMAGE } from '../data/festivalConfig';

export const FESTIVAL_EVENT_ID = 'bigsound-valencia-2027';

export const FESTIVAL_LOGO_SRC = `${import.meta.env.BASE_URL}festival-logo.jpg`;

export const FESTIVAL_EVENT = {
  id: FESTIVAL_EVENT_ID,
  title: 'BIGSOUND Festival 2027',
  image: GALLERY_IMAGES[0]?.src ?? POSTER_IMAGE,
  venue: 'Parc Central — Torrent, Valencia',
  dateLine: '18–19 June 2027 (Friday–Saturday)',
};

export function getFestivalEvent(eventId: string) {
  if (eventId === FESTIVAL_EVENT_ID) return FESTIVAL_EVENT;
  return null;
}
