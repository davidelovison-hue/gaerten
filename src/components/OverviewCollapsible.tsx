import type { ReactNode } from 'react';
import { LINEUP_HINT, LINEUP_TITLE } from '../data/festivalConfig';
import { FESTIVAL_ARTISTS } from '../data/festivalArtists';
import { FestivalArtistsCarousel } from './FestivalArtistsCarousel';
import { OverviewSection } from './OverviewSection';
import './OverviewCollapsible.css';

type OverviewCollapsibleProps = {
  isOpen: boolean;
  onToggle: () => void;
  id?: string;
  children?: ReactNode;
};

export function OverviewCollapsible({
  isOpen,
  onToggle,
  id = 'overview',
  children,
}: OverviewCollapsibleProps) {
  return (
    <section
      id={id}
      className={`planOverviewCollapsible ${isOpen ? 'planOverviewCollapsibleOpen' : ''}`}
      aria-label="Overview"
    >
      <div className="planOverviewLineup">
        <FestivalArtistsCarousel
          artists={FESTIVAL_ARTISTS}
          title={LINEUP_TITLE}
          hint={LINEUP_HINT}
          hideDay
        />
      </div>

      <div className={`planOverviewFold ${isOpen ? 'planOverviewFoldOpen' : 'planOverviewFoldPeek'}`}>
        <button
          type="button"
          className="planOverviewToggle"
          aria-expanded={isOpen}
          aria-controls="plan-overview-panel"
          onClick={onToggle}
        >
          <span className="planOverviewToggleText">
            <span className="planOverviewToggleLabel">Overview</span>
            <span className="planOverviewToggleHint">Show info, venue &amp; more</span>
          </span>
          <span className="planOverviewToggleAction">
            <span className="planOverviewToggleActionText">{isOpen ? 'Hide' : 'Show details'}</span>
            <svg
              className="planOverviewToggleChevron"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M6 9.5L12 15.5L18 9.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>

        <div className="planOverviewReveal">
          <div className="planOverviewRevealInner">
            <div
              id="plan-overview-panel"
              className="planOverviewPanel"
              ref={(el) => {
                if (el) el.inert = !isOpen;
              }}
              aria-hidden={!isOpen || undefined}
            >
              {children ?? <OverviewSection />}
            </div>
            <div className="planOverviewPeekFade" aria-hidden="true" />
            <button
              type="button"
              className="planOverviewPeekHit"
              tabIndex={-1}
              aria-hidden="true"
            />
          </div>
        </div>
        {!isOpen ? (
          <button type="button" className="planOverviewShowMore" onClick={onToggle}>
            Show more
            <svg
              className="planOverviewShowMoreChevron"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M6 9.5L12 15.5L18 9.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        ) : null}
      </div>
    </section>
  );
}
