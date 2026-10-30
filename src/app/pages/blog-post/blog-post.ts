import { ChangeDetectionStrategy, Component, ElementRef, PLATFORM_ID, afterNextRender, inject, signal } from '@angular/core';
import { DatePipe, NgOptimizedImage, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BlogPost, findPost, sortedPosts } from '../../core/data/blog';
import { BLOG_BODIES } from '../../core/data/blog-content';
import { findProduct } from '../../core/data/products';
import { SITE, whatsappLink } from '../../core/config/site.config';
import { crumbs } from '../../core/seo/breadcrumbs';
import { articleSchema } from '../../core/seo/schema';
import { SeoService } from '../../core/seo/seo.service';
import { BlogCard } from '../../shared/ui/blog-card';
import { Breadcrumbs } from '../../shared/ui/breadcrumbs';
import { CtaBand } from '../../shared/ui/cta-band';
import { Icon } from '../../shared/ui/icon';

const slugify = (s: string): string => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

@Component({
  selector: 'app-blog-post',
  imports: [NgOptimizedImage, DatePipe, RouterLink, Breadcrumbs, BlogCard, CtaBand, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './blog-post.html',
  styleUrl: './blog-post.scss',
  host: { '(window:scroll)': 'onScroll()' },
})
export class BlogPostPage {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  protected readonly site = SITE;
  protected readonly post: BlogPost = findPost(inject(ActivatedRoute).snapshot.paramMap.get('slug'))!;
  protected readonly body = (BLOG_BODIES[this.post.slug] ?? []).map((b) => (b.type === 'h2' ? { ...b, id: slugify(b.text) } : b));
  /** Table of contents built from the article's H2 headings. */
  protected readonly toc = this.body.flatMap((b) => (b.type === 'h2' ? [{ id: (b as { id: string }).id, text: b.text }] : []));
  protected readonly product = findProduct(this.post.relatedProduct);
  protected readonly more = sortedPosts().filter((p) => p.slug !== this.post.slug).slice(0, 3);
  protected readonly breadcrumbs = crumbs({ label: 'Blog', path: '/blog' }, { label: this.post.title });
  protected readonly progress = signal(0);
  protected readonly activeId = signal('');
  protected readonly copied = signal(false);
  protected readonly shareText = `${this.post.title} – ${SITE.name}`;

  constructor() {
    const p = this.post;
    inject(SeoService).setPage({
      title: p.title,
      description: p.description,
      path: `/blog/${p.slug}`,
      type: 'article',
      image: { url: p.image.src, alt: p.image.alt },
      article: { publishedTime: p.published, modifiedTime: p.updated, author: p.author, section: 'Water treatment' },
      breadcrumbs: this.breadcrumbs,
      jsonLd: articleSchema(p),
    });

    // Highlight the table-of-contents entry for the section being read.
    afterNextRender(() => {
      if (!('IntersectionObserver' in window)) return;
      const io = new IntersectionObserver(
        (entries) => {
          const hit = entries.find((e) => e.isIntersecting);
          if (hit) this.activeId.set(hit.target.id);
        },
        { rootMargin: '-90px 0px -65% 0px' },
      );
      this.host.nativeElement.querySelectorAll('.prose h2[id]').forEach((h) => io.observe(h));
    });
  }

  /** Reading progress through the article text. */
  protected onScroll(): void {
    if (!this.isBrowser) return;
    const el = this.host.nativeElement.querySelector<HTMLElement>('.prose');
    if (!el) return;
    const r = el.getBoundingClientRect();
    const total = r.height - window.innerHeight * 0.6;
    this.progress.set(total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0);
  }

  /** Scrolls to a section; a bare #fragment would resolve against <base href="/"> and leave the page. */
  protected jump(event: Event, id: string): void {
    event.preventDefault();
    const target = this.host.nativeElement.querySelector<HTMLElement>(`#${CSS.escape(id)}`);
    if (!target) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    this.activeId.set(id);
  }

  protected async copyLink(): Promise<void> {
    try {
      await navigator.clipboard.writeText(location.href);
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    } catch {
      /* clipboard blocked: the WhatsApp / Facebook share links still work */
    }
  }

  protected shareWhatsapp(): string {
    return `https://wa.me/?text=${encodeURIComponent(`${this.shareText} ${this.pageUrl()}`)}`;
  }

  protected shareFacebook(): string {
    return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(this.pageUrl())}`;
  }

  protected enquiry(): string {
    return whatsappLink(`Hi ${SITE.name}, I read "${this.post.title}" and would like some advice.`);
  }

  private pageUrl(): string {
    return `${SITE.baseUrl}/blog/${this.post.slug}`;
  }
}
