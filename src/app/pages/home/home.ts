import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PAGES } from '../../core/config/pages';
import { SITE } from '../../core/config/site.config';
import { sortedPosts } from '../../core/data/blog';
import { GALLERY, TESTIMONIALS } from '../../core/data/content';
import { image } from '../../core/data/images';
import { PRODUCTS, lowestPrice } from '../../core/data/products';
import { localBusinessSchema, websiteSchema } from '../../core/seo/schema';
import { SeoService } from '../../core/seo/seo.service';
import { BlogCard } from '../../shared/ui/blog-card';
import { ButtonDirective } from '../../shared/ui/button';
import { CtaBand } from '../../shared/ui/cta-band';
import { Icon } from '../../shared/ui/icon';
import { ProductCard } from '../../shared/ui/product-card';
import { SectionHeading } from '../../shared/ui/section-heading';
import { TestimonialCard } from '../../shared/ui/testimonial-card';

@Component({
  selector: 'app-home',
  imports: [NgOptimizedImage, RouterLink, ButtonDirective, Icon, SectionHeading, ProductCard, TestimonialCard, BlogCard, CtaBand],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(document:keydown)': 'onKey($event)' },
})
export class Home {
  protected readonly site = SITE;
  protected readonly roHighlights = ['RO + UV purification', 'Alkaline and copper stages', 'Kent, Aqua and more', 'Safe drinking water'];
  protected readonly machines = [
    { cls: 'm-left', src: '/images/hero-water-softener.webp', w: 101, h: 470, alt: 'Evergreen Aqua water softener vessel with digital control valve' },
    { cls: 'm-mid', src: '/images/hero-iron-filter-digital.webp', w: 93, h: 458, alt: 'Evergreen Aqua iron removal filter with digital control valve' },
    { cls: 'm-right', src: '/images/hero-iron-filter-manual.webp', w: 92, h: 459, alt: 'Evergreen Aqua manual iron removal filter' },
  ];
  protected readonly products = PRODUCTS.map((p) => ({ ...p, fromPrice: lowestPrice(p) }));
  protected readonly roImage = image('ro-kent-crystal-star-black', 'Kent Crystal Star black RO + UV water purifier');
  protected readonly testimonials = TESTIMONIALS.slice(0, 3);
  protected readonly posts = sortedPosts().slice(0, 3);

  protected readonly trust = [
    { icon: 'award', label: `${SITE.yearsOfExperience} years’ experience` },
    { icon: 'shield', label: `${SITE.warrantyYears}-year warranty` },
    { icon: 'bolt-off', label: 'No electricity needed*' },
    { icon: 'wrench', label: 'No civil work' },
  ];

  protected readonly benefits = [
    { icon: 'gauge', title: 'High output', text: 'Maximise efficiency. High output and low maintenance for superior water solutions.', link: '/products/water-softeners' },
    { icon: 'wrench', title: 'Low maintenance', text: 'Effortless upkeep. Low maintenance for sustained, hassle-free water solutions.', link: '/services' },
    { icon: 'timer', title: 'Longevity', text: 'Enduring excellence. Longevity for appliances, fabrics and a life well-lived.', link: '/products' },
    { icon: 'sparkle', title: 'Smooth skin', text: 'Gentle luxury. Smooth skin with advanced water softening solutions.', link: '/products/water-softeners' },
    { icon: 'bubbles', title: 'Enhanced lather', text: 'Rich lather, less soap. Elevate your bathing experience effortlessly.', link: '/products/water-softeners' },
    { icon: 'utensils', title: 'Cleaner vessels', text: 'Stain-free vessels. Our solution ensures cleaner, pristine kitchenware effortlessly.', link: '/products/water-softeners' },
    { icon: 'shirt', title: 'Softer clothes', text: 'Gentle fabrics. Our technology ensures softer, more vibrant clothes effortlessly.', link: '/products/water-softeners' },
  ];

  /** Set `photo` (e.g. '/images/benefit-skin.webp') to show a real photo instead of the illustrated panel. hue shifts the panel colour. */
  protected readonly softenerBenefits: { icon: string; title: string; text: string; hue: number; photo?: string }[] = [
    { icon: 'flame', title: 'Heats water faster', text: 'Softened water speeds up the heating process. Reduced energy consumption and lower utility bills.', hue: 0 },
    { icon: 'sparkle', title: 'Soft skin and soft hair', text: 'Soft water helps soaps lather and rinse, making your skin and hair much softer.', hue: 18 },
    { icon: 'shield', title: 'Longer-lasting appliances', text: 'A water softener makes soaps work more efficiently and elongates the life of your appliances.', hue: -14 },
    { icon: 'utensils', title: 'Saves dishes', text: 'Helps keep your dishes spotless and makes silverware and glasses cleaner and shinier.', hue: 10 },
    { icon: 'layers', title: 'Improves life of linens', text: 'A water softener helps prevent colour fading and keeps your linens soft.', hue: -8 },
    { icon: 'shirt', title: 'Softer fabrics', text: 'Soft water preserves fabrics, enhancing durability and vibrancy effortlessly.', hue: 22 },
  ];

  protected readonly certs = ['ISO 18001:2007', 'ISO 9001:2015', 'ISO 14001:2015'];

  /** The nine most recent installations, shown as a photo grid with a lightbox. */
  protected readonly activity = GALLERY.slice(0, 9);
  protected readonly lightbox = signal<number | null>(null);
  protected readonly current = computed(() => (this.lightbox() === null ? null : this.activity[this.lightbox()!]));

  protected openLightbox(i: number): void {
    this.lightbox.set(i);
  }

  protected closeLightbox(): void {
    this.lightbox.set(null);
  }

