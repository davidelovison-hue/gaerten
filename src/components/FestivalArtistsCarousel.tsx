import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { FestivalArtist } from '../data/festivalArtists';
import './CarouselNav.css';
import './FestivalArtistsCarousel.css';

type FestivalArtistsCarouselProps = {
  artists: FestivalArtist[];
  title?: string;
  hint?: string | null;
  hideDay?: boolean;
  className?: string;
};

function ArtistChipAvatar({ artist }: { artist: FestivalArtist }) {
  const [src, setSrc] = useState(artist.image);

  useEffect(() => {
    setSrc(artist.image);
  }, [artist.id, artist.image]);

  return (
    <img
      className="festivalArtistChip__img"
      src={src}
      alt=""
      width={92}
      height={92}
      loading="lazy"
      decoding="async"
      onError={() => {
        if (src !== artist.fallbackImage) setSrc(artist.fallbackImage);
      }}
    />
  );
}

export function FestivalArtistsCarousel({
  artists,
  title = 'Lineup',
  hint = null,
  hideDay = true,
  className = '',
}: FestivalArtistsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollable, setScrollable] = useState(false);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(true);

  const updateScrollState = useCallback(() => {
    const element = scrollRef.current;
    if (!element) {
      setScrollable(false);
      setAtStart(true);
      setAtEnd(true);
      return;
    }
    const { scrollLeft, scrollWidth, clientWidth } = element;
    setScrollable(scrollWidth > clientWidth + 2);
    setAtStart(scrollLeft <= 4);
    setAtEnd(scrollLeft + clientWidth >= scrollWidth - 4);
  }, []);

  useLayoutEffect(() => {
    updateScrollState();
  }, [artists.length, updateScrollState]);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    element.addEventListener('scroll', updateScrollState, { passive: true });
    const observer = new ResizeObserver(updateScrollState);
    observer.observe(element);

    return () => {
      element.removeEventListener('scroll', updateScrollState);
      observer.disconnect();
    };
  }, [updateScrollState, artists.length]);

  const scrollByPage = (direction: 1 | -1) => {
    const element = scrollRef.current;
    if (!element) return;
    const firstChild = element.firstElementChild as HTMLElement | null;
    const gap = parseFloat(getComputedStyle(element).gap || '12') || 12;
    const amount = firstChild ? firstChild.offsetWidth + gap : element.clientWidth * 0.85;
    element.scrollBy({ left: direction * amount, behavior: 'smooth' });
  };

  if (artists.length === 0) return null;

  return (
    <section
      className={`festivalArtistsCarousel${className ? ` ${className}` : ''}`}
      aria-label="Festival lineup artists"
    >
      <div className="festivalArtistsCarousel__head">
        <h2 className="festivalArtistsCarousel__title">{title}</h2>
        {hint != null && hint !== '' ? (
          <p className="festivalArtistsCarousel__hint">{hint}</p>
        ) : null}
      </div>
      <div
        className="festivalArtistsCarousel__outer"
        data-scrollable={scrollable ? 'true' : 'false'}
        data-at-start={scrollable ? String(atStart) : 'true'}
        data-at-end={scrollable ? String(atEnd) : 'true'}
      >
        {scrollable ? (
          <>
            {!atStart ? (
              <button
                type="button"
                className="carouselNavBtn carouselNavPrev"
                aria-label="Previous artists"
                onClick={() => scrollByPage(-1)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
            ) : null}
            {!atEnd ? (
              <button
                type="button"
                className="carouselNavBtn carouselNavNext"
                aria-label="Next artists"
                onClick={() => scrollByPage(1)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            ) : null}
          </>
        ) : null}
        <div ref={scrollRef} className="festivalArtistsCarousel__track" role="list" tabIndex={0}>
          {artists.map((artist) => (
            <div key={artist.id} className="festivalArtistChip" role="listitem">
              <span className="festivalArtistChip__avatar">
                <ArtistChipAvatar artist={artist} />
              </span>
              <span className="festivalArtistChip__name">{artist.name}</span>
              {!hideDay && artist.day ? (
                <span className="festivalArtistChip__day">{artist.day}</span>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
