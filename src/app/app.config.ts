import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { RouteReuseStrategy, provideRouter, withInMemoryScrolling, withRouterConfig } from '@angular/router';
import { provideClientHydration, withEventReplay, withIncrementalHydration } from '@angular/platform-browser';
import { routes } from './app.routes';
import { ParamAwareReuseStrategy } from './core/routing/reuse-strategy';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' }),
      withRouterConfig({ onSameUrlNavigation: 'ignore' }),
    ),
    { provide: RouteReuseStrategy, useClass: ParamAwareReuseStrategy },
    provideHttpClient(withFetch()),
    // Full hydration reuses server DOM (no flicker / CLS); event replay keeps
    // clicks made before hydration; incremental hydration defers JS for
    // below-the-fold @defer blocks while their HTML is still server-rendered.
    provideClientHydration(withEventReplay(), withIncrementalHydration()),
  ],
};
