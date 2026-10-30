import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PAGES } from '../../core/config/pages';
import { whatsappLink } from '../../core/config/site.config';
import { RO_PURIFIERS } from '../../core/data/content';
import { crumbs } from '../../core/seo/breadcrumbs';
import { roItemListSchema } from '../../core/seo/schema';
import { SeoService } from '../../core/seo/seo.service';
import { ButtonDirective } from '../../shared/ui/button';
import { CtaBand } from '../../shared/ui/cta-band';
import { InrPipe } from '../../shared/ui/inr.pipe';
import { PageHeader } from '../../shared/ui/page-header';

@Component({
  selector: 'app-ro-purifiers',
  imports: [NgOptimizedImage, RouterLink, PageHeader, ButtonDirective, InrPipe, CtaBand],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-header
      [breadcrumbs]="breadcrumbs"
      eyebrow="Drinking water"
      title="RO + UV water purifiers"
      lead="Safe, great-tasting drinking water with multi-stage RO, UV and alkaline purification. Supplied, installed and serviced by our team."
    />

    <section class="section">
      <div class="container">
        <h2>Compare purifiers</h2>
        <p class="muted">Not sure which suits your water? We check the TDS of your supply before recommending a model. For whole-house problems such as hardness or iron, see our <a routerLink="/products/water-softeners">water softeners</a> and <a routerLink="/products/iron-filters">iron filters</a>.</p>
        <ul class="grid card-list list">
          @for (p of items; track p.name; let i = $index) {
            <li>
              <article class="card card--flush">
                <div class="media media--contain media--square">
                  <img [ngSrc]="p.image.src" [alt]="p.image.alt" fill sizes="(min-width: 900px) 33vw, 100vw" [priority]="i < 3" />
                </div>
                <div class="card__body">
                  <span class="muted small">{{ p.brand }} · {{ p.mounting }}</span>
                  <h3 class="card__title">{{ p.name }}</h3>
                  <p class="price">{{ p.price | inr }}</p>
                  <ul class="chips" aria-label="Purification stages">
                    @for (s of p.stages; track s) {
                      <li class="badge">{{ s }}</li>
                    }
                  </ul>
                  <ul class="check-list small">
                    @for (h of p.highlights; track h) {
                      <li>{{ h }}</li>
                    }
                  </ul>
                  <div class="card__footer">
                    <a appButton size="sm" variant="outline" [href]="wa(p.name)" target="_blank" rel="noopener">
                      Enquire<span class="visually-hidden"> about {{ p.name }} on WhatsApp (opens in a new tab)</span>
                    </a>
                  </div>
                </div>
              </article>
            </li>
          }
        </ul>
      </div>
    </section>
    <app-cta-band title="Need help choosing a purifier?" text="We test your water's TDS for free and recommend the right model." />
  `,
  styles: `
    .list { margin-top: 2rem; }
    .media { border-radius: 0; background: var(--color-surface); border-bottom: 1px solid var(--color-border); }
    .small { font-size: var(--font-size-sm); }
    .price { font-size: var(--font-size-xl); margin: 0; }
    .check-list { margin: .5rem 0 0; gap: .4rem; }
  `,
})
export class RoPurifiers {
  protected readonly items = RO_PURIFIERS;
  protected readonly breadcrumbs = crumbs({ label: 'Products', path: '/products' }, { label: 'RO water purifiers' });
  protected readonly wa = (name: string) => whatsappLink(`Hi Evergreen Aqua, I'm interested in the ${name}.`);

  constructor() {
    const p = PAGES.ro;
    inject(SeoService).setPage({
      title: p.title,
      description: p.description,
      path: p.path,
      breadcrumbs: this.breadcrumbs,
      image: { url: RO_PURIFIERS[0].image.src, alt: RO_PURIFIERS[0].image.alt },
      jsonLd: roItemListSchema(RO_PURIFIERS),
    });
  }
}
