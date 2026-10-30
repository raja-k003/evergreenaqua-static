import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Header } from './header';

describe('Header', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Header], providers: [provideRouter([])] }).compileComponents();
  });

  it('renders crawlable links for every main and product page', async () => {
    const fixture = TestBed.createComponent(Header);
    await fixture.whenStable();
    const hrefs = [...(fixture.nativeElement as HTMLElement).querySelectorAll('nav a')].map((a) => a.getAttribute('href'));
    expect(hrefs).toEqual(expect.arrayContaining(['/', '/about', '/products/water-softeners', '/blog', '/contact']));
  });

  it('toggles the mobile menu and submenu with correct aria-expanded', async () => {
    const fixture = TestBed.createComponent(Header);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    const toggle = el.querySelector<HTMLButtonElement>('.menu-toggle')!;
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    toggle.click();
    await fixture.whenStable();
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(el.querySelector('#main-nav')!.classList).toContain('is-open');

    const products = el.querySelector<HTMLButtonElement>('[data-group="Products"]')!;
    products.click();
    await fixture.whenStable();
    expect(products.getAttribute('aria-expanded')).toBe('true');

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await fixture.whenStable();
    expect(products.getAttribute('aria-expanded')).toBe('false');
  });
});
