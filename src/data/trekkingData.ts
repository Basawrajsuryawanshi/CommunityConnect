import type { Trek } from '../types/trekking'

export const treks: Trek[] = [
  {
    id: 'trek-ut-1',
    name: 'Kedarkantha Winter Trek',
    state: 'Uttarakhand',
    location: 'Sankri, Uttarkashi',
    difficulty: 'Moderate',
    duration: '5 Days / 4 Nights',
    rate: 8500,
    description:
      'A classic winter trek offering panoramic views of snow-capped peaks including Swargarohini and Bandarpoonch. Perfect for alumni groups seeking adventure in the Himalayas.',
    highlights: ['360° summit views', 'Snow camping', 'Pine forest trails'],
    inclusions: ['Guide & permits', 'Camping gear', 'All meals', 'Transport from Dehradun'],
    imageGradient: 'from-sky-400 to-blue-700',
    slots: [
      { id: 's1', date: '2026-04-18', reportingTime: '06:00 AM', availableSeats: 8, totalSeats: 15 },
      { id: 's2', date: '2026-05-02', reportingTime: '06:00 AM', availableSeats: 12, totalSeats: 15 },
      { id: 's3', date: '2026-05-16', reportingTime: '06:00 AM', availableSeats: 5, totalSeats: 15 },
    ],
  },
  {
    id: 'trek-ut-2',
    name: 'Valley of Flowers Trek',
    state: 'Uttarakhand',
    location: 'Govindghat, Chamoli',
    difficulty: 'Moderate',
    duration: '6 Days / 5 Nights',
    rate: 12000,
    description:
      'UNESCO World Heritage site blooming with alpine flowers. A scenic trek through lush meadows and the sacred Hemkund Sahib.',
    highlights: ['Alpine flowers', 'Hemkund Sahib visit', 'UNESCO heritage'],
    inclusions: ['Guide & permits', 'Guesthouse stay', 'All meals', 'Porter support'],
    imageGradient: 'from-emerald-400 to-green-700',
    slots: [
      { id: 's4', date: '2026-07-10', reportingTime: '05:30 AM', availableSeats: 10, totalSeats: 12 },
      { id: 's5', date: '2026-07-24', reportingTime: '05:30 AM', availableSeats: 6, totalSeats: 12 },
    ],
  },
  {
    id: 'trek-hp-1',
    name: 'Triund Trek',
    state: 'Himachal Pradesh',
    location: 'McLeod Ganj, Dharamshala',
    difficulty: 'Easy',
    duration: '2 Days / 1 Night',
    rate: 3500,
    description:
      'A beginner-friendly trek with stunning Dhauladhar range views. Ideal for first-time trekkers and weekend alumni getaways.',
    highlights: ['Dhauladhar views', 'Camping under stars', 'Beginner friendly'],
    inclusions: ['Guide', 'Camping tent', 'Dinner & breakfast', 'Permits'],
    imageGradient: 'from-violet-400 to-purple-700',
    slots: [
      { id: 's6', date: '2026-04-05', reportingTime: '07:00 AM', availableSeats: 20, totalSeats: 25 },
      { id: 's7', date: '2026-04-19', reportingTime: '07:00 AM', availableSeats: 18, totalSeats: 25 },
      { id: 's8', date: '2026-05-03', reportingTime: '07:00 AM', availableSeats: 22, totalSeats: 25 },
    ],
  },
  {
    id: 'trek-hp-2',
    name: 'Hampta Pass Trek',
    state: 'Himachal Pradesh',
    location: 'Manali to Spiti',
    difficulty: 'Difficult',
    duration: '5 Days / 4 Nights',
    rate: 9500,
    description:
      'Cross from lush Kullu valley to barren Spiti landscapes. One of the most dramatic crossover treks in India.',
    highlights: ['Valley crossover', 'Chandratal Lake', 'Diverse landscapes'],
    inclusions: ['Guide & permits', 'Camping gear', 'All meals', 'Transport Manali–Chandratal'],
    imageGradient: 'from-orange-400 to-red-700',
    slots: [
      { id: 's9', date: '2026-06-14', reportingTime: '06:00 AM', availableSeats: 7, totalSeats: 12 },
      { id: 's10', date: '2026-06-28', reportingTime: '06:00 AM', availableSeats: 4, totalSeats: 12 },
    ],
  },
  {
    id: 'trek-mh-1',
    name: 'Rajmachi Fort Trek',
    state: 'Maharashtra',
    location: 'Lonavala, Pune District',
    difficulty: 'Easy',
    duration: '1 Day',
    rate: 2500,
    description:
      'A popular monsoon trek to historic Rajmachi fort with views of Shirota Lake and surrounding Sahyadri hills.',
    highlights: ['Historic fort', 'Monsoon waterfalls', 'Day trek'],
    inclusions: ['Guide', 'Lunch', 'First aid kit', 'Group insurance'],
    imageGradient: 'from-teal-400 to-cyan-700',
    slots: [
      { id: 's11', date: '2026-04-12', reportingTime: '06:30 AM', availableSeats: 30, totalSeats: 35 },
      { id: 's12', date: '2026-04-26', reportingTime: '06:30 AM', availableSeats: 28, totalSeats: 35 },
      { id: 's13', date: '2026-05-10', reportingTime: '06:30 AM', availableSeats: 32, totalSeats: 35 },
    ],
  },
  {
    id: 'trek-mh-2',
    name: 'Harishchandragad Trek',
    state: 'Maharashtra',
    location: 'Ahmednagar District',
    difficulty: 'Moderate',
    duration: '2 Days / 1 Night',
    rate: 2800,
    description:
      'Trek to the ancient Konkan Kada cliff with breathtaking views. Famous for the Kedareshwar cave and night camping.',
    highlights: ['Konkan Kada cliff', 'Kedareshwar cave', 'Night camping'],
    inclusions: ['Guide', 'Camping', 'Meals', 'Forest permits'],
    imageGradient: 'from-amber-400 to-yellow-700',
    slots: [
      { id: 's14', date: '2026-04-19', reportingTime: '05:00 AM', availableSeats: 15, totalSeats: 20 },
      { id: 's15', date: '2026-05-17', reportingTime: '05:00 AM', availableSeats: 12, totalSeats: 20 },
    ],
  },
  {
    id: 'trek-ka-1',
    name: 'Kumara Parvatha Trek',
    state: 'Karnataka',
    location: 'Subramanya, Coorg Border',
    difficulty: 'Difficult',
    duration: '2 Days / 1 Night',
    rate: 4500,
    description:
      'One of the toughest treks in South India with dense shola forests and grasslands. A rite of passage for adventure enthusiasts.',
    highlights: ['Pushpagiri wildlife', 'Grassland ridges', 'Sunrise summit'],
    inclusions: ['Guide', 'Camping at Bhattara Mane', 'Meals', 'Forest permits'],
    imageGradient: 'from-lime-400 to-green-700',
    slots: [
      { id: 's16', date: '2026-04-26', reportingTime: '05:30 AM', availableSeats: 10, totalSeats: 15 },
      { id: 's17', date: '2026-05-24', reportingTime: '05:30 AM', availableSeats: 8, totalSeats: 15 },
    ],
  },
  {
    id: 'trek-ka-2',
    name: 'Mullayanagiri Peak Trek',
    state: 'Karnataka',
    location: 'Chikmagalur',
    difficulty: 'Easy',
    duration: '1 Day',
    rate: 3000,
    description:
      'Trek to the highest peak in Karnataka at 1,930m. Coffee plantations and misty trails make this a scenic day outing.',
    highlights: ['Highest peak in Karnataka', 'Coffee estates', 'Sunrise trek'],
    inclusions: ['Guide', 'Breakfast & lunch', 'Transport from Chikmagalur'],
    imageGradient: 'from-rose-400 to-pink-700',
    slots: [
      { id: 's18', date: '2026-04-05', reportingTime: '04:30 AM', availableSeats: 25, totalSeats: 30 },
      { id: 's19', date: '2026-05-03', reportingTime: '04:30 AM', availableSeats: 20, totalSeats: 30 },
    ],
  },
  {
    id: 'trek-sk-1',
    name: 'Goechala Trek',
    state: 'Sikkim',
    location: 'Yuksom, West Sikkim',
    difficulty: 'Expert',
    duration: '9 Days / 8 Nights',
    rate: 18000,
    description:
      'The closest view of Mt. Kanchenjunga from Indian soil. A challenging high-altitude trek through rhododendron forests.',
    highlights: ['Kanchenjunga views', 'Rhododendron forests', 'Samiti Lake'],
    inclusions: ['Guide & permits', 'Camping gear', 'All meals', 'Porter', 'Yuksom transport'],
    imageGradient: 'from-indigo-400 to-blue-800',
    slots: [
      { id: 's20', date: '2026-05-10', reportingTime: '06:00 AM', availableSeats: 6, totalSeats: 10 },
      { id: 's21', date: '2026-06-07', reportingTime: '06:00 AM', availableSeats: 4, totalSeats: 10 },
    ],
  },
  {
    id: 'trek-jk-1',
    name: 'Kashmir Great Lakes Trek',
    state: 'Jammu & Kashmir',
    location: 'Sonamarg, Ganderbal',
    difficulty: 'Expert',
    duration: '8 Days / 7 Nights',
    rate: 16500,
    description:
      'Seven alpine lakes in succession — one of India\'s most beautiful treks through meadows and high passes.',
    highlights: ['7 alpine lakes', 'Nichnai Pass', 'Alpine meadows'],
    inclusions: ['Guide & permits', 'Camping gear', 'All meals', 'Ponies', 'Srinagar transport'],
    imageGradient: 'from-cyan-400 to-teal-800',
    slots: [
      { id: 's22', date: '2026-07-05', reportingTime: '05:00 AM', availableSeats: 8, totalSeats: 12 },
      { id: 's23', date: '2026-07-19', reportingTime: '05:00 AM', availableSeats: 5, totalSeats: 12 },
    ],
  },
]

export function getTrekStates() {
  return Array.from(new Set(treks.map((t) => t.state))).sort()
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function generateBookingId() {
  return `CC-TREK-${Date.now().toString(36).toUpperCase()}`
}
