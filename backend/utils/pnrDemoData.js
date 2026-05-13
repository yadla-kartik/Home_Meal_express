const DEFAULT_DEMO_ROUTE = [
  {
    code: 'NDLS',
    name: 'New Delhi',
    sequence: 1,
    day: '1',
    distance: '0',
    scheduledArrival: 'Boarding',
    scheduledDeparture: '06:00',
    liveArrival: 'Boarding',
    liveDeparture: '06:10',
    haltTime: '10m',
  },
  {
    code: 'MTJ',
    name: 'Mathura Jn',
    sequence: 2,
    day: '1',
    distance: '141',
    scheduledArrival: '08:15',
    scheduledDeparture: '08:20',
    liveArrival: '08:18',
    liveDeparture: '08:22',
    haltTime: '5m',
  },
  {
    code: 'AGC',
    name: 'Agra Cantt',
    sequence: 3,
    day: '1',
    distance: '196',
    scheduledArrival: '09:25',
    scheduledDeparture: '09:30',
    liveArrival: '09:28',
    liveDeparture: '09:32',
    haltTime: '5m',
  },
  {
    code: 'BPL',
    name: 'Bhopal Jn',
    sequence: 4,
    day: '1',
    distance: '702',
    scheduledArrival: '15:05',
    scheduledDeparture: '15:10',
    liveArrival: '15:08',
    liveDeparture: '15:13',
    haltTime: '5m',
  },
  {
    code: 'NGP',
    name: 'Nagpur',
    sequence: 5,
    day: '1',
    distance: '1092',
    scheduledArrival: '21:30',
    scheduledDeparture: '21:35',
    liveArrival: '21:34',
    liveDeparture: '21:38',
    haltTime: '4m',
  },
]

