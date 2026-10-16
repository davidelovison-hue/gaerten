import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  FESTIVAL_COPY,
  FESTIVAL_MEDIA_HERO,
  GALLERY_IMAGE_URLS,
  IMMERSIVE_DAY_STEPS,
  IMMERSIVE_EXPECT,
  IMMERSIVE_FAQS,
  IMMERSIVE_HIGHLIGHT_CARDS,
  LINEUP_TITLE,
  VENUE_IMAGE,
} from '../data/festivalConfig';
import { FESTIVAL_ARTISTS } from '../data/festivalArtists';
import { FestivalArtistsCarousel } from './FestivalArtistsCarousel';
import { FestivalGalleryModal } from './FestivalGalleryModal';
import { FeverNavTabs } from './FeverNavTabs';
import './ImmersiveOverview.css';

const SECTION_NAV = [
  { id: 'highlights-1', label: 'Highlights' },
  { id: 'gallery-1', label: 'Gallery' },
  { id: 'how-it-works-1', label: 'On the day' },
  { id: 'description-1', label: 'Overview' },
  { id: 'venue-1', label: 'Venue' },
  { id: 'faqs-1', label: 'FAQs' },
] as const;

const GALLERY_TILE_PATTERN = ['lead', 'wide', 'tile', 'tile', 'portrait', 'tile', 'tile'] as const;

function galleryTileClass(index: number) {
  const tile = GALLERY_TILE_PATTERN[index % GALLERY_TILE_PATTERN.length];
  return tile === 'tile' ? 'fvGallery__item' : `fvGallery__item fvGallery__item--${tile}`;
}

function SectionHeader({
  overline,
  title,
  titleHref,
}: {
  overline: string;
  title: string;
  titleHref?: string;
}) {
  return (
    <header className="fvHead">
      <h2 className="fvHead__title">
        <span className="fvHead__overline">{overline}</span>
        {titleHref ? (
          <a className="fvHead__link" href={titleHref} target="_blank" rel="noopener noreferrer">
            {title}
          </a>
        ) : (
          title
        )}
      </h2>
    </header>
  );
}

function ReadMore({ children, lines }: { children: ReactNode; lines: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`fvReadMore ${open ? 'fvReadMore--open' : ''}`}>
      <div className="fvReadMore__content" style={{ ['--max-lines' as string]: String(lines) }}>
        <div className="fvReadMore__inner">{children}</div>
      </div>
      <button
        type="button"
        className="fvReadMore__btn"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span>{open ? 'Show less' : 'Show more'}</span>
        <svg width="12" height="12" viewBox="0 0 512 512" aria-hidden="true">
          {open ? (
            <path
              fill="currentColor"
              d="M273 111c-9.4-9.4-24.6-9.4-33.9 0L47 303c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l175-175 175 175c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9L273 111z"
            />
          ) : (
            <path
              fill="currentColor"
              d="M239 401c9.4 9.4 24.6 9.4 33.9 0L465 209c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-175 175L81 175c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9L239 401z"
            />
          )}
        </svg>
      </button>
    </div>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 384 512" width="16" height="16" aria-hidden="true">
      <path
        fill="currentColor"
        d="M352 192c0-88.4-71.6-160-160-160S32 103.6 32 192c0 15.6 5.4 37 16.6 63.4c10.9 25.9 26.2 54 43.6 82.1c34.1 55.3 74.4 108.2 99.9 140c25.4-31.8 65.8-84.7 99.9-140c17.3-28.1 32.7-56.3 43.6-82.1C346.6 229 352 207.6 352 192zm32 0c0 87.4-117 243-168.3 307.2c-12.3 15.3-35.1 15.3-47.4 0C117 435 0 279.4 0 192C0 86 86 0 192 0S384 86 384 192zm-240 0a48 48 0 1 0 96 0 48 48 0 1 0 -96 0zm48 80a80 80 0 1 1 0-160 80 80 0 1 1 0 160z"
      />
    </svg>
  );
}

type ImmersiveOverviewProps = {
  hideNav?: boolean;
  only?: string | string[];
};

