import type { ReactNode } from 'react';
import './SectionMediaHeading.css';

type SectionMediaHeadingProps = {
  title: string;
  imageSrc?: string;
  imageSrcs?: string[];
  imageAlt?: string;
  icon?: ReactNode;
  compact?: boolean;
};

function LineupIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="2.4" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="16.5" cy="9" r="2.1" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M4.5 18c.6-2.4 2.4-3.7 3.5-3.7s2.9 1.3 3.5 3.7M13.2 18c.45-1.9 1.8-2.9 2.7-2.9s2.2 1 2.7 2.9"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SectionMediaHeading({
  title,
  imageSrc,
  imageSrcs,
  imageAlt = '',
  icon,
  compact = false,
}: SectionMediaHeadingProps) {
  const photos = (imageSrcs?.filter(Boolean) ?? []).length
    ? imageSrcs!.filter(Boolean)
    : imageSrc
      ? [imageSrc]
      : [];

  return (
    <div className={`sectionMediaHeading${compact ? ' sectionMediaHeading--compact' : ''}`}>
      <div
        className={`sectionMediaHeading__photoWrap${photos.length > 1 ? ' sectionMediaHeading__photoWrap--strip' : ''}`}
        aria-hidden="true"
      >
        {photos.map((src) => (
          <img key={src} className="sectionMediaHeading__photo" src={src} alt="" />
        ))}
      </div>
      <div className="sectionMediaHeading__chip">
        <span className="sectionMediaHeading__icon">{icon ?? <LineupIcon />}</span>
        <h2 className="sectionMediaHeading__title">{title}</h2>
      </div>
      <span className="sr-only">{imageAlt || title}</span>
    </div>
  );
}
