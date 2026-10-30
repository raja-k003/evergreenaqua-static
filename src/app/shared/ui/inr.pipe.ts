import { Pipe, PipeTransform } from '@angular/core';

const formatter = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

/** Formats rupees with Indian digit grouping: 120500 → ₹1,20,500. */
@Pipe({ name: 'inr' })
export class InrPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    return typeof value === 'number' && Number.isFinite(value) ? formatter.format(value) : '';
  }
}
