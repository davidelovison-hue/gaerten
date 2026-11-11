import type { ReactNode } from 'react';
import './PlanFoldSection.css';

type PlanFoldSectionProps = {
  id: string;
  title: string;
  open: boolean;
  onToggle: () => void;
  className?: string;
  peekWhenCollapsed?: boolean;
  children: ReactNode;
};

function ChevronIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 512 512" aria-hidden="true">
      <path
        fill="currentColor"
        d="M239 401c9.4 9.4 24.6 9.4 33.9 0L465 209c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-175 175L81 175c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9L239 401z"
      />
    </svg>
  );
}

export function PlanSectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="planFold__title">{children}</h2>;
}

export function PlanFoldSection({
  id,
  title,
  open,
  onToggle,
  className,
  peekWhenCollapsed = false,
  children,
}: PlanFoldSectionProps) {
  const panelId = `${id}-region`;
  const collapsedHidden = !open && !peekWhenCollapsed;
  const showHeaderToggle = open || !peekWhenCollapsed;

  return (
    <section
      id={id}
      className={`planFold${open ? ' planFold--open' : ''}${peekWhenCollapsed ? ' planFold--peek' : ''}${className ? ` ${className}` : ''}`}
      aria-label={title}
    >
      <div className="planFold__header" onClick={onToggle}>
        <PlanSectionTitle>{title}</PlanSectionTitle>
        {showHeaderToggle ? (
          <button
            type="button"
            className="planFold__toggle"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={(event) => {
              event.stopPropagation();
              onToggle();
            }}
          >
            <span>{open ? 'See less' : 'See more'}</span>
            <span className="planFold__toggleIcon">
              <ChevronIcon />
            </span>
          </button>
        ) : null}
      </div>
      <div
        id={panelId}
        className={`planFold__region${collapsedHidden ? ' planFold__region--collapsed' : ''}`}
      >
        <div
          className="planFold__inner"
          ref={(el) => {
            if (el) el.inert = collapsedHidden;
          }}
        >
          {children}
        </div>
      </div>
      {peekWhenCollapsed && !open ? (
        <div className="planFold__seeMoreRow">
          <button
            type="button"
            className="planFold__seeMoreBtn"
            aria-expanded={false}
            aria-controls={panelId}
            onClick={onToggle}
          >
            Show all details
          </button>
        </div>
      ) : null}
    </section>
  );
}
