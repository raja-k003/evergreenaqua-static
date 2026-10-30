import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE } from '../../core/config/site.config';
import { ButtonDirective } from './button';
import { Icon } from './icon';

@Component({
  selector: 'app-cta-band',
  imports: [RouterLink, ButtonDirective, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section section--tight" aria-labelledby="cta-title">
      <div class="container">
        <div class="cta-band">
          <div>
            <h2 id="cta-title">{{ title() }}</h2>
            <p>{{ text() }}</p>
          </div>
          <div class="btn-row">
            <a appButton variant="light" size="lg" routerLink="/contact">Book a water test</a>
            <a appButton variant="outline" size="lg" class="on-brand" [href]="'tel:' + phone.e164">
              <app-icon name="phone" [size]="18" /> {{ phone.display }}
            </a>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: `.on-brand { --btn-fg: var(--color-on-primary); --btn-border: currentColor; color: var(--color-on-primary); } .on-brand:hover { --btn-bg: transparent; --btn-fg: var(--color-on-primary); --btn-border: var(--color-on-primary); text-decoration: underline; }`,
})
export class CtaBand {
  readonly title = input('Not sure which system you need?');
  readonly text = input('We test your water on site and recommend the right softener or filter — no obligation.');
  protected readonly phone = SITE.phones[0];
}
