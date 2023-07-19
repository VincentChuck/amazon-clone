export const TRADEMARK =
  '© 1996-2023, (Not) Amazon.com, Inc. or its affiliates';

export const RESULTSPERPAGE = 16;

export const SORTOPTIONS = ['default', 'price-asc', 'price-desc'] as const;

export type SortOption = (typeof SORTOPTIONS)[number];

export const SORTOPTIONSDISPLAY = {
  default: 'Default',
  'price-asc': 'Price: Low to High',
  'price-desc': 'Price: High to Low',
};

export const USDollar = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});
