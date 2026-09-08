import { GALLERY_IMAGES } from './festivalConfig';

export type FestivalArtist = {
  id: string;
  name: string;
  image: string;
  fallbackImage: string;
  day?: string;
};

export const LINEUP_FALLBACK_IMAGE =
  GALLERY_IMAGES[0]?.src ??
  'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1200&q=85';

const WIKI = 'https://upload.wikimedia.org/wikipedia/commons';
const UNSPLASH = 'https://images.unsplash.com';

function artist(
  id: string,
  name: string,
  day: string,
  image: string,
): FestivalArtist {
  return { id, name, image, fallbackImage: LINEUP_FALLBACK_IMAGE, day };
}

/** Artists currently listed on bigsoundfestival.com/valencia/cartel. */
export const FESTIVAL_ARTISTS: FestivalArtist[] = [
  artist(
    'rels-b',
    'Rels B',
    'Fri 18 Jun',
    `${UNSPLASH}/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=400&h=400&q=80`,
  ),
  artist(
    'david-bisbal',
    'David Bisbal',
    'Fri 18 Jun',
    `${WIKI}/thumb/5/58/2023-11-16_Gala_de_los_Latin_Grammy%2C_12_%28cropped%29.jpg/330px-2023-11-16_Gala_de_los_Latin_Grammy%2C_12_%28cropped%29.jpg`,
  ),
  artist(
    'ana-mena',
    'Ana Mena',
    'Fri 18 Jun',
    `${WIKI}/thumb/5/51/Premios_Goya_2026_-_Ana_Mena_%28cropped%29.jpg/330px-Premios_Goya_2026_-_Ana_Mena_%28cropped%29.jpg`,
  ),
  artist(
    'lia-kali',
    'Lia Kali',
    'Fri 18 Jun',
    `${WIKI}/e/e6/Lia_Kali.jpg`,
  ),
  artist(
    'despistaos',
    'Despistaos',
    'Fri 18 Jun',
    `${UNSPLASH}/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=400&h=400&q=80`,
  ),
  artist(
    'marc-segui',
    'Marc Seguí',
    'Fri 18 Jun',
    `${UNSPLASH}/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&h=400&q=80`,
  ),
  artist(
    'yami-safdie',
    'Yami Safdie',
    'Fri 18 Jun',
    `${WIKI}/thumb/c/c2/Yami_Safdie_02.jpg/330px-Yami_Safdie_02.jpg`,
  ),
  artist(
    'dollar-selmouni',
    'Dollar Selmouni',
    'Fri 18 Jun',
    `${UNSPLASH}/photo-1571266028243-d220c6c2d2cd?auto=format&fit=crop&w=400&h=400&q=80`,
  ),
  artist(
    'hens',
    'Hens',
    'Fri 18 Jun',
    `${UNSPLASH}/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=400&h=400&q=80`,
  ),
  artist(
    'metrika',
    'Metrika',
    'Fri 18 Jun',
    `${UNSPLASH}/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=400&h=400&q=80`,
  ),
  artist(
    'chema-rivas',
    'Chema Rivas',
    'Fri 18 Jun',
    `${UNSPLASH}/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=400&h=400&q=80`,
  ),
  artist(
    'juanjo-garcia',
    'Juanjo García',
    'Fri 18 Jun',
    `${UNSPLASH}/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&w=400&h=400&q=80`,
  ),
  artist(
    'king-africa',
    'King Africa',
    'Fri 18 Jun',
    `${UNSPLASH}/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=400&h=400&q=80`,
  ),
  artist(
    'paula-koops',
    'Paula Koops',
    'Fri 18 Jun',
    `${UNSPLASH}/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&h=400&q=80`,
  ),
  artist(
    'samantha-palos',
    'Samantha Palos',
    'Fri 18 Jun',
    `${UNSPLASH}/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=400&h=400&q=80`,
  ),
  artist(
    'lola-indigo',
    'Lola Índigo',
    'Sat 19 Jun',
    `${WIKI}/thumb/1/1d/Lola%C3%8Dndigo_GiraEstadios_BCN.jpg/330px-Lola%C3%8Dndigo_GiraEstadios_BCN.jpg`,
  ),
  artist(
    'nathy-peluso',
    'Nathy Peluso',
    'Sat 19 Jun',
    `${WIKI}/thumb/e/ef/Nathy_Peluso_Latin_Grammys_2021.jpg/330px-Nathy_Peluso_Latin_Grammys_2021.jpg`,
  ),
  artist(
    'juan-magan',
    'Juan Magán',
    'Sat 19 Jun',
    `${WIKI}/thumb/a/aa/Billboard_Latin_Music_Showcase_Chile_2018_-_Juan_Mag%C3%A1n_-_01_%28cropped%29.jpg/330px-Billboard_Latin_Music_Showcase_Chile_2018_-_Juan_Mag%C3%A1n_-_01_%28cropped%29.jpg`,
  ),
  artist(
    'rigoberta-bandini',
    'Rigoberta Bandini',
    'Sat 19 Jun',
    `${UNSPLASH}/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&h=400&q=80`,
  ),
  artist(
    'rusowsky',
    'Rusowsky',
    'Sat 19 Jun',
    `${UNSPLASH}/photo-1574391884720-bbc3740c59d1?auto=format&fit=crop&w=400&h=400&q=80`,
  ),
  artist(
    'barry-b',
    'Barry B',
    'Sat 19 Jun',
    `${UNSPLASH}/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=400&h=400&q=80`,
  ),
  artist(
    'lucho-rk',
    'Lucho RK',
    'Sat 19 Jun',
    `${UNSPLASH}/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=400&h=400&q=80`,
  ),
  artist(
    'maldita-nerea',
    'Maldita Nerea',
    'Sat 19 Jun',
    `${WIKI}/thumb/f/fb/Maldita_Nerea_-_Rock_in_Rio_Madrid_2012_-_13.jpg/330px-Maldita_Nerea_-_Rock_in_Rio_Madrid_2012_-_13.jpg`,
  ),
  artist(
    'samurai',
    'Samuraï',
    'Sat 19 Jun',
    `${UNSPLASH}/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=400&h=400&q=80`,
  ),
  artist(
    'chimeno',
    'Chimeno',
    'Sat 19 Jun',
    `${UNSPLASH}/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=400&h=400&q=80`,
  ),
  artist(
    'lara-taylor',
    'Lara Taylor',
    'Sat 19 Jun',
    `${UNSPLASH}/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=400&h=400&q=80`,
  ),
  artist(
    'mario-los-codigos',
    'Mario Los Códigos',
    'Sat 19 Jun',
    `${UNSPLASH}/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&h=400&q=80`,
  ),
  artist(
    'selecta',
    'Selecta',
    'Sat 19 Jun',
    `${UNSPLASH}/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=400&h=400&q=80`,
  ),
];
