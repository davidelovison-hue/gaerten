import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { CartPanel } from '../components/CartPanel';
import { FestivalGallery } from '../components/FestivalGallery';
import { FestivalNavbar } from '../components/FestivalNavbar';
import { ForcedPlanProgress } from '../components/ForcedPlanProgress';
import { OverviewCollapsible } from '../components/OverviewCollapsible';
import { PlanCategorySection } from '../components/PlanCategorySection';
import { PlanCrossSellStrip } from '../components/PlanCrossSellStrip';
import { PlanTabs } from '../components/PlanTabs';
import { useCart } from '../lib/cartContext';
import { rememberPlanOrigin } from '../lib/routes';
import { scrollPageToTop } from '../lib/scrollPageToTop';
import { useIsMobile } from '../lib/useIsMobile';
import {
  DEFAULT_PLAN_STEP,
  PLAN_CORE_STEP_IDS,
  PLAN_STEPS,
  getCategoriesForStep,
  getPlanStep,
  getPlanStepIndex,
  getStepIdFromHash,
  shouldPrefixCategory,
  type PlanStepId,
} from '../data/planCatalog';
import './PlanPage.css';

type PlanPageProps = {
  homePath?: string;
  overview?: ReactNode;
  guided?: boolean;
};

const LAST_STEP_INDEX = PLAN_STEPS.length - 1;

function getTabFromHash(): PlanStepId {
  const hash = window.location.hash.replace(/^#/, '');
  if (hash === 'overview') return DEFAULT_PLAN_STEP;
  if (hash === 'accompagnant' || hash === 'pmr') return DEFAULT_PLAN_STEP;
  return getStepIdFromHash(hash);
}

function shouldOpenOverviewFromHash() {
  const hash = window.location.hash.replace(/^#/, '');
  return hash === 'overview';
}

const TAB_SCROLL_GAP_PX = 12;
const STICKY_CHECK_TOLERANCE_PX = 2;

function getStickyOffsetPx() {
  const nav = document.querySelector<HTMLElement>('.planStickyNav');
  const tabs = document.querySelector<HTMLElement>('.planTabsSlot');
  const navH = nav?.getBoundingClientRect().height ?? 0;
  const tabsH = tabs?.getBoundingClientRect().height ?? 0;
  return navH + tabsH + TAB_SCROLL_GAP_PX;
}

function isTabsBarStickyNow() {
  const nav = document.querySelector<HTMLElement>('.planStickyNav');
  const tabs = document.querySelector<HTMLElement>('.planTabsSlot');
  const anchor = document.querySelector<HTMLElement>('.planTabsScrollAnchor');
  if (!tabs) return false;
  if (!anchor) return false;

  const navH = nav?.getBoundingClientRect().height ?? 0;
  // Sticky engages once we've scrolled past the anchor point (adjusted by nav height).
  const anchorDocTop = anchor.getBoundingClientRect().top + window.scrollY;
  return window.scrollY >= anchorDocTop - navH - STICKY_CHECK_TOLERANCE_PX;
}

function getScrollTargetEl(tabId: string) {
  const categories = getCategoriesForStep(tabId);
  const firstId = categories[0]?.id;
  const section = firstId ? document.getElementById(firstId) : document.getElementById(tabId);
  if (!section) return null;
  const firstTitle = section.querySelector<HTMLElement>('.categorySectionTitle, .groupCarouselTitle');
  if (firstTitle) return firstTitle;
  const firstBlock = section.querySelector<HTMLElement>('.groupBlock');
  return firstBlock ?? section;
}

function scheduleOverviewScroll() {
  let cancelled = false;
  let rafId = 0;

  const runOnce = () => {
    const overviewEl = document.querySelector<HTMLElement>('.planOverviewSlot');
    if (!overviewEl) return;
    overviewEl.scrollIntoView({ block: 'start', behavior: 'auto' });
    const offset = getStickyOffsetPx();
    if (offset > 0) window.scrollBy({ top: -offset, left: 0, behavior: 'auto' });
  };

  rafId = requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (!cancelled) runOnce();
    });
  });

  return () => {
    cancelled = true;
    if (rafId) cancelAnimationFrame(rafId);
  };
}

function scheduleActiveTabScroll(tabId: string) {
  let cancelled = false;
  let rafId = 0;

  const runOnce = () => {
    if (!isTabsBarStickyNow()) return;

    const targetEl = getScrollTargetEl(tabId);
    if (!targetEl) return;

    // Deterministic and robust: scroll the element into view, then compensate for
    // sticky navbar + tabs so the target isn't hidden underneath.
    targetEl.scrollIntoView({ block: 'start', behavior: 'auto' });
    const offset = getStickyOffsetPx();
    if (offset > 0) window.scrollBy({ top: -offset, left: 0, behavior: 'auto' });
  };

  rafId = requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (!cancelled) runOnce();
    });
  });

  return () => {
    cancelled = true;
    if (rafId) cancelAnimationFrame(rafId);
  };
}

