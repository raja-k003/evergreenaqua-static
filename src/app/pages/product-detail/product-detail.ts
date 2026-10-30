import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SITE, whatsappLink } from '../../core/config/site.config';
import { Product, findProduct, lowestPrice } from '../../core/data/products';
import { crumbs } from '../../core/seo/breadcrumbs';
import { productSchema } from '../../core/seo/schema';
import { SeoService } from '../../core/seo/seo.service';
import { CtaBand } from '../../shared/ui/cta-band';
import { ButtonDirective } from '../../shared/ui/button';
import { Icon } from '../../shared/ui/icon';
import { InrPipe } from '../../shared/ui/inr.pipe';
import { PageHeader } from '../../shared/ui/page-header';
import { ProductCard } from '../../shared/ui/product-card';

/**
 * Dedicated landing page per product. The route's canMatch guard guarantees
 * the slug exists, so `product` is always defined here.
 */
@Component({
  selector: 'app-product-detail',
  imports: [NgOptimizedImage, RouterLink, PageHeader, ButtonDirective, Icon, InrPipe, ProductCard, CtaBand],
  templateUrl: './product-detail.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .hero-img { max-width: 32rem; margin-inline: auto; width: 100%; background: var(--color-surface); border: 1px solid var(--color-border); }
    .price-line { font-size: var(--font-size-lg); margin: 0 0 1.25rem; }
    .features { margin-top: 1.5rem; }
    h2 { font-size: var(--font-size-2xl); }
    .tables { display: grid; gap: 1.5rem; }
    @media (min-width: 800px) { .tables { grid-template-columns: 1fr 1fr; } }
    .brochure { margin: 1rem 0 0; font-weight: 600; }
    .note { font-size: var(--font-size-xs); color: var(--color-text-muted); margin-top: .75rem; }
  `,
})
export class ProductDetail {
  private readonly route = inject(ActivatedRoute);
  protected readonly product: Product = findProduct(this.route.snapshot.paramMap.get('slug'))!;
  protected readonly fromPrice = lowestPrice(this.product);
  protected readonly site = SITE;
  protected readonly wa = whatsappLink(`Hi Evergreen Aqua, I'm interested in the ${this.product.name}.`);
  protected readonly breadcrumbs = crumbs({ label: 'Products', path: '/products' }, { label: this.product.name });
  protected readonly related = this.product.related.map((s) => findProduct(s)).filter((p): p is Product => !!p);
  protected readonly automatic = computed(() => this.product.models?.filter((m) => m.operation === 'Automatic') ?? []);
  protected readonly manual = computed(() => this.product.models?.filter((m) => m.operation === 'Manual') ?? []);
  protected readonly lowestPrice = lowestPrice;

  constructor() {
    const p = this.product;
    const schema = productSchema(p);
    inject(SeoService).setPage({
      title: p.seoTitle,
      description: p.seoDescription,
      path: `/products/${p.slug}`,
      type: 'product',
      image: { url: p.image.src, alt: p.image.alt },
      breadcrumbs: this.breadcrumbs,
      jsonLd: schema ? [schema] : [],
    });
  }
}
