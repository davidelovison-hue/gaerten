import { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react';
import { createPortal } from 'react-dom';
import {
  FESTIVAL_MEDIA_HERO,
  GALLERY_IMAGE_URLS,
  GALLERY_IMAGES,
  HERO_FACTS,
} from '../data/festivalConfig';
import { getCatalogFromPrice } from '../data/planCatalog';
import { useCart } from '../lib/cartContext';
import { FESTIVAL_EVENT } from '../lib/festivalEvent';
import { useIsMobile } from '../lib/useIsMobile';
import { useTicketsSectionReached } from '../lib/useTicketsSectionReached';
import {
  buildGalleryItems,
  FestivalGalleryModal,
  galleryIndexForSrc,
} from './FestivalGalleryModal';
import './FestivalGallery.css';

const BASE = import.meta.env.BASE_URL;

function formatFeverFromPrice(value: number) {
  return `€${value.toFixed(2)}`;
}

function TitleChevron() {
  return (
    <svg
      className="eventMediaHero__titleChevron"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 448 512"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M241 337c-9.4 9.4-24.6 9.4-33.9 0L47 177c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l143 143L367 143c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9L241 337z"
      />
    </svg>
  );
}

function FactIcon({ icon }: { icon: string }) {
  if (icon === 'duration') {
    return (
      <svg viewBox="0 0 512 512" aria-hidden="true">
        <path
          fill="currentColor"
          d="M480 256A224 224 0 1 1 32 256a224 224 0 1 1 448 0zM0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM240 112V256c0 5.3 2.7 10.3 7.1 13.3l96 64c7.4 4.9 17.3 2.9 22.2-4.4s2.9-17.3-4.4-22.2L272 247.4V112c0-8.8-7.2-16-16-16s-16 7.2-16 16z"
        />
      </svg>
    );
  }
  if (icon === 'start') {
    return (
      <svg viewBox="0 0 384 512" aria-hidden="true">
        <path
          fill="currentColor"
          d="M320 32c0-9.9-4.5-19.2-12.3-25.2S289.8-1.4 280.2 1L100.3 45.8C79 51.3 64 70.5 64 92.5V448H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H64h256 32c17.7 0 32-14.3 32-32s-14.3-32-32-32H320V32zM96 112.5 288 71.4V448H96V112.5z"
        />
      </svg>
    );
  }
  if (icon === 'end') {
    return (
      <svg viewBox="0 0 384 512" aria-hidden="true">
        <path
          fill="currentColor"
          d="M64 64C46.3 64 32 78.3 32 96V416c0 17.7 14.3 32 32 32H256V64H64zM0 96C0 60.7 28.7 32 64 32H256h32c17.7 0 32 14.3 32 32s-14.3 32-32 32H256V448h32c17.7 0 32 14.3 32 32s-14.3 32-32 32H256 64c-35.3 0-64-28.7-64-64V96zM192 264a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"
        />
      </svg>
    );
  }
  if (icon === 'ages') {
    return (
      <svg viewBox="0 0 640 512" aria-hidden="true">
        <path
          fill="currentColor"
          d="M128 128a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zM269.7 336c80 0 145 64.3 146.3 144H32c1.2-79.7 66.2-144 146.3-144h91.4zM224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3zM512 304c0 8.8 7.2 16 16 16s16-7.2 16-16V224h80c8.8 0 16-7.2 16-16s-7.2-16-16-16H544V112c0-8.8-7.2-16-16-16s-16 7.2-16 16v80H432c-8.8 0-16 7.2-16 16s7.2 16 16 16h80v80z"
        />
      </svg>
    );
  }
  if (icon === 'music') {
    return (
      <svg viewBox="0 0 512 512" aria-hidden="true">
        <path
          fill="currentColor"
          d="M499.1 6.3c8.1 6 12.9 15.6 12.9 25.7v72V368c0 44.2-43 80-96 80s-96-35.8-96-80s43-80 96-80c11.2 0 22 1.6 32 4.6V147L192 223.8V432c0 44.2-43 80-96 80s-96-35.8-96-80s43-80 96-80c11.2 0 22 1.6 32 4.6V200 128.1c0-14.6 9.6-27.6 23.9-31.2l288-76.8c9.3-2.5 19.1-.2 27.2 6.2z"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 384 512" aria-hidden="true">
      <path
        fill="currentColor"
        d="M190.6 66.8c-38.8 37.8-62.9 90.7-62.9 149.2c0 108.9 83.5 198.3 189.9 207.3C289.8 439 257.7 448 223.5 448C117.7 448 32 362.1 32 256c0-94.8 68.5-173.5 158.6-189.2zm66.1-21.5c-1.5-6.9-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8C100 32 0 132.3 0 256S100 480 223.5 480c60.6 0 115.5-24.2 155.8-63.4c5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6c-96.9 0-175.5-78.8-175.5-176c0-65.8 36-123.1 89.3-153.3c6.1-3.5 9.2-10.5 7.7-17.3z"
      />
    </svg>
  );
}

function GalleryIcon() {
  return (
    <span className="eventMediaHero__galleryIcon" aria-hidden>
      <span />
      <span />
      <span />
      <span />
    </span>
  );
}

function GalleryButton({
  className,
  onClick,
}: {
  className: string;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <button type="button" className={className} onClick={onClick}>
      <GalleryIcon />
      Gallery
    </button>
  );
}

type FestivalGalleryProps = {
  onBuyTickets?: () => void;
};

export function FestivalGallery({ onBuyTickets }: FestivalGalleryProps) {
  const config = FESTIVAL_MEDIA_HERO;
  const alt = GALLERY_IMAGES[0]?.alt ?? FESTIVAL_EVENT.title;
  const { totalItems } = useCart();
  const isMobile = useIsMobile();
  const ticketsReached = useTicketsSectionReached();
  const priceRowRef = useRef<HTMLDivElement | null>(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryStartIndex, setGalleryStartIndex] = useState(0);
  const [heroCtaInView, setHeroCtaInView] = useState(true);

  const galleryItems = useMemo(
    () => buildGalleryItems(GALLERY_IMAGE_URLS, config.video, config.videoPoster),
    [config.video, config.videoPoster],
  );
  const fromPrice = formatFeverFromPrice(getCatalogFromPrice());

  const canOpenGallery = galleryItems.length > 0;
  const showStickyBuy =
    isMobile && Boolean(onBuyTickets) && totalItems === 0 && !heroCtaInView && !ticketsReached;

  useEffect(() => {
    const el = priceRowRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setHeroCtaInView(Boolean(entry?.isIntersecting)),
      { threshold: 0.45 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.classList.toggle('has-sticky-get-tickets', showStickyBuy);
    return () => document.body.classList.remove('has-sticky-get-tickets');
  }, [showStickyBuy]);

  const openGalleryAt = (index: number) => {
    if (!canOpenGallery) return;
    const i = Math.min(Math.max(0, index), galleryItems.length - 1);
    setGalleryStartIndex(i);
    setGalleryOpen(true);
  };

  return (
    <>
      <section className="festivalGalleryBand" aria-label="Festival media">
        <div className="eventMediaHero eventMediaHero--immersive">
          <div className="eventMediaHero__main">
            <video
              className="eventMediaHero__video"
              src={config.video}
              poster={config.videoPoster}
              muted
              playsInline
              loop
              autoPlay
              preload="auto"
              aria-label={`${alt} video`}
            />
            {canOpenGallery ? (
              <button
                type="button"
                className="eventMediaHero__mediaOpen"
                aria-label="Open gallery at video"
                onClick={() => openGalleryAt(0)}
              />
            ) : null}
            <div className="eventMediaHero__scrim" aria-hidden />
            <div className="eventMediaHero__overlay">
              <div className="eventMediaHero__overlayInner">
                <div className="eventMediaHero__contentMain">
                  <div className="eventMediaHero__header">
                    <span className="eventMediaHero__tag">
                      <span className="eventMediaHero__tagA11y">Fever exclusive</span>
                      <span className="eventMediaHero__tagText">Only on</span>
                      <img
                        className="eventMediaHero__tagLogo"
                        src={`${BASE}fever-logo-white.svg`}
                        alt=""
                        aria-hidden="true"
                      />
                    </span>
                    <h1 className="eventMediaHero__title">
                      <button type="button" className="eventMediaHero__titleToggle" aria-expanded="false">
                        <span className="eventMediaHero__titleText">{FESTIVAL_EVENT.title}</span>
                        <TitleChevron />
                      </button>
                    </h1>
                  </div>
                  <div className="eventMediaHero__eventMeta">
                    <time className="eventMediaHero__eventDate" dateTime="2027-05-15">
                      15 May
                    </time>
                    <p className="eventMediaHero__venue">Grand Palais</p>
                  </div>
                  <div className="eventMediaHero__facts" aria-label="Event highlights">
                    <div className="eventMediaHero__factsTrack">
                      {[0, 1].map((copy) => (
                        <ul
                          key={copy}
                          className="eventMediaHero__factsSet"
                          aria-hidden={copy === 1 || undefined}
                        >
                          {HERO_FACTS.map((fact) => (
                            <li key={`${copy}-${fact.label}`} className="eventMediaHero__fact">
                              <span className="eventMediaHero__factIcon">
                                <FactIcon icon={fact.icon} />
                              </span>
                              <dl className="eventMediaHero__factCopy">
                                <dt className="eventMediaHero__factLabel">{fact.label}</dt>
                                <dd className="eventMediaHero__factValue">{fact.value}</dd>
                              </dl>
                              <span className="eventMediaHero__factDivider" aria-hidden="true" />
                            </li>
                          ))}
                        </ul>
                      ))}
                    </div>
                  </div>
                </div>
                {onBuyTickets ? (
                  <div
                    ref={priceRowRef}
                    className="eventMediaHero__priceRow eventMediaHero__priceRow--bannered"
                  >
                    <div className="eventMediaHero__from">
                      <span className="eventMediaHero__fromLabel">From</span>
                      <span className="eventMediaHero__fromPrice">{fromPrice}</span>
                    </div>
                    <button type="button" className="eventMediaHero__buyBtn" onClick={onBuyTickets}>
                      Get tickets
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
            {canOpenGallery ? (
              <GalleryButton
                className="eventMediaHero__galleryBtn eventMediaHero__galleryBtn--onVideo"
                onClick={(e) => {
                  e.stopPropagation();
                  openGalleryAt(0);
                }}
              />
            ) : null}
            <div className="eventMediaHero__progress" aria-hidden>
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>

          {config.grid.map((src, index) => (
            <div key={`${src}-${index}`} className="eventMediaHero__cellWrap">
              <button
                type="button"
                className="eventMediaHero__cell"
                disabled={!canOpenGallery}
                aria-label={`Open gallery, image ${index + 1}`}
                onClick={() => openGalleryAt(galleryIndexForSrc(galleryItems, src))}
              >
                <img
                  className="eventMediaHero__img"
                  src={src}
                  alt=""
                  loading={index === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                />
              </button>
              {index === 3 && canOpenGallery ? (
                <GalleryButton
                  className="eventMediaHero__galleryBtn eventMediaHero__galleryBtn--onTile"
                  onClick={(e) => {
                    e.stopPropagation();
                    openGalleryAt(galleryIndexForSrc(galleryItems, src));
                  }}
                />
              ) : null}
            </div>
          ))}
        </div>
      </section>

      {galleryOpen && canOpenGallery ? (
        <FestivalGalleryModal
          images={GALLERY_IMAGE_URLS}
          alt={alt}
          videoSrc={config.video}
          videoPoster={config.videoPoster}
          initialIndex={galleryStartIndex}
          onClose={() => setGalleryOpen(false)}
        />
      ) : null}

      {showStickyBuy
        ? createPortal(
            <div className="eventMediaHeroStickyBuy" role="region" aria-label="Get tickets">
              <div className="eventMediaHeroStickyBuy__from">
                <span className="eventMediaHeroStickyBuy__fromLabel">From</span>
                <span className="eventMediaHeroStickyBuy__fromPrice">{fromPrice}</span>
              </div>
              <button type="button" className="eventMediaHeroStickyBuy__btn" onClick={onBuyTickets}>
                Get tickets
              </button>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
