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
  'iron-in-borewell-water': [
    { type: 'p', text: 'Iron is one of the most common contaminants in borewell and groundwater supplies. It is rarely harmful in small amounts, but it stains, tastes unpleasant and slowly damages plumbing and appliances.' },
    { type: 'h2', text: 'Signs of iron in your water' },
    { type: 'ul', items: [
      'Orange or rust-brown stains on tiles, sinks, toilets and laundry.',
      'A metallic taste in drinking water, tea and coffee.',
      'Water that runs clear from the tap but turns yellow or brown after standing.',
      'White clothes that turn dull yellow after washing.',
      'Reduced flow as iron deposits build up inside pipes.',
    ] },
    { type: 'h2', text: 'Why it happens' },
    { type: 'p', text: 'Dissolved iron is clear when it leaves the borewell. Once it meets air it oxidises into rust particles, which is why stains and discolouration appear after the water has been stored or exposed.' },
    { type: 'h2', text: 'How an iron removal filter helps' },
    { type: 'p', text: 'An iron filter oxidises dissolved iron and traps the particles in a media bed, which is cleaned by a regular backwash. The water that reaches your taps is clear and free of the metallic taste.' },
    { type: 'ul', items: [
      'Stains on fixtures, tiles and clothes stop building up.',
      'Pipes, geysers and washing machines are protected from rust deposits.',
      'Water tastes cleaner for drinking and cooking.',
    ] },
    { type: 'h2', text: 'Pair it with the right filters' },
    { type: 'p', text: 'Iron often comes with hardness or turbidity. An on-site water test will show whether you also need a softener or sand filter alongside the iron filter.' },
  ],
  'sand-and-carbon-filters-explained': [
    { type: 'p', text: 'Sand filters and activated carbon filters are often installed together, but they solve different problems. Knowing the difference helps you choose the right setup for your water.' },
    { type: 'h2', text: 'What a sand filter does' },
    { type: 'p', text: 'A sand filter removes suspended particles such as silt, mud and fine dirt, making cloudy water clear. It is usually the first stage, protecting every filter and appliance that comes after it.' },
    { type: 'ul', items: [
      'Removes turbidity and visible particles.',
      'Needs only a periodic backwash to stay clean.',
      'Protects softeners and carbon filters from clogging.',
    ] },
    { type: 'h2', text: 'What an activated carbon filter does' },
    { type: 'p', text: 'Activated carbon adsorbs chlorine, organic matter and the compounds that cause bad smell, taste and colour. It makes water pleasant to drink and gentler on skin and hair.' },
    { type: 'ul', items: [
      'Removes chlorine, odour and unpleasant taste.',
      'Reduces colour and organic impurities.',
      'Improves the quality of water going to RO purifiers.',
    ] },
    { type: 'h2', text: 'When do you need both?' },
    { type: 'p', text: 'If your water is both cloudy and smelly, the usual order is sand filter first, then carbon filter, with a softener added where hardness is a problem. A quick on-site test will confirm the right combination for your home.' },
  ],
};
