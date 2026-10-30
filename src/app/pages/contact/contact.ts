import { ChangeDetectionStrategy, Component, afterNextRender, inject, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PAGES } from '../../core/config/pages';
import { SITE, fullAddress, whatsappLink } from '../../core/config/site.config';
import { crumbs } from '../../core/seo/breadcrumbs';
import { localBusinessSchema } from '../../core/seo/schema';
import { SeoService } from '../../core/seo/seo.service';
import { EnquiryForm } from '../../shared/forms/enquiry-form';
import { Breadcrumbs } from '../../shared/ui/breadcrumbs';
import { Icon } from '../../shared/ui/icon';

const ZONE = 'Asia/Kolkata';
const toMinutes = (hhmm: string): number => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

/** Whether the shop is open right now (Indian Standard Time), from the opening hours in SITE. */
function openStatus(now = new Date()): { open: boolean; text: string } {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: ZONE, weekday: 'long', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)!.value;
  const minutes = Number(get('hour')) * 60 + Number(get('minute'));
  const day = get('weekday');
  const { days, opens, closes } = SITE.hours;
  const isOpen = (days as readonly string[]).includes(day) && minutes >= toMinutes(opens) && minutes < toMinutes(closes);
  return isOpen ? { open: true, text: 'Open now · closes at 5 pm' } : { open: false, text: 'Closed now · opens Mon – Sat, 9 am' };
}

@Component({
  selector: 'app-contact',
  imports: [Breadcrumbs, EnquiryForm, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {
  protected readonly site = SITE;
  protected readonly address = fullAddress();
  protected readonly wa = whatsappLink();
  protected readonly mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.name + ', ' + fullAddress())}`;
  /** Fixed Google Maps embed URL built from our own address, so trusting it is safe. */
  protected readonly mapEmbedUrl: SafeResourceUrl = inject(DomSanitizer).bypassSecurityTrustResourceUrl(
    `https://www.google.com/maps?q=${encodeURIComponent(fullAddress())}&output=embed`,
  );
  protected readonly breadcrumbs = crumbs({ label: 'Contact' });
  protected readonly status = signal<{ open: boolean; text: string } | null>(null);

  constructor() {
    const p = PAGES.contact;
    inject(SeoService).setPage({
      title: p.title,
      description: p.description,
      path: p.path,
      breadcrumbs: this.breadcrumbs,
      jsonLd: localBusinessSchema(),
    });
    // Computed after hydration so the server-rendered page never disagrees with the visitor's clock.
    afterNextRender(() => this.status.set(openStatus()));
  }
}