  protected step(delta: number): void {
    const i = this.lightbox();
    if (i !== null) this.lightbox.set((i + delta + this.activity.length) % this.activity.length);
  }

  protected onKey(e: KeyboardEvent): void {
    if (this.lightbox() === null) return;
    if (e.key === 'Escape') this.closeLightbox();
    else if (e.key === 'ArrowRight') this.step(1);
    else if (e.key === 'ArrowLeft') this.step(-1);
  }

  protected readonly steps = [
    { icon: 'calendar', title: 'Book a visit', text: 'Call, WhatsApp or send an enquiry to schedule a convenient time.' },
    { icon: 'drop', title: 'Free water test', text: 'We test hardness, iron and turbidity on site and explain the results.' },
    { icon: 'wrench', title: 'Expert installation', text: 'Our technicians install the right system — no civil work required.' },
    { icon: 'shield', title: 'Ongoing support', text: 'Recharging guidance, servicing and a 1-year warranty for peace of mind.' },
  ];

  constructor() {
    const page = PAGES.home;
    inject(SeoService).setPage({
      title: page.title,
      rawTitle: true,
      description: page.description,
      path: page.path,
      jsonLd: [localBusinessSchema(), websiteSchema()],
    });
  }

  /** Decorative water shapes around the hero image: x/y in %, size in rem, d = parallax depth. */
  protected readonly shapes: { kind: 'drop' | 'bubble' | 'ripple'; x: number; y: number; size: number; d: number; delay: number; dur: number }[] = [
    { kind: 'drop', x: 78, y: 2, size: 4.5, d: 28, delay: 0, dur: 7 },
    { kind: 'drop', x: 2, y: 8, size: 3.2, d: -22, delay: -2, dur: 8 },
    { kind: 'drop', x: 90, y: 40, size: 2.4, d: 36, delay: -4, dur: 6 },
    { kind: 'drop', x: -4, y: 52, size: 5.5, d: -30, delay: -1, dur: 9 },
    { kind: 'drop', x: 70, y: 82, size: 3.6, d: 24, delay: -3, dur: 7.5 },
    { kind: 'drop', x: 30, y: 90, size: 2.2, d: -38, delay: -5, dur: 6.5 },
    { kind: 'drop', x: 46, y: -4, size: 2, d: 20, delay: -6, dur: 8.5 },
    { kind: 'drop', x: 92, y: 66, size: 4.2, d: -26, delay: -2.5, dur: 10 },
    { kind: 'bubble', x: 14, y: 30, size: 2.4, d: 34, delay: -1, dur: 6 },
    { kind: 'bubble', x: 84, y: 22, size: 1.6, d: -32, delay: -3, dur: 5 },
    { kind: 'bubble', x: 6, y: 74, size: 3.2, d: 26, delay: -4, dur: 8 },
    { kind: 'bubble', x: 58, y: 94, size: 1.4, d: -20, delay: -2, dur: 5.5 },
    { kind: 'bubble', x: 96, y: 88, size: 2.2, d: 30, delay: -6, dur: 7 },
    { kind: 'bubble', x: 22, y: 2, size: 1.2, d: -28, delay: -1.5, dur: 6 },
    { kind: 'ripple', x: 62, y: 70, size: 9, d: 12, delay: 0, dur: 5 },
    { kind: 'ripple', x: 8, y: 20, size: 7, d: -14, delay: -2.5, dur: 6 },
  ];

  /** Bubbles rising inside the water at the foot of the hero: x in %, y = start height in % of the water layer. */
  protected readonly bubbles = [
    { x: 3, y: 12, size: 2.2, delay: -0.0, dur: 5 },
    { x: 7, y: 30, size: 1.2, delay: -0.9, dur: 7 },
    { x: 11, y: 8, size: 3.2, delay: -1.8, dur: 9 },
    { x: 15, y: 24, size: 1.6, delay: -2.7, dur: 6 },
    { x: 19, y: 40, size: 2.6, delay: -3.6, dur: 8 },
    { x: 24, y: 14, size: 1.1, delay: -4.5, dur: 5 },
    { x: 5, y: 48, size: 1.8, delay: -5.4, dur: 7 },
    { x: 30, y: 10, size: 1.4, delay: -6.3, dur: 9 },
    { x: 38, y: 22, size: 2, delay: -0.20000000000000018, dur: 6 },
    { x: 46, y: 6, size: 1.2, delay: -1.0999999999999996, dur: 8 },
    { x: 54, y: 26, size: 1.7, delay: -2.0, dur: 5 },
    { x: 62, y: 12, size: 2.4, delay: -2.9000000000000004, dur: 7 },
    { x: 70, y: 30, size: 1.3, delay: -3.8000000000000007, dur: 9 },
    { x: 78, y: 8, size: 1.8, delay: -4.700000000000001, dur: 6 },
    { x: 85, y: 22, size: 2.8, delay: -5.6, dur: 8 },
    { x: 91, y: 14, size: 1.4, delay: -6.5, dur: 5 },
    { x: 95, y: 36, size: 2, delay: -0.40000000000000036, dur: 7 },
    { x: 1, y: 64, size: 1.3, delay: -1.3000000000000007, dur: 9 },
    { x: 13, y: 58, size: 1.1, delay: -2.1999999999999993, dur: 6 },
    { x: 97, y: 56, size: 1.5, delay: -3.1000000000000014, dur: 8 },
  ];

  protected track(e: PointerEvent): void {
    const el = e.currentTarget as HTMLElement;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--px', String((e.clientX - r.left) / r.width - 0.5));
    el.style.setProperty('--py', String((e.clientY - r.top) / r.height - 0.5));
  }
}
