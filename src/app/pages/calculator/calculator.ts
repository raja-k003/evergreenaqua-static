import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PAGES } from '../../core/config/pages';
import { crumbs } from '../../core/seo/breadcrumbs';
import { SeoService } from '../../core/seo/seo.service';
import { ButtonDirective } from '../../shared/ui/button';
import { Icon } from '../../shared/ui/icon';
import { PageHeader } from '../../shared/ui/page-header';
import {
  ChemistryResult,
  ControlMode,
  MvpResult,
  SignalMode,
  SizeResult,
  WaterUnit,
  mpvSettings,
  softenerSize,
  softeningChemistry,
} from './calculator.logic';

type TabId = 'chemistry' | 'size' | 'mpv';

const positive = [Validators.required, Validators.min(0.01)];
const num = () => new FormControl<number | null>(null, positive);

@Component({
  selector: 'app-calculator',
  imports: [NgTemplateOutlet, ReactiveFormsModule, RouterLink, PageHeader, ButtonDirective, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calculator.html',
  styleUrl: './calculator.scss',
})
export class Calculator {
  protected readonly breadcrumbs = crumbs({ label: 'Softener calculator' });

  protected readonly tabs: { id: TabId; label: string; title: string; text: string }[] = [
    {
      id: 'chemistry',
      label: 'WS chemistry',
      title: 'Calculate water softening chemistry',
      text: 'Work out salt dosage and the output between regenerations from your resin quantity (litres) and incoming water hardness (PPM), so hardness is removed efficiently and soft water stays consistent.',
    },
    {
      id: 'size',
      label: 'WS size',
      title: 'Identify the required water softener size',
      text: 'Find the right softener size from daily water use (litres), water hardness (PPM) and your preferred regeneration frequency (days) for continuous soft water and efficient long-term performance.',
    },
    {
      id: 'mpv',
      label: 'Softener MPV',
      title: 'Calculate softener MPV settings and variables',
      text: 'Get multiport-valve cycle times and setting codes from the unit of water, control mode and signal output mode, for precise regeneration timing and consistent soft water.',
    },
  ];

  protected readonly active = signal<TabId>('chemistry');
  protected readonly submitted = signal(false);

  protected readonly chemistryForm = new FormGroup({ resin: num(), hardness: num() });
  protected readonly sizeForm = new FormGroup({ dailyUse: num(), hardness: num(), regenDays: num() });
  protected readonly mpvForm = new FormGroup({
    resin: num(),
    hardness: num(),
    regenDays: num(),
    unit: new FormControl<WaterUnit>('M³', { nonNullable: true }),
    control: new FormControl<ControlMode>('Meter Delayed', { nonNullable: true }),
    signal: new FormControl<SignalMode>('Regeneration Only', { nonNullable: true }),
  });

  protected readonly chemistry = signal<ChemistryResult | null>(null);
  protected readonly size = signal<SizeResult | null>(null);
  protected readonly mpv = signal<MvpResult | null>(null);

  constructor() {
    const p = PAGES.calculator;
    inject(SeoService).setPage({ title: p.title, description: p.description, path: p.path, breadcrumbs: this.breadcrumbs });
  }

  protected select(id: TabId): void {
    this.active.set(id);
    this.submitted.set(false);
  }

  /** Roving-tabindex keyboard support for the tablist. */
  protected onTabKey(event: KeyboardEvent, index: number): void {
    const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const next = (index + step + this.tabs.length) % this.tabs.length;
    this.select(this.tabs[next].id);
    (event.currentTarget as HTMLElement).parentElement?.querySelectorAll<HTMLElement>('[role=tab]')[next]?.focus();
  }

  protected invalid(c: AbstractControl | null): boolean {
    return !!c && c.invalid && (c.touched || this.submitted());
  }

  protected calculateChemistry(): void {
    this.submitted.set(true);
    if (this.chemistryForm.invalid) return;
    const { resin, hardness } = this.chemistryForm.getRawValue();
    this.chemistry.set(softeningChemistry(resin!, hardness!));
    this.submitted.set(false);
  }

  protected calculateSize(): void {
    this.submitted.set(true);
    if (this.sizeForm.invalid) return;
    const { dailyUse, hardness, regenDays } = this.sizeForm.getRawValue();
    this.size.set(softenerSize(dailyUse!, hardness!, regenDays!));
    this.submitted.set(false);
  }

  protected calculateMpv(): void {
    this.submitted.set(true);
    if (this.mpvForm.invalid) return;
    const v = this.mpvForm.getRawValue();
    this.mpv.set(mpvSettings({ resinLitres: v.resin!, hardnessPpm: v.hardness!, regenDays: v.regenDays!, unit: v.unit, control: v.control, signal: v.signal }));
    this.submitted.set(false);
  }

  protected reset(): void {
    const id = this.active();
    if (id === 'chemistry') { this.chemistryForm.reset(); this.chemistry.set(null); }
    else if (id === 'size') { this.sizeForm.reset(); this.size.set(null); }
    else { this.mpvForm.reset({ unit: 'M³', control: 'Meter Delayed', signal: 'Regeneration Only' }); this.mpv.set(null); }
    this.submitted.set(false);
  }
}
