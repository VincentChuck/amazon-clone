import { type SyntheticEvent } from 'react';

export function parseRouterParam(k: unknown): string {
  if (typeof k === 'string') return k;
  if (Array.isArray(k) && typeof k[0] === 'string') return k[0];
  return '';
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
