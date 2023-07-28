import { type SyntheticEvent } from 'react';
import type { CategoryTreeData, CategoryObject } from '~/utils/data/dataUtils';
import categoryMapJson from '~/utils/data/categoryMap.json';
const categoryMap: CategoryTreeData = categoryMapJson;

export function parseRouterParam(k: unknown): string {
  if (typeof k === 'string') return k;
  if (Array.isArray(k) && typeof k[0] === 'string') return k[0];
  return '';
}

export function parseCidParam(cid: unknown): number {
  const categoryId = Number(parseRouterParam(cid));
  const checkCategory = getCategoryObject(categoryId);

  return checkCategory?.id ?? 0;
}

export function scrollTop(event: SyntheticEvent) {
  event.preventDefault();
  const duration = 300; // arbitrary number for smooth and noticeable animation
  const initY = window.scrollY;

  //ease in and ease out function
  function timingFunc(t: number) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  let startTime: number;

  const step = (timeStamp: number) => {
    startTime = startTime || timeStamp;
    const progress = Math.min(1, (timeStamp - startTime) / duration); // in percentage

    window.scrollTo(0, initY - timingFunc(progress) * initY);
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };

  window.requestAnimationFrame(step);
}

export function getCategoryObject(id: number): CategoryObject | null {
  const currCategory = categoryMap[id];
  if (!currCategory) {
    return null;
  }

  return currCategory;
}

export function getDescendentCategoryIds(id: number): number[] | null {
  const self = getCategoryObject(id);

  if (!self) {
    return null;
  }

  const childCategoriesId = [self.id];

  if (self && self.descendentIds && self.descendentIds.length > 0) {
    childCategoriesId.push(...self.descendentIds);
  }

  return childCategoriesId;
}
