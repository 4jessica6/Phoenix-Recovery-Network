// Site content for the Phoenix Recovery Network build (tools/build-site.js reads this).
// Anything in [brackets] is a placeholder the client still has to confirm; the preview build tints it.
// Street addresses are never published; homes are listed by working name and city only.

const PHONE = '(XXX) XXX-XXXX';          // PHONE NUMBER PLACEHOLDER (also update the teaser)
const EMAIL = 'info@phoenixrecoverynetwork.com';
const APPLY_URL = '#availability';       // SOBRIETY HUB APPLICATION LINK PLACEHOLDER
const FORM_ENDPOINT = '';                // e.g. https://formspree.io/f/xxxx — empty = prefilled email fallback

const network = {
  title: 'Phoenix Recovery Network | Sober Living Homes for Men in Indiana',
  description: 'Phoenix Recovery Network operates structured, peer-supported sober living homes for men across Indiana. Clear expectations, house leadership, and a community that holds each other accountable.',
  heroEyebrow: 'Sober living for men · Indiana',
  heroTitle: 'A steady place to <em>rise</em> again.',
  heroLede: 'Structured, peer-supported recovery homes, with clear expectations and a community that holds each other to them.',
  statement: 'The phoenix stands for what we see every day: men rising out of a hard season and building something new.',
  statementMuted: 'Our homes give them the structure, and the people, to do it.',
  proofs: [
    { title: 'Structured', body: 'Monitored homes with house leadership and regular testing.' },
    { title: 'Peer-supported', body: 'Men holding each other to the same goals, every day.' },
    { title: 'Private pay', body: 'Simple weekly rent. No insurance billing.' }
  ],
  homesLede: 'Each home has its own page with photos, rooms and openings. Addresses are shared after a short phone screening.',
  approachTitle: 'More than a sober house with rules.',
  approachLede: 'Phoenix homes are structured, monitored residences with house leadership, regular testing and set expectations. We’re a residence, not a treatment program, so residents keep their own outpatient care, counselor or sponsor.',
  pillars: [
    { n: 'i.', title: 'Structure', body: 'House meetings, testing, chores, and work or school. The habits of recovery become everyday life.' },
    { n: 'ii.', title: 'Accountability', body: 'House leadership on site and residents who speak up early when someone is struggling.' },
    { n: 'iii.', title: 'Community', body: 'Shared meals, shared responsibility, and peers who understand the work you’re doing.' }
  ],
  standardsTitle: 'Clear standards make a home work.',
  standardsLede: 'Every resident agrees to them, and every Phoenix house lives by them.',
  standards: [
    { title: 'Sober living', body: 'Drug and alcohol free, with regular and random testing.' },
    { title: 'Program work', body: 'Weekly recovery meetings and a program of your choice.' },
    { title: 'Work or school', body: 'A job, classes or service, or an active search.' },
    { title: 'House meetings', body: 'A weekly check-in to keep the home running well.' },
    { title: 'Shared responsibility', body: 'Chores, curfew, and respect for the home and neighbors.' },
    { title: 'Peer accountability', body: 'We speak up early, and we support each other.' }
  ],
  lifePhotos: [
    { src: 'assets/homes/5701-julian/dining.jpg', alt: 'Dining room with a wood table and built-in cabinets in a Phoenix home' },
    { src: 'assets/homes/5701-julian/deck.jpg', alt: 'Back deck and yard of a Phoenix home' },
    { src: 'assets/homes/5701-julian/living.jpg', alt: 'Furnished living room in a Phoenix home' }
  ],
  families: {
    eyebrow: 'For families', title: 'Supporting someone you love?',
    body: 'You’re welcome to reach out on their behalf. We’ll explain how the homes run, what we expect of residents, and what the next step looks like, with no pressure and in confidence.',
    link: 'Talk with our team'
  },
  professionals: {
    eyebrow: 'For professionals', title: 'Referring a client?',
    body: 'Treatment centers, counselors and case managers can contact us directly about openings, fit and discharge timing. We respond within one business day.',
    link: 'Make a referral'
  },
  stepsTitle: 'From first call to move-in, usually within days.',
  steps: [
    { n: 'One', title: 'Reach out', body: 'Check availability online or call. Family and professionals can reach out for someone.' },
    { n: 'Two', title: 'Phone screening', body: 'A short conversation about where you are and whether Phoenix is a good fit.' },
    { n: 'Three', title: 'Tour & apply', body: 'Meet house leadership, see the home, and complete the application.' },
    { n: 'Four', title: 'Move in', body: 'Sign the resident agreement, pay first rent, and settle in.' }
  ],
  availTitle: 'Check availability.',
  availLede: 'Tell us a little about what you need and someone from Phoenix will call you back personally. It’s confidential and there’s no obligation.'
};

