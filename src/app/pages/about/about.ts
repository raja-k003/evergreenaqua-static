import { ChangeDetectionStrategy, Component, ElementRef, PLATFORM_ID, afterNextRender, inject, signal } from '@angular/core';
import { NgOptimizedImage, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PAGES } from '../../core/config/pages';
import { SITE } from '../../core/config/site.config';
import { image } from '../../core/data/images';
import { crumbs } from '../../core/seo/breadcrumbs';
import { SeoService } from '../../core/seo/seo.service';
import { Breadcrumbs } from '../../shared/ui/breadcrumbs';
import { CtaBand } from '../../shared/ui/cta-band';
import { Icon } from '../../shared/ui/icon';

@Component({
  selector: 'app-about',
  imports: [NgOptimizedImage, RouterLink, Breadcrumbs, Icon, CtaBand],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  protected readonly site = SITE;
  protected readonly breadcrumbs = crumbs({ label: 'About us' });
  protected readonly img = image('sm-paramount-team-installation', 'Evergreen Aqua team beside a newly installed water softener');

  /** Figures shown on the intro stats band. */
  protected readonly stats = [
    { target: 38, suffix: '+', label: 'Qualified technicians' },
    { target: 450, suffix: '+', label: 'Completed projects' },
    { target: 5, suffix: 'k+', label: 'Happy customers' },
  ];
  protected readonly counts = signal(this.stats.map((s) => s.target));

  protected readonly benefits = [
    { title: 'Prevents plumbing issues', text: 'Stops scale deposition on fittings.' },
    { title: 'Preserves utensil shine', text: 'Maintains shine for longer.' },
    { title: 'Pipeline protection', text: 'Prevents corrosion and scale build-up.' },
    { title: 'Easy installation, lightweight', text: 'Quick setup, no civil work needed.' },
    { title: 'Zero maintenance', text: 'No replacements required.' },
    { title: 'Energy efficient', text: 'Operates without electricity (manual models), cutting bills.' },
    { title: 'Convenient recharging, low-pressure use', text: 'Simple recharge; soft water even at low pressures.' },
  ];

  protected readonly filters = [
    { name: 'Water softener', link: '/products/water-softeners', img: '/images/filtration-water-softener.webp', alt: 'A child filling a glass with water from a kitchen tap',
      text: 'Unlock the magic of water softeners with us. Bid farewell to hard water issues as our advanced systems redefine your water, ensuring a home filled with clarity and comfort.' },
    { name: 'Sand filter', link: '/products/sand-filters', img: '/images/filtration-sand-filter.webp', alt: 'Sand filter cartridges beside glasses of unfiltered and filtered water',
      text: 'Explore the epitome of water purification with our cutting-edge sand filter. Immerse yourself in unparalleled filtration excellence, ensuring crystal-clear water that redefines your aquatic experience.' },
    { name: 'Iron filter', link: '/products/iron-filters', img: '/images/filtration-iron-filter.webp', alt: 'Three glasses showing iron-stained water becoming clear',
      text: 'Eradicate iron-related water concerns with our advanced filter. Enjoy the confidence of iron-free water, ensuring the purity and quality your home deserves. Experience water, refined.' },
    { name: 'Carbon filter', link: '/products/carbon-filters', img: '/images/filtration-carbon-filter.webp', alt: 'A glass of clear water in front of carbon filter cartridges',
      text: 'Step into a world of pristine water with our cutting-edge carbon filter. Immerse yourself in the purity and freshness as our filter transforms your water into a crystal-clear elixir.' },
  ];

  constructor() {
    const p = PAGES.about;
    inject(SeoService).setPage({ title: p.title, description: p.description, path: p.path, breadcrumbs: this.breadcrumbs });

    // Count the figures up the first time the stats band scrolls into view.
    afterNextRender(() => {
      const el = this.host.nativeElement.querySelector('.stats');
      if (!this.isBrowser || !el || matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
      this.counts.set(this.stats.map(() => 0));
      const io = new IntersectionObserver((entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / 1400, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          this.counts.set(this.stats.map((s) => Math.round(s.target * eased)));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
      io.observe(el);
    });
  }
}