const DEMO_CHEFS = {
  NDLS: [
    {
      id: '65f100000000000000000001',
      registerId: '65f200000000000000000001',
      name: 'Sunita Devi',
      kitchenName: 'Sunita Home Kitchen',
      specialty: 'North Indian Meals',
      cuisine: 'North Indian',
      rating: 4.8,
      dishes: 4,
      price: 'Rs 80 - Rs 180',
      tag: 'Top Rated',
      prepTime: '25 mins',
      nearestStation: 'New Delhi',
      phone: '9876543210',
      email: 'sunita.demo@example.com',
      menuItems: [
        { id: 'NDLS-1', name: 'Dal Makhani', desc: 'Creamy black lentils with jeera rice.', price: 120, isVeg: true, category: 'Main Course' },
        { id: 'NDLS-2', name: 'Paneer Butter Masala', desc: 'Rich paneer curry with naan.', price: 160, isVeg: true, category: 'Main Course' },
        { id: 'NDLS-3', name: 'Jeera Rice', desc: 'Fragrant basmati rice.', price: 80, isVeg: true, category: 'Rice' },
        { id: 'NDLS-4', name: 'Gulab Jamun', desc: 'Soft dessert box.', price: 50, isVeg: true, category: 'Dessert' },
      ],
    },
    {
      id: '65f100000000000000000002',
      registerId: '65f200000000000000000002',
      name: 'Priya Singh',
      kitchenName: 'Priya Tiffin House',
      specialty: 'Punjabi Combos',
      cuisine: 'Punjabi',
      rating: 4.6,
      dishes: 3,
      price: 'Rs 90 - Rs 200',
      tag: 'Popular',
      prepTime: '30 mins',
      nearestStation: 'New Delhi',
      phone: '9876543211',
      email: 'priya.demo@example.com',
      menuItems: [
        { id: 'NDLS-P1', name: 'Butter Chicken', desc: 'Creamy butter chicken with roti.', price: 190, isVeg: false, category: 'Main Course' },
        { id: 'NDLS-P2', name: 'Tandoori Roti', desc: 'Fresh tandoori rotis.', price: 40, isVeg: true, category: 'Bread' },
        { id: 'NDLS-P3', name: 'Chicken Biryani', desc: 'Long grain biryani pack.', price: 220, isVeg: false, category: 'Rice' },
      ],
    },
  ],
  MTJ: [
    {
      id: '65f100000000000000000003',
      registerId: '65f200000000000000000003',
      name: 'Geeta Yadav',
      kitchenName: 'Mathura Misthan',
      specialty: 'Mathura Snacks',
      cuisine: 'Snacks',
      rating: 4.7,
      dishes: 3,
      price: 'Rs 50 - Rs 150',
      tag: 'Top Rated',
      prepTime: '20 mins',
      nearestStation: 'Mathura Jn',
      phone: '9876543212',
      email: 'geeta.demo@example.com',
      menuItems: [
        { id: 'MTJ-1', name: 'Peda Box', desc: 'Fresh Mathura peda pack.', price: 130, isVeg: true, category: 'Sweets' },
        { id: 'MTJ-2', name: 'Kachori Sabzi', desc: 'Classic Mathura breakfast.', price: 70, isVeg: true, category: 'Breakfast' },
        { id: 'MTJ-3', name: 'Sweet Lassi', desc: 'Cold kesar lassi.', price: 60, isVeg: true, category: 'Drinks' },
      ],
    },
  ],
  AGC: [
    {
      id: '65f100000000000000000004',
      registerId: '65f200000000000000000004',
      name: 'Lakshmi Joshi',
      kitchenName: 'Agra Petha Corner',
      specialty: 'Agra Specials',
      cuisine: 'North Indian',
      rating: 4.5,
      dishes: 3,
      price: 'Rs 60 - Rs 160',
      tag: 'Popular',
      prepTime: '18 mins',
      nearestStation: 'Agra Cantt',
      phone: '9876543213',
      email: 'lakshmi.demo@example.com',
      menuItems: [
        { id: 'AGC-1', name: 'Petha Assortment', desc: 'Mixed petha flavors.', price: 160, isVeg: true, category: 'Sweets' },
        { id: 'AGC-2', name: 'Bedai Kachori', desc: 'Agra style bedai and sabzi.', price: 85, isVeg: true, category: 'Snack' },
        { id: 'AGC-3', name: 'Paneer Pakora', desc: 'Crunchy paneer fritters.', price: 80, isVeg: true, category: 'Snack' },
      ],
    },
  ],
  BPL: [
    {
      id: '65f100000000000000000005',
      registerId: '65f200000000000000000005',
      name: 'Kamla Patel',
      kitchenName: 'Bhopal Bhoj',
      specialty: 'Dal Bafla',
      cuisine: 'Madhya Pradesh',
      rating: 4.8,
      dishes: 3,
      price: 'Rs 80 - Rs 180',
      tag: 'Top Rated',
      prepTime: '28 mins',
      nearestStation: 'Bhopal Jn',
      phone: '9876543214',
      email: 'kamla.demo@example.com',
      menuItems: [
        { id: 'BPL-1', name: 'Dal Bafla', desc: 'Bhopal special thali.', price: 180, isVeg: true, category: 'Thali' },
        { id: 'BPL-2', name: 'Poha Jalebi', desc: 'Indori style combo.', price: 75, isVeg: true, category: 'Breakfast' },
        { id: 'BPL-3', name: 'Masala Chaas', desc: 'Cooling chaas bottle.', price: 35, isVeg: true, category: 'Drinks' },
      ],
    },
  ],
  NGP: [
    {
      id: '65f100000000000000000006',
      registerId: '65f200000000000000000006',
      name: 'Vandana Deshmukh',
      kitchenName: 'Vidarbha Meals',
      specialty: 'Vidarbha Thali',
      cuisine: 'Maharashtrian',
      rating: 4.7,
      dishes: 3,
      price: 'Rs 90 - Rs 200',
      tag: 'Top Rated',
      prepTime: '24 mins',
      nearestStation: 'Nagpur',
      phone: '9876543215',
      email: 'vandana.demo@example.com',
      menuItems: [
        { id: 'NGP-1', name: 'Tarri Poha', desc: 'Nagpur famous spicy poha.', price: 65, isVeg: true, category: 'Breakfast' },
        { id: 'NGP-2', name: 'Vidarbha Thali', desc: 'Homestyle thali meal.', price: 190, isVeg: true, category: 'Thali' },
        { id: 'NGP-3', name: 'Saoji Chicken', desc: 'Spicy Nagpur curry.', price: 260, isVeg: false, category: 'Main Course' },
      ],
    },
  ],
}

