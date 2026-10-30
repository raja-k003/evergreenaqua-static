import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DatePipe, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BlogPost } from '../../core/data/blog';
import { Icon } from './icon';

@Component({
  selector: 'app-blog-card',
  imports: [NgOptimizedImage, RouterLink, DatePipe, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="card card--flush card--interactive">
      <div class="media media--wide">
        <img [ngSrc]="post().image.src" [alt]="post().image.alt" fill sizes="(min-width: 900px) 33vw, 100vw" />
        <span class="chip"><app-icon name="clock" [size]="13" /> {{ post().readingMinutes }} min read</span>
      </div>
      <div class="card__body">
        <p class="meta">
          <span class="by">{{ post().author }}</span>
          <time [attr.datetime]="post().published">{{ post().published | date: 'd MMM y' : 'UTC' }}</time>
        </p>
        <h3 class="card__title"><a class="stretched-link" [routerLink]="['/blog', post().slug]">{{ post().title }}</a></h3>
        <p class="card__text">{{ post().excerpt }}</p>
        <span class="more" aria-hidden="true">Read article <app-icon name="arrow-right" [size]="16" /></span>
      </div>
    </article>
  `,
  styles: `
    :host { display: block; height: 100%; }
    .card { border-radius: 1.25rem; box-shadow: 0 10px 28px color-mix(in srgb, var(--color-primary) 10%, transparent); transition: transform .35s cubic-bezier(.2, .7, .2, 1), box-shadow .35s ease, border-color .35s ease; }
    .card:hover, .card:focus-within { transform: translateY(-6px); box-shadow: 0 24px 46px color-mix(in srgb, var(--color-primary) 22%, transparent); }
    .media { position: relative; border-radius: 0; overflow: hidden; background: var(--color-surface-alt); }
    .media img { transition: transform .6s cubic-bezier(.2, .7, .2, 1); }
    .media::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, transparent 55%, color-mix(in srgb, var(--color-primary) 35%, transparent)); opacity: 0; transition: opacity .35s ease; }
    .card:hover .media img { transform: scale(1.07); }
    .card:hover .media::after { opacity: 1; }
    .chip { position: absolute; z-index: 2; left: .75rem; top: .75rem; display: inline-flex; align-items: center; gap: .35rem; padding: .25rem .7rem; border-radius: var(--radius-pill); font-size: var(--font-size-xs); font-weight: 700; color: var(--color-text); background: rgb(255 255 255 / .85); backdrop-filter: blur(6px); }
    .meta { display: flex; flex-wrap: wrap; align-items: center; gap: .35rem .75rem; margin: 0; font-size: var(--font-size-xs); color: var(--color-text-muted); }
    .by { font-weight: 700; color: var(--color-primary); }
    .by::after { content: ''; display: inline-block; width: .25rem; height: .25rem; margin-left: .75rem; vertical-align: middle; border-radius: 50%; background: currentColor; opacity: .5; }
    .card__title { font-size: var(--font-size-lg); line-height: 1.3; }
    .card__title a { color: var(--color-text); text-decoration: none; }
    .card__title a:hover { color: var(--color-primary); }
    .more { margin-top: auto; padding-top: .5rem; display: inline-flex; align-items: center; gap: .35rem; font-weight: 700; font-size: var(--font-size-sm); color: var(--color-primary); transition: gap .25s ease; }
    .card:hover .more { gap: .65rem; }
    @media (prefers-reduced-motion: reduce) { .card, .media img, .media::after, .more { transition: none; } .card:hover { transform: none; } .card:hover .media img { transform: none; } }
  `,
})
export class BlogCard {
  readonly post = input.required<BlogPost>();
}
