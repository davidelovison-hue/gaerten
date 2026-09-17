import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { CartPanel } from '../components/CartPanel';
import { FestivalGallery } from '../components/FestivalGallery';
import { FestivalNavbar } from '../components/FestivalNavbar';
import { OverviewCollapsible } from '../components/OverviewCollapsible';
import { PlanCategorySection } from '../components/PlanCategorySection';
import { PlanTabs } from '../components/PlanTabs';
import { useCart } from '../lib/cartContext';
import { scrollPageToTop } from '../lib/scrollPageToTop';
import { useIsMobile } from '../lib/useIsMobile';
import {
  DEFAULT_PLAN_STEP,
  PLAN_STEPS,
  getCategoriesForStep,
  getStepIdFromHash,
  type PlanStepId,
} from '../data/planCatalog';
import './PlanPage.css';
import './PlanScrollPage.css';

const TAB_SCROLL_GAP_PX = 12;

function getStickyOffsetPx() {
  const nav = document.querySelector<HTMLElement>('.planStickyNav');
  const tabs = document.querySelector<HTMLElement>('.planTabsSlot');
  const navH = nav?.getBoundingClientRect().height ?? 0;
  const tabsH = tabs?.getBoundingClientRect().height ?? 0;
  return navH + tabsH + TAB_SCROLL_GAP_PX;
}

