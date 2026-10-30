import { ChangeDetectionStrategy, Component, DOCUMENT, ElementRef, PLATFORM_ID, effect, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { MAIN_NAV, NavGroup, isGroup } from '../../core/config/navigation';
import { SITE } from '../../core/config/site.config';
import { ButtonDirective } from '../ui/button';
import { Icon } from '../ui/icon';
import { ThemeSwitcher } from './theme-switcher';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, Icon, ButtonDirective, ThemeSwitcher],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:click)': 'onDocumentClick($event)',
    '(document:keydown.escape)': 'onEscape()',
    '(window:scroll)': 'onScroll()',
  },
})
export class Header {
  private readonly doc = inject(DOCUMENT);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  protected readonly nav = MAIN_NAV;
  protected readonly isGroup = isGroup;
  protected readonly site = SITE;
  protected readonly menuOpen = signal(false);
  protected readonly openGroup = signal<string | null>(null);
  protected readonly scrolled = signal(false);

  constructor() {
    inject(Router)
      .events.pipe(filter((e) => e instanceof NavigationEnd), takeUntilDestroyed())
      .subscribe(() => this.closeAll());

    // Lock page scroll behind the open mobile menu.
    effect(() => {
      const open = this.menuOpen();
      if (this.isBrowser) this.doc.body.style.overflow = open ? 'hidden' : '';
    });
  }

  toggleMenu(): void {
    this.menuOpen.update((v) => !v);
    if (!this.menuOpen()) this.openGroup.set(null);
  }

  toggleGroup(group: NavGroup): void {
    this.openGroup.update((current) => (current === group.label ? null : group.label));
  }

  groupId(group: NavGroup): string {
    return 'nav-' + group.label.toLowerCase().replace(/\W+/g, '-');
  }

  onScroll(): void {
    if (this.isBrowser) this.scrolled.set(this.doc.defaultView!.scrollY > 8);
  }

  onEscape(): void {
    if (this.openGroup()) {
      const label = this.openGroup();
      this.openGroup.set(null);
      this.host.nativeElement.querySelector<HTMLElement>(`[data-group="${label}"]`)?.focus();
    } else if (this.menuOpen()) {
      this.menuOpen.set(false);
      this.host.nativeElement.querySelector<HTMLElement>('.menu-toggle')?.focus();
    }
  }

  onDocumentClick(event: Event): void {
    if (this.openGroup() && !this.host.nativeElement.contains(event.target as Node)) this.openGroup.set(null);
  }

  private closeAll(): void {
    this.menuOpen.set(false);
    this.openGroup.set(null);
  }
}
