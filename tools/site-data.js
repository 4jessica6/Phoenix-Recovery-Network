// Site content for the Phoenix Recovery Network build (tools/build-site.js reads this).
// Copy and per-home details follow the Claude Design handoff v8 (2026-10-21).
// Anything in [brackets] is still to be confirmed; the preview build tints it orange.
// Street addresses are never published: URLs, slugs and asset folders use house names only.

const PHONE = '(317) 296-3622';
const PHONE_TEL = '+13172963622';
const EMAIL = 'info@phoenixrecoverynetwork.com';
const APPLY_URL = 'https://www.sobrietyhub.app/dashboard/forms/public/36b0f645-35b6-43c3-9c63-622fb5df62e3';
const BEDS_EMBED = 'https://www.sobrietyhub.app/embed/13862/occupancy';
const SHOW_BEDS = false;      // Sobriety Hub live-occupancy widgets (homepage + per house). Turn on when the client is ready.
const SHOW_FOUNDERS = false;  // "Our founders" block on house pages. Needs the story and a portrait from the client.

const network = {
  title: 'Phoenix Recovery Network | Sober Living Homes in Indiana',
  description: 'Phoenix Recovery Network operates structured, peer-supported sober living homes for men and women across Indiana. Clear expectations, house leadership, and a community committed to rising together.',
  heroEyebrow: 'Sober living for men & women · Indiana',
  heroTitle: 'Communities of Hope. Built on Recovery.',
  heroLede: 'A widespread community of structured, peer-supported homes across Indiana, built on clear expectations and a shared commitment to rising together.',
  statement: 'The phoenix stands for what we see every day: people rising out of a hard season and building something new.',
  statementMuted: 'Our homes give them the structure, and the people, to do it.',
  proofs: [
    { title: 'Structured', body: 'Monitored homes with house leadership and regular testing.' },
    { title: 'Peer-supported', body: 'Residents holding each other to the same goals, every day.' },
    { title: 'Recovery-first', body: 'Drug- and alcohol-free homes built around 12 Step recovery.' }
  ],
  mission: 'Phoenix Recovery Network elevates the standard of recovery housing through professionally structured Level II environments that prioritize peer connection, personal responsibility, and community integration. By fostering an atmosphere of empowerment, spiritual growth, and personal transformation, we provide the professional stability individuals need to rise above addiction, reclaim their potential, and achieve long-term recovery.',
  vision: 'To expand our footprint across Indiana as a trusted leader in recovery housing by building a highly sustainable, professionally structured, and far-reaching network of homes. We envision a community that champions resident empowerment, drives deep personal transformation, reduces stigma, and inspires resilient communities anchored in lasting wellness and long-term recovery.',
  mapLede: 'Each light marks a Phoenix home, shown within a few miles of where it is to protect residents’ privacy.',
  homesLede: 'Each has its own page with photos, rooms and openings. Addresses are shared after a short phone screening.',
  approachTitle: 'More than a sober house with rules.',
  approachLede: 'Anchored in an unwavering commitment to sustainable recovery, Phoenix homes provide structured, monitored residences with house leadership, regular testing, and set expectations. We’re a residence, not a treatment program, so residents keep their own outpatient care.',
  pillars: [
    { n: 'i.', title: 'Structure', body: 'House meetings, testing, chores, and work or school. The habits of recovery become everyday life.' },
    { n: 'ii.', title: 'Accountability', body: 'House leadership on site and residents who speak up early when someone is struggling.' },
    { n: 'iii.', title: 'Community', body: 'Shared meals, shared responsibility, and peers who understand the work you’re doing.' }
  ],
  standardsTitle: 'Clear standards make a home work.',
  standardsLede: 'Every resident agrees to them, and every Phoenix house lives by them.',
  standards: [
    { title: 'Sober living', body: 'Drug and alcohol free, with regular and random testing.' },
    { title: 'Program work', body: 'Weekly 12 Step meetings, step work with a sponsor, and service work.' },
    { title: 'Work or school', body: 'A job, classes or service, or an active search.' },
    { title: 'House meetings', body: 'A weekly check-in to keep the home running well.' },
    { title: 'Shared responsibility', body: 'Chores, curfew, and respect for the home and neighbors.' },
    { title: 'Peer accountability', body: 'We speak up early, and we support each other.' }
  ],
  lifePhotos: [
    { src: 'assets/homes/julian-house/dining.jpg', alt: 'Dining room with a wood table and built-in cabinets in a Phoenix home' },
    { src: 'assets/homes/julian-house/deck.jpg', alt: 'Back deck and yard of a Phoenix home' },
    { src: 'assets/homes/julian-house/living.jpg', alt: 'Furnished living room in a Phoenix home' }
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
    { n: 'Four', title: 'Move in', body: 'Sign the resident agreement and settle in with your new community.' }
  ],
  applyTitle: 'Apply now.',
  applyLede: 'Applications go straight to our team and are kept confidential. Family members and referring professionals are welcome to call or email us directly.',
  bedsTitle: 'Openings across the network, updated automatically.'
};