function getTabFromHash(): PlanStepId {
  const hash = window.location.hash.replace(/^#/, '');
  if (hash === 'overview') return DEFAULT_PLAN_STEP;
  return getStepIdFromHash(hash);
}

function scrollToStep(stepId: PlanStepId, behavior: ScrollBehavior) {
  const el = document.getElementById(stepId);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - getStickyOffsetPx();
  window.scrollTo({ top: Math.max(0, top), left: 0, behavior });
}

function activeStepFromScroll(): PlanStepId {
  const offset = getStickyOffsetPx() + 8;
  const doc = document.documentElement;
  const atBottom = window.scrollY + window.innerHeight >= doc.scrollHeight - 24;
  if (atBottom) return PLAN_STEPS[PLAN_STEPS.length - 1].id;

  let current: PlanStepId = PLAN_STEPS[0].id;
  for (const step of PLAN_STEPS) {
    const el = document.getElementById(step.id);
    if (!el) continue;
    if (el.getBoundingClientRect().top - offset <= 0) current = step.id;
  }
  return current;
}

function scrollToStepInColumn(
  column: HTMLElement,
  stepId: PlanStepId,
  behavior: ScrollBehavior,
) {
  const el = document.getElementById(stepId);
  if (!el) return;
  const top =
    el.getBoundingClientRect().top - column.getBoundingClientRect().top + column.scrollTop - TAB_SCROLL_GAP_PX;
  column.scrollTo({ top: Math.max(0, top), left: 0, behavior });
}

function activeStepFromColumn(column: HTMLElement): PlanStepId {
  const offset = column.getBoundingClientRect().top + TAB_SCROLL_GAP_PX + 8;
  const atBottom = column.scrollTop + column.clientHeight >= column.scrollHeight - 24;
  if (atBottom) return PLAN_STEPS[PLAN_STEPS.length - 1].id;

  let current: PlanStepId = PLAN_STEPS[0].id;
  for (const step of PLAN_STEPS) {
    const el = document.getElementById(step.id);
    if (!el) continue;
    if (el.getBoundingClientRect().top - offset <= 0) current = step.id;
  }
  return current;
}

type PlanScrollPageProps = {
  homePath?: string;
  overview?: ReactNode;
};

export function PlanScrollPage({ homePath = '/scroll', overview }: PlanScrollPageProps) {
  const location = useLocation();
  const { items } = useCart();
  const isMobile = useIsMobile();
  const isSnap = homePath === '/immersive';
  const [activeTab, setActiveTab] = useState<PlanStepId>(getTabFromHash);
  const [isOverviewOpen, setIsOverviewOpen] = useState(
    () => window.location.hash.replace(/^#/, '') === 'overview',
  );
  const hasCart = items.length > 0;
  const suppressSpyUntilRef = useRef(0);
  const didInitialHashScroll = useRef(false);
  const snapRootRef = useRef<HTMLDivElement>(null);
  const ticketsColumnRef = useRef<HTMLDivElement>(null);
  const [ticketsInView, setTicketsInView] = useState(false);

  const setTabAndHash = useCallback((stepId: PlanStepId, replace = false) => {
    setActiveTab(stepId);
    const nextHash = `#${stepId}`;
    if (window.location.hash === nextHash) return;
    if (replace) window.history.replaceState(null, '', nextHash);
    else window.history.pushState(null, '', nextHash);
  }, []);

  const scrollSnapTo = useCallback((section: 'hero' | 'intro' | 'tickets', behavior: ScrollBehavior) => {
    const root = snapRootRef.current;
    const el = root?.querySelector<HTMLElement>(`.planSnap--${section}`);
    if (!root || !el) return;
    root.scrollTo({ top: el.offsetTop, left: 0, behavior });
  }, []);

  const scrollToCategory = useCallback(
    (stepId: PlanStepId, behavior: ScrollBehavior = 'smooth') => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const nextBehavior = reduceMotion ? 'auto' : behavior;
      suppressSpyUntilRef.current = performance.now() + 700;
      setTabAndHash(stepId);
      requestAnimationFrame(() => {
        if (!isSnap) {
          scrollToStep(stepId, nextBehavior);
          return;
        }
        scrollSnapTo('tickets', nextBehavior);
        window.setTimeout(
          () => {
            const column = ticketsColumnRef.current;
            if (column) scrollToStepInColumn(column, stepId, nextBehavior);
          },
          nextBehavior === 'auto' ? 40 : 420,
        );
      });
    },
    [isSnap, scrollSnapTo, setTabAndHash],
  );

  useLayoutEffect(() => {
    if (location.pathname !== homePath) return;
    if (location.hash) return;
    return scrollPageToTop();
  }, [homePath, location.pathname, location.hash, location.key]);

  useEffect(() => {
    if (didInitialHashScroll.current) return;
    didInitialHashScroll.current = true;
    const hash = window.location.hash.replace(/^#/, '');
    if (!hash) return;
    if (hash === 'overview') {
      if (isSnap) {
        const timeoutId = window.setTimeout(() => scrollSnapTo('intro', 'auto'), 80);
        return () => window.clearTimeout(timeoutId);
      }
      return;
    }
    const stepId = getStepIdFromHash(hash);
    const timeoutId = window.setTimeout(() => scrollToCategory(stepId, 'auto'), 80);
    return () => window.clearTimeout(timeoutId);
  }, [isSnap, scrollSnapTo, scrollToCategory]);

  useEffect(() => {
    const onScroll = () => {
      if (performance.now() < suppressSpyUntilRef.current) return;
      if (isSnap) {
        const column = ticketsColumnRef.current;
        const tickets = snapRootRef.current?.querySelector('.planSnap--tickets');
        if (tickets) {
          setTicketsInView(tickets.getBoundingClientRect().top < window.innerHeight * 0.72);
        }
        if (!column || !tickets) return;
        const ticketsVisible = tickets.getBoundingClientRect().top < window.innerHeight * 0.55;
        if (!ticketsVisible) return;
        const next = activeStepFromColumn(column);
        setActiveTab((current) => {
          if (current === next) return current;
          const nextHash = `#${next}`;
          if (window.location.hash !== nextHash) {
            window.history.replaceState(null, '', nextHash);
          }
          return next;
        });
        return;
      }

      const next = activeStepFromScroll();
      setActiveTab((current) => {
        if (current === next) return current;
        const nextHash = `#${next}`;
        if (window.location.hash !== nextHash) {
          window.history.replaceState(null, '', nextHash);
        }
        return next;
      });
    };

    onScroll();
    const snapRoot = snapRootRef.current;
    const column = ticketsColumnRef.current;
    if (isSnap) {
      snapRoot?.addEventListener('scroll', onScroll, { passive: true });
      column?.addEventListener('scroll', onScroll, { passive: true });
    } else {
      window.addEventListener('scroll', onScroll, { passive: true });
    }
    window.addEventListener('resize', onScroll);
    return () => {
      snapRoot?.removeEventListener('scroll', onScroll);
      column?.removeEventListener('scroll', onScroll);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [isSnap]);

  const handleTabChange = useCallback(
    (tabId: PlanStepId) => {
      setIsOverviewOpen(false);
      scrollToCategory(tabId);
    },
    [scrollToCategory],
  );

  const selectPlanTab = useCallback(
    (tabId: string) => {
      setIsOverviewOpen(false);
      scrollToCategory(getStepIdFromHash(tabId));
    },
    [scrollToCategory],
  );

  const handleGoToTickets = useCallback(() => {
    setIsOverviewOpen(false);
    scrollToCategory(DEFAULT_PLAN_STEP);
  }, [scrollToCategory]);

  const ticketsCatalog = (
    <>
      <div className="planTabsScrollAnchor" aria-hidden="true" />
      <div className="planTabsSlot">
        <PlanTabs activeTab={activeTab} onTabChange={handleTabChange} />
      </div>
      <div className="planMainShell">
        <div className="planMainColumn">
          <div className="planContentColumn" ref={isSnap ? ticketsColumnRef : undefined}>
            {PLAN_STEPS.map((step) =>
              getCategoriesForStep(step.id).map((category) => (
                <PlanCategorySection
                  key={category.id}
                  category={category}
                  isActive
                  showCategoryHeading
                />
              )),
            )}
          </div>
        </div>
      </div>
    </>
  );

  const overviewBlock = (
    <OverviewCollapsible
      isOpen={isOverviewOpen}
      onToggle={() => setIsOverviewOpen((open) => !open)}
    >
      {overview}
    </OverviewCollapsible>
  );

  const cartPanels = (
    <>
      {isMobile && hasCart ? <CartPanel mode="mobile" onSelectPlanTab={selectPlanTab} /> : null}
      {!isMobile ? <CartPanel mode="desktop" onSelectPlanTab={selectPlanTab} /> : null}
    </>
  );

  if (isSnap) {
    return (
      <div
        ref={snapRootRef}
        className={`planPage planPage--scroll planPage--snap${isOverviewOpen ? ' planPage--snapOverviewOpen' : ''}`}
      >
        <div className="planStickyNav">
          <FestivalNavbar />
        </div>

        <section className="planSnap planSnap--hero" aria-label="Festival">
          <div className="planHeroSlot planHeroSlot--mediaHero planHeroSlot--immersive">
            <FestivalGallery onBuyTickets={handleGoToTickets} />
          </div>
          <button
            type="button"
            className="planSnapContinue"
            onClick={() => scrollSnapTo('intro', 'smooth')}
          >
            Lineup
            <span className="planSnapContinueChevron" aria-hidden="true" />
          </button>
        </section>

        <section
          className={`planSnap planSnap--intro${isOverviewOpen ? ' planSnap--introOpen' : ''}`}
          aria-label="Lineup and overview"
        >
          <div className="planSnapIntroInner">
            <div className="planOverviewSlot">{overviewBlock}</div>
          </div>
          <div className={`planSnapIntroDock${ticketsInView ? ' planSnapIntroDock--hidden' : ''}`}>
            <button
              type="button"
              className="planSnapContinue planSnapContinue--onLight"
              onClick={() => scrollSnapTo('tickets', 'smooth')}
            >
              Tickets
              <span className="planSnapContinueChevron" aria-hidden="true" />
            </button>
          </div>
        </section>

        <section className="planSnap planSnap--tickets" aria-label="Tickets">
          <div className="planDesktopShell">
            <div className="planIntroBand">
              <h2 className="planTicketsHeading">Tickets</h2>
            </div>
            {ticketsCatalog}
            {cartPanels}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="planPage planPage--scroll">
      <div className="planStickyNav">
        <FestivalNavbar />
      </div>

      <div className="planHeroSlot planHeroSlot--mediaHero planHeroSlot--immersive">
        <FestivalGallery onBuyTickets={handleGoToTickets} />
      </div>

      <div className="planDesktopShell">
        <div className="planIntroBand">
          <div className="planOverviewSlot">{overviewBlock}</div>
          <h2 className="planTicketsHeading">Tickets</h2>
        </div>

        {ticketsCatalog}
        {cartPanels}
      </div>
    </div>
  );
}
