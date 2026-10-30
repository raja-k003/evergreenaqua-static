import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PAGES } from '../../core/config/pages';
import { SITE } from '../../core/config/site.config';
import { image } from '../../core/data/images';
import { crumbs } from '../../core/seo/breadcrumbs';
import { SeoService } from '../../core/seo/seo.service';
import { Breadcrumbs } from '../../shared/ui/breadcrumbs';
import { ButtonDirective } from '../../shared/ui/button';
import { CtaBand } from '../../shared/ui/cta-band';
import { Icon } from '../../shared/ui/icon';

@Component({
  selector: 'app-services',
  imports: [NgOptimizedImage, RouterLink, Breadcrumbs, ButtonDirective, CtaBand, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './services.html',
  styleUrl: './services.scss',
})
export class Services {
  protected readonly site = SITE;
  protected readonly breadcrumbs = crumbs({ label: 'Services' });
  protected readonly img = image('technician-twin-vessel-installation', 'Evergreen Aqua technician beside a twin-vessel filter installation');
  protected readonly services = [
    { icon: 'gauge', title: 'On-site water testing', text: 'We measure hardness, iron and turbidity at your tap and explain what they mean for your home.' },
    { icon: 'wrench', title: 'Installation', text: 'Softeners, filters and RO purifiers installed neatly with no civil work, usually within a day.' },
    { icon: 'layers', title: 'Resin recharge & replacement', text: 'Restore softening capacity with recharging guidance and Purolite resin replacement.' },
    { icon: 'timer', title: 'Maintenance visits', text: 'Periodic checks, backwash and cleaning to keep systems running at full capacity.' },
    { icon: 'drop', title: 'RO purifier service', text: 'Supply, installation and servicing of RO + UV purifiers for safe drinking water.' },
    { icon: 'users', title: 'Apartments & businesses', text: 'Larger-capacity plants sized for apartment blocks, offices and commercial kitchens.' },
  ];
  protected readonly highlights = [
    'High output with low maintenance',
    'Longer life for appliances, fittings and clothes',
    'Smoother skin and richer lather with less soap',
    'Stain-free vessels and kitchenware',
    'Up to 20% lower water-heating costs a year, by our estimate',
  ];
  protected readonly steps = [
    { icon: 'calendar', title: 'Schedule your appointment', text: 'Pick a time that suits you by phone, WhatsApp or the enquiry form.' },
    { icon: 'gauge', title: 'Get professional advice', text: 'We test your water and recommend the right system and size.' },
    { icon: 'users', title: 'Meet our expert team', text: 'Skilled technicians install and commission the system.' },
    { icon: 'shield', title: 'Enjoy better water', text: `With a ${SITE.warrantyYears}-year warranty and support whenever you need it.` },
  ];

  constructor() {
    const p = PAGES.services;
    inject(SeoService).setPage({ title: p.title, description: p.description, path: p.path, breadcrumbs: this.breadcrumbs });
  }
}
