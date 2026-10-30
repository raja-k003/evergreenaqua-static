/**
 * Article bodies, kept apart from the post metadata so the list pages, router
 * and home page don't ship every article's full text in the main bundle.
 * Imported only by the lazy blog-post page.
 */
export type BlogBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'ul'; items: string[] };

export const BLOG_BODIES: Record<string, BlogBlock[]> = {
  'signs-of-hard-water': [
    { type: 'p', text: 'Hard water is water with a high level of dissolved calcium and magnesium. It is perfectly common in borewell and groundwater supplies, and while it is not usually a health risk, it causes a long list of everyday problems around the home.' },
    { type: 'h2', text: 'Five signs you have hard water' },
    { type: 'h3', text: '1. Scale on taps and fixtures' },
    { type: 'p', text: 'A chalky white or off-white crust around taps, shower heads and tiles is mineral scale left behind when hard water evaporates.' },
    { type: 'h3', text: '2. Soap scum in the bathroom' },
    { type: 'p', text: 'Calcium and magnesium react with soap to form a sticky film on buckets, tubs and shower screens that is hard to wipe away.' },
    { type: 'h3', text: '3. Stiff, dull laundry' },
    { type: 'p', text: 'Minerals stay trapped in fabric after washing, leaving clothes and towels rough and colours faded.' },
    { type: 'h3', text: '4. Clogged pipes and low flow' },
    { type: 'p', text: 'Over time scale narrows pipes and blocks shower-head nozzles, reducing water pressure.' },
    { type: 'h3', text: '5. Spots on glasses and dishes' },
    { type: 'p', text: 'Glassware and steel vessels come out of the wash with white spots and streaks.' },
    { type: 'h2', text: 'Why a water softener is the fix' },
    { type: 'ul', items: [
      'Appliances last longer: geysers, washing machines and dishwashers are protected from scale.',
      'Plumbing stays clear: no new scale builds up inside pipes and fittings.',
      'Skin and hair feel softer because soap rinses away cleanly.',
      'You use less soap, shampoo and detergent.',
    ] },
    { type: 'p', text: 'If you are seeing two or more of these signs, a quick on-site water hardness test will tell you which softener size suits your home.' },
  ],
  'water-softener-maintenance-tips': [
    { type: 'p', text: 'Water softeners need very little attention, but a few simple checks will keep yours running efficiently and help it last for decades.' },
    { type: 'h2', text: 'Check the salt level' },
    { type: 'p', text: 'Keep the brine tank at least half full of salt. Without enough salt the resin cannot recharge and hard water will pass straight through.' },
    { type: 'h2', text: 'Use the right salt' },
    { type: 'p', text: 'Use clean softener salt pellets rather than rock salt. Rock salt contains insoluble impurities that settle as sludge in the tank.' },
    { type: 'h2', text: 'Break up salt bridges' },
    { type: 'p', text: 'Humidity can form a hard crust of salt above the water line. If the salt level never seems to drop, gently push a broom handle down through the salt to break the crust.' },
    { type: 'h2', text: 'Clean the brine tank and resin' },
    { type: 'ul', items: [
      'Empty and rinse the brine tank once a year to remove sludge.',
      'Use a resin cleaner periodically, especially if your water contains iron.',
      'Watch for “mushing” — a thick sludge at the bottom of the tank — and clean it out.',
    ] },
    { type: 'h2', text: 'Check for leaks and test your water' },
    { type: 'p', text: 'Look over valves and connections for drips, and test the hardness of your softened water every few months. If hardness creeps back up, it is time for a service visit.' },
  ],
  'choosing-the-right-water-softener': [
    { type: 'p', text: 'Buying a water softener is a long-term decision. These are the questions to answer before you choose a model.' },
    { type: 'h2', text: '1. Test your water hardness' },
    { type: 'p', text: 'Hardness, measured in ppm, decides how much work the softener has to do. Iron and suspended solids matter too, because they may need a filter ahead of the softener.' },
    { type: 'h2', text: '2. Choose the type of system' },
    { type: 'ul', items: [
      'Salt-based ion-exchange softeners remove hardness minerals and are the most effective option.',
      'Salt-free conditioners change how minerals behave but do not remove them.',
      'Dual-tank systems provide soft water continuously, even while one tank recharges.',
    ] },
    { type: 'h2', text: '3. Size capacity and flow rate' },
    { type: 'p', text: 'Match capacity to your daily water use and hardness, and make sure the flow rate can keep up when several taps run at once.' },
    { type: 'h2', text: '4. Decide how it regenerates' },
    { type: 'p', text: 'Automatic valves recharge on a timer or meter; manual valves cost less and need no electricity but rely on you to recharge on schedule.' },
    { type: 'h2', text: '5. Consider efficiency, maintenance and running cost' },
    { type: 'p', text: 'Look at salt and water used per recharge, how much maintenance the system needs, and what consumables cost over the years — not just the purchase price.' },
    { type: 'h2', text: '6. Read reviews and ask for a site test' },
    { type: 'p', text: 'Experiences from other customers and an on-site water test from the installer are the best guide to a system that will work for your home.' },
  ],
};
