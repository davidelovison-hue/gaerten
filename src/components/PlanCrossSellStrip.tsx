import { PLAN_STEPS, type PlanStepId } from '../data/planCatalog';
import './PlanCrossSellStrip.css';

type PlanCrossSellStripProps = {
  activeTab: PlanStepId;
  onSelectTab: (tabId: string) => void;
};

export function PlanCrossSellStrip({ activeTab, onSelectTab }: PlanCrossSellStripProps) {
  const links = PLAN_STEPS.filter((step) => step.id !== activeTab);
  return (
    <nav className="planCrossSell" aria-label="Also available">
      <p className="planCrossSellLabel">Also available:</p>
      <ul className="planCrossSellList">
        {links.map((item, index) => (
          <li key={item.id} className="planCrossSellItem">
            {index > 0 ? (
              <span className="planCrossSellDot" aria-hidden="true">
                ·
              </span>
            ) : null}
            <button
              type="button"
              className="planCrossSellChip"
              onClick={() => onSelectTab(item.id)}
            >
              {item.title}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
