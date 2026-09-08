/**
 * BIGSOUND Valencia 2027 ticket catalog.
 * Weekend abonos are the entry-pass tab; add-ons are cashless + insurance.
 */
import { formatPrice } from '../lib/formatPrice';

export type VariantAxis = {
  id: string;
  label: string;
  options: string[];
  disabledOptions?: string[];
  defaultOption?: string;
};

export type PlanEntity = {
  id: string;
  name: string;
  price: number;
  type: 'configurable_single' | 'configurable_multi' | 'composite';
  variantAxes?: VariantAxis[];
  optionPrices?: Record<string, number>;
  date?: string;
  listingTag?: 'SELLING FAST' | 'SOLD OUT' | 'LIMITED';
  description?: string;
  includedItems?: string[];
  cardPreviewBullets?: string[];
  requires?: string[];
  displaySummary?: boolean;
  pricingMode?: 'dynamic';
  hideImage?: boolean;
};

export type PlanGroup = {
  id: string;
  title: string;
  entities: PlanEntity[];
};

export type PlanCategory = {
  id: string;
  title: string;
  contentMode?: 'overview';
  cardLayout?: 'equalRow';
  groups: PlanGroup[];
};

export const ENTRY_TICKET_IDS = [
  'abono-general',
  'abono-front-stage',
  'abono-vipsound',
] as const;

