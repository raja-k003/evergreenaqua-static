import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe, NgOptimizedImage } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PAGES } from '../../core/config/pages';
import { SITE } from '../../core/config/site.config';
import { BlogPost, sortedPosts } from '../../core/data/blog';
import { pagePath, paginate, parsePage, totalPages } from '../../core/routing/pagination';
import { markNotFound } from '../../core/routing/route-utils';
import { crumbs } from '../../core/seo/breadcrumbs';
import { SeoService } from '../../core/seo/seo.service';
import { BlogCard } from '../../shared/ui/blog-card';
import { Breadcrumbs } from '../../shared/ui/breadcrumbs';
import { Icon } from '../../shared/ui/icon';
import { StateView } from '../../shared/ui/state';

@Component({
  selector: 'app-blog',
  imports: [RouterLink, DatePipe, NgOptimizedImage, Breadcrumbs, BlogCard, Icon, StateView],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './blog.html',
  styleUrl: './blog.scss',
})
export class Blog {
  private readonly seo = inject(SeoService);
  private readonly all = sortedPosts();

  protected readonly breadcrumbs = crumbs({ label: 'Blog' });
  protected readonly pages = signal(totalPages(this.all.length, SITE.blogPageSize));
  protected readonly page = signal(1);
  protected readonly invalid = signal(false);
  protected readonly posts = signal<BlogPost[]>([]);
  protected readonly pageNumbers = signal<number[]>([]);
  /** The newest article is featured big on the first page only. */
  protected readonly featured = computed(() => (this.page() === 1 && this.posts().length > 1 ? this.posts()[0] : null));
  protected readonly rest = computed(() => (this.featured() ? this.posts().slice(1) : this.posts()));

  constructor() {
    this.pageNumbers.set(Array.from({ length: this.pages() }, (_, i) => i + 1));
    const route = inject(ActivatedRoute);
    const first = parsePage(route.snapshot.queryParamMap.get('page'), this.pages());
    if (first === null) markNotFound();

    route.queryParamMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const page = parsePage(params.get('page'), this.pages());
      const meta = PAGES.blog;
      if (page === null) {
        this.invalid.set(true);
        this.posts.set([]);
        this.seo.setPage({ title: 'Page not found', description: meta.description, path: meta.path, noindex: true });
        return;
      }
      this.invalid.set(false);
      this.page.set(page);
      this.posts.set(paginate(this.all, page, SITE.blogPageSize));
      // Each page in the series is self-canonical (Google's recommendation for pagination).
      this.seo.setPage({
        title: page > 1 ? `${meta.title} – Page ${page}` : meta.title,
        description: page > 1 ? `${meta.description} Page ${page} of ${this.pages()}.` : meta.description,
        path: pagePath(meta.path, page),
        breadcrumbs: page > 1 ? crumbs({ label: 'Blog', path: '/blog' }, { label: `Page ${page}` }) : this.breadcrumbs,
      });
    });
  }

  protected qp(n: number): Record<string, number> | undefined {
    return n > 1 ? { page: n } : undefined;
  }
}
