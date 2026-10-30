import { ChangeDetectionStrategy, Component, ElementRef, Injector, afterNextRender, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Enquiry, EnquiryService } from '../../core/enquiry/enquiry.service';
import { SITE, whatsappLink } from '../../core/config/site.config';
import { ButtonDirective } from '../ui/button';
import { Icon } from '../ui/icon';

type Status = 'idle' | 'submitting' | 'success' | 'error';

const PHONE_PATTERN = /^[+]?[\d\s()-]{8,16}$/;

/**
 * Accessible enquiry form used on Contact, Careers and FAQ.
 * - labels tied to inputs, errors linked with aria-describedby
 * - errors appear after a field is touched or on submit
 * - focus moves to the first invalid field on submit
 * - submit result is announced through a live region
 */
@Component({
  selector: 'app-enquiry-form',
  imports: [ReactiveFormsModule, ButtonDirective, Icon],
  templateUrl: './enquiry-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnquiryForm {
  private readonly fb = inject(FormBuilder);
  private readonly enquiries = inject(EnquiryService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);

  readonly kind = input<Enquiry['kind']>('contact');
  readonly positions = input<string[]>([]);
  readonly submitLabel = input('Send message');
  /** Unique prefix for element ids when several forms share a page. */
  readonly idPrefix = input('enq');

  protected readonly status = signal<Status>('idle');
  protected readonly errorMessage = signal('');
  protected readonly submitted = signal(false);
  protected readonly site = SITE;
  protected readonly wa = whatsappLink();

  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(120)]],
    phone: ['', [Validators.required, Validators.pattern(PHONE_PATTERN)]],
    position: [''],
    message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(2000)]],
    website: [''], // honeypot
  });

  protected id(name: string): string {
    return `${this.idPrefix()}-${name}`;
  }

  protected showError(name: keyof typeof this.form.controls): boolean {
    const c = this.form.controls[name];
    return c.invalid && (c.touched || this.submitted());
  }

  protected errorFor(name: keyof typeof this.form.controls): string {
    const e = this.form.controls[name].errors;
    if (!e) return '';
    const labels: Record<string, string> = { name: 'your name', email: 'your email address', phone: 'your phone number', message: 'a message', position: 'a position' };
    if (e['required']) return `Please enter ${labels[name]}.`;
    if (e['email']) return 'Please enter a valid email address, like name@example.com.';
    if (e['pattern']) return 'Please enter a valid phone number, like +91 98413 13297.';
    if (e['minlength']) return `Please enter at least ${e['minlength'].requiredLength} characters.`;
    if (e['maxlength']) return `Please keep this under ${e['maxlength'].requiredLength} characters.`;
    return 'Please check this field.';
  }

  async submit(): Promise<void> {
    this.submitted.set(true);
    if (this.kind() === 'career') this.form.controls.position.addValidators(Validators.required);
    this.form.controls.position.updateValueAndValidity();

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      // Wait for the error state to render, then focus the first invalid field.
      afterNextRender(() => this.host.nativeElement.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(), {
        injector: this.injector,
      });
      return;
    }
    if (this.status() === 'submitting') return;

    this.status.set('submitting');
    const value = this.form.getRawValue();
    const result = await this.enquiries.send({ ...value, kind: this.kind() });
    if (result.ok) {
      this.status.set('success');
      this.form.reset();
      this.submitted.set(false);
    } else {
      this.status.set('error');
      this.errorMessage.set(result.message);
    }
  }

  reset(): void {
    this.status.set('idle');
  }
}
