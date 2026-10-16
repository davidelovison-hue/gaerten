import { PLAN_STEPS, type PlanPageTab, type PlanStepId } from '../data/planCatalog';
import { FeverNavTabs } from './FeverNavTabs';

type PlanTabsProps = {
  activeTab: PlanStepId;
  onTabChange: (tabId: PlanStepId) => void;
  tabs?: PlanPageTab[];
};

export function PlanTabs({ activeTab, onTabChange, tabs = PLAN_STEPS }: PlanTabsProps) {
  return (
    <FeverNavTabs
      ariaLabel="Ticket categories"
      variant="pill"
      tabs={tabs.map((tab) => ({ id: tab.id, label: tab.title }))}
      activeId={activeTab}
      onSelect={(id) => onTabChange(id as PlanStepId)}
      getTabDomId={(id) => `plan-tab-${id}`}
    />
  );
}