export function ImmersiveOverview({ hideNav = false, only }: ImmersiveOverviewProps) {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [showAllFaqs, setShowAllFaqs] = useState(false);
  const [activeSection, setActiveSection] = useState<string>(SECTION_NAV[0].id);
  const highlightsListRef = useRef<HTMLUListElement>(null);
  const visibleIds = only
    ? new Set(Array.isArray(only) ? only : [only])
    : null;
  const showBlock = (id: string) => !visibleIds || visibleIds.has(id);
  const visibleFaqs = showAllFaqs ? IMMERSIVE_FAQS : IMMERSIVE_FAQS.slice(0, 3);

  const galleryThumbs = useMemo(() => {
    const poster = FESTIVAL_MEDIA_HERO.videoPoster;
    const images = GALLERY_IMAGE_URLS.filter((src) => src !== poster);
    return [
      { kind: 'video' as const, src: poster, video: FESTIVAL_MEDIA_HERO.video },
      ...images.map((src) => ({ kind: 'image' as const, src })),
    ];
  }, []);
  const galleryListRef = useRef<HTMLUListElement>(null);

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(FESTIVAL_COPY.gettingThere.mapQuery)}`;
  const mapEmbed = `https://maps.google.com/maps?q=${encodeURIComponent(FESTIVAL_COPY.gettingThere.mapQuery)}&z=14&output=embed&hl=en`;

  useEffect(() => {
    if (hideNav) return undefined;
    const nodes = SECTION_NAV.map((item) => document.getElementById(item.id)).filter(
      (el): el is HTMLElement => Boolean(el),
    );
    if (nodes.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveSection(visible.target.id);
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: [0.1, 0.35, 0.6] },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [hideNav]);

  const openGallery = (index: number) => {
    setGalleryIndex(index);
    setGalleryOpen(true);
  };

  const jumpTo = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className={`fvOverview${hideNav ? ' fvOverview--embedded' : ''}`}>
      {hideNav ? null : (
        <FeverNavTabs
          ariaLabel="Experience sections"
          variant="bar"
          tabs={SECTION_NAV.map((item) => ({ id: item.id, label: item.label }))}
          activeId={activeSection}
          onSelect={jumpTo}
        />
      )}

      <div className={`fvSections${hideNav ? ' fvSections--embedded' : ''}`}>
        {showBlock('highlights-1') ? (
        <div id="highlights-1" className="fvBlock">
          <section className="fvSection fvSection--highlights">
            <SectionHeader overline="Experience highlights" title="Highlights" />
            <div className="fvHighlights">
              <div className="fvHighlights__host">
                <ul className="fvHighlights__list" ref={highlightsListRef}>
                  {IMMERSIVE_HIGHLIGHT_CARDS.map((card) => (
                    <li key={card.title} className="fvHighlights__item">
                      <article className="fvHighlight">
                        <div className="fvHighlight__image">
                          <img src={card.image} alt="" />
                        </div>
                        <div className="fvHighlight__caption">
                          <h3 className="fvHighlight__title">{card.title}</h3>
                          <p className="fvHighlight__desc">{card.text}</p>
                        </div>
                      </article>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  className="fvHighlights__next"
                  aria-label="Next highlights"
                  onClick={() => {
                    highlightsListRef.current?.scrollBy({ left: 380, behavior: 'smooth' });
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 320 512" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </section>
        </div>
        ) : null}

        {showBlock('lineup-1') ? (
        <div id="lineup-1" className="fvBlock">
          <section className="fvSection">
            <div className="fvLineup">
              <FestivalArtistsCarousel
                artists={FESTIVAL_ARTISTS}
                overline="Artists"
                title={LINEUP_TITLE}
                hideDay
              />
            </div>
          </section>
        </div>
        ) : null}

        {showBlock('gallery-1') ? (
        <div id="gallery-1" className="fvBlock">
          <section className="fvGallerySection">
            <SectionHeader overline="Gallery" title="Photos from our fans" />
            <div className="fvGalleryHost">
              <ul className="fvGallery" ref={galleryListRef}>
                {galleryThumbs.map((item, index) => (
                  <li key={`${item.kind}-${item.src}`} className={galleryTileClass(index)}>
                    <button
                      type="button"
                      className="fvGallery__btn"
                      aria-label={item.kind === 'video' ? 'Play gallery video' : 'Open gallery photo'}
                      onClick={() => openGallery(index)}
                    >
                      {item.kind === 'video' ? (
                        <video
                          className="fvGallery__video"
                          muted
                          playsInline
                          loop
                          preload="none"
                          poster={item.src}
                          src={item.video}
                          aria-hidden="true"
                        />
                      ) : (
                        <img src={item.src} alt="" />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className="fvGallery__next"
                aria-label="Next gallery photos"
                onClick={() => {
                  galleryListRef.current?.scrollBy({ left: 420, behavior: 'smooth' });
                }}
              >
                <svg width="16" height="16" viewBox="0 0 320 512" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"
                  />
                </svg>
              </button>
            </div>
          </section>
        </div>
        ) : null}

        {showBlock('how-it-works-1') ? (
        <div id="how-it-works-1" className="fvBlock">
          <section className="fvSection">
            <SectionHeader overline="On the day" title="How it works" />
            <ol className="fvSteps">
              {IMMERSIVE_DAY_STEPS.map((step) => (
                <li key={step.title}>
                  <div className="fvStep">
                    <div className="fvStep__media">
                      <div className="fvStep__picture">
                        <img src={step.image} alt="" />
                      </div>
                    </div>
                    <div className="fvStep__content">
                      {step.time ? <p className="fvStep__time">{step.time}</p> : null}
                      <p className="fvStep__title">{step.title}</p>
                      <p className="fvStep__desc">{step.text}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>
        ) : null}

        {showBlock('description-1') ? (
        <div id="description-1" className="fvBlock">
          <section className="fvSection">
            <SectionHeader overline="In short" title="What to expect" />
            <div className="fvExpect">
              <ReadMore lines={4}>
                {IMMERSIVE_EXPECT.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </ReadMore>
            </div>
          </section>
        </div>
        ) : null}

        {showBlock('venue-1') ? (
        <div id="venue-1" className="fvBlock">
          <section className="fvVenueSection">
            <SectionHeader overline="About the venue" title={FESTIVAL_COPY.venue.name} titleHref={mapsUrl} />
            <div className="fvVenueBody">
              <div className="fvVenueHighlight">
                <div className="fvVenueHighlight__image">
                  <img src={VENUE_IMAGE} alt={FESTIVAL_COPY.venue.name} />
                </div>
                <div className="fvVenueHighlight__caption">
                  <ReadMore lines={6}>
                    <p>{FESTIVAL_COPY.venue.text}</p>
                  </ReadMore>
                </div>
              </div>
              <div className="fvVenueList">
                <div className="fvVenueMap">
                  <iframe
                    title="Venue location map"
                    src={mapEmbed}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <ul className="fvVenueFacts">
                  <li className="fvVenueFact">
                    <span className="fvVenueFact__icon">
                      <PinIcon />
                    </span>
                    <span className="fvVenueFact__content">
                      <p className="fvVenueFact__label">Address</p>
                      <p className="fvVenueFact__value">{FESTIVAL_COPY.gettingThere.address.replace(/\n/g, ', ')}</p>
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </div>
        ) : null}

        {showBlock('faqs-1') ? (
        <div id="faqs-1" className="fvBlock">
          <section className="fvSection">
            <SectionHeader overline="FAQs" title="Got questions? We've got answers" />
            <div className="fvFaqs">
              <div className="fvFaqs__list">
                {visibleFaqs.map((item, index) => (
                  <div key={item.q} className="fvFaqs__item">
                    <details className="fvFaq" open={index === 0}>
                      <summary className="fvFaq__dt">
                        <span className="fvFaq__q">{item.q}</span>
                        <span className="fvFaq__icon" aria-hidden="true">
                          <svg width="14" height="14" viewBox="0 0 448 512">
                            <path
                              fill="currentColor"
                              d="M241 337c-9.4 9.4-24.6 9.4-33.9 0L47 177c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l143 143L367 143c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9L241 337z"
                            />
                          </svg>
                        </span>
                      </summary>
                      <div className="fvFaq__answerWrap">
                        <p className="fvFaq__a">{item.a}</p>
                      </div>
                    </details>
                  </div>
                ))}
              </div>
              {!showAllFaqs && IMMERSIVE_FAQS.length > 3 ? (
                <button type="button" className="fvReadMore__btn fvReadMore__btn--underline" onClick={() => setShowAllFaqs(true)}>
                  <span>See all {IMMERSIVE_FAQS.length} questions</span>
                  <svg width="12" height="12" viewBox="0 0 512 512" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M239 401c9.4 9.4 24.6 9.4 33.9 0L465 209c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-175 175L81 175c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9L239 401z"
                    />
                  </svg>
                </button>
              ) : null}
            </div>
          </section>
        </div>
        ) : null}
      </div>

      {galleryOpen ? (
        <FestivalGalleryModal
          images={GALLERY_IMAGE_URLS}
          alt={FESTIVAL_COPY.venue.name}
          videoSrc={FESTIVAL_MEDIA_HERO.video}
          videoPoster={FESTIVAL_MEDIA_HERO.videoPoster}
          initialIndex={galleryIndex}
          onClose={() => setGalleryOpen(false)}
        />
      ) : null}
    </div>
  );
}
