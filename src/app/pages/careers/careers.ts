import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PAGES } from '../../core/config/pages';
import { JOB_OPENINGS } from '../../core/data/content';
import { crumbs } from '../../core/seo/breadcrumbs';
import { SeoService } from '../../core/seo/seo.service';
import { EnquiryForm } from '../../shared/forms/enquiry-form';
import { Icon } from '../../shared/ui/icon';
import { PageHeader } from '../../shared/ui/page-header';
import { SectionHeading } from '../../shared/ui/section-heading';
import { StateView } from '../../shared/ui/state';

@Component({
  selector: 'app-careers',
  imports: [PageHeader, SectionHeading, Icon, EnquiryForm, StateView],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-header
      [breadcrumbs]="breadcrumbs"
      eyebrow="Careers"
      title="Join the Evergreen Aqua team"
      lead="We are a growing Chennai team focused on great service, practical skills and doing the job right."
    />

    <section class="section" aria-labelledby="openings">
      <div class="container">
        <app-section-heading headingId="openings" title="Open positions" />
        @if (jobs.length) {
          <ul class="grid grid--2 card-list">
            @for (job of jobs; track job.title) {
              <li class="card">
                <span class="badge">{{ job.type }} · Chennai</span>
                <h3 class="card__title job">{{ job.title }}</h3>
                <p class="card__text">{{ job.summary }}</p>
                <div class="card__footer"><a href="#apply">Apply for this role</a></div>
              </li>
            }
          </ul>
        } @else {
          <app-state title="No open positions right now" message="We still welcome applications — send us your details below." />
        }
      </div>
    </section>

    <section class="section section--alt" aria-labelledby="benefits">
      <div class="container">
        <app-section-heading headingId="benefits" title="Why work with us" />
        <ul class="grid card-list">
          @for (b of benefits; track b.title) {
            <li class="card">
              <span class="icon-tile"><app-icon [name]="b.icon" [size]="24" /></span>
              <h3 class="card__title">{{ b.title }}</h3>
              <p class="card__text">{{ b.text }}</p>
            </li>
          }
        </ul>
      </div>
    </section>

    <section id="apply" class="section" aria-labelledby="apply-title">
      <div class="container narrow">
        <app-section-heading headingId="apply-title" title="Apply now" lead="Tell us which role interests you and a little about your experience." />
        <div class="card">
          <app-enquiry-form kind="career" idPrefix="job" [positions]="positions" submitLabel="Send application" />
        </div>
      </div>
    </section>
  `,
  styles: `.job { margin-top: .5rem; } .badge { align-self: flex-start; } .narrow { max-width: 46rem; }`,
})
export class Careers {
  protected readonly jobs = JOB_OPENINGS;
  protected readonly positions = JOB_OPENINGS.map((j) => j.title);
  protected readonly breadcrumbs = crumbs({ label: 'Careers' });
  protected readonly benefits = [
    { icon: 'award', title: 'Learn from experience', text: 'Work alongside a team with 25 years in water treatment.' },
    { icon: 'heart', title: 'Wellness allowance', text: 'Support for your health and wellbeing.' },
    { icon: 'shield', title: 'Insurance cover', text: 'Comprehensive insurance for full-time employees.' },
  ];

  constructor() {
    // JobPosting markup is intentionally omitted: it requires posting dates,
    // locations and validity periods that are not published for these roles.
    const p = PAGES.careers;
    inject(SeoService).setPage({ title: p.title, description: p.description, path: p.path, breadcrumbs: this.breadcrumbs });
  }
}