// Shared across every house page. {name} and {people} are filled in per home ("men" / "women").
const homeDefaults = {
  lede: 'A calm, well-kept home close to meetings, work and transit, with house leadership and {people} who show up for each other.',
  insideTitle: 'Move in with a bag. The rest is here.',
  insideBody: 'Rooms are furnished and the house is stocked for everyday life, so you can focus on work, meetings and getting settled.',
  amenities: ['Furnished bedrooms', 'Full shared kitchen', 'Washer and dryer', 'Wi-Fi and utilities', 'Shared living room for meals and movie nights', 'Off-street parking', 'Outdoor space', 'Linens on move-in'],
  rhythm: [
    { when: 'Weekdays', title: 'Work, school or service', body: 'Residents head out to jobs, classes or volunteering, or job-search on an agreed plan.' },
    { when: 'Every week', title: 'Recovery meetings', body: 'Attend meetings and work a program of your choice. Several are within walking distance.' },
    { when: 'Weekly', title: 'House meetings', body: 'Everyone checks in, chores rotate, and problems get solved together.' },
    { when: 'Ongoing', title: 'Testing', body: 'Regular and random drug and alcohol testing keeps the home safe for everyone.' },
    { when: 'Nightly', title: 'Curfew', body: '11 pm Sunday through Thursday, and midnight on Friday and Saturday.' }
  ],
  faqs: [
    { q: 'Who is {name} for?', a: 'Adult {people} in recovery from drugs or alcohol who are ready to live by the house standards: sober, working a program, and contributing to the home.' },
    { q: 'Do I need to be in treatment?', a: 'No. Phoenix is a residence, not a treatment program. Many residents keep outpatient care, a counselor or a sponsor alongside living here.' },
    { q: 'Can I keep my job, my car, or have visitors?', a: 'Yes to work and transportation. Visitor guidelines are set by the house, and we’ll walk you through them on your tour.' },
    { q: 'How fast can I move in?', a: 'When a bed is open, most people go from first call to move-in within a few days of screening and a tour.' }
  ],
  applyLede: 'Applications go straight to our team and are kept confidential. Family members and referring professionals are welcome to call on someone’s behalf.',
  founders: { headline: '[Founders story headline]', body: '[Darrell and Chad’s story, coming from the client.]', names: 'Darrell Mitchell & Chad [Last name]', photo: null }
};