const parseBoolean = (value, fallback) => {
  if (typeof value === 'undefined' || value === null || value === '') return fallback
  return ['1', 'true', 'yes', 'on'].includes(String(value).trim().toLowerCase())
}

const isDemoPnrEnabled = () => parseBoolean(process.env.PNR_DEMO_MODE, process.env.NODE_ENV !== 'production')

const getTomorrowIsoDate = () => {
  const date = new Date()
  date.setDate(date.getDate() + 1)
  return date.toISOString().slice(0, 10)
}

const buildDemoPnrSnapshot = (pnr) => {
  const suffix = Number(String(pnr || '').slice(-2)) || 1
  const coachSeed = (suffix % 5) + 1

  return {
    pnr: String(pnr || ''),
    status: 'CNF',
    trainNumber: '12951',
    trainName: 'Home Meal Express Demo Rajdhani',
    boardingStation: 'New Delhi NDLS',
    destinationStation: 'Nagpur NGP',
    dateOfJourney: getTomorrowIsoDate(),
    passengers: [
      {
        bookingStatus: 'CNF',
        currentStatus: 'CNF',
        coach: `B${coachSeed}`,
        berth: String(20 + coachSeed),
        berthType: 'LB',
      },
      {
        bookingStatus: 'CNF',
        currentStatus: 'CNF',
        coach: `B${coachSeed}`,
        berth: String(21 + coachSeed),
        berthType: 'UB',
      },
    ],
  }
}

const buildDemoTrainSummary = () => ({
  trainInfo: {
    trainNumber: '12951',
    trainName: 'Home Meal Express Demo Rajdhani',
  },
  route: DEFAULT_DEMO_ROUTE,
  live: {
    stations: DEFAULT_DEMO_ROUTE,
  },
})

const buildDemoAvailableStations = () =>
  DEFAULT_DEMO_ROUTE.map((station) => ({
    code: station.code,
    name: station.name,
    distance: `${station.distance} km`,
    eta: station.liveDeparture || station.scheduledDeparture || 'TBA',
    chefs: Array.isArray(DEMO_CHEFS[station.code]) ? DEMO_CHEFS[station.code].length : 0,
    sequence: station.sequence,
    day: station.day,
    scheduledArrival: station.scheduledArrival,
    scheduledDeparture: station.scheduledDeparture,
    liveArrival: station.liveArrival,
    liveDeparture: station.liveDeparture,
    haltTime: station.haltTime,
  })).filter((station) => station.chefs > 0)

const getDemoChefsForStation = (stationCode) =>
  Array.isArray(DEMO_CHEFS[stationCode])
    ? DEMO_CHEFS[stationCode].map((chef) => ({
        id: chef.id,
        registerId: chef.registerId,
        name: chef.name,
        kitchenName: chef.kitchenName,
        specialty: chef.specialty,
        cuisine: chef.cuisine,
        rating: chef.rating,
        dishes: chef.dishes,
        price: chef.price,
        tag: chef.tag,
        prepTime: chef.prepTime,
        nearestStation: chef.nearestStation,
        phone: chef.phone,
      }))
    : []

const getDemoChefMenu = (stationCode, chefId) => {
  const chef = Array.isArray(DEMO_CHEFS[stationCode])
    ? DEMO_CHEFS[stationCode].find((entry) => entry.id === chefId)
    : null

  if (!chef) return null

  return {
    chef: {
      id: chef.id,
      registerId: chef.registerId,
      name: chef.name,
      kitchenName: chef.kitchenName,
      specialty: chef.specialty,
      cuisine: chef.cuisine,
      rating: chef.rating,
      prepTime: chef.prepTime,
      nearestStation: chef.nearestStation,
      phone: chef.phone,
      email: chef.email,
    },
    menuItems: chef.menuItems.map((item) => ({
      id: item.id,
      name: item.name,
      desc: item.desc,
      price: item.price,
      isVeg: item.isVeg,
      category: item.category,
      imageUrl: '',
      servingSize: '1 plate',
      spiceLevel: 'Medium',
    })),
  }
}

module.exports = {
  isDemoPnrEnabled,
  buildDemoPnrSnapshot,
  buildDemoTrainSummary,
  buildDemoAvailableStations,
  getDemoChefsForStation,
  getDemoChefMenu,
}
