import { useEffect, useId } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { PLAN_ADDON_CATEGORIES, type TicketStepId } from '../data/planCatalog';
import { useCart } from '../lib/cartContext';
import { buildCheckoutFromCart } from '../lib/buildCheckoutFromCart';
import { persistCheckoutBasket } from '../lib/checkoutFlowStorage';
import { connectPath } from '../lib/routes';
import './PlanAddonsModal.css';

type PlanAddonsModalProps = {
  open: boolean;
  onClose: () => void;
  onSelectCategory: (stepId: TicketStepId) => void;
};

const ADDON_COPY: Record<
  (typeof PLAN_ADDON_CATEGORIES)[number]['id'],
  { hint: string; image: string }
> = {
  merch: {
    hint: 'Limited tees for the night',
    image: 'merch-black-coffee-front.jpg',
  },
  addons: {
    hint: 'Cashless top-up for the night',
    image: 'entity-cashless.png',
  },
  shuttle: {
    hint: 'Return coach to Paris-Bercy',
    image: 'entity-bus.jpg',
  },
};

function ChevronIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PlanAddonsModal({ open, onClose, onSelectCategory }: PlanAddonsModalProps) {
  const titleId = useId();
  const navigate = useNavigate();
  const { items } = useCart();

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleCheckout = () => {
    const returnHash = window.location.hash.replace(/^#/, '') || 'entry';
    const payload = buildCheckoutFromCart(items, returnHash);
    if (!payload) return;
    persistCheckoutBasket(payload.eventId, payload);
    navigate(connectPath(payload.eventId), { state: payload });
  };

  const base = import.meta.env.BASE_URL;

  return createPortal(
    <div className="planAddonsModal" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <button
        type="button"
        className="planAddonsModal__backdrop"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="planAddonsModal__panel">
        <header className="planAddonsModal__header">
          <div className="planAddonsModal__heading">
            <h2 className="planAddonsModal__title" id={titleId}>
              Want anything else?
            </h2>
            <p className="planAddonsModal__lead">
              Tickets are in your cart. Add another category, or go to checkout.
            </p>
          </div>
          <button type="button" className="planAddonsModal__close" aria-label="Close" onClick={onClose}>
            ×
          </button>
        </header>

        <ul className="planAddonsModal__list">
          {PLAN_ADDON_CATEGORIES.map((category) => {
            const copy = ADDON_COPY[category.id];
            return (
              <li key={category.id}>
                <button
                  type="button"
                  className="planAddonsModal__offer"
                  onClick={() => onSelectCategory(category.id)}
                >
                  <img
                    className="planAddonsModal__thumb"
                    src={`${base}${copy.image}`}
                    alt=""
                  />
                  <span className="planAddonsModal__offerCopy">
                    <span className="planAddonsModal__offerTitle">{category.label}</span>
                    <span className="planAddonsModal__offerHint">{copy.hint}</span>
                  </span>
                  <span className="planAddonsModal__chevron">
                    <ChevronIcon />
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="planAddonsModal__footer">
          <button type="button" className="planAddonsModal__checkout" onClick={handleCheckout}>
            Go to checkout
          </button>
          <p className="planAddonsModal__brand">
            <img src={`${base}fever-logo-black.svg`} alt="fever" />
          </p>
        </div>
      </div>
    </div>,
    document.body,
  );
}
