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
import { BubbleField } from '../../shared/ui/bubble-field';
import { ButtonDirective } from '../../shared/ui/button';
import { CtaBand } from '../../shared/ui/cta-band';
import { Icon } from '../../shared/ui/icon';
import { ProductCard } from '../../shared/ui/product-card';
import { SectionHeading } from '../../shared/ui/section-heading';
import { TestimonialCard } from '../../shared/ui/testimonial-card';

@Component({
  selector: 'app-home',
  imports: [NgOptimizedImage, RouterLink, ButtonDirective, BubbleField, Icon, SectionHeading, ProductCard, TestimonialCard, BlogCard, CtaBand],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(document:keydown)': 'onKey($event)' },
})
export class Home {
  protected readonly site = SITE;
  protected readonly roHighlights = ['RO + UV purification', 'Alkaline and copper stages', 'Kent, Aqua and more', 'Safe drinking water'];
  protected readonly products = PRODUCTS.map((p) => ({ ...p, fromPrice: lowestPrice(p) }));
  protected readonly roImage = image('ro-kent-crystal-star-black', 'Kent Crystal Star black RO + UV water purifier');
  protected readonly testimonials = TESTIMONIALS.slice(0, 3);
  protected readonly posts = sortedPosts().slice(0, 3);

  protected readonly trust = [
    { icon: 'award', label: `${SITE.yearsOfExperience} years’ experience` },
    { icon: 'shield', label: `${SITE.warrantyYears}-year warranty` },
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
}
