import { inject, RESPONSE_INIT } from '@angular/core';
import { CanMatchFn, UrlSegment } from '@angular/router';

/**
 * Route guard factory: the route only matches when the `:slug` segment exists
 * in the given set. Unknown slugs fall through to the `**` route, which the
 * server renders with HTTP 404 — so there is no soft-404 for bad URLs.
 */
export function slugIn(slugs: ReadonlySet<string>, segmentIndex = 1): CanMatchFn {
  return (_route, segments: UrlSegment[]) => slugs.has(segments[segmentIndex]?.path ?? '');
}

/**
 * Marks the current server response as 404. No-op in the browser.
 * Must be called in an injection context (constructor / field initialiser).
 */
export function markNotFound(): void {
  const response = inject(RESPONSE_INIT, { optional: true });
  if (response) response.status = 404;
}
