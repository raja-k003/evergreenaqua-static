import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { COMPANY_LINKS, PRODUCT_LINKS } from '../../core/config/navigation';
import { SITE, fullAddress, whatsappLink } from '../../core/config/site.config';
import { Icon } from '../ui/icon';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="site-footer" (pointermove)="track($event)">
      <div class="fx" aria-hidden="true">
        <svg class="wave w1" viewBox="0 0 2400 120" preserveAspectRatio="none"><path d="M0 60 Q300 0 600 60 T1200 60 T1800 60 T2400 60 V0 H0Z"/></svg>
        <svg class="wave w2" viewBox="0 0 2400 120" preserveAspectRatio="none"><path d="M0 50 Q300 110 600 50 T1200 50 T1800 50 T2400 50 V0 H0Z"/></svg>
        <span class="glow g1"></span><span class="glow g2"></span><span class="glow g3"></span><span class="spot"></span><span class="sheen"></span>
        @for (b of bubbles; track b) {
          <i class="bubble" [style.--i]="b"></i>
        }
      </div>
      <div class="container cols">
        <section class="about" aria-labelledby="footer-brand">
          <p id="footer-brand" class="brand">Evergreen Aqua</p>
          <p class="muted">Water softeners, sand, iron and carbon filters and RO purifiers for Chennai homes and businesses — {{ site.yearsOfExperience }} years of experience.</p>
          <p class="social-title">Follow &amp; connect</p>
          <ul class="social">
            @for (s of socials; track s.name) {
              <li>
                <a class="soc" [class]="'soc soc--' + s.key" [href]="s.url" [attr.target]="s.external ? '_blank' : null" [attr.rel]="s.external ? 'noopener' : null" [attr.data-tip]="s.name">
                  <app-icon [name]="s.icon" [size]="20" [label]="s.label" />
                </a>
              </li>
            }
          </ul>
        </section>

        <nav aria-labelledby="footer-products">
          <h2 id="footer-products">Products</h2>
          <ul class="links">
            @for (l of productLinks; track l.path) {
              <li><a [routerLink]="l.path">{{ l.label }}</a></li>
            }
          </ul>
        </nav>

        <nav aria-labelledby="footer-company">
          <h2 id="footer-company">Company</h2>
          <ul class="links">
            @for (l of companyLinks; track l.path) {
              <li><a [routerLink]="l.path">{{ l.label }}</a></li>
            }
          </ul>
        </nav>

        <nav aria-labelledby="footer-explore">
          <h2 id="footer-explore">Explore</h2>
          <ul class="links">
            @for (l of exploreLinks; track l.path) {
              <li><a [routerLink]="l.path">{{ l.label }}</a></li>
            }
          </ul>
        </nav>

        <section aria-labelledby="footer-contact">
          <h2 id="footer-contact">Contact</h2>
          <address>
            <p class="row"><app-icon name="pin" [size]="18" /><span>{{ address }}</span></p>
            @for (p of site.phones; track p.e164) {
              <p class="row"><app-icon name="phone" [size]="18" /><a [href]="'tel:' + p.e164">{{ p.display }}</a></p>
            }
            <p class="row"><app-icon name="mail" [size]="18" /><a [href]="'mailto:' + site.email">{{ site.email }}</a></p>
            <p class="row"><app-icon name="clock" [size]="18" /><span>{{ site.hours.label }}</span></p>
          </address>
        </section>
      </div>
      <div class="container bottom">
        <p>© {{ year }} {{ site.legalName }}. All rights reserved.</p>
        <div class="bottom__right">
          <a routerLink="/contact">Contact us</a>
          <button type="button" class="top" (click)="toTop()" aria-label="Back to top"><app-icon name="arrow-up" [size]="18" /></button>
        </div>
      </div>
    </footer>

    <a class="wa-fab" [href]="wa" target="_blank" rel="noopener">
      <app-icon name="whatsapp" [size]="26" label="Chat with us on WhatsApp (opens in a new tab)" />
    </a>
  `,
  styles: `
    .site-footer {
      --f-deep: color-mix(in srgb, var(--color-primary) 38%, #020617);
      --f-mid: color-mix(in srgb, var(--color-primary) 62%, #020617);
      --f-glow: var(--color-accent, var(--color-primary));
      --f-text: #eef4ff; --f-muted: color-mix(in srgb, #eef4ff 68%, var(--f-deep)); --f-accent: color-mix(in srgb, var(--f-glow) 55%, #fff); --f-line: rgb(255 255 255 / .16);
      --mx: 50%; --my: 60%;
      position: relative; isolation: isolate; overflow: hidden; margin-top: auto; font-size: var(--font-size-sm);
      color: var(--f-text);
      background: linear-gradient(115deg, var(--f-deep), var(--f-mid), var(--f-deep), color-mix(in srgb, var(--f-glow) 30%, var(--f-deep)));
      background-size: 300% 300%; animation: flow 14s ease-in-out infinite;
    }
    .site-footer > .container { position: relative; z-index: 1; }
    .fx { position: absolute; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }
    .fx::before { content: ''; position: absolute; inset: 0 0 auto; height: 1.5rem; background: var(--color-bg, #fff); }
    .wave { position: absolute; top: -1px; left: 0; width: 200%; height: 3.5rem; fill: var(--color-bg, #fff); animation: drift 9s linear infinite, bob 5s ease-in-out infinite; }
    .w2 { opacity: .55; height: 4.25rem; animation: drift 15s linear infinite reverse, bob 7s ease-in-out infinite alternate; fill: var(--color-bg, #fff); }
    .glow { position: absolute; border-radius: 50%; filter: blur(70px); opacity: .45; animation: float 9s ease-in-out infinite alternate; }
    .g1 { width: 26rem; height: 26rem; left: -6rem; bottom: -10rem; background: var(--f-glow); }
    .g3 { width: 18rem; height: 18rem; left: 40%; top: -4rem; background: color-mix(in srgb, var(--f-glow) 60%, #fff); opacity: .18; animation-duration: 11s; animation-delay: -3s; }
    .g2 { width: 22rem; height: 22rem; right: -5rem; top: 30%; background: color-mix(in srgb, var(--f-glow) 50%, #2dd4bf); opacity: .3; animation-delay: -6s; }
    .bubble { position: absolute; bottom: -2rem; left: calc(var(--i) * 9%); width: calc(.4rem + var(--i) * .12rem); aspect-ratio: 1; border-radius: 50%;
      border: 1px solid rgb(190 235 255 / .5); background: radial-gradient(circle at 30% 30%, rgb(255 255 255 / .35), transparent 60%);
      animation: rise calc(6s + var(--i) * 1s) linear infinite; animation-delay: calc(var(--i) * -1.7s); }
    .spot { position: absolute; inset: 0; background: radial-gradient(22rem circle at var(--mx) var(--my), color-mix(in srgb, var(--f-glow) 38%, transparent), transparent 70%); transition: background-position .2s; }
    .sheen { position: absolute; inset: 0; background: linear-gradient(105deg, transparent 40%, rgb(255 255 255 / .09) 50%, transparent 60%); background-size: 250% 100%; animation: sheen 7s ease-in-out infinite; }
    @keyframes flow { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
    @keyframes sheen { from { background-position: 150% 0; } to { background-position: -50% 0; } }
    @keyframes bob { 50% { translate: 0 .45rem; } }
    @keyframes drift { to { transform: translateX(-50%); } }
    @keyframes float { to { transform: translate(7rem, -5rem) scale(1.3); } }
    @keyframes rise { 0% { transform: translateY(0) translateX(0); opacity: 0; } 15% { opacity: .9; } 100% { transform: translateY(-26rem) translateX(1.5rem); opacity: 0; } }
    @media (prefers-reduced-motion: reduce) { .site-footer, .wave, .glow, .bubble, .sheen { animation: none; } .spot { display: none; } .bubble { display: none; } }

    .cols { display: grid; gap: 2rem; padding-block: 6rem 2.5rem; grid-template-columns: repeat(auto-fit, minmax(min(100%, 12rem), 1fr)); }
    @media (min-width: 1100px) { .cols { grid-template-columns: 1.5fr 1fr 1fr .9fr 1.5fr; } }
    .brand { font-weight: 800; font-size: 1.125rem; margin-bottom: .5rem; background: linear-gradient(90deg, #fff, var(--f-accent)); -webkit-background-clip: text; background-clip: text; color: transparent; }
    .muted { color: var(--f-muted); }
    h2 { font-size: var(--font-size-xs); text-transform: uppercase; letter-spacing: .08em; color: var(--f-accent); margin-bottom: 1rem; }
    ul { list-style: none; padding: 0; margin: 0; display: grid; gap: .5rem; }
    a { color: var(--f-text); text-decoration: none; transition: color var(--transition), transform var(--transition); }
    h2 { position: relative; padding-bottom: .6rem; }
    h2::after { content: ''; position: absolute; left: 0; bottom: 0; width: 1.75rem; height: 2px; border-radius: 2px; background: var(--f-accent); transition: width .3s ease; }
    nav:hover h2::after { width: 3rem; }
    .links { gap: .15rem; }
    .links a { position: relative; display: inline-flex; align-items: center; padding: .3rem 0 .3rem 0; transition: color .25s ease, padding-left .25s ease; }
    .links a::before { content: ''; position: absolute; left: 0; top: 50%; width: 0; height: 2px; border-radius: 2px; translate: 0 -50%; background: var(--f-accent); transition: width .25s ease; }
    .links a:hover, .links a:focus-visible { color: var(--f-accent); padding-left: 1.1rem; transform: none; }
    .links a:hover::before, .links a:focus-visible::before { width: .75rem; }
    .links a[aria-current='page'] { color: var(--f-accent); font-weight: 700; }
    address a:hover, .bottom a:hover { color: var(--f-accent); text-decoration: underline; }
    address { font-style: normal; padding: 1rem 1.1rem; border-radius: var(--radius-md); border: 1px solid var(--f-line);
      background: rgb(255 255 255 / .05); backdrop-filter: blur(8px); }
    .row { display: flex; gap: .6rem; align-items: flex-start; margin-bottom: .6rem; }
    .row:last-child { margin-bottom: 0; }
    .row app-icon { color: var(--f-accent); margin-top: .2rem; }
    .social-title { margin: 1.1rem 0 0; font-size: var(--font-size-xs); font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--f-accent); }
    .social { display: flex; flex-wrap: wrap; gap: .6rem; margin-top: .75rem; }
    .soc { position: relative; display: grid; place-items: center; width: 2.75rem; height: 2.75rem; border-radius: 50%; border: 1px solid var(--f-line); color: var(--f-text); background: rgb(255 255 255 / .07); backdrop-filter: blur(6px);
      transition: transform .3s cubic-bezier(.3, 1.6, .5, 1), background .25s ease, border-color .25s ease, box-shadow .25s ease, color .25s ease; }
    .soc:hover, .soc:focus-visible { transform: translateY(-5px) scale(1.08); color: #fff; border-color: transparent; text-decoration: none; }
    .soc--facebook:hover, .soc--facebook:focus-visible { background: #1877f2; box-shadow: 0 10px 22px rgb(24 119 242 / .5); }
    .soc--instagram:hover, .soc--instagram:focus-visible { background: linear-gradient(45deg, #f9ce34, #ee2a7b 55%, #6228d7); box-shadow: 0 10px 22px rgb(238 42 123 / .45); }
    .soc--youtube:hover, .soc--youtube:focus-visible { background: #ff0000; box-shadow: 0 10px 22px rgb(255 0 0 / .45); }
    .soc--whatsapp:hover, .soc--whatsapp:focus-visible { background: #25d366; box-shadow: 0 10px 22px rgb(37 211 102 / .5); }
    .soc--linkedin:hover, .soc--linkedin:focus-visible { background: #0a66c2; box-shadow: 0 10px 22px rgb(10 102 194 / .5); }
    .soc--twitter:hover, .soc--twitter:focus-visible { background: #0f1419; box-shadow: 0 10px 22px rgb(0 0 0 / .5); }
    /* tooltip */
    .soc::after { content: attr(data-tip); position: absolute; bottom: calc(100% + .5rem); left: 50%; translate: -50% .3rem; padding: .25rem .6rem; border-radius: .5rem; font-size: var(--font-size-xs); font-weight: 600; white-space: nowrap; color: var(--f-deep); background: #fff; opacity: 0; pointer-events: none; transition: opacity .2s ease, translate .2s ease; }
    .soc:hover::after, .soc:focus-visible::after { opacity: 1; translate: -50% 0; }
    .bottom { display: flex; flex-wrap: wrap; justify-content: space-between; gap: .5rem; padding-block: 1.25rem; border-top: 1px solid var(--f-line); color: var(--f-muted); }
    .bottom p { margin: 0; }
    .bottom__right { display: flex; align-items: center; gap: 1rem; }
    .top { display: grid; place-items: center; width: 2.5rem; height: 2.5rem; padding: 0; border-radius: 50%; border: 1px solid var(--f-line); color: var(--f-text); background: rgb(255 255 255 / .07); cursor: pointer; transition: transform .3s cubic-bezier(.3, 1.6, .5, 1), background .25s ease, color .25s ease; }
    .top:hover, .top:focus-visible { transform: translateY(-4px); background: var(--f-accent); color: var(--f-deep); }
    @media (prefers-reduced-motion: reduce) { .soc, .top, .links a, h2::after { transition: none; } .soc::after { transition: none; } }
    .wa-fab { position: fixed; right: 1rem; bottom: 1rem; z-index: 40; display: grid; place-items: center; width: 3.5rem; height: 3.5rem; border-radius: 50%; background: #1f7a4d; color: #fff; box-shadow: var(--shadow-lg); }
    .wa-fab:hover { background: #17603c; color: #fff; }
  `,
})
export class Footer {
  protected toTop(): void {
    window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }

  protected track(e: PointerEvent): void {
    const el = e.currentTarget as HTMLElement;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  }

  protected readonly site = SITE;
  protected readonly productLinks = PRODUCT_LINKS;
  protected readonly companyLinks = COMPANY_LINKS;
  protected readonly exploreLinks = [
    { label: 'Services', path: '/services' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Blog', path: '/blog' },
    { label: 'Contact us', path: '/contact' },
  ];
  /** Social profiles from the site config, plus direct WhatsApp chat. Add more entries to SITE.social (linkedin / twitter icons are available). */
  protected readonly socials = [
    ...SITE.social.map((s) => ({ key: s.icon, name: s.name, url: s.url, icon: s.icon, external: true, label: `Evergreen Aqua on ${s.name} (opens in a new tab)` })),
    { key: 'whatsapp', name: 'WhatsApp', url: whatsappLink(), icon: 'whatsapp', external: true, label: 'Chat with Evergreen Aqua on WhatsApp (opens in a new tab)' },
  ];
  protected readonly address = fullAddress();
  protected readonly wa = whatsappLink();
  protected readonly bubbles = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  protected readonly year = new Date().getFullYear();
}
