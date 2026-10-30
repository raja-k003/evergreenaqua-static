import { Breadcrumb } from './seo.models';

/** Prepends the Home crumb. The last item is the current page (no path needed). */
export const crumbs = (...items: Breadcrumb[]): Breadcrumb[] => [{ label: 'Home', path: '/' }, ...items];
