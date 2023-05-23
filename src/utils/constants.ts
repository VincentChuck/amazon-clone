export const RESULTSPERPAGE = 16;

export const SORTOPTIONS = ['', 'price-asc', 'price-desc'] as const;

export type SortOption = (typeof SORTOPTIONS)[number];
