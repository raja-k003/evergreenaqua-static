import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PAGES } from '../../core/config/pages';
import { image } from '../../core/data/images';
import { crumbs } from '../../core/seo/breadcrumbs';
import { SeoService } from '../../core/seo/seo.service';
import { CtaBand } from '../../shared/ui/cta-band';
import { Icon } from '../../shared/ui/icon';
import { PageHeader } from '../../shared/ui/page-header';
import { SectionHeading } from '../../shared/ui/section-heading';

@Component({
  selector: 'app-how-it-works',
  imports: [NgOptimizedImage, RouterLink, PageHeader, SectionHeading, Icon, CtaBand],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-header
      [breadcrumbs]="breadcrumbs"
      eyebrow="How it works"
      title="How a water softener works"
      lead="Hard water is common in borewell and groundwater supplies. Here is what causes it, what it does to your home, and how a softener fixes it."
    />

    <section class="section">
      <div class="container split">
        <div>
          <h2>Understanding hard water</h2>
          <p>Water becomes “hard” when it picks up dissolved calcium and magnesium as it passes through rock and soil. Hardness is measured in parts per million (ppm); water above roughly 200 ppm usually causes visible scale and soap problems.</p>
          <p>The minerals are not usually harmful to drink, but when hard water is heated or evaporates they leave scale behind — on taps, tiles, geysers, pipes and the inside of appliances.</p>
          <ul class="facts card-list">
            @for (f of facts; track f.label) {
              <li><strong>{{ f.value }}</strong><span>{{ f.label }}</span></li>
            }
          </ul>
        </div>
        <div class="frame">
          <div class="media media--contain">
            <img [ngSrc]="img.src" [alt]="img.alt" fill sizes="(min-width: 900px) 45vw, 100vw" />
          </div>
        </div>
      </div>
    </section>

    <section class="section section--alt">
      <div class="container">
        <app-section-heading title="The ion-exchange process, step by step" />
        <ol class="steps">
          @for (s of process; track s.title; let i = $index) {
            <li [style.--i]="i">
              <span class="step__node" aria-hidden="true"><app-icon [name]="s.icon" [size]="22" /></span>
              <span class="step__num" aria-hidden="true">Step {{ i + 1 }}</span>
              <h3>{{ s.title }}</h3>
              <p>{{ s.text }}</p>
            </li>
          }
        </ol>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <app-section-heading title="Problems caused by hard water" />
        <ul class="grid card-list">
          @for (p of problems; track p.title; let i = $index) {
            <li class="card prob" [style.--i]="i">
              <span class="icon-tile"><app-icon [name]="p.icon" [size]="24" /></span>
              <h3 class="card__title">{{ p.title }}</h3>
              <p class="card__text">{{ p.text }}</p>
            </li>
          }
        </ul>
        <p class="more"><a routerLink="/blog/signs-of-hard-water">Read: common signs of hard water</a> · <a routerLink="/products/water-softeners">See our water softeners</a></p>
      </div>
    </section>

    <app-cta-band />
  `,
  styles: `
    .more { margin-top: 2rem; font-weight: 600; }

    .facts { display: grid; grid-template-columns: repeat(3, 1fr); gap: .75rem; margin-top: 1.5rem;
      li { padding: .85rem .75rem; text-align: center; border-radius: 1rem; background: var(--color-primary-soft); border: 1px solid color-mix(in srgb, var(--color-primary) 18%, transparent); transition: transform .3s ease, box-shadow .3s ease;
        &:hover { transform: translateY(-4px); box-shadow: 0 12px 24px color-mix(in srgb, var(--color-primary) 18%, transparent); } }
      strong { display: block; font-size: var(--font-size-lg); color: var(--color-primary); }
      span { display: block; margin-top: .15rem; font-size: var(--font-size-xs); line-height: 1.35; color: var(--color-text-muted); } }
    @media (max-width: 520px) { .facts { grid-template-columns: 1fr; } }

    .frame { position: relative; isolation: isolate; padding: .75rem; border-radius: 1.5rem; background: var(--color-surface); box-shadow: 0 20px 44px color-mix(in srgb, var(--color-primary) 16%, transparent);
      &::before { content: ''; position: absolute; z-index: -1; inset: 1.1rem -1rem -1rem 1.1rem; border-radius: 1.5rem; background: linear-gradient(135deg, var(--color-accent, var(--color-primary)), var(--color-primary)); opacity: .22; }
      .media { border-radius: 1rem; } }

    /* process timeline */
    .steps { position: relative; display: grid; gap: 1.25rem; counter-reset: none; }
    @media (min-width: 900px) {
      .steps { grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
      .steps::before { content: ''; position: absolute; top: 2.35rem; left: 12%; right: 12%; height: 3px; border-radius: 3px; background: repeating-linear-gradient(90deg, var(--color-primary) 0 10px, transparent 10px 18px); opacity: .35; }
    }
    .steps li { position: relative; display: flex; flex-direction: column; align-items: center; padding: 1.4rem 1.25rem 1.6rem; text-align: center; border-radius: 1.25rem; background: var(--color-surface); border: 1px solid var(--color-border);
      animation: hiw-in .6s cubic-bezier(.2, .7, .2, 1) both; animation-delay: calc(var(--i) * .1s); transition: transform .35s cubic-bezier(.2, .7, .2, 1), box-shadow .35s ease;
      &::before, &::after { content: none; }
      &:hover { transform: translateY(-8px); box-shadow: 0 22px 44px color-mix(in srgb, var(--color-primary) 20%, transparent); }
      h3 { margin: .35rem 0 .5rem; font-size: var(--font-size-lg); }
      p { margin: 0; font-size: var(--font-size-sm); color: var(--color-text-muted); } }
    .step__node { position: relative; z-index: 1; display: grid; place-items: center; width: 3.1rem; height: 3.1rem; border-radius: 50%; color: var(--color-on-primary);
      background: var(--color-secondary); color: var(--color-on-secondary); box-shadow: 0 0 0 6px var(--color-surface); transition: transform .4s cubic-bezier(.3, 1.6, .5, 1); }
    .steps li:hover .step__node { transform: scale(1.12) rotate(-8deg); }
    .step__num { margin-top: .85rem; font-size: var(--font-size-xs); font-weight: 800; letter-spacing: .1em; text-transform: uppercase; color: var(--color-primary); }

    /* problem cards */
    .prob { position: relative; overflow: hidden; animation: hiw-in .6s cubic-bezier(.2, .7, .2, 1) both; animation-delay: calc(var(--i) * .08s); transition: transform .35s cubic-bezier(.2, .7, .2, 1), box-shadow .35s ease;
      &::after { content: ''; position: absolute; left: 0; right: 0; bottom: 0; height: 4px; background: linear-gradient(90deg, var(--color-accent, var(--color-primary)), var(--color-primary)); transform: scaleX(0); transform-origin: left; transition: transform .4s ease; }
      &:hover { transform: translateY(-6px); box-shadow: 0 20px 40px color-mix(in srgb, var(--color-primary) 18%, transparent); }
      &:hover::after { transform: scaleX(1); }
      .icon-tile { transition: transform .4s cubic-bezier(.3, 1.6, .5, 1), background .3s ease, color .3s ease; }
      &:hover .icon-tile { transform: scale(1.12) rotate(-6deg); background: var(--color-primary); color: var(--color-on-primary); } }

    @keyframes hiw-in { from { opacity: 0; transform: translateY(1.2rem); } }
    @media (prefers-reduced-motion: reduce) { .steps li, .prob { animation: none; } .steps li, .prob, .facts li, .step__node, .prob .icon-tile { transition: none; } }
  `,
})
export class HowItWorks {
  protected readonly breadcrumbs = crumbs({ label: 'How it works' });
  protected readonly img = image('water-softener-home-plumbing-diagram', 'Diagram of a water softener connected to a home’s sump, overhead tank and taps');
  protected readonly facts = [
    { value: 'Ca + Mg', label: 'Dissolved calcium and magnesium cause hardness' },
    { value: '~200 ppm', label: 'Above this, scale is usually visible' },
    { value: 'Scale', label: 'Left on taps, geysers, pipes and appliances' },
  ];
  protected readonly process = [
    { icon: 'drop', title: 'Hard water enters', text: 'Water from your sump or borewell flows into the resin tank.' },
    { icon: 'magnet', title: 'Resin captures minerals', text: 'Resin beads hold calcium and magnesium ions and release sodium ions in exchange.' },
    { icon: 'sparkle', title: 'Soft water flows out', text: 'Softened water goes to every tap, shower and appliance in the house.' },
    { icon: 'timer', title: 'Brine recharge', text: 'When the resin is saturated, a salt brine wash flushes the minerals away and the cycle starts again.' },
  ];
  protected readonly problems = [
    { icon: 'bubbles', title: 'Poor lather', text: 'Soap and shampoo do not foam properly, so you use more and still feel less clean.' },
    { icon: 'sparkle', title: 'Dry skin and dull hair', text: 'Soap residue that will not rinse off can leave skin dry and itchy and hair rough.' },
    { icon: 'flame', title: 'Scaled geysers', text: 'Scale insulates heating elements, so geysers take longer and use more power.' },
    { icon: 'utensils', title: 'Spotted vessels and tiles', text: 'White marks on steel vessels, glasses, taps and bathroom tiles.' },
  ];

  constructor() {
    const p = PAGES.howItWorks;
    inject(SeoService).setPage({ title: p.title, description: p.description, path: p.path, breadcrumbs: this.breadcrumbs });
  }
}
