/** Rules of thumb ported from the previous Evergreen Aqua calculator. All outputs are rounded to whole numbers. */

const GALLON_IN_LITRES = 3.78541;
const LITRES_PER_CUBIC_METRE = 1000;
/** Hardness capacity of one litre of softener resin, in ppm-litres. */
const RESIN_CAPACITY = 50000;

const whole = (n: number): string => n.toFixed(0);

export interface ChemistryResult {
  outputBetweenRegen: string;
  saltPerRegen: string;
  brineWater: string;
}

/** Output between regenerations, salt and brine water from resin volume (L) and hardness (ppm). */
export function softeningChemistry(resinLitres: number, hardnessPpm: number): ChemistryResult {
  const outputLitres = (resinLitres * RESIN_CAPACITY) / hardnessPpm;
  const saltKg = (resinLitres * 150) / 1000;
  return {
    outputBetweenRegen: `${whole(outputLitres)} Litres`,
    saltPerRegen: `${whole(saltKg)} Kg`,
    brineWater: `${whole(saltKg * 3)} Litres`,
  };
}

export interface SizeResult {
  resinQuantity: string;
  regenDays: number;
}

/** Resin volume needed for a given daily use (L), hardness (ppm) and regeneration interval (days). */
export function softenerSize(dailyUseLitres: number, hardnessPpm: number, regenDays: number): SizeResult {
  return {
    resinQuantity: `${whole((regenDays * dailyUseLitres * hardnessPpm) / RESIN_CAPACITY)} Litres`,
    regenDays,
  };
}

export type WaterUnit = 'M³' | 'Gallons' | 'Litres';
export type ControlMode = 'Meter Delayed' | 'Meter Immediate';
export type SignalMode = 'Regeneration Only' | 'Interval Only';

export interface MvpInput {
  resinLitres: number;
  hardnessPpm: number;
  regenDays: number;
  unit: WaterUnit;
  control: ControlMode;
  signal: SignalMode;
}

export interface MvpResult {
  backwash: string;
  brineDraw: string;
  brineRefill: string;
  fastRinse: string;
  obr: string;
  regenDays: string;
  unitCode: string;
  controlCode: string;
  signalCode: string;
}

/** Multiport-valve (MPV) cycle times and setting codes. */
export function mpvSettings(i: MvpInput): MvpResult {
  const obrLitres = Math.round((RESIN_CAPACITY * i.resinLitres) / i.hardnessPpm);
  return {
    backwash: `${whole(i.resinLitres * 0.1)} Minutes`,
    brineDraw: `${whole(i.resinLitres * 0.2)} Minutes`,
    brineRefill: `${whole(i.resinLitres * 0.15)} Minutes`,
    fastRinse: `${whole(i.resinLitres * 0.21)} Minutes`,
    obr: `${obrLitres} Litres / ${whole(obrLitres / GALLON_IN_LITRES)} Gallons / ${whole(obrLitres / LITRES_PER_CUBIC_METRE)} M³`,
    regenDays: `H-${i.regenDays}D`,
    unitCode: i.unit === 'Litres' ? 'HU-03' : i.unit === 'Gallons' ? 'HU-02' : 'HU-01',
    controlCode: i.control === 'Meter Delayed' ? 'A-01' : 'A-02',
    signalCode: i.signal === 'Interval Only' ? 'b-02' : 'b-01',
  };
}
