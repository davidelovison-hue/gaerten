import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
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

export function PlanScrollPage() {
  const location = useLocation();
  const { items } = useCart();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<PlanStepId>(getTabFromHash);
  const [isOverviewOpen, setIsOverviewOpen] = useState(false);
  const hasCart = items.length > 0;
  const suppressSpyUntilRef = useRef(0);
  const didInitialHashScroll = useRef(false);

  const setTabAndHash = useCallback((stepId: PlanStepId, replace = false) => {
    setActiveTab(stepId);
    const nextHash = `#${stepId}`;
    if (window.location.hash === nextHash) return;
    if (replace) window.history.replaceState(null, '', nextHash);
    else window.history.pushState(null, '', nextHash);
  }, []);

  const scrollToCategory = useCallback(
    (stepId: PlanStepId, behavior: ScrollBehavior = 'smooth') => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      suppressSpyUntilRef.current = performance.now() + 700;
      setTabAndHash(stepId);
      requestAnimationFrame(() => {
        scrollToStep(stepId, reduceMotion ? 'auto' : behavior);
      });
    },
    [setTabAndHash],
  );

  useLayoutEffect(() => {
    if (location.pathname !== '/scroll') return;
    if (location.hash) return;
    return scrollPageToTop();
  }, [location.pathname, location.hash, location.key]);

  useEffect(() => {
    if (didInitialHashScroll.current) return;
    didInitialHashScroll.current = true;
    const hash = window.location.hash.replace(/^#/, '');
    if (!hash || hash === 'overview') return;
    const stepId = getStepIdFromHash(hash);
    const timeoutId = window.setTimeout(() => scrollToCategory(stepId, 'auto'), 80);
    return () => window.clearTimeout(timeoutId);
  }, [scrollToCategory]);

  useEffect(() => {
    const onScroll = () => {
      if (performance.now() < suppressSpyUntilRef.current) return;
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
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

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
          <div className="planOverviewSlot">
            <OverviewCollapsible isOpen={isOverviewOpen} onToggle={() => setIsOverviewOpen((open) => !open)} />
          </div>
          <h2 className="planTicketsHeading">Tickets</h2>
        </div>

        <div className="planTabsScrollAnchor" aria-hidden="true" />
        <div className="planTabsSlot">
          <PlanTabs activeTab={activeTab} onTabChange={handleTabChange} />
        </div>

        <div className="planMainShell">
          <div className="planMainColumn">
            <div className="planContentColumn">
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

        {isMobile && hasCart ? <CartPanel mode="mobile" onSelectPlanTab={selectPlanTab} /> : null}
        {!isMobile ? <CartPanel mode="desktop" onSelectPlanTab={selectPlanTab} /> : null}
      </div>
    </div>
  );
}
