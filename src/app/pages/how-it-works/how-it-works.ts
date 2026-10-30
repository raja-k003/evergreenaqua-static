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
        </div>
        <div class="media media--contain">
          <img [ngSrc]="img.src" [alt]="img.alt" fill sizes="(min-width: 900px) 45vw, 100vw" />
        </div>
      </div>
    </section>

    <section class="section section--alt">
      <div class="container">
        <app-section-heading title="The ion-exchange process, step by step" />
        <ol class="steps">
          @for (s of process; track s.title) {
            <li><h3>{{ s.title }}</h3><p>{{ s.text }}</p></li>
          }
        </ol>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <app-section-heading title="Problems caused by hard water" />
        <ul class="grid card-list">
          @for (p of problems; track p.title) {
            <li class="card">
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
  styles: `.more { margin-top: 2rem; font-weight: 600; }`,
})
export class HowItWorks {
  protected readonly breadcrumbs = crumbs({ label: 'How it works' });
  protected readonly img = image('water-softener-home-plumbing-diagram', 'Diagram of a water softener connected to a home’s sump, overhead tank and taps');
  protected readonly process = [
    { title: 'Hard water enters', text: 'Water from your sump or borewell flows into the resin tank.' },
    { title: 'Resin captures minerals', text: 'Resin beads hold calcium and magnesium ions and release sodium ions in exchange.' },
    { title: 'Soft water flows out', text: 'Softened water goes to every tap, shower and appliance in the house.' },
    { title: 'Brine recharge', text: 'When the resin is saturated, a salt brine wash flushes the minerals away and the cycle starts again.' },
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
