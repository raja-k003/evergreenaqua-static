import { image, SiteImage } from './images';

export type ProductCategory = 'softeners' | 'filters' | 'purifiers';

export const PRODUCT_CATEGORIES: { id: ProductCategory; label: string }[] = [
  { id: 'softeners', label: 'Water softeners' },
  { id: 'filters', label: 'Filters' },
  { id: 'purifiers', label: 'RO purifiers' },
];

export interface ProductModel {
  model: string;
  operation: 'Automatic' | 'Manual';
  mrp: number;
}

export interface Product {
  slug: string;
  name: string;
  category: ProductCategory;
  seoTitle: string;
  seoDescription: string;
  h1: string;
  summary: string;
  intro: string[];
  benefits: string[];
  features: string[];
  /** Short checklist shown on product cards (mirrors the previous site). */
  highlightsTitle: string;
  highlights: string[];
  removes?: string[];
  models?: ProductModel[];
  image: SiteImage;
  related: string[];
  faqs: { q: string; a: string }[];
}

export const PRODUCTS: Product[] = [
  {
    slug: 'water-softeners',
    name: 'Water Softener',
    category: 'softeners',
    seoTitle: 'Water Softener for Home in Chennai – Prices & Models',
    seoDescription:
      'Automatic and manual water softeners from ₹41,900. Remove calcium and magnesium hardness, stop scale on taps and geysers. Installed across Chennai.',
    h1: 'Water softeners for homes and apartments',
    summary: 'Removes calcium and magnesium hardness to stop scale on pipes, taps, geysers and appliances.',
    intro: [
      'Hard water carries dissolved calcium and magnesium. When it is heated or left to dry, those minerals leave white scale on taps, tiles, shower heads and the heating element of your geyser. An Evergreen Aqua water softener removes the hardness before it reaches your plumbing.',
      'Our softeners use food-grade ion-exchange resin. Hard water passes through the resin bed, which holds back calcium and magnesium and releases softened water. When the resin is saturated it is recharged with a simple brine wash — automatically on A-series models, or with a manual valve on M-series models.',
    ],
    benefits: [
      'Less scale on bathroom fittings, tiles and taps',
      'Geysers and washing machines heat and run more efficiently',
      'Soap, shampoo and detergent lather better, so you use less',
      'Less staining and corrosion on vessels and utensils',
      'Softer-feeling skin, hair and clothes',
    ],
    features: ['Low recurring cost', 'Low recharge frequency', 'Handles excessive hardness', 'No electricity required on manual models', 'No civil work for installation', '1-year warranty'],
    highlightsTitle: 'Benefits of water softener',
    highlights: ['Limescale prevention', 'Softer skin and hair', 'Cleaner and brighter fabrics', 'Low recurring cost', 'Low recharge frequency', 'Softens excessive hardness'],
    models: [
      { model: 'SF 20M', operation: 'Manual', mrp: 41900 },
      { model: 'SF 30M', operation: 'Manual', mrp: 52500 },
      { model: 'SF 60M', operation: 'Manual', mrp: 81500 },
      { model: 'SF 90M', operation: 'Manual', mrp: 130700 },
      { model: 'SF 140M', operation: 'Manual', mrp: 170900 },
      { model: 'SF 20A', operation: 'Automatic', mrp: 62500 },
      { model: 'SF 30A', operation: 'Automatic', mrp: 72900 },
      { model: 'SF 60A', operation: 'Automatic', mrp: 120500 },
      { model: 'SF 90A', operation: 'Automatic', mrp: 150200 },
      { model: 'SF 140A', operation: 'Automatic', mrp: 210900 },
    ],
    image: image('water-softener', 'Evergreen Aqua water softener vessel with control valve'),
    related: ['purolite-softener-resin', 'sand-filters', 'iron-filters'],
    faqs: [
      { q: 'Which softener size do I need?', a: 'It depends on your daily water use and the hardness of your supply. We test your water on site and recommend a model; smaller homes usually suit the 20 or 30 series, apartments and villas the larger series.' },
      { q: 'What is the difference between A and M models?', a: 'A-series models recharge automatically on a schedule. M-series models are recharged with a manual valve and need no electricity.' },
    ],
  },
  {
    slug: 'purolite-softener-resin',
    name: 'Purolite Water Softener Resin',
    category: 'softeners',
    seoTitle: 'Purolite Water Softener Resin – Food-Grade Replacement Resin',
    seoDescription:
      'Food-grade Purolite ion-exchange resin for water softeners. Handles up to 1500 ppm hardness. Resin replacement and recharging service in Chennai.',
    h1: 'Purolite water softener resin',
    summary: 'Premium food-grade ion-exchange resin, rated for hardness up to 1500 ppm.',
    intro: [
      'The resin is the working part of every water softener. Purolite resin is a synthetic polymer bead used in water treatment plants worldwide for its consistent ion-exchange performance.',
      'We use Purolite resin in our own softeners and supply it for resin replacement in existing units. Fresh resin restores softening capacity in older systems that no longer keep up with your water hardness.',
    ],
    benefits: ['Restores softening capacity in older units', 'Consistent, predictable ion exchange', 'Long service life with regular recharging'],
    features: ['Premium food-grade resin', 'Rated for up to 1500 ppm hardness', 'Anti-scalant resin'],
    highlightsTitle: 'Features of resin',
    highlights: ['Premium food-grade resin', '1500 PPM hardness', 'Anti-scalant resin'],
    image: image('purolite-softener-resin', 'Purolite ion-exchange water softener resin beads'),
    related: ['water-softeners', 'sand-filters'],
    faqs: [{ q: 'When should resin be replaced?', a: 'If softened water starts leaving scale again even after regular recharging, the resin may be exhausted or fouled. We can test it and replace it on site.' }],
  },
  {
    slug: 'sand-filters',
    name: 'Sand Filter',
    category: 'filters',
    seoTitle: 'Sand Filter for Borewell & Sump Water – Prices',
    seoDescription:
      'Multi-grade sand filters from ₹29,000 that remove mud, silt and suspended particles from borewell and sump water. Zero maintenance, no recurring cost.',
    h1: 'Sand filters for clear borewell and sump water',
    summary: 'Traps mud, silt and suspended particles for visibly clearer water.',
    intro: [
      'Borewell and tanker water often carries fine mud, silt and other suspended solids. A sand filter passes the water through graded layers of filter media that trap these particles, giving you clear water and protecting the softener, pumps and fittings downstream.',
      'A periodic backwash flushes the trapped dirt out of the media, so there are no cartridges to buy and no recurring cost.',
    ],
    benefits: ['Effective removal of suspended particles', 'Visibly clearer water', 'Protects softeners, pumps and fittings', 'Long, high-capacity service life'],
    features: ['No recurring cost', 'Zero maintenance beyond backwash', 'Continuous service flow', 'No electricity required'],
    highlightsTitle: 'Benefits of sand filter',
    highlights: ['Effective particle removal', 'Improved water clarity', 'Extended equipment life', 'No recurring cost', 'Low recharge frequency', 'Softens excessive hardness'],
    models: [
      { model: 'SF 20M', operation: 'Manual', mrp: 29000 },
      { model: 'SF 20A', operation: 'Automatic', mrp: 39400 },
    ],
    image: image('sand-filter', 'Evergreen Aqua multi-grade sand filter vessel'),
    related: ['iron-filters', 'carbon-filters', 'water-softeners'],
    faqs: [{ q: 'Do I need a sand filter before a softener?', a: 'If your water is muddy or carries silt, yes. Removing particles first protects the softener resin and keeps it working efficiently.' }],
  },
  {
    slug: 'iron-filters',
    name: 'Iron Filter',
    category: 'filters',
    seoTitle: 'Iron Removal Filter for Borewell Water in Chennai',
    seoDescription:
      'Iron removal filters that stop yellow and brown stains, metallic smell and clogged fittings caused by iron and manganese in borewell water.',
    h1: 'Iron removal filters for borewell water',
    summary: 'Removes iron and manganese that cause yellow stains, metallic smell and clogged fittings.',
    intro: [
      'Iron in groundwater is the usual cause of yellow or brown stains on buckets, tiles and clothes, a metallic smell, and shower heads and taps that slowly clog. An iron filter oxidises dissolved iron and manganese and traps them in the filter media.',
      'Removing iron also protects a downstream water softener, because iron can foul softener resin over time.',
    ],
    benefits: ['Prevents yellow and brown staining', 'Reduces metallic odour', 'Keeps pipes, taps and shower heads from clogging', 'Protects softener resin and appliances'],
    features: ['Low recurring cost', 'Low recharge frequency', 'No electricity required'],
    highlightsTitle: 'Benefits of iron filter',
    highlights: ['Appliance protection', 'Stain prevention', 'Odour elimination', 'No recurring cost', 'Low recharge frequency', 'Softens excessive hardness'],
    removes: ['Dissolved iron', 'Manganese'],
    image: image('iron-filter', 'Evergreen Aqua iron removal filter for borewell water'),
    related: ['sand-filters', 'water-softeners', 'carbon-filters'],
    faqs: [{ q: 'How do I know if my water has iron?', a: 'Yellow or brown stains on white buckets and tiles, a metallic taste or smell, and water that turns cloudy after standing are common signs. We test iron levels on site.' }],
  },
  {
    slug: 'carbon-filters',
    name: 'Carbon Filter',
    category: 'filters',
    seoTitle: 'Activated Carbon Filter – Remove Odour, Taste & Chemicals',
    seoDescription:
      'Activated carbon filters that remove bad odour, taste, colour, chlorine and organic chemicals from water. No recurring cost, zero maintenance.',
    h1: 'Activated carbon filters for better taste and odour',
    summary: 'Activated carbon removes odour, bad taste, colour and many organic chemicals.',
    intro: [
      'Activated carbon has an enormous internal surface area that adsorbs many dissolved contaminants as water passes through it. A whole-house carbon filter improves the smell, taste and colour of the water at every tap.',
      'Carbon filtration works well after a sand or iron filter, which remove the particles that would otherwise clog the carbon bed.',
    ],
    benefits: ['Removes bad odour and taste', 'Reduces colour', 'Removes chlorine and many organic chemicals'],
    features: ['No recurring cost', 'Zero maintenance', 'No electricity required'],
    highlightsTitle: 'Benefits of carbon filter',
    highlights: ['Chemical removal', 'Odour reduction', 'Improved taste', 'No recurring cost', 'Low recharge frequency', 'Softens excessive hardness'],
    removes: ['Odour and bad taste', 'Colour', 'Chlorine', 'Organic chemicals', 'Some pesticides'],
    image: image('carbon-filter', 'Evergreen Aqua activated carbon filter vessel'),
    related: ['sand-filters', 'iron-filters', 'water-softeners'],
    faqs: [{ q: 'Does a carbon filter make water safe to drink?', a: 'A carbon filter improves taste and odour and removes many chemicals, but it does not remove dissolved salts or all microorganisms. For drinking water we recommend an RO + UV purifier.' }],
  },
];

export const PRODUCT_SLUGS = new Set(PRODUCTS.map((p) => p.slug));

export const findProduct = (slug: string | null | undefined): Product | undefined =>
  slug ? PRODUCTS.find((p) => p.slug === slug) : undefined;

export const lowestPrice = (p: Product): number | undefined =>
  p.models?.length ? Math.min(...p.models.map((m) => m.mrp)) : undefined;

export const highestPrice = (p: Product): number | undefined =>
  p.models?.length ? Math.max(...p.models.map((m) => m.mrp)) : undefined;