// Defaults every home page shares (from the concept); a home can override any field.
const homeDefaults = {
  lede: 'A calm, well-kept home close to meetings, work and transit, with house leadership and men who show up for each other.',
  beds: null,                       // number of open beds, or null = "call for current availability"
  glance: [
    { k: 'Serves', v: 'Men in recovery', sub: 'Adults 18 and over' },
    { k: 'Home type', v: 'Structured sober living', sub: 'Monitored residence' },
    { k: 'Capacity', v: '[8] residents', sub: 'Shared and single rooms' },
    { k: 'Rent', v: '$[XXX] per week', sub: 'Paid directly' }
  ],
  insideTitle: 'Move in with a bag. The rest is here.',
  insideBody: 'Rooms are furnished and the house is stocked for everyday life, so you can focus on work, meetings and getting settled.',
  amenities: ['Furnished bedrooms', 'Full shared kitchen', 'Washer and dryer', 'Wi-Fi and utilities', 'Shared living room for meals and movie nights', 'Off-street parking', 'Outdoor space', 'Linens on move-in'],
  rhythm: [
    { when: 'Weekdays', title: 'Work, school or service', body: 'Residents head out to jobs, classes or volunteering, or job-search on an agreed plan.' },
    { when: 'Every week', title: 'Recovery meetings', body: 'Attend meetings and work a program of your choice. Several are within walking distance.' },
    { when: '[Day] evenings', title: 'House meeting', body: 'Everyone checks in, chores rotate, and problems get solved together.' },
    { when: 'Ongoing', title: 'Testing', body: 'Regular and random drug and alcohol testing keeps the home safe for everyone.' },
    { when: 'Nightly', title: 'Curfew at [time]', body: 'A consistent curfew, with flexibility earned as residents progress.' }
  ],
  manager: { quote: '[A short, first-person note from the house manager about what this home is like and who it’s right for.]', name: '[Name]', photo: null },
  areaBody: 'A quiet residential street in [neighborhood], [City]. The exact address is shared after your phone screening.',
  nearby: [
    { what: 'Recovery meetings', dist: '[X] min walk' },
    { what: 'Bus line', dist: '[X] min walk' },
    { what: 'Grocery store', dist: '[X] min' },
    { what: 'Entry-level employers', dist: '[X] min' }
  ],
  rent: '$[XXX]',
  rentBody: 'Residents pay rent directly. We don’t bill insurance. Ask us about move-in costs and payment timing.',
  includes: ['Furnished room', 'All utilities', 'Wi-Fi', 'Household supplies', 'Testing', 'House leadership'],
  faqs: [
    { q: 'Who is {name} for?', a: 'Adult men in recovery from drugs or alcohol who are ready to live by the house standards: sober, working a program, and contributing to the home.' },
    { q: 'Do I need to be in treatment?', a: 'No. Phoenix is a residence, not a treatment program. Many residents keep outpatient care, a counselor or a sponsor alongside living here.' },
    { q: 'Can I keep my job, my car, or have visitors?', a: 'Yes to work and transportation. Visitor guidelines are set by the house, and we’ll walk you through them on your tour.' },
    { q: 'How fast can I move in?', a: 'When a bed is open, most people go from first call to move-in within a few days of screening and a tour.' }
  ]
};

// One entry per home. `name` is the public name (working names in brackets until the client confirms).
// `photos` are [file, caption] pairs relative to preview/assets/homes/<slug>/; the first is the front/hero tile.
const homes = [
  { slug: '5701-julian',    name: 'Phoenix [Julian]',    city: 'Indianapolis',
    photos: [['front.jpg','Front of the house'],['living.jpg','Living room'],['dining.jpg','Dining room'],['bath.jpg','Bathroom'],['deck.jpg','Back deck and yard']],
    video: 'walkthrough.mp4' },
  { slug: '1222-central',   name: 'Phoenix [Central]',   city: '[City]',
    photos: [['front.jpg','Front of the house'],['hall.jpg','Entry hall and staircase'],['kitchen.jpg','Kitchen'],['bath.jpg','Bathroom'],['kitchen-2.jpg','Kitchen and pantry']],
    video: 'walkthrough.mp4' },
  { slug: '3901-rookwood',  name: 'Phoenix [Rookwood]',  city: 'Indianapolis',
    photos: [['front.jpg','Front of the house'],['kitchen.jpg','Kitchen'],['hall.jpg','Upstairs hallway'],['bath.jpg','Bathroom'],['laundry.jpg','Laundry room']],
    video: 'walkthrough.mp4' },
  { slug: '4005-cornelius', name: 'Phoenix [Cornelius]', city: 'Indianapolis',
    photos: [['front.jpg','Front of the house'],['hall.jpg','Front room and staircase'],['kitchen.jpg','Kitchen'],['bath.jpg','Bathroom'],['laundry.jpg','Laundry and wash room']],
    video: 'walkthrough.mp4' },
  { slug: '925-w-7th',      name: 'Phoenix [7th Street]', city: 'Anderson',
    photos: [['front.jpg','Front of the house'],['exterior-2.jpg','Side of the house']], video: null },
  { slug: '1302-e-8th',     name: 'Phoenix [8th Street]', city: 'Anderson',
    photos: [['front.jpg','Front of the house'],['living.jpg','Living room'],['kitchen.jpg','Kitchen'],['kitchen-2.jpg','Kitchen, sink and pantry'],['dining.jpg','Dining room']],
    video: null },
  { slug: '1921-w-9th',     name: 'Phoenix [9th Street]', city: '[Anderson]',
    photos: [['front.jpg','Front of the house'],['kitchen.jpg','Kitchen'],['living.jpg','Living room'],['bath.jpg','Bathroom'],['kitchen-2.jpg','Kitchen sink and window']],
    video: null },
  { slug: '2221-central',   name: 'Phoenix [Central · Anderson]', city: 'Anderson', 
    photos: [['front.jpg','Front of the house'],['living.jpg','Living room'],['kitchen.jpg','Kitchen'],['bath.jpg','Bathroom'],['backyard.jpg','Back yard']],
    video: null }
];

module.exports = { PHONE, EMAIL, APPLY_URL, FORM_ENDPOINT, network, homeDefaults, homes };
