import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Consistent H2 block for page sections. */
@Component({
  selector: 'app-section-heading',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.text-center]': 'center()' },
  template: `
    @if (eyebrow()) {
      <p class="eyebrow">{{ eyebrow() }}</p>
    }
    <h2 [id]="headingId() || null">{{ title() }}</h2>
    @if (lead()) {
      <p class="lead">{{ lead() }}</p>
    }
  `,
  styles: `:host { display: block; margin-bottom: clamp(1.5rem, 1rem + 2vw, 2.5rem); } h2 { max-width: 40rem; } :host(.text-center) h2 { margin-inline: auto; }`,
})
export class SectionHeading {
  readonly title = input.required<string>();
  readonly eyebrow = input<string>('');
  readonly lead = input<string>('');
  readonly center = input(false);
  /** Set when the parent <section> uses aria-labelledby. */
  readonly headingId = input<string>('');
}
