/**
 * Gärten 2027 ticket catalog.
 * Entry pass: one GA card and one VIP card, each with release waves.
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
  waveIncludes?: Record<string, string[]>;
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

export const ENTRY_TICKET_IDS = ['ticket-ga', 'ticket-vip'] as const;

const TEE_SIZES: VariantAxis = {
  id: 'size',
  label: 'Size',
  options: ['S', 'M', 'L', 'XL', 'XXL'],
};

function merchTee(id: string, name: string, price: number): PlanEntity {
  return {
    id,
    name,
    price,
    type: 'configurable_single',
    listingTag: 'LIMITED',
    description: 'Limited edition.',
    variantAxes: [TEE_SIZES],
    optionPrices: Object.fromEntries(TEE_SIZES.options.map((size) => [size, price])),
    includedItems: ['1× t-shirt'],
  };
}

function barTopUp(id: string, amount: number): PlanEntity {
  const option = `€${amount}`;
  return {
    id,
    name: `${amount}€ top-up`,
    price: amount,
    type: 'configurable_single',
    hideImage: true,
    description: 'Load credit onto your Gärten bar account. Cashless only.',
    variantAxes: [
      {
        id: 'option',
        label: 'Option',
        options: [option],
        defaultOption: option,
      },
    ],
    includedItems: [`€${amount} bar credit`],
    requires: [...ENTRY_TICKET_IDS],
  };
}

export const PLAN_CATALOG: PlanCategory[] = [
  {
    id: 'overview',
    title: 'Overview',
    contentMode: 'overview',
    groups: [],
  },
  {
    id: 'entry',
    title: 'Tickets',
    groups: [
      {
        id: 'entry-passes',
        title: '',
        entities: [
          {
            id: 'ticket-ga',
            name: 'General Access',
            price: 69,
            type: 'configurable_single',
            listingTag: 'SELLING FAST',
            description: 'General admission. Valid for 1 person.',
            variantAxes: [
              {
                id: 'wave',
                label: 'Wave',
                options: ['First Wave', 'Second Wave'],
                defaultOption: 'First Wave',
              },
            ],
            optionPrices: {
              'First Wave': 69,
              'Second Wave': 69,
            },
            cardPreviewBullets: ['Valid for 1 person', 'All waves €69'],
            includedItems: ['Festival entry', 'General access area'],
            waveIncludes: {
              'First Wave': [
                'Doors open at 20:00, last entry before close',
                'Access to all Grand Palais general areas',
                'Valid for 1 person',
                'Transferable up to 48h before the event, non-refundable',
              ],
              'Second Wave': [
                'Doors open at 20:00',
                'Access to all Grand Palais general areas',
                'Valid for 1 person',
                'Non-refundable',
              ],
            },
          },
          {
            id: 'ticket-vip',
            name: 'VIP Area',
            price: 249,
            type: 'configurable_single',
            listingTag: 'LIMITED',
            pricingMode: 'dynamic',
            description: 'Limited. Valid for 1 person.',
            variantAxes: [
              {
                id: 'wave',
                label: 'Wave',
                options: ['First Wave', 'Second Wave'],
                defaultOption: 'First Wave',
              },
            ],
            optionPrices: {
              'First Wave': 249,
              'Second Wave': 249,
            },
            cardPreviewBullets: ['Stage VIP next to DJ booth', 'Private WC · bottle service'],
            includedItems: [
              'VIP area next to the DJ booth',
              'Private WC',
              'Bottle service',
              'Fast-track entry',
            ],
            waveIncludes: {
              'First Wave': [
                'Fast-track entry from 20:00',
                'VIP area next to the DJ booth throughout the show',
                'Private WC',
                'Bottle service',
                'Valid for 1 person',
              ],
              'Second Wave': [
                'Fast-track entry from 20:00',
                'VIP area next to the DJ booth throughout the show',
                'Private WC and bottle service',
                'Valid for 1 person',
                'Non-refundable',
              ],
            },
          },
        ],
      },
    ],
  },
  {
    id: 'merch',
    title: 'Merch',
    groups: [
      {
        id: 'merch-tees',
        title: '',
        entities: [
          merchTee('merch-tee-black-coffee', 'T-shirt — Black Coffee @Grand Palais', 40),
          merchTee('merch-tee-gaerten-2026', 'T-shirt Gärten 2026 — Black', 35),
          merchTee('merch-tee-gaerten-project', 'T-shirt Gärten Project — Black', 35),
        ],
      },
    ],
  },
  {
    id: 'addons',
    title: 'Bar',
    groups: [
      {
        id: 'addons-bar',
        title: '',
        entities: [
          barTopUp('bar-topup-20', 20),
          barTopUp('bar-topup-50', 50),
          barTopUp('bar-topup-100', 100),
          barTopUp('bar-topup-150', 150),
        ],
      },
    ],
  },
  {
    id: 'shuttle',
    title: 'Shuttle',
    groups: [
      {
        id: 'shuttle-paris',
        title: '',
        entities: [
          {
            id: 'shuttle-paris-return',
            name: 'Return shuttle to Paris',
            price: 15,
            type: 'configurable_single',
            cardPreviewBullets: [
              'Pickup at Grand Palais after 03:00',
              'Drop-off Paris-Bercy · about 25 minutes',
            ],
            includedItems: [
              'Reserved seat on the return coach after the show',
              'Pickup outside the Grand Palais after 03:00',
              'Drop-off at Paris-Bercy · about 25 minutes',
              'Valid with a GA or VIP ticket',
            ],
            variantAxes: [
              {
                id: 'option',
                label: 'Option',
                options: ['Paris-Bercy'],
                defaultOption: 'Paris-Bercy',
              },
            ],
            requires: [...ENTRY_TICKET_IDS],
          },
        ],
      },
    ],
  },
];

const BASE = import.meta.env.BASE_URL;

export const DEFAULT_TICKET_IMAGE = `${BASE}entity-ticket.jpg`;

export const ENTITY_IMAGES: Record<string, string> = {
  'ticket-ga': `${BASE}ticket-ga-crowd.jpg`,
  'ticket-vip': `${BASE}ticket-vip-lounge.jpg`,
  'merch-tee-black-coffee': `${BASE}merch-black-coffee-front.jpg`,
  'merch-tee-gaerten-2026': `${BASE}merch-gaerten-2026.jpg`,
  'merch-tee-gaerten-project': `${BASE}merch-gaerten-project.jpg`,
  'shuttle-paris-return': `${BASE}entity-bus.jpg`,
};

export const ENTITY_GALLERIES: Record<string, string[]> = {
  'merch-tee-black-coffee': [
    `${BASE}merch-black-coffee-front.jpg`,
    `${BASE}merch-black-coffee-back.jpg`,
  ],
  'merch-tee-gaerten-2026': [`${BASE}merch-gaerten-2026.jpg`, `${BASE}merch-gaerten-2026-back.jpg`],
  'merch-tee-gaerten-project': [
    `${BASE}merch-gaerten-project.jpg`,
    `${BASE}merch-gaerten-project-back.jpg`,
  ],
};

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

export function findEntityPlacement(entityId: string): {
  categoryTitle: string;
  groupTitle: string;
} | undefined {
  for (const category of PLAN_CATALOG) {
    for (const group of category.groups) {
      const entity = group.entities.find((item) => item.id === entityId);
      if (entity) {
        return { categoryTitle: category.title, groupTitle: entity.name };
      }
    }
  }
  return undefined;
}

export const PLAN_CORE_CATEGORY_IDS = ['entry'] as const;

export const PLAN_ADDON_CATEGORIES = [
  { id: 'merch', label: 'Merch' },
  { id: 'addons', label: 'Bar' },
  { id: 'shuttle', label: 'Shuttle' },
] as const;

export type TicketStepId = 'entry' | 'merch' | 'addons' | 'shuttle';
export type PlanStepId = TicketStepId;

export type PlanStep = {
  id: TicketStepId;
  title: string;
  categoryIds: string[];
};

export type PlanPageTab = {
  id: PlanStepId;
  title: string;
};

export const PLAN_CORE_STEP_IDS: TicketStepId[] = ['entry'];

export const DEFAULT_PLAN_STEP: TicketStepId = 'entry';

export const PLAN_STEPS: PlanStep[] = [
  { id: 'entry', title: 'Tickets', categoryIds: ['entry'] },
  { id: 'merch', title: 'Merch', categoryIds: ['merch'] },
  { id: 'addons', title: 'Bar', categoryIds: ['addons'] },
  { id: 'shuttle', title: 'Shuttle', categoryIds: ['shuttle'] },
];

export const PLAN_PAGE_TABS: PlanPageTab[] = PLAN_STEPS.map((step) => ({
  id: step.id,
  title: step.title,
}));

const CATEGORY_TO_STEP: Record<string, PlanStepId> = {
  entry: 'entry',
  vip: 'entry',
  merch: 'merch',
  addons: 'addons',
  shuttle: 'shuttle',
  tickets: 'entry',
  abonos: 'entry',
  extra: 'addons',
};

const HASH_TO_STEP: Record<string, PlanStepId> = {
  ...CATEGORY_TO_STEP,
  pass: 'entry',
  'entry-pass': 'entry',
  ga: 'entry',
  'general-access': 'entry',
  'vip-area': 'entry',
  tshirt: 'merch',
  tees: 'merch',
  bar: 'addons',
  cashless: 'addons',
  'top-up': 'addons',
  bus: 'shuttle',
  navette: 'shuttle',
  paris: 'shuttle',
};

export function isTicketStepId(id: string): id is TicketStepId {
  return PLAN_STEPS.some((step) => step.id === id);
}

export function getPlanStep(stepId: string): PlanStep | undefined {
  return PLAN_STEPS.find((step) => step.id === stepId);
}

export function getPlanStepIndex(stepId: string): number {
  const index = PLAN_STEPS.findIndex((step) => step.id === stepId);
  return index >= 0 ? index : 0;
}

export function getCategoriesForStep(stepId: string): PlanCategory[] {
  const step = getPlanStep(stepId);
  if (!step) return [];
  return PLAN_CATALOG.filter((category) => step.categoryIds.includes(category.id));
}

export function getCatalogFromPrice(): number {
  let min = Number.POSITIVE_INFINITY;
  for (const category of PLAN_CATALOG) {
    for (const group of category.groups) {
      for (const entity of group.entities) {
        if (entity.price < min) min = entity.price;
      }
    }
  }
  return Number.isFinite(min) ? min : 15;
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
  return isTicketStepId(id);
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
