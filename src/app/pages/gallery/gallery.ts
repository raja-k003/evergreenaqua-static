import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { PAGES } from '../../core/config/pages';
import { GALLERY, GALLERY_VIDEOS, GALLERY_YOUTUBE } from '../../core/data/content';
import { crumbs } from '../../core/seo/breadcrumbs';
import { SeoService } from '../../core/seo/seo.service';
import { CtaBand } from '../../shared/ui/cta-band';
import { LazyVideo } from '../../shared/ui/lazy-video';
import { LazyYoutube } from '../../shared/ui/lazy-youtube';
import { PageHeader } from '../../shared/ui/page-header';
import { StateView } from '../../shared/ui/state';

@Component({
  selector: 'app-gallery',
  imports: [NgOptimizedImage, LazyVideo, LazyYoutube, PageHeader, CtaBand, StateView],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-header
      [breadcrumbs]="breadcrumbs"
      eyebrow="Gallery"
      title="Our completed installations"
      lead="A selection of softener and filter systems we have installed at homes and apartments across Chennai."
    />
    <section class="section videos" aria-labelledby="videos-title">
      <div class="container">
        <header class="videos__head">
          <p class="eyebrow">Watch our work</p>
          <h2 id="videos-title">Installations on video</h2>
        </header>
        <div class="videos__feature">
          <app-lazy-youtube [videoId]="youtube.id" [label]="youtube.title" />
        </div>
        <ul class="videos__grid card-list">
          @for (v of videos; track v.src; let i = $index) {
            <li class="videos__item" [style.--i]="i">
              <app-lazy-video [src]="v.src" [label]="v.title" [duration]="v.duration" />
              <p>{{ v.title }}</p>
            </li>
          }
        </ul>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <h2 class="visually-hidden">Installation photos</h2>
        @if (items.length) {
          <ul class="gallery card-list">
            @for (item of items; track item.image.src; let i = $index) {
              <li>
                <figure>
                  <div class="media media--square">
                    <img [ngSrc]="item.image.src" [alt]="item.image.alt" fill sizes="(min-width: 1100px) 25vw, (min-width: 640px) 33vw, 50vw" [loading]="i < 4 ? 'eager' : 'lazy'" />
                  </div>
                  <figcaption>{{ item.caption }}</figcaption>
                </figure>
              </li>
            }
          </ul>
        } @else {
          <app-state title="No photos yet" message="We are adding photos of recent installations. Please check back soon." />
        }
      </div>
    </section>
    <app-cta-band />
  `,
  styles: `
    .gallery { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fill, minmax(min(45%, 15rem), 1fr)); }
    figure { margin: 0; }
    .videos { background: var(--color-surface-alt); }
    .videos__head { text-align: center; margin-bottom: clamp(1.5rem, 1rem + 2vw, 2.5rem); }
    .videos__head h2 { margin: 0 auto; }
    .videos__grid { display: grid; gap: clamp(1rem, .5rem + 2vw, 2rem); grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr)); max-width: 62rem; margin-inline: auto; }
    .videos__feature { max-width: 48rem; margin: 0 auto clamp(1.5rem, 1rem + 2vw, 2.5rem); border-radius: 1.5rem; overflow: hidden; box-shadow: 0 22px 50px color-mix(in srgb, var(--color-primary) 26%, transparent); }
    .videos__item { animation: vid-in .6s cubic-bezier(.2, .7, .2, 1) both; animation-delay: calc(var(--i) * .1s); }
    .videos__item app-lazy-video { border-radius: 1.25rem; overflow: hidden; box-shadow: 0 16px 38px color-mix(in srgb, var(--color-primary) 22%, transparent); transition: transform .35s cubic-bezier(.2, .7, .2, 1), box-shadow .35s ease; }
    .videos__item:hover app-lazy-video { transform: translateY(-6px); box-shadow: 0 26px 52px color-mix(in srgb, var(--color-primary) 30%, transparent); }
    .videos__item p { margin: .75rem 0 0; text-align: center; font-weight: 600; font-size: var(--font-size-sm); }
    @keyframes vid-in { from { opacity: 0; transform: translateY(1rem); } }
    @media (prefers-reduced-motion: reduce) { .videos__item { animation: none; } .videos__item app-lazy-video { transition: none; } }
    figcaption { margin-top: .5rem; font-size: var(--font-size-sm); color: var(--color-text-muted); }
  `,
})
export class Gallery {
  protected readonly items = GALLERY;
  protected readonly videos = GALLERY_VIDEOS;
  protected readonly youtube = GALLERY_YOUTUBE;
  protected readonly breadcrumbs = crumbs({ label: 'Gallery' });

  constructor() {
    const p = PAGES.gallery;
    inject(SeoService).setPage({
      title: p.title,
      description: p.description,
      path: p.path,
      breadcrumbs: this.breadcrumbs,
      image: { url: GALLERY[0].image.src, alt: GALLERY[0].image.alt },
    });
  }
}