// One entry per home, in display order. `photos` are [file, caption] pairs under preview/assets/homes/<slug>/;
// the first is the front of the house. `nearby` distances are the client's estimates from the design handoff.
const homes = [
  { slug: 'julian-house', name: 'Julian House', city: 'Indianapolis', serves: 'Men', capacity: 12, bedsHouseId: '17258',
    area: 'A quiet residential street in Irvington, on Indianapolis’ east side.',
    nearby: [['AA meeting', '5 min walk'], ['NA meeting', '5 min drive'], ['Bus stop (IndyGo)', '15 min walk'], ['Grocery store', '5 min drive'], ['Public library', '5 min walk'], ['Park', '5 min walk'], ['Hospital', '5 min drive']],
    photos: [['front.jpg', 'Front of the house'], ['living.jpg', 'Living room with sectional seating'], ['bath.jpg', 'Bathroom with walk-in shower'], ['laundry.jpg', 'Laundry room with washer and dryer'], ['deck.jpg', 'Backyard with deck and garden bed']],
    video: 'walkthrough.mp4' },
  { slug: 'cornelius-house', name: 'Cornelius House', city: 'Indianapolis', serves: 'Men', capacity: 7,
    area: 'A quiet residential street in Mapleton, on Indianapolis’ north side.',
    nearby: [['AA meeting', '5 min drive'], ['NA meeting', '5 min drive'], ['Bus stop (IndyGo)', '15 min walk'], ['Grocery store', '10 min drive'], ['Public library', '5 min drive'], ['Park', '15 min walk']],
    photos: [['front.jpg', 'Front of the house'], ['hall.jpg', 'Front room and staircase'], ['kitchen.jpg', 'Kitchen'], ['bath.jpg', 'Bathroom'], ['laundry.jpg', 'Laundry and wash room']],
    video: 'walkthrough.mp4' },
  { slug: 'rookwood-house', name: 'Rookwood House', city: 'Indianapolis', serves: 'Men', capacity: 8,
    area: 'A quiet residential street in Mapleton, on Indianapolis’ north side.',
    nearby: [['AA meeting', '5 min drive'], ['NA meeting', '5 min drive'], ['Bus stop (IndyGo)', '15 min walk'], ['Grocery store', '5 min drive'], ['Public library', '5 min drive'], ['Park', '10 min walk']],
    photos: [['front.jpg', 'Front of the house'], ['kitchen.jpg', 'Kitchen'], ['hall.jpg', 'Upstairs hallway'], ['bath.jpg', 'Bathroom'], ['laundry.jpg', 'Laundry room']],
    video: 'walkthrough.mp4' },
  { slug: 'central-house', name: 'Central House', city: 'Anderson', serves: 'Men', capacity: 10,
    area: 'A quiet residential street on Anderson’s near east side, close to downtown.',
    nearby: [['AA meeting', '10 min walk'], ['NA meeting', '10 min walk'], ['Bus stop', '5 min walk'], ['Grocery store', '5 min drive'], ['Public library', '10 min walk'], ['Park', '5 min walk'], ['Hospital', '5 min drive']],
    photos: [['front.jpg', 'Front of the house'], ['hall.jpg', 'Entry hall and staircase'], ['kitchen.jpg', 'Kitchen'], ['bath.jpg', 'Bathroom'], ['kitchen-2.jpg', 'Kitchen and pantry']],
    video: 'walkthrough.mp4' },
  { slug: 'central-house-ii', name: 'Central House II', city: 'Anderson', serves: 'Men', capacity: 8,
    area: 'A quiet residential street on Anderson’s south side.',
    nearby: [['AA meeting', '10 min drive'], ['NA meeting', '5 min drive'], ['Bus stop', '10 min drive'], ['Grocery store', '5 min drive'], ['Park', '10 min walk'], ['Hospital', '10 min drive']],
    photos: [['front.jpg', 'Front of the house'], ['living.jpg', 'Living room'], ['kitchen.jpg', 'Kitchen'], ['bath.jpg', 'Bathroom'], ['backyard.jpg', 'Back yard']],
    video: 'walkthrough.mp4' },
  { slug: '8th-street-house', name: '8th Street House', city: 'Anderson', serves: 'Men', capacity: 9,
    area: 'A quiet residential street on Anderson’s near east side, close to downtown.',
    nearby: [['AA meeting', '15 min walk'], ['NA meeting', '15 min walk'], ['Bus stop', '5 min walk'], ['Grocery store', '15 min walk'], ['Public library', '5 min drive'], ['Park', '10 min walk'], ['Hospital', '5 min drive']],
    photos: [['front.jpg', 'Front of the house'], ['living.jpg', 'Living room'], ['kitchen.jpg', 'Kitchen'], ['kitchen-2.jpg', 'Kitchen, sink and pantry'], ['dining.jpg', 'Dining room']],
    video: 'walkthrough.mp4' },
  // 9th Street is not in the v8 design handoff (which lists seven homes). Kept here with placeholders until the client confirms.
  { slug: '9th-street-house', name: '9th Street House', city: 'Anderson', serves: '[Men]', capacity: '[X]', tbc: true,
    area: 'A quiet residential street in [neighborhood], Anderson.',
    nearby: [['AA meeting', '[X] min walk'], ['NA meeting', '[X] min walk'], ['Bus stop', '[X] min walk'], ['Grocery store', '[X] min drive'], ['Park', '[X] min walk'], ['Hospital', '[X] min drive']],
    photos: [['front.jpg', 'Front of the house'], ['kitchen.jpg', 'Kitchen'], ['living.jpg', 'Living room'], ['bath.jpg', 'Bathroom'], ['kitchen-2.jpg', 'Kitchen sink and window']],
    video: 'walkthrough.mp4' },
  { slug: '7th-street-house', name: '7th Street House', city: 'Anderson', serves: 'Women', capacity: 6,
    area: 'A quiet residential street on Anderson’s west side, close to downtown.',
    nearby: [['AA meeting', '15 min walk'], ['NA meeting', '5 min walk'], ['Bus stop', '15 min walk'], ['Grocery store', '5 min drive'], ['Public library', '5 min drive'], ['Park', '5 min walk'], ['Hospital', '5 min drive']],
    photos: [['front.jpg', 'Front of the house'], ['living.jpg', 'Living room'], ['kitchen.jpg', 'Kitchen'], ['bath.jpg', 'Bathroom'], ['backyard.jpg', 'Back of the house and patio']],
    video: 'walkthrough.mp4' }
];

module.exports = { PHONE, PHONE_TEL, EMAIL, APPLY_URL, BEDS_EMBED, SHOW_BEDS, SHOW_FOUNDERS, network, homeDefaults, homes };