function getPlanTabsScrollTop() {
  const nav = document.querySelector<HTMLElement>('.planStickyNav');
  const tabs = document.querySelector<HTMLElement>('.planTabsSlot');
  const anchor = document.querySelector<HTMLElement>('.planTabsScrollAnchor');
  const target = tabs ?? anchor;
  if (!target) return null;

  const navH = nav?.getBoundingClientRect().height ?? 0;
  return Math.max(0, target.getBoundingClientRect().top + window.scrollY - navH);
}

function getTicketSectionScrollTop() {
  const fromTabs = getPlanTabsScrollTop();
  if (fromTabs != null) return fromTabs;

  const section = document.getElementById(DEFAULT_PLAN_STEP);
  if (!section) return null;
  const nav = document.querySelector<HTMLElement>('.planStickyNav');
  const navH = nav?.getBoundingClientRect().height ?? 0;
  return Math.max(0, section.getBoundingClientRect().top + window.scrollY - navH);
}

function focusPlanTab(tabId: string) {
  const tabButton =
    document.getElementById(`plan-tab-${tabId}`) ?? document.getElementById(`plan-step-${tabId}`);
  tabButton?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'auto' });
  tabButton?.focus({ preventScroll: true });
}

/** Scroll the tab bar under the nav and move keyboard/screen focus to that tab. */
function scheduleScrollToPlanTab(tabId: string) {
  let cancelled = false;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const run = () => {
    if (cancelled) return;
    const top = getPlanTabsScrollTop();
    if (top != null) {
      window.scrollTo({ top, left: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    }
    focusPlanTab(tabId);
  };

  const rafId = requestAnimationFrame(() => {
    requestAnimationFrame(run);
  });
  const timeoutId = window.setTimeout(run, 120);

  return () => {
    cancelled = true;
    cancelAnimationFrame(rafId);
    window.clearTimeout(timeoutId);
  };
}

/** Hero "Get tickets" CTA: always scroll to the ticket tabs + cards. */
function scrollToTicketSection() {
  const top = getTicketSectionScrollTop();
  if (top == null) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top, left: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
}

function scheduleScrollToTicketSection() {
  let cancelled = false;
  const run = () => {
    if (!cancelled) scrollToTicketSection();
  };
  const rafId = requestAnimationFrame(() => {
    requestAnimationFrame(run);
  });
  const timeoutId = window.setTimeout(run, 80);
  return () => {
    cancelled = true;
    cancelAnimationFrame(rafId);
    window.clearTimeout(timeoutId);
  };
}

export function PlanPage({ homePath = '/', overview, guided = false }: PlanPageProps) {
  const location = useLocation();
  const { items } = useCart();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<PlanStepId>(getTabFromHash);
  const [isOverviewOpen, setIsOverviewOpen] = useState(shouldOpenOverviewFromHash);
  const hasInitialTabScrollRef = useRef(false);
  const hasCart = items.length > 0;
  const stepIndex = getPlanStepIndex(activeTab);
  const stepCategories = getCategoriesForStep(activeTab);
  const isLastStep = stepIndex >= LAST_STEP_INDEX;
  // A category heading that repeats the selected tab adds nothing.
  const activeStepTitle = getPlanStep(activeTab)?.title;

  useEffect(() => {
    rememberPlanOrigin(location.pathname);
  }, [location.pathname]);

  // Logo / home: land at the very top of the page (no section jump).
  useLayoutEffect(() => {
    if (location.pathname !== homePath) return;
    const hash = location.hash.replace(/^#/, '');
    if (hash) return;
    setIsOverviewOpen(false);
    return scrollPageToTop();
  }, [homePath, location.pathname, location.hash, location.key]);

  const goToStep = useCallback(
    (stepId: PlanStepId, scrollToBar = false) => {
      const targetIndex = getPlanStepIndex(stepId);
      if (guided && targetIndex > stepIndex + 1) return;
      setIsOverviewOpen(false);
      setActiveTab(stepId);
      const nextHash = `#${stepId}`;
      if (window.location.hash !== nextHash) {
        window.history.pushState(null, '', nextHash);
      }
      if (scrollToBar) scheduleScrollToPlanTab(stepId);
    },
    [guided, stepIndex],
  );

  const handleTabChange = useCallback(
    (tabId: PlanStepId) => {
      if (tabId === activeTab) return;
      goToStep(tabId);
    },
    [activeTab, goToStep],
  );

  const selectPlanTab = useCallback(
    (tabId: string) => {
      goToStep(getStepIdFromHash(tabId), true);
    },
    [goToStep],
  );

  const goToNextStep = useCallback(() => {
    const next = PLAN_STEPS[stepIndex + 1];
    if (!next) return false;
    goToStep(next.id, true);
    return true;
  }, [goToStep, stepIndex]);

  const goToPrevStep = useCallback(() => {
    const prev = PLAN_STEPS[stepIndex - 1];
    if (!prev) return;
    goToStep(prev.id, true);
  }, [goToStep, stepIndex]);

  const handleCartContinue = useCallback(() => {
    if (isLastStep) return false;
    return goToNextStep();
  }, [goToNextStep, isLastStep]);

  const handleGoToTickets = useCallback(() => {
    setIsOverviewOpen(false);
    if (activeTab !== DEFAULT_PLAN_STEP) {
      setActiveTab(DEFAULT_PLAN_STEP);
      window.history.pushState(null, '', `#${DEFAULT_PLAN_STEP}`);
    } else {
      window.history.replaceState(null, '', `#${DEFAULT_PLAN_STEP}`);
    }
    scheduleScrollToTicketSection();
  }, [activeTab]);

  const handleOverviewToggle = useCallback(() => {
    setIsOverviewOpen((open) => !open);
  }, []);

  useEffect(() => {
    const syncFromHash = () => {
      const hash = window.location.hash.replace(/^#/, '');
      if (hash === 'overview') {
        setIsOverviewOpen(true);
        return;
      }
      const next = getTabFromHash();
      if (guided) {
        const nextIndex = getPlanStepIndex(next);
        if (nextIndex > stepIndex + 1) return;
      }
      setActiveTab(next);
    };

    window.addEventListener('popstate', syncFromHash);
    window.addEventListener('hashchange', syncFromHash);
    return () => {
      window.removeEventListener('popstate', syncFromHash);
      window.removeEventListener('hashchange', syncFromHash);
    };
  }, [guided, stepIndex]);

  useEffect(() => {
    if (!isOverviewOpen) return;
    return scheduleOverviewScroll();
  }, [isOverviewOpen]);

  useEffect(() => {
    if (!hasInitialTabScrollRef.current) {
      hasInitialTabScrollRef.current = true;
      const hash = window.location.hash.replace(/^#/, '');
      if ((activeTab === DEFAULT_PLAN_STEP && !hash) || hash === 'overview') {
        return;
      }
    }

    return scheduleActiveTabScroll(activeTab);
  }, [activeTab]);

  return (
    <div className="planPage">
      <div className="planStickyNav">
        <FestivalNavbar />
      </div>

      <div className="planHeroSlot planHeroSlot--mediaHero planHeroSlot--immersive">
        <FestivalGallery onBuyTickets={handleGoToTickets} />
      </div>

      <div className="planDesktopShell">
        <div className="planIntroBand">
          <div className="planOverviewSlot">
            <OverviewCollapsible isOpen={isOverviewOpen} onToggle={handleOverviewToggle}>
              {overview}
            </OverviewCollapsible>
          </div>

          <h2 className="planTicketsHeading">Tickets</h2>
        </div>

        <div className="planTabsScrollAnchor" aria-hidden="true" />
        <div className={`planTabsSlot${guided ? ' planTabsSlot--forced' : ''}`}>
          {guided ? (
            <ForcedPlanProgress activeStep={activeTab} />
          ) : (
            <PlanTabs activeTab={activeTab} onTabChange={handleTabChange} />
          )}
        </div>

        <div className="planMainShell">
          <div className="planMainColumn">
            <div className="planContentColumn">
              {stepCategories.map((category) => (
                <PlanCategorySection
                  key={category.id}
                  category={category}
                  isActive
                  prefixCarouselTitles={shouldPrefixCategory(
                    stepCategories,
                    category,
                    activeStepTitle,
                  )}
                />
              ))}
              {!guided && PLAN_CORE_STEP_IDS.includes(activeTab) ? (
                <PlanCrossSellStrip activeTab={activeTab} onSelectTab={selectPlanTab} />
              ) : null}
            </div>
          </div>
        </div>

        {isMobile && hasCart ? (
          <CartPanel
            mode="mobile"
            continueInsteadOfCheckout={guided && !isLastStep}
            onContinue={guided ? handleCartContinue : undefined}
            onBack={guided && stepIndex > 0 ? goToPrevStep : undefined}
          />
        ) : null}
        {!isMobile ? (
          <CartPanel
            mode="desktop"
            continueInsteadOfCheckout={guided && !isLastStep}
            onContinue={guided ? handleCartContinue : undefined}
            onBack={guided && stepIndex > 0 ? goToPrevStep : undefined}
          />
        ) : null}
      </div>
    </div>
  );
}
