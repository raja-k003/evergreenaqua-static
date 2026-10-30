export function totalPages(totalItems: number, pageSize: number): number {
  if (pageSize <= 0) return 1;
  return Math.max(1, Math.ceil(Math.max(0, totalItems) / pageSize));
}

/**
 * Parses a `?page=` value. Returns null for anything that is not a clean
 * positive integer within range ("1" is also null: page one lives at the
 * bare URL so there is only one canonical version of it).
 */
export function parsePage(raw: string | null | undefined, maxPage: number): number | null {
  if (raw == null || raw === '') return 1;
  if (!/^[1-9]\d*$/.test(raw)) return null;
  const n = Number(raw);
  if (n === 1 || n > maxPage) return null;
  return n;
}

export function paginate<T>(items: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

export function pagePath(basePath: string, page: number): string {
  return page <= 1 ? basePath : `${basePath}?page=${page}`;
}
