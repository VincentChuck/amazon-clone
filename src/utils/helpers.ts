export function parseRouterParam(k: unknown): string {
  if (typeof k === 'string') return k;
  if (Array.isArray(k) && typeof k[0] === 'string') return k[0];
  return '';
}
