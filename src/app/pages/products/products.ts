import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PAGES } from '../../core/config/pages';
import { SITE } from '../../core/config/site.config';
import { image } from '../../core/data/images';
import { PRODUCT_CATEGORIES, PRODUCTS, ProductCategory, lowestPrice } from '../../core/data/products';
import { crumbs } from '../../core/seo/breadcrumbs';
import { SeoService } from '../../core/seo/seo.service';
import { CtaBand } from '../../shared/ui/cta-band';
import { PageHeader } from '../../shared/ui/page-header';
import { ProductCard } from '../../shared/ui/product-card';
import { StateView } from '../../shared/ui/state';

interface ListItem {
  name: string;
  summary: string;
  link: string;
  image: ReturnType<typeof image>;
  fromPrice?: number;
  category: ProductCategory;
  tag: string;
}

const label = (c: ProductCategory) => PRODUCT_CATEGORIES.find((x) => x.id === c)?.label ?? '';

const ALL_ITEMS: ListItem[] = [
  ...PRODUCTS.map((p) => ({
    name: p.name,
    summary: p.summary,
    link: `/products/${p.slug}`,
    image: p.image,
    fromPrice: lowestPrice(p),
    category: p.category,
    tag: label(p.category),
  })),
  {
    name: 'RO water purifiers',
    summary: 'RO + UV purifiers with alkaline and copper stages from Kent, Aqua and Euro.',
    link: '/products/ro-water-purifiers',
    image: image('ro-kent-crystal-star-black', 'Kent Crystal Star black RO + UV water purifier'),
    fromPrice: 9990,
    category: 'purifiers',
    tag: label('purifiers'),
  },
];

@Component({
  selector: 'app-products',
  imports: [RouterLink, PageHeader, ProductCard, StateView, CtaBand],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-header
      [breadcrumbs]="breadcrumbs"
      eyebrow="Products"
      title="Water softeners, filters and purifiers"
      lead="Compare our range and starting prices. Every system is sized for your water after a free on-site test."
    />
    <section class="section">
      <div class="container">
        <h2 class="visually-hidden">Product range</h2>
        <nav aria-label="Filter products by category" class="filters">
          <ul class="chips">
            <li><a class="chip" routerLink="/products" [attr.aria-current]="!category() ? 'page' : null">All</a></li>
            @for (c of categories; track c.id) {
              <li>
                <a class="chip" routerLink="/products" [queryParams]="{ category: c.id }" [attr.aria-current]="category() === c.id ? 'page' : null">{{ c.label }}</a>
              </li>
            }
          </ul>
        </nav>
        <p class="brochure"><a [href]="brochure" target="_blank" rel="noopener">Download our product brochure</a> <span class="muted">(PDF, 3.8 MB)</span></p>
        <p class="visually-hidden" aria-live="polite">{{ items().length }} products shown</p>

        @if (items().length) {
          <ul class="grid card-list">
            @for (p of items(); track p.link; let i = $index) {
              <li>
                <app-product-card [name]="p.name" [summary]="p.summary" [link]="p.link" [image]="p.image" [fromPrice]="p.fromPrice" [tag]="p.tag" [priority]="i < 3" />
              </li>
            }
          </ul>
        } @else {
          <app-state title="No products in this category" message="Try another category, or view the full range.">
            <a class="btn btn--outline" routerLink="/products">Show all products</a>
          </app-state>
        }
      </div>
    </section>
    <app-cta-band />
  `,
  styles: `
    .filters { margin-bottom: 1rem; }
    .brochure { margin: 0 0 2rem; font-weight: 600; }
    .chip { display: inline-flex; align-items: center; min-height: 2.75rem; padding: .5rem 1rem; border-radius: var(--radius-pill); border: 1px solid var(--color-border); background: var(--color-surface); color: var(--color-text); text-decoration: none; font-weight: 600; font-size: var(--font-size-sm); }
    .chip:hover { border-color: var(--color-primary); color: var(--color-primary); }
    .chip[aria-current] { background: var(--color-primary); border-color: var(--color-primary); color: var(--color-on-primary); }
  `,
})
export class Products {
  private readonly seo = inject(SeoService);
  protected readonly categories = PRODUCT_CATEGORIES;
  protected readonly brochure = SITE.brochureUrl;
  protected readonly breadcrumbs = crumbs({ label: 'Products' });
  protected readonly category = signal<string | null>(null);
  protected readonly items = signal<ListItem[]>(ALL_ITEMS);

  constructor() {
    inject(ActivatedRoute)
      .queryParamMap.pipe(takeUntilDestroyed())
      .subscribe((params) => {
        const category = params.get('category');
        this.category.set(category);
        this.items.set(category ? ALL_ITEMS.filter((i) => i.category === category) : ALL_ITEMS);

        const p = PAGES.products;
        const name = category ? label(category as ProductCategory) : '';
        this.seo.setPage({
          title: name ? `${name} – ${p.title}` : p.title,
          description: p.description,
          path: p.path,
          breadcrumbs: this.breadcrumbs,
          // Filtered views duplicate the main listing: keep them out of the index.
          noindex: !!category,
        });
      });
  }
}
