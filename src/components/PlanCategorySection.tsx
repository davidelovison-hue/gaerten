import type { ReactNode } from 'react';
import { formatCarouselTitle, type PlanCategory, type PlanGroup } from '../data/planCatalog';
import { EntityCard } from './EntityCard';
import { GroupCarousel } from './GroupCarousel';
import { OverviewSection } from './OverviewSection';
import './PlanCategorySection.css';

type PlanCategorySectionProps = {
  category: PlanCategory;
  isActive?: boolean;
  /** Carry the category name in each carousel title instead of a heading row. */
  prefixCarouselTitles?: boolean;
  footer?: ReactNode;
};

export function PlanCategorySection({
  category,
  isActive = true,
  prefixCarouselTitles = false,
  footer,
}: PlanCategorySectionProps) {
  const groups = category.groups.filter((group) => group.entities.length > 0);
  const equalRow = category.cardLayout === 'equalRow';
  const showCarouselTitle = prefixCarouselTitles || groups.length > 1;

  const carouselTitle = (group: PlanGroup) =>
    formatCarouselTitle(category.title, group.title, prefixCarouselTitles);

  const sectionClassName = isActive ? 'categorySection' : 'categorySection categorySectionHidden';

  if (category.contentMode === 'overview' || category.id === 'overview') {
    return (
      <section
        id={category.id}
        className={sectionClassName}
        aria-label={category.title}
        aria-hidden={!isActive}
        hidden={!isActive}
      >
        <OverviewSection />
      </section>
    );
  }

  if (groups.length === 0) {
    return (
      <section
        id={category.id}
        className={sectionClassName}
        aria-label={category.title}
        aria-hidden={!isActive}
        hidden={!isActive}
      />
    );
  }

  const renderGroup = (group: PlanGroup, withTitle: boolean) => (
    <div key={group.id} className="groupBlock">
      {withTitle ? <h3 className="groupCarouselTitle">{carouselTitle(group)}</h3> : null}
      <GroupCarousel
        mobileGroupLayout="all"
        layout={equalRow ? 'equalRow' : 'default'}
        itemCount={group.entities.length}
        ariaLabel={carouselTitle(group)}
      >
        {group.entities.map((entity) => (
          <EntityCard key={entity.id} entity={entity} />
        ))}
      </GroupCarousel>
    </div>
  );

  return (
    <section
      id={category.id}
      className={sectionClassName}
      aria-label={category.title}
      aria-hidden={!isActive}
      hidden={!isActive}
    >
      {groups.length > 1 ? (
        <div className="groupStackAll">{groups.map((group) => renderGroup(group, true))}</div>
      ) : groups[0] ? (
        renderGroup(groups[0], showCarouselTitle)
      ) : null}
      {footer}
    </section>
  );
}
