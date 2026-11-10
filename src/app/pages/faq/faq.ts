import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { PAGES } from '../../core/config/pages';
import { ALL_FAQS, FAQ_GROUPS } from '../../core/data/content';
import { crumbs } from '../../core/seo/breadcrumbs';
import { faqSchema } from '../../core/seo/schema';
import { SeoService } from '../../core/seo/seo.service';
import { EnquiryForm } from '../../shared/forms/enquiry-form';
import { Icon } from '../../shared/ui/icon';
import { PageHeader } from '../../shared/ui/page-header';

@Component({
  selector: 'app-faq',
  imports: [PageHeader, EnquiryForm, Icon],
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
          <div class="search">
            <app-icon name="filter" [size]="18" />
            <input type="search" placeholder="Search questions…" aria-label="Search questions" autocomplete="off" [value]="query()" (input)="query.set($any($event.target).value)" />
          </div>
          <nav class="chips" aria-label="Question topics">
            @for (group of groups; track group.title) {
              <a [href]="'#faq-' + $index" class="chip">{{ group.title }} <span>{{ group.items.length }}</span></a>
            }
          </nav>
          @for (group of visible(); track group.title; let gi = $index) {
            <section class="group" [attr.aria-labelledby]="'faq-' + gi">
              <h2 [id]="'faq-' + gi"><span class="group__badge" aria-hidden="true">{{ gi + 1 }}</span>{{ group.title }}</h2>
              <div class="accordion">
                @for (item of group.items; track item.q; let n = $index) {
                  <details [style.--n]="n">
                    <summary>{{ item.q }}</summary>
                    <div class="accordion__body"><p>{{ item.a }}</p></div>
                  </details>
                }
              </div>
            </section>
          } @empty {
            <p class="empty">No questions match “{{ query() }}”. Try a different word, or ask us using the form.</p>
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
    .group { scroll-margin-top: calc(var(--header-height) + 1rem); }
    .group + .group { margin-top: 2.5rem; }
    h2 { font-size: var(--font-size-2xl); }
    .group h2 { display: flex; align-items: center; gap: .75rem; margin-bottom: 1.1rem; }
    .group__badge { display: grid; place-items: center; flex: none; width: 2.1rem; height: 2.1rem; border-radius: .6rem; font-size: var(--font-size-sm); font-weight: 800; color: var(--color-on-primary);
      background: var(--color-secondary); color: var(--color-on-secondary); }

    .search { position: relative; display: flex; align-items: center; margin-bottom: 1rem; color: var(--color-text-muted);
      app-icon { position: absolute; left: 1rem; pointer-events: none; }
      input { width: 100%; padding: .85rem 1rem .85rem 2.75rem; font: inherit; color: var(--color-text); background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-pill);
        box-shadow: var(--shadow-sm); transition: border-color .2s ease, box-shadow .2s ease;
        &:focus { outline: none; border-color: var(--color-primary); box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-primary) 18%, transparent); } } }
    .chips { display: flex; flex-wrap: wrap; gap: .5rem; margin-bottom: 2rem; }
    .chip { display: inline-flex; align-items: center; gap: .5rem; padding: .4rem .9rem; border-radius: var(--radius-pill); font-size: var(--font-size-sm); font-weight: 600; text-decoration: none;
      color: var(--color-primary); background: var(--color-primary-soft); border: 1px solid transparent; transition: background .2s ease, color .2s ease, transform .2s ease;
      span { display: grid; place-items: center; min-width: 1.35rem; height: 1.35rem; padding: 0 .3rem; border-radius: 99px; font-size: .75rem; background: var(--color-surface); }
      &:hover { background: var(--color-primary); color: var(--color-on-primary); transform: translateY(-2px); } }
    .empty { padding: 1.5rem; text-align: center; color: var(--color-text-muted); background: var(--color-surface); border: 1px dashed var(--color-border); border-radius: var(--radius-md); }

    .accordion details { position: relative; overflow: hidden; border-radius: 1rem; transition: border-color .25s ease, box-shadow .25s ease, transform .25s ease;
      animation: faq-in .5s cubic-bezier(.2, .7, .2, 1) both; animation-delay: calc(var(--n) * .05s);
      &::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: linear-gradient(180deg, var(--color-accent, var(--color-primary)), var(--color-primary)); transform: scaleY(0); transform-origin: top; transition: transform .35s ease; }
      &:hover { border-color: color-mix(in srgb, var(--color-primary) 45%, var(--color-border)); transform: translateX(3px); }
      &[open] { border-color: color-mix(in srgb, var(--color-primary) 55%, var(--color-border)); box-shadow: 0 14px 32px color-mix(in srgb, var(--color-primary) 14%, transparent); }
      &[open]::before { transform: scaleY(1); } }
    .accordion summary { padding-block: 1.1rem; transition: color .2s ease;
      &::after { transition: transform .3s cubic-bezier(.3, 1.6, .5, 1), background .25s ease, color .25s ease; }
      &:focus-visible { outline: 2px solid var(--color-primary); outline-offset: -2px; border-radius: 1rem; } }
    .accordion details[open] summary { color: var(--color-primary); }
    .accordion details[open] summary::after { content: '+'; transform: rotate(135deg); background: var(--color-primary); color: var(--color-on-primary); }
    .accordion__body { animation: faq-open .35s ease both; }

    .ask { position: relative; overflow: hidden; border-radius: 1.25rem; box-shadow: 0 18px 40px color-mix(in srgb, var(--color-primary) 14%, transparent);
      &::before { content: ''; position: absolute; inset: 0 0 auto 0; height: 5px; background: linear-gradient(90deg, var(--color-accent, var(--color-primary)), var(--color-primary)); } }

    @keyframes faq-in { from { opacity: 0; transform: translateY(.8rem); } }
    @keyframes faq-open { from { opacity: 0; transform: translateY(-.4rem); } }
    @media (prefers-reduced-motion: reduce) { .accordion details, .accordion__body, .chip { animation: none; transition: none; } }
  `,
})
export class FaqPage {
  protected readonly groups = FAQ_GROUPS;
  protected readonly query = signal('');
  protected readonly visible = computed(() => {
    const q = this.query().trim().toLowerCase();
    if (!q) return this.groups;
    return this.groups
      .map((g) => ({ ...g, items: g.items.filter((i) => (i.q + ' ' + i.a).toLowerCase().includes(q)) }))
      .filter((g) => g.items.length);
  });
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
