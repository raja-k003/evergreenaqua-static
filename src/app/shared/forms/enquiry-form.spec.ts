import { TestBed } from '@angular/core/testing';
import { EnquiryService } from '../../core/enquiry/enquiry.service';
import { EnquiryForm } from './enquiry-form';

describe('EnquiryForm', () => {
  const send = vi.fn();

  beforeEach(async () => {
    send.mockReset();
    await TestBed.configureTestingModule({
      imports: [EnquiryForm],
      providers: [{ provide: EnquiryService, useValue: { send } }],
    }).compileComponents();
  });

  const setup = async () => {
    const fixture = TestBed.createComponent(EnquiryForm);
    await fixture.whenStable();
    return { fixture, el: fixture.nativeElement as HTMLElement };
  };

  const type = (el: HTMLElement, id: string, value: string) => {
    const input = el.querySelector<HTMLInputElement | HTMLTextAreaElement>(`#enq-${id}`)!;
    input.value = value;
    input.dispatchEvent(new Event('input'));
  };

  it('shows linked, accessible errors and does not submit when invalid', async () => {
    const { fixture, el } = await setup();
    el.querySelector('form')!.dispatchEvent(new Event('submit'));
    await fixture.whenStable();
    const name = el.querySelector('#enq-name')!;
    expect(name.getAttribute('aria-invalid')).toBe('true');
    expect(name.getAttribute('aria-describedby')).toBe('enq-name-err');
    expect(el.querySelector('#enq-name-err')?.textContent).toContain('Please enter your name');
    expect(send).not.toHaveBeenCalled();
  });

  it('submits valid data and shows a success message', async () => {
    send.mockResolvedValue({ ok: true });
    const { fixture, el } = await setup();
    type(el, 'name', 'Raja K');
    type(el, 'phone', '+91 98413 13297');
    type(el, 'email', 'raja@example.com');
    type(el, 'message', 'Hard water leaves scale on taps.');
    el.querySelector('form')!.dispatchEvent(new Event('submit'));
    await fixture.whenStable();
    expect(send).toHaveBeenCalledWith(expect.objectContaining({ name: 'Raja K', kind: 'contact' }));
    expect(el.querySelector('.alert--success')?.textContent).toContain('Thank you');
  });

  it('shows an error alert when sending fails', async () => {
    send.mockResolvedValue({ ok: false, message: 'Network down' });
    const { fixture, el } = await setup();
    type(el, 'name', 'Raja K');
    type(el, 'phone', '9841313297');
    type(el, 'email', 'raja@example.com');
    type(el, 'message', 'Please call me back about iron.');
    el.querySelector('form')!.dispatchEvent(new Event('submit'));
    await fixture.whenStable();
    expect(el.querySelector('[role=alert]')?.textContent).toContain('Network down');
  });
});
