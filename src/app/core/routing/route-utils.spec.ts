import { RESPONSE_INIT, runInInjectionContext, Injector } from '@angular/core';
import { Route, UrlSegment } from '@angular/router';
import { markNotFound, slugIn } from './route-utils';

const seg = (...p: string[]) => p.map((x) => new UrlSegment(x, {}));

describe('route utils', () => {
  it('slugIn matches only known slugs', () => {
    const guard = slugIn(new Set(['sand-filters']));
    expect(guard({} as Route, seg('products', 'sand-filters'), {} as never)).toBe(true);
    expect(guard({} as Route, seg('products', 'nope'), {} as never)).toBe(false);
  });

  it('markNotFound sets status 404 on the server response', () => {
    const response: { status?: number } = {};
    const injector = Injector.create({ providers: [{ provide: RESPONSE_INIT, useValue: response }] });
    runInInjectionContext(injector, () => markNotFound());
    expect(response.status).toBe(404);
  });

  it('markNotFound is a no-op in the browser', () => {
    expect(() => runInInjectionContext(Injector.create({ providers: [] }), () => markNotFound())).not.toThrow();
  });
});
