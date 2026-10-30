import { mpvSettings, softenerSize, softeningChemistry } from './calculator.logic';

describe('calculator logic', () => {
  it('computes softening chemistry', () => {
    expect(softeningChemistry(25, 500)).toEqual({ outputBetweenRegen: '2500 Litres', saltPerRegen: '4 Kg', brineWater: '11 Litres' });
  });

  it('sizes a softener from daily use', () => {
    expect(softenerSize(1000, 300, 5)).toEqual({ resinQuantity: '30 Litres', regenDays: 5 });
  });

  it('computes MPV cycle times and codes', () => {
    const r = mpvSettings({ resinLitres: 100, hardnessPpm: 500, regenDays: 7, unit: 'Litres', control: 'Meter Immediate', signal: 'Interval Only' });
    expect(r.backwash).toBe('10 Minutes');
    expect(r.brineDraw).toBe('20 Minutes');
    expect(r.brineRefill).toBe('15 Minutes');
    expect(r.fastRinse).toBe('21 Minutes');
    expect(r.obr).toBe('10000 Litres / 2642 Gallons / 10 M³');
    expect([r.regenDays, r.unitCode, r.controlCode, r.signalCode]).toEqual(['H-7D', 'HU-03', 'A-02', 'b-02']);
  });

  it('maps the remaining unit/mode codes', () => {
    const base = { resinLitres: 10, hardnessPpm: 100, regenDays: 3 } as const;
    expect(mpvSettings({ ...base, unit: 'Gallons', control: 'Meter Delayed', signal: 'Regeneration Only' })).toMatchObject({ unitCode: 'HU-02', controlCode: 'A-01', signalCode: 'b-01' });
    expect(mpvSettings({ ...base, unit: 'M³', control: 'Meter Delayed', signal: 'Regeneration Only' }).unitCode).toBe('HU-01');
  });
});
