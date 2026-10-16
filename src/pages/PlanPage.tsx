import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { CartPanel } from '../components/CartPanel';
import { FestivalGallery } from '../components/FestivalGallery';
import { FestivalNavbar } from '../components/FestivalNavbar';
import { ForcedPlanProgress } from '../components/ForcedPlanProgress';
import { ImmersiveOverview } from '../components/ImmersiveOverview';
import { PlanCategorySection } from '../components/PlanCategorySection';
import { PlanFoldSection, PlanSectionTitle } from '../components/PlanFoldSection';
import { PlanTabs } from '../components/PlanTabs';
import { useCart } from '../lib/cartContext';
import { rememberPlanOrigin } from '../lib/routes';
import { scrollPageToTop } from '../lib/scrollPageToTop';
import { useIsMobile } from '../lib/useIsMobile';
import {
  DEFAULT_PLAN_STEP,
  PLAN_STEPS,
  getCategoriesForStep,
  getPlanStep,
  getPlanStepIndex,
  getStepIdFromHash,
  isTicketStepId,
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

const OVERVIEW_HASHES = new Set([
  'overview',
  'highlights',
  'gallery',
  'day',
  'venue',
  'accompagnant',
  'pmr',
  'highlights-1',
  'lineup-1',
  'gallery-1',
  'how-it-works-1',
  'description-1',
  'rules-1',
  'venue-1',
  'faqs-1',
]);

function getHashId() {
  return window.location.hash.replace(/^#/, '');
}

function isOverviewHash(hash: string) {
  return OVERVIEW_HASHES.has(hash);
}

function getTabFromHash(guided = false): PlanStepId {
  const hash = window.location.hash.replace(/^#/, '');
  if (!hash || isOverviewHash(hash)) {
    return DEFAULT_PLAN_STEP;
  }
  const next = getStepIdFromHash(hash);
  if (guided && !isTicketStepId(next)) return DEFAULT_PLAN_STEP;
  return next;
}

const TAB_SCROLL_GAP_PX = 12;
const STICKY_CHECK_TOLERANCE_PX = 2;

function getNavOverlayHeightPx() {
  const card = document.querySelector<HTMLElement>('.festivalNavbar');
  if (card) {
    const bottom = card.getBoundingClientRect().bottom;
    if (bottom > 0) return bottom;
  }
  return document.querySelector<HTMLElement>('.planStickyNav')?.getBoundingClientRect().height ?? 0;
}

function getStickyOffsetPx() {
  const tabs = document.querySelector<HTMLElement>('.planTabsSlot');
  const navH = getNavOverlayHeightPx();
  const tabsH = tabs?.getBoundingClientRect().height ?? 0;
  return navH + tabsH + TAB_SCROLL_GAP_PX;
}

function isTabsBarStickyNow() {
  const tabs = document.querySelector<HTMLElement>('.planTabsSlot');
  const anchor = document.querySelector<HTMLElement>('.planTabsScrollAnchor');
  if (!tabs) return false;
  if (!anchor) return false;

  const navH = getNavOverlayHeightPx();
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
  const tabs = document.querySelector<HTMLElement>('.planTabsSlot');
  const anchor = document.querySelector<HTMLElement>('.planTabsScrollAnchor');
  const target = tabs ?? anchor;
  if (!target) return null;

  const navH = getNavOverlayHeightPx();
  return Math.max(0, target.getBoundingClientRect().top + window.scrollY - navH);
}

function getTicketSectionScrollTop() {
  const fold = document.getElementById('tickets');
  const navH = getNavOverlayHeightPx();
  if (fold) {
    return Math.max(0, fold.getBoundingClientRect().top + window.scrollY - navH);
  }

  const fromTabs = getPlanTabsScrollTop();
  if (fromTabs != null) return fromTabs;

  const section = document.getElementById(DEFAULT_PLAN_STEP);
  if (!section) return null;
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

export function PlanPage({ homePath = '/', guided = false }: PlanPageProps) {
  const location = useLocation();
  const { items } = useCart();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<PlanStepId>(() => getTabFromHash(guided));
  const [overviewOpen, setOverviewOpen] = useState(() => isOverviewHash(getHashId()));
  const [navScrolled, setNavScrolled] = useState(false);
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

  useEffect(() => {
    if (guided) return;
    const sync = () => setNavScrolled(window.scrollY > 24);
    sync();
    window.addEventListener('scroll', sync, { passive: true });
    return () => window.removeEventListener('scroll', sync);
  }, [guided]);

  useLayoutEffect(() => {
    if (guided) return undefined;
    const applyViewportHeight = () => {
      if (window.scrollY > 1) return;
      const h = window.visualViewport?.height ?? window.innerHeight;
      document.documentElement.style.setProperty('--app-vh', `${h}px`);
    };
    applyViewportHeight();
    window.addEventListener('orientationchange', applyViewportHeight);
    window.addEventListener('resize', applyViewportHeight);
    window.visualViewport?.addEventListener('resize', applyViewportHeight);
    return () => {
      window.removeEventListener('orientationchange', applyViewportHeight);
      window.removeEventListener('resize', applyViewportHeight);
      window.visualViewport?.removeEventListener('resize', applyViewportHeight);
      document.documentElement.style.removeProperty('--app-vh');
    };
  }, [guided]);

  // Logo / home: land at the very top of the page (no section jump).
  useLayoutEffect(() => {
    if (location.pathname !== homePath) return;
    const hash = location.hash.replace(/^#/, '');
    if (hash) return;
    return scrollPageToTop();
  }, [homePath, location.pathname, location.hash, location.key]);

  const goToStep = useCallback(
    (stepId: PlanStepId, scrollToBar = false) => {
      const targetIndex = getPlanStepIndex(stepId);
      if (guided && targetIndex > stepIndex + 1) return;
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
    setOverviewOpen(false);
    if (activeTab !== DEFAULT_PLAN_STEP) {
      setActiveTab(DEFAULT_PLAN_STEP);
      window.history.pushState(null, '', `#${DEFAULT_PLAN_STEP}`);
    } else {
      window.history.replaceState(null, '', `#${DEFAULT_PLAN_STEP}`);
    }
    scheduleScrollToTicketSection();
  }, [activeTab]);

  const toggleOverview = useCallback(() => {
    setOverviewOpen((open) => !open);
  }, []);

  useEffect(() => {
    const syncFromHash = () => {
      const hash = getHashId();
      const next = getTabFromHash(guided);
      if (guided) {
        const nextIndex = getPlanStepIndex(next);
        if (nextIndex > stepIndex + 1) return;
      }
      setActiveTab(next);
      if (isOverviewHash(hash)) setOverviewOpen(true);
      if (isTicketStepId(hash)) setOverviewOpen(false);
    };

    window.addEventListener('popstate', syncFromHash);
    window.addEventListener('hashchange', syncFromHash);
    return () => {
      window.removeEventListener('popstate', syncFromHash);
      window.removeEventListener('hashchange', syncFromHash);
    };
  }, [guided, stepIndex]);

  useEffect(() => {
    if (!hasInitialTabScrollRef.current) {
      hasInitialTabScrollRef.current = true;
      const hash = window.location.hash.replace(/^#/, '');
      if (!hash || hash === 'overview') {
        return;
      }
    }

    return scheduleActiveTabScroll(activeTab);
  }, [activeTab]);

  return (
    <div
      className={`planPage${guided ? '' : ' planPage--marketplace'}${!guided && navScrolled ? ' planPage--navScrolled' : ''}`}
    >
      <div className="planStickyNav">
        <FestivalNavbar variant={guided ? 'dark' : 'marketplace'} />
      </div>

      <div className="planHeroSlot planHeroSlot--mediaHero planHeroSlot--immersive">
        <FestivalGallery onBuyTickets={handleGoToTickets} />
      </div>

      <div className="planDesktopShell">
        {guided ? (
          <>
            <div className="planTabsScrollAnchor" aria-hidden="true" />
            <div className="planTabsSlot planTabsSlot--forced">
              <ForcedPlanProgress activeStep={isTicketStepId(activeTab) ? activeTab : DEFAULT_PLAN_STEP} />
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
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="planIntroBand">
              <PlanFoldSection
                id="overview"
                title="Overview"
                icon="compass"
                open={overviewOpen}
                onToggle={toggleOverview}
              >
                <ImmersiveOverview />
              </PlanFoldSection>
            </div>
            <section id="tickets" className="planTicketsSection" aria-label="Tickets">
              <div className="planTickets">
                <PlanSectionTitle icon="ticket">Tickets</PlanSectionTitle>
                <div className="planTicketsRail">
                  <div className="planTicketsMain">
                    <div className="planTabsScrollAnchor" aria-hidden="true" />
                    <div className="planTabsSlot">
                      <PlanTabs activeTab={activeTab} onTabChange={handleTabChange} tabs={PLAN_STEPS} />
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
                        </div>
                      </div>
                    </div>
                  </div>
                  {!isMobile ? (
                    <div className="planTicketsCart">
                      <CartPanel
                        mode="desktop"
                        continueInsteadOfCheckout={!isLastStep}
                        onContinue={handleCartContinue}
                        onBack={stepIndex > 0 ? goToPrevStep : undefined}
                      />
                    </div>
                  ) : null}
                </div>
              </div>
            </section>
          </>
        )}

        {isMobile && hasCart ? (
          <CartPanel
            mode="mobile"
            continueInsteadOfCheckout={!isLastStep}
            onContinue={handleCartContinue}
            onBack={stepIndex > 0 ? goToPrevStep : undefined}
          />
        ) : null}
        {guided && !isMobile ? (
          <CartPanel
            mode="desktop"
            continueInsteadOfCheckout={!isLastStep}
            onContinue={handleCartContinue}
            onBack={stepIndex > 0 ? goToPrevStep : undefined}
          />
        ) : null}
      </div>
    </div>
  );
}
