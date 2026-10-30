import { ChangeDetectionStrategy, Component, DOCUMENT, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ThemeService } from './core/theme/theme.service';
import { Footer } from './shared/layout/footer';
import { Header } from './shared/layout/header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a class="skip-link" href="#main">Skip to main content</a>
    @if (loading()) {
      <div class="route-progress" role="progressbar" aria-label="Loading page" aria-busy="true"></div>
    }
    <app-header />
    <main id="main" tabindex="-1">
      <router-outlet />
    </main>
    <app-footer />
  `,
  styleUrl: './app.scss',
})
export class App {
  private readonly doc = inject(DOCUMENT);
  protected readonly loading = signal(false);

  constructor() {
    inject(ThemeService); // renders theme CSS and restores the saved preset
    if (!isPlatformBrowser(inject(PLATFORM_ID))) return;

    let timer: ReturnType<typeof setTimeout> | undefined;
    let first = true;
    inject(Router)
      .events.pipe(takeUntilDestroyed())
      .subscribe((e) => {
        if (e instanceof NavigationStart) {
          // Only show the bar for slow navigations (lazy chunk on a slow network).
          timer = setTimeout(() => this.loading.set(true), 200);
        } else if (e instanceof NavigationEnd || e instanceof NavigationCancel || e instanceof NavigationError) {
          clearTimeout(timer);
          this.loading.set(false);
          if (e instanceof NavigationEnd) {
            // Move focus to the new page for keyboard and screen-reader users
            // (skipped on the first load so we don't steal focus).
            if (!first && !e.urlAfterRedirects.includes('#')) {
              this.doc.getElementById('main')?.focus({ preventScroll: true });
            }
            first = false;
          }
        }
      });
  }
}