export const PLAN_CATALOG: PlanCategory[] = [
  {
    id: 'overview',
    title: 'Overview',
    contentMode: 'overview',
    groups: [],
  },
  {
    id: 'abonos',
    title: 'Abonos',
    groups: [
      {
        id: 'abonos-weekend',
        title: 'Weekend pass',
        entities: [
          {
            id: 'abono-general',
            name: 'Abono General',
            price: 49,
            type: 'configurable_single',
            listingTag: 'SELLING FAST',
            date: '18–19 Jun 2027',
            description:
              'Access to the BIGSOUND concert grounds on Friday 18 and Saturday 19 June, from doors to close. Fees included. Nominative ticket — swapped for a wristband at accreditation.',
            cardPreviewBullets: ['Friday & Saturday', 'General admission'],
            includedItems: [
              'Festival access 18–19 June',
              'General grounds',
              'Cashless wristband at accreditation',
            ],
          },
          {
            id: 'abono-front-stage',
            name: 'Abono Front Stage',
            price: 89,
            type: 'configurable_single',
            listingTag: 'LIMITED',
            date: '18–19 Jun 2027',
            description:
              'Front-row access under the main stage plus general grounds, Friday 18 and Saturday 19 June. Fees included.',
            cardPreviewBullets: ['Front rows, main stage', 'Friday & Saturday'],
            includedItems: [
              'Festival access 18–19 June',
              'Front Stage zone at the main stage',
              'General grounds',
            ],
          },
          {
            id: 'abono-vipsound',
            name: 'Abono VIPSOUND',
            price: 230,
            type: 'configurable_single',
            listingTag: 'LIMITED',
            date: '18–19 Jun 2027',
            description:
              'The most exclusive weekend pass: fast-track accreditation, VIP platform and Front Stage, exclusive toilets, bar and food, glass + lanyard, and 4 drinks. Fees included.',
            cardPreviewBullets: ['VIP platform + Front Stage', '4 drinks included'],
            includedItems: [
              'Festival access 18–19 June',
              'Fast-track accreditation',
              'VIP platform and Front Stage',
              'Exclusive toilets, bar and food',
              'Glass + lanyard',
              '4 drinks',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'addons',
    title: 'Add-ons',
    groups: [
      {
        id: 'addons-cashless',
        title: 'Cashless top-up',
        entities: [
          {
            id: 'cashless-promo-30',
            name: 'Promo 30',
            price: 30,
            type: 'configurable_single',
            hideImage: true,
            listingTag: 'LIMITED',
            description:
              'Load €30 onto your cashless wristband and get €5 extra. Add more than one promo to the same ticket. Promotional credit is used first and is not refundable.',
            cardPreviewBullets: ['Pay €30, get €35', 'While stocks last'],
            includedItems: ['€30 cashless credit', '€5 bonus drink credit'],
            requires: [...ENTRY_TICKET_IDS],
          },
          {
            id: 'cashless-promo-50',
            name: 'Promo 50',
            price: 50,
            type: 'configurable_single',
            hideImage: true,
            listingTag: 'LIMITED',
            description:
              'Load €50 onto your cashless wristband and get €10 extra. Add more than one promo to the same ticket. Promotional credit is used first and is not refundable.',
            cardPreviewBullets: ['Pay €50, get €60', 'While stocks last'],
            includedItems: ['€50 cashless credit', '€10 bonus drink credit'],
            requires: [...ENTRY_TICKET_IDS],
          },
        ],
      },
      {
        id: 'addons-insurance',
        title: 'Insurance',
        entities: [
          {
            id: 'insurance-ingood',
            name: 'Reimbursement insurance',
            price: 5.9,
            type: 'configurable_single',
            hideImage: true,
            description:
              'Ingood refund insurance by Reale Seguros if you cannot attend. After purchase you receive the policy by email. Questions: ayuda@ingood.es.',
            cardPreviewBullets: ['Ingood × Reale Seguros', 'Per ticket'],
            includedItems: ['Non-attendance reimbursement cover', 'Policy details by email'],
            requires: [...ENTRY_TICKET_IDS],
          },
        ],
      },
    ],
  },
];

const BASE = import.meta.env.BASE_URL;

export const DEFAULT_TICKET_IMAGE = `${BASE}entity-ticket.jpg`;
const ABONO_GENERAL_IMG = `${BASE}abono-general.jpg`;
const ABONO_FRONT_IMG = `${BASE}abono-front-stage.jpg`;
const ABONO_VIP_IMG = `${BASE}abono-vipsound.jpg`;

export const ENTITY_IMAGES: Record<string, string> = {
  'abono-general': ABONO_GENERAL_IMG,
  'abono-front-stage': ABONO_FRONT_IMG,
  'abono-vipsound': ABONO_VIP_IMG,
};

export const ENTITY_GALLERIES: Record<string, string[]> = {};

export function getEntityImages(entityId: string): string[] {
  if (ENTITY_GALLERIES[entityId]) return ENTITY_GALLERIES[entityId];
  if (ENTITY_IMAGES[entityId]) return [ENTITY_IMAGES[entityId]];
  return [DEFAULT_TICKET_IMAGE];
}

export function findEntity(entityId: string): PlanEntity | undefined {
  for (const category of PLAN_CATALOG) {
    for (const group of category.groups) {
      const entity = group.entities.find((item) => item.id === entityId);
      if (entity) return entity;
    }
  }
  return undefined;
}

export const PLAN_CORE_CATEGORY_IDS = ['abonos'] as const;

export const PLAN_ADDON_CATEGORIES = [{ id: 'addons', label: 'Add-ons' }] as const;

export type PlanStepId = 'abonos' | 'addons';

export type PlanStep = {
  id: PlanStepId;
  title: string;
  categoryIds: string[];
};

export const PLAN_CORE_STEP_IDS: PlanStepId[] = ['abonos'];

export const DEFAULT_PLAN_STEP: PlanStepId = 'abonos';

export const PLAN_STEPS: PlanStep[] = [
  { id: 'abonos', title: 'Abonos', categoryIds: ['abonos'] },
  { id: 'addons', title: 'Add-ons', categoryIds: ['addons'] },
];

const CATEGORY_TO_STEP: Record<string, PlanStepId> = {
  abonos: 'abonos',
  addons: 'addons',
  acceso: 'abonos',
  bundles: 'abonos',
  extra: 'addons',
};

const HASH_TO_STEP: Record<string, PlanStepId> = {
  ...CATEGORY_TO_STEP,
  pass: 'abonos',
  tickets: 'abonos',
  'entry-pass': 'abonos',
  entradas: 'abonos',
  'day-pass': 'abonos',
  cashless: 'addons',
  insurance: 'addons',
};

export function getPlanStep(stepId: string): PlanStep | undefined {
  return PLAN_STEPS.find((step) => step.id === stepId);
}

export function getCategoriesForStep(stepId: string): PlanCategory[] {
  const step = getPlanStep(stepId);
  if (!step) return [];
  return PLAN_CATALOG.filter((category) => step.categoryIds.includes(category.id));
}

export function shouldPrefixCategory(
  categories: PlanCategory[],
  category: PlanCategory,
  activeStepTitle?: string,
): boolean {
  return categories.length > 1 && category.title !== activeStepTitle;
}

export function formatCarouselTitle(
  categoryTitle: string,
  groupTitle: string,
  prefix: boolean,
): string {
  return prefix && groupTitle !== categoryTitle ? `${categoryTitle} - ${groupTitle}` : groupTitle;
}

export function getStepIdFromHash(hash: string): PlanStepId {
  return HASH_TO_STEP[hash] ?? DEFAULT_PLAN_STEP;
}

export function isPlanStepId(id: string): id is PlanStepId {
  return PLAN_STEPS.some((step) => step.id === id);
}

export function findCategoryIdForEntity(entityId: string): string | undefined {
  for (const category of PLAN_CATALOG) {
    for (const group of category.groups) {
      if (group.entities.some((item) => item.id === entityId)) return category.id;
    }
  }
  return undefined;
}

export function getEntityUnitPrice(
  entity: PlanEntity,
  selections: Record<string, string> = {},
): number {
  const prices = entity.optionPrices;
  if (prices) {
    const preferredKeys = ['option', 'camping', 'size', 'wave', 'day', 'weekend', 'route'];
    for (const key of preferredKeys) {
      const value = selections[key];
      if (value && prices[value] != null) return prices[value];
    }

    for (const value of Object.values(selections)) {
      if (value && prices[value] != null) return prices[value];
    }
  }

  return entity.price;
}

export function formatEntityPrice(price: number): string {
  return formatPrice(price);
}
