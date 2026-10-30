import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PAGES } from '../../core/config/pages';
import { TESTIMONIALS } from '../../core/data/content';
import { crumbs } from '../../core/seo/breadcrumbs';
import { SeoService } from '../../core/seo/seo.service';
import { CtaBand } from '../../shared/ui/cta-band';
import { PageHeader } from '../../shared/ui/page-header';
import { StateView } from '../../shared/ui/state';
import { TestimonialCard } from '../../shared/ui/testimonial-card';

@Component({
  selector: 'app-testimonials',
  imports: [PageHeader, TestimonialCard, CtaBand, StateView],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-header
      [breadcrumbs]="breadcrumbs"
      eyebrow="Testimonials"
      title="What our customers say"
      lead="Real feedback from homeowners who switched to soft, filtered water."
    />
    <section class="section">
      <div class="container">
        <h2 class="visually-hidden">Customer testimonials</h2>
        @if (items.length) {
          <ul class="grid card-list">
            @for (t of items; track t.name) {
              <li><app-testimonial-card [item]="t" /></li>
            }
          </ul>
        } @else {
          <app-state title="No testimonials yet" message="Check back soon to hear from our customers." />
        }
      </div>
    </section>
    <app-cta-band title="Join our happy customers" />
  `,
})
export class Testimonials {
  protected readonly items = TESTIMONIALS;
  protected readonly breadcrumbs = crumbs({ label: 'Testimonials' });

  constructor() {
    // Self-serving reviews on a business's own site are not eligible for review
    // rich results, so no Review/AggregateRating markup is added here.
    const p = PAGES.testimonials;
    inject(SeoService).setPage({ title: p.title, description: p.description, path: p.path, breadcrumbs: this.breadcrumbs });
  }
}
