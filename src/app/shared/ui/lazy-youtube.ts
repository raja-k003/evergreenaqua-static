import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Icon } from './icon';

/**
 * Click-to-load YouTube player. Until the visitor presses play nothing is requested from YouTube
 * (no iframe, no thumbnail), which keeps the page fast and avoids third-party tracking by default.
 * Uses the privacy-enhanced youtube-nocookie.com domain.
 */
@Component({
  selector: 'app-lazy-youtube',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="yt">
      @if (active()) {
        <iframe
          [src]="embed()"
          [title]="label()"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen
        ></iframe>
      } @else {
        <button type="button" class="yt__facade" (click)="active.set(true)" [attr.aria-label]="'Play video: ' + label()">
          <span class="yt__btn"><app-icon name="chevron-right" [size]="34" /></span>
          <span class="yt__label">{{ label() }}</span>
          <span class="yt__note">Plays on YouTube</span>
        </button>
      }
    </div>
  `,
  styles: `
    :host { display: block; }
    .yt { position: relative; aspect-ratio: 16 / 9; overflow: hidden; border-radius: inherit; background: #07182c; }
    iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
    .yt__facade { position: absolute; inset: 0; width: 100%; display: grid; place-content: center; justify-items: center; gap: .5rem; padding: 1rem; border: 0; cursor: pointer; color: #fff; font: inherit;
      background: radial-gradient(circle at 25% 20%, rgb(255 255 255 / .2), transparent 50%), linear-gradient(160deg, color-mix(in srgb, var(--color-accent, var(--color-primary)) 55%, #07182c), color-mix(in srgb, var(--color-primary) 60%, #020617)); }
    .yt__btn { display: grid; place-items: center; width: 5rem; height: 5rem; border-radius: 50%; background: rgb(255 255 255 / .2); border: 1px solid rgb(255 255 255 / .55); backdrop-filter: blur(6px); transition: transform .3s cubic-bezier(.3, 1.6, .5, 1), background .3s ease; }
    .yt__facade:hover .yt__btn, .yt__facade:focus-visible .yt__btn { transform: scale(1.12); background: rgb(255 255 255 / .32); }
    .yt__label { font-weight: 700; font-size: var(--font-size-lg); }
    .yt__note { font-size: var(--font-size-xs); opacity: .8; }
    @media (prefers-reduced-motion: reduce) { .yt__btn { transition: none; } }
  `,
})
export class LazyYoutube {
  readonly videoId = input.required<string>();
  readonly label = input.required<string>();

  protected readonly active = signal(false);
  private readonly sanitizer = inject(DomSanitizer);
  /** The ID comes from our own data file and is URL-encoded, so trusting the resulting URL is safe. */
  protected readonly embed = computed<SafeResourceUrl>(() =>
    this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube-nocookie.com/embed/${encodeURIComponent(this.videoId())}?autoplay=1&rel=0&playsinline=1`,
    ),
  );
}
