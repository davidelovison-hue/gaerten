import { useEffect, useRef } from 'react';
import { PLAN_CORE_STEP_IDS, PLAN_STEPS, type PlanStepId } from '../data/planCatalog';
import './PlanTabs.css';

const CORE_TAB_IDS = new Set<PlanStepId>(PLAN_CORE_STEP_IDS);

type PlanTabsProps = {
  activeTab: PlanStepId;
  onTabChange: (tabId: PlanStepId) => void;
};

function TabButton({
  tabId,
  title,
  isActive,
  onTabChange,
}: {
  tabId: PlanStepId;
  title: string;
  isActive: boolean;
  onTabChange: (tabId: PlanStepId) => void;
}) {
  return (
    <li className="tabsItem" role="none">
      <button
        type="button"
        role="tab"
        aria-selected={isActive}
        id={`plan-tab-${tabId}`}
        className={`tabsLink ${isActive ? 'tabsLinkActive' : ''}`}
        onClick={() => onTabChange(tabId)}
      >
        {title}
      </button>
    </li>
  );
}

export function PlanTabs({ activeTab, onTabChange }: PlanTabsProps) {
  const tabsScrollRef = useRef<HTMLDivElement>(null);
  const tabsBarInnerRef = useRef<HTMLDivElement>(null);
  const coreTabs = PLAN_STEPS.filter((step) => CORE_TAB_IDS.has(step.id));
  const addonTabs = PLAN_STEPS.filter((step) => !CORE_TAB_IDS.has(step.id));

  useEffect(() => {
    const el = tabsScrollRef.current;
    if (!el) return;

    const update = () => {
      const canScroll = el.scrollWidth > el.clientWidth + 1;
      el.dataset.scrollable = canScroll ? 'true' : 'false';
      const syncDataset = (node: HTMLElement | null, start: string, end: string) => {
        if (!node) return;
        node.dataset.scrollable = canScroll ? 'true' : 'false';
        node.dataset.atStart = start;
        node.dataset.atEnd = end;
      };

      if (!canScroll) {
        syncDataset(el, 'true', 'true');
        syncDataset(tabsBarInnerRef.current, 'true', 'true');
        return;
      }
      const atStart = el.scrollLeft <= 1;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
      const start = atStart ? 'true' : 'false';
      const end = atEnd ? 'true' : 'false';
      syncDataset(el, start, end);
      syncDataset(tabsBarInnerRef.current, start, end);
    };

    update();
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);

    return () => {
      el.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  useEffect(() => {
    const tabButton = document.getElementById(`plan-tab-${activeTab}`);
    const scrollContainer = tabsScrollRef.current;
    if (!tabButton || !scrollContainer) return;

    if (scrollContainer.scrollWidth <= scrollContainer.clientWidth + 1) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    tabButton.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'nearest',
      inline: 'nearest',
    });
  }, [activeTab]);

  return (
    <div className="stickyTabsBar">
      <nav className="tabsNav" aria-label="Plan categories">
        <div className="tabsBarInner" ref={tabsBarInnerRef}>
          <div className="tabsScroll" ref={tabsScrollRef}>
            <ul className="tabsList" role="tablist">
              {coreTabs.map((step) => (
                <TabButton
                  key={step.id}
                  tabId={step.id}
                  title={step.title}
                  isActive={activeTab === step.id}
                  onTabChange={onTabChange}
                />
              ))}
              <li className="tabsGroupDivider" role="separator" aria-label="Add-ons">
                |
              </li>
              {addonTabs.map((step) => (
                <TabButton
                  key={step.id}
                  tabId={step.id}
                  title={step.title}
                  isActive={activeTab === step.id}
                  onTabChange={onTabChange}
                />
              ))}
            </ul>
          </div>
          <div className="tabsScrollCue" aria-hidden="true">
            <span className="tabsScrollCueIcon">›</span>
          </div>
        </div>
      </nav>
    </div>
  );
}
