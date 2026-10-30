import { ChangeDetectionStrategy, Component, ElementRef, PLATFORM_ID, afterNextRender, inject, input, signal, viewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Icon } from './icon';

/** The video currently playing, so starting another one pauses it. */
let playing: HTMLVideoElement | null = null;

/**
 * Lazy-loaded video.
 * - Nothing is requested on the server or until the player is within `margin` of the viewport.
 * - Once near, only the metadata (first frame) is fetched; the rest streams when the visitor presses play.
 * - Playing one video pauses the others, and a video that scrolls out of view is paused.
 */
@Component({
  selector: 'app-lazy-video',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="lv" #box>
      @if (near()) {
        <video
          #video
          [src]="src()"
          controls
          playsinline
          preload="metadata"
          controlslist="nodownload"
          [attr.aria-label]="label()"
          (loadeddata)="ready.set(true)"
          (play)="onPlay()"
        ></video>
      }
      @if (!ready()) {
        <div class="lv__ph" aria-hidden="true">
          <span class="lv__btn"><app-icon name="chevron-right" [size]="30" /></span>
        </div>
      }
      @if (duration()) {
        <span class="lv__time" aria-hidden="true">{{ duration() }}</span>
      }
    </div>
  `,
  styles: `
    :host { display: block; }
    .lv { position: relative; aspect-ratio: var(--lv-ratio, 9 / 16); overflow: hidden; border-radius: inherit; background: #07182c; }
    video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; background: #07182c; }
    .lv__ph { position: absolute; inset: 0; display: grid; place-items: center;
      background: radial-gradient(circle at 30% 20%, rgb(255 255 255 / .18), transparent 50%), linear-gradient(160deg, color-mix(in srgb, var(--color-accent, var(--color-primary)) 55%, #07182c), color-mix(in srgb, var(--color-primary) 60%, #020617));
      animation: lv-shimmer 2.2s ease-in-out infinite alternate; }
    .lv__btn { display: grid; place-items: center; width: 4rem; height: 4rem; border-radius: 50%; color: #fff; background: rgb(255 255 255 / .2); border: 1px solid rgb(255 255 255 / .5); backdrop-filter: blur(6px); }
    .lv__time { position: absolute; z-index: 1; right: .6rem; top: .6rem; padding: .15rem .55rem; border-radius: 999px; font-size: var(--font-size-xs); font-weight: 700; color: #fff; background: rgb(0 0 0 / .45); pointer-events: none; }
    @keyframes lv-shimmer { to { filter: brightness(1.2); } }
    @media (prefers-reduced-motion: reduce) { .lv__ph { animation: none; } }
  `,
})
export class LazyVideo {
  readonly src = input.required<string>();
  readonly label = input.required<string>();
  readonly duration = input('');
  /** How far outside the viewport (px) the player starts loading its first frame. */
  readonly margin = input(300);

  protected readonly near = signal(false);
  protected readonly ready = signal(false);

  private readonly box = viewChild.required<ElementRef<HTMLElement>>('box');
  private readonly video = viewChild<ElementRef<HTMLVideoElement>>('video');
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  constructor() {
    afterNextRender(() => {
      if (!this.isBrowser) return;
      const el = this.box().nativeElement;
      if (!('IntersectionObserver' in window)) {
        this.near.set(true);
        return;
      }
      // 1) start loading shortly before the player scrolls into view
      const load = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            this.near.set(true);
            load.disconnect();
          }
        },
        { rootMargin: `${this.margin()}px 0px` },
      );
      load.observe(el);
      // 2) pause when it leaves the screen
      new IntersectionObserver((entries) => {
        const v = this.video()?.nativeElement;
        if (v && !v.paused && !entries.some((e) => e.isIntersecting)) v.pause();
      }, { threshold: 0.2 }).observe(el);
    });
  }

  protected onPlay(): void {
    const v = this.video()?.nativeElement ?? null;
    if (playing && playing !== v) playing.pause();
    playing = v;
  }
}
