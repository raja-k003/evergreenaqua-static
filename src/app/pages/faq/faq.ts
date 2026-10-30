import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PAGES } from '../../core/config/pages';
import { ALL_FAQS, FAQ_GROUPS } from '../../core/data/content';
import { crumbs } from '../../core/seo/breadcrumbs';
import { faqSchema } from '../../core/seo/schema';
import { SeoService } from '../../core/seo/seo.service';
import { EnquiryForm } from '../../shared/forms/enquiry-form';
import { PageHeader } from '../../shared/ui/page-header';

@Component({
  selector: 'app-faq',
  imports: [PageHeader, EnquiryForm],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-header
      [breadcrumbs]="breadcrumbs"
      eyebrow="FAQ"
      title="Frequently asked questions"
      lead="Straight answers about water softeners, filters, installation and maintenance."
    />
    <div class="section">
      <div class="container layout">
        <div>
          @for (group of groups; track group.title) {
            <section class="group" [attr.aria-labelledby]="'faq-' + $index">
              <h2 [id]="'faq-' + $index">{{ group.title }}</h2>
              <div class="accordion">
                @for (item of group.items; track item.q) {
                  <details>
                    <summary>{{ item.q }}</summary>
                    <div class="accordion__body"><p>{{ item.a }}</p></div>
                  </details>
                }
              </div>
            </section>
          }
        </div>
        <aside class="card ask" aria-labelledby="ask-title">
          <h2 id="ask-title">Still have a question?</h2>
          <p class="muted">Send it to us and we will get back to you within one working day.</p>
          <app-enquiry-form kind="question" idPrefix="faq" submitLabel="Ask a question" />
        </aside>
      </div>
    </div>
  `,
  styles: `
    .layout { display: grid; gap: 2.5rem; align-items: start; }
    @media (min-width: 1000px) { .layout { grid-template-columns: 1.4fr 1fr; } .ask { position: sticky; top: calc(var(--header-height) + 1.5rem); } }
    .group + .group { margin-top: 2.5rem; }
    h2 { font-size: var(--font-size-2xl); }
  `,
})
export class FaqPage {
  protected readonly groups = FAQ_GROUPS;
  protected readonly breadcrumbs = crumbs({ label: 'FAQ' });

  constructor() {
    const p = PAGES.faq;
    inject(SeoService).setPage({
      title: p.title,
      description: p.description,
      path: p.path,
      breadcrumbs: this.breadcrumbs,
      jsonLd: faqSchema(ALL_FAQS),
    });
  }
}
