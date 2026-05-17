const crypto = require('crypto')
const chefAuth = require('../models/chefAuth')
const chefMenu = require('../models/chefMenu')
const chefRegister = require('../models/chefRegister')
const userOrder = require('../models/userOrder')
const userOrderDraft = require('../models/userOrderDraft')
const { emitToChef } = require('../socket')
const {
  buildDemoAvailableStations,
  buildDemoPnrSnapshot,
  buildDemoTrainSummary,
  getDemoChefMenu,
  getDemoChefsForStation,
  isDemoPnrEnabled,
} = require('../utils/pnrDemoData')

const BASE_URL = 'https://irctc-connect-api.rajivdubey.tech'
const SDK_VERSION = '1'
const DEFAULT_SIGNING_SECRET = '97c56e08b27b161124f88acd4f24d1bd50f48075f11dc23b9ea6c0bc9b2f8794'

const apiKey = process.env.IRCTC_API_KEY || ''
const signingSecret = process.env.IRCTC_SIGNING_SECRET || DEFAULT_SIGNING_SECRET

const toTrimmedString = (value, fallback = '') => {
  if (typeof value !== 'string') return fallback
  return value.trim()
}

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

const onlyDigits = (value) => String(value ?? '').replace(/\D/g, '')

const toStringArray = (value) => {
  if (!Array.isArray(value)) return []
  return value
    .map((item) => toTrimmedString(String(item ?? '')))
    .filter(Boolean)
}

const FOOD_GST_RATE = 0.05
const DELIVERY_CHARGE = 30
const DEFAULT_CURRENCY = 'INR'
const ONLINE_PAYMENT_MODE = 'online'
const DEFAULT_PAYMENT_PROVIDER = 'demo_gateway'

const roundCurrency = (value) =>
  Math.round((toNumber(value, 0) + Number.EPSILON) * 100) / 100

const calculateBillingSummary = (items = []) => {
  const normalizedItems = Array.isArray(items) ? items : []
  const totalItems = normalizedItems.reduce((sum, item) => sum + Math.max(0, toNumber(item?.quantity, 0)), 0)
  const subtotal = roundCurrency(
    normalizedItems.reduce((sum, item) => {
      const price = Math.max(0, toNumber(item?.price, 0))
      const quantity = Math.max(0, toNumber(item?.quantity, 0))
      return sum + price * quantity
    }, 0),
  )
  const gstAmount = roundCurrency(subtotal * FOOD_GST_RATE)
  const totalAmount = roundCurrency(subtotal + gstAmount + DELIVERY_CHARGE)

  return {
    totalItems,
    subtotal,
    gstRate: FOOD_GST_RATE,
    gstAmount,
    deliveryCharge: DELIVERY_CHARGE,
    totalAmount,
    currency: DEFAULT_CURRENCY,
  }
}

const buildReference = (prefix) => {
  const dateStamp = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const randomPart = crypto.randomBytes(3).toString('hex').toUpperCase()
  return `${prefix}-${dateStamp}-${randomPart}`
}

const formatDateForApi = (value) => {
  if (!value) {
    const today = new Date()
    const dd = String(today.getDate()).padStart(2, '0')
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const yyyy = today.getFullYear()
    return `${dd}-${mm}-${yyyy}`
  }

  const text = String(value).trim()
  if (/^\d{2}-\d{2}-\d{4}$/.test(text)) return text

  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    const [yyyy, mm, dd] = text.split('-')
    return `${dd}-${mm}-${yyyy}`
  }

  const parsed = new Date(text)
  if (!Number.isNaN(parsed.getTime())) {
    const dd = String(parsed.getDate()).padStart(2, '0')
    const mm = String(parsed.getMonth() + 1).padStart(2, '0')
    const yyyy = parsed.getFullYear()
    return `${dd}-${mm}-${yyyy}`
  }

  return text
}

const sha256Hex = (value) =>
  crypto.createHash('sha256').update(value).digest('hex')

const hmacSha256Hex = (secret, value) =>
  crypto.createHmac('sha256', secret).update(value).digest('hex')

const randomNonceHex = () => crypto.randomBytes(32).toString('hex')

const buildHeaders = async (path) => {
  const timestamp = String(Date.now())
  const nonce = randomNonceHex()
  const payloadHash = sha256Hex('')
  const signature = hmacSha256Hex(
    signingSecret,
    ['GET', path, timestamp, nonce, payloadHash, apiKey].join('\n'),
  )

  return {
    'x-api-key': apiKey,
    Accept: 'application/json',
    'x-irctc-sdk-ts': timestamp,
    'x-irctc-sdk-nonce': nonce,
    'x-irctc-sdk-payload-sha256': payloadHash,
    'x-irctc-sdk-signature': signature,
    'x-irctc-sdk-version': SDK_VERSION,
  }
}

const readJson = async (response) => {
  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    return response.json()
  }
  return response.text()
}

const fetchIrctcJson = async (path) => {
  if (!apiKey) {
    return { success: false, error: 'IRCTC_API_KEY is missing on the backend.' }
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'GET',
    headers: await buildHeaders(path),
  })

  const body = await readJson(response)
  if (!response.ok) {
    return {
      success: false,
      status: response.status,
      error: body?.error || body?.message || body || `HTTP ${response.status}`,
      code: response.status === 429 ? 'RATE_LIMIT' : response.status === 401 || response.status === 403 ? 'AUTH' : 'HTTP_ERROR',
    }
  }

  if (body?.success === false || body?.type === 'error') {
    return {
      success: false,
      error: body?.message || body?.error || 'IRCTC request failed.',
      code: 'API_ERROR',
      data: body?.data || null,
    }
  }

  if (body?.success === true) {
    return body
  }

  return {
    success: true,
    data: body?.data || body,
  }
}

const normalizePnrSnapshot = (pnr, payload = {}) => {
  const data = payload?.data || payload || {}
  const train = data?.train || {}
  const journey = data?.journey || {}
  const passengers = Array.isArray(data?.passengers) ? data.passengers : Array.isArray(payload?.passengers) ? payload.passengers : []

  return {
    pnr: toTrimmedString(String(data?.pnr || payload?.pnr || pnr || '')),
    status: toTrimmedString(data?.status || payload?.status || 'CNF', 'CNF'),
    trainNumber: toTrimmedString(String(train.number || train.trainNumber || data?.trainNumber || payload?.trainNumber || '')),
    trainName: toTrimmedString(train.name || data?.trainName || payload?.trainName || 'Train details'),
    boardingStation:
      toTrimmedString(payload?.boardingStation) ||
      [journey.from?.name, journey.from?.code].filter(Boolean).join(' ') ||
      toTrimmedString(data?.boardingStation),
    destinationStation:
      toTrimmedString(payload?.destinationStation) ||
      [journey.to?.name, journey.to?.code].filter(Boolean).join(' ') ||
      toTrimmedString(data?.destinationStation),
    dateOfJourney:
      toTrimmedString(payload?.dateOfJourney) ||
      toTrimmedString(data?.dateOfJourney || journey.departure || journey.date),
    passengers: passengers.map((passenger) => {
      const seat = toTrimmedString(String(passenger?.seat || ''))
      const [coachFromSeat, berthFromSeat] = seat.includes('-') ? seat.split('-') : ['', '']

      return {
        bookingStatus: toTrimmedString(passenger?.bookingStatus || passenger?.status || 'CNF', 'CNF'),
        currentStatus: toTrimmedString(passenger?.currentStatus || passenger?.status || 'CNF', 'CNF'),
        coach: toTrimmedString(passenger?.coach || coachFromSeat),
        berth: toTrimmedString(passenger?.berth || berthFromSeat),
        berthType: toTrimmedString(passenger?.berthType || passenger?.berth_type),
      }
    }),
  }
}

const hasUsablePnrSnapshot = (pnrData) =>
  Boolean(pnrData?.pnr && pnrData?.trainNumber && pnrData?.trainName)

const canUseDemoFallback = (result) => {
  const message = String(result?.error || '').toLowerCase()
  return (
    isDemoPnrEnabled() &&
    result?.code !== 'RATE_LIMIT' &&
    result?.code !== 'AUTH' &&
    !message.includes('usage limit') &&
    !message.includes('billing') &&
    !message.includes('api key')
  )
}

const normalizeStationToken = (value) =>
  String(value ?? '')
    .toUpperCase()
    .replace(/\([^)]*\)/g, ' ')
    .replace(/\b(JN|JUNCTION|STATION|RAILWAY|RS|ROAD)\b/g, ' ')
    .replace(/[^A-Z0-9]/g, '')
    .trim()

const parseStationLabel = (value) => {
  const text = toTrimmedString(value)
  if (!text) return { name: '', code: '' }

  const bracketCode = text.match(/\(([A-Z0-9]{1,6})\)/i)?.[1] || ''
  const trailingCode = text.match(/\b([A-Z0-9]{1,6})\b$/i)?.[1] || ''
  const code = bracketCode || trailingCode
  const name = text
    .replace(/\(([A-Z0-9]{1,6})\)/gi, ' ')
    .replace(/\b([A-Z0-9]{1,6})\b$/i, (match) => (match.toUpperCase() === code.toUpperCase() ? '' : match))
    .replace(/\s+/g, ' ')
    .trim()

  return {
    name: name || text,
    code: code.toUpperCase(),
  }
}

const mapRouteStation = (station = {}, index = 0) => ({
  code: toTrimmedString(
    station.stationCode ||
      station.station_code ||
      station.stnCode ||
      station.stn_code ||
      station.code ||
      station.stn ||
      '',
  ).toUpperCase(),
  name: toTrimmedString(
    station.stationName ||
      station.station_name ||
      station.stnName ||
      station.stn_name ||
      station.name ||
      station.station ||
      '',
  ),
  sequence: Math.max(
    1,
    toNumber(
      station.stopNo ||
        station.stop_no ||
        station.sequence ||
        station.seq ||
        station.sno ||
        index + 1,
      index + 1,
    ),
  ),
  day: toTrimmedString(String(station.day || station.dayCount || station.day_count || '')),
  distance: toTrimmedString(String(station.distance || station.distance_from_source || station.km || '')),
  scheduledArrival: toTrimmedString(
    station.scheduledArrival ||
      station.arrival_time ||
      station.arrivalTime ||
      station.arr ||
      station.scharr ||
      station.sched_arrival ||
      '',
  ),
  scheduledDeparture: toTrimmedString(
    station.scheduledDeparture ||
      station.departure_time ||
      station.departureTime ||
      station.dep ||
      station.schdep ||
      station.sched_departure ||
      '',
  ),
  liveArrival: toTrimmedString(
    station.liveArrival ||
      station.actual_arrival ||
      station.actualArrival ||
      station.actarr ||
      '',
  ),
  liveDeparture: toTrimmedString(
    station.liveDeparture ||
      station.actual_departure ||
      station.actualDeparture ||
      station.actdep ||
      '',
  ),
  haltTime: toTrimmedString(
    station.haltTime ||
      station.halt_time ||
      station.halt ||
      '',
  ),
})

const buildStationAliasSet = (station = {}) => {
  const aliases = new Set()
  const code = normalizeStationToken(station.code)
  const name = normalizeStationToken(station.name)
  const rawName = normalizeStationToken(`${station.name} ${station.code}`)

  if (code) aliases.add(code)
  if (name) aliases.add(name)
  if (rawName) aliases.add(rawName)

  return aliases
}

const pickDisplayEta = (station = {}) => {
  const departure = station.liveDeparture || station.scheduledDeparture
  const arrival = station.liveArrival || station.scheduledArrival
  if (departure) return departure
  if (arrival) return arrival
  return 'TBA'
}

const formatDistanceLabel = (station = {}) => {
  if (!station.distance) return ''
  const raw = String(station.distance).trim()
  return /km$/i.test(raw) ? raw : `${raw} km`
}

const extractMinutes = (value) => {
  const match = String(value || '').match(/\d+/)
  return match ? Number(match[0]) : 0
}

const getStationMinutesFromNow = (station = {}) => {
  const timeText = station.liveArrival || station.scheduledArrival || station.liveDeparture || station.scheduledDeparture
  if (!timeText) return Number.POSITIVE_INFINITY

  const match = String(timeText).match(/(\d{1,2}):(\d{2})/)
  if (!match) return Number.POSITIVE_INFINITY

  const now = new Date()
  const stationTime = new Date(now)
  stationTime.setHours(Number(match[1]), Number(match[2]), 0, 0)
  if (stationTime.getTime() < now.getTime()) {
    stationTime.setDate(stationTime.getDate() + 1)
  }

  return Math.round((stationTime.getTime() - now.getTime()) / 60000)
}

const canChefPrepareForStation = (chef = {}, dish = {}, station = {}) => {
  const stationMinutes = getStationMinutesFromNow(station)
  const prepMinutes = extractMinutes(dish.prepTime || chef.prepTime)
  if (!Number.isFinite(stationMinutes) || !prepMinutes) return true
  return prepMinutes + 10 <= stationMinutes
}

const mergeRouteAndLiveStations = (summary = {}) => {
  const routeStations = Array.isArray(summary?.route) ? summary.route.map(mapRouteStation) : []
  const liveStations = Array.isArray(summary?.live?.stations)
    ? summary.live.stations.map(mapRouteStation)
    : []

  if (!liveStations.length) {
    return routeStations
  }

  const liveMap = new Map()
  liveStations.forEach((station) => {
    const key = station.code || normalizeStationToken(station.name)
    if (key) liveMap.set(key, station)
  })

  const merged = routeStations.map((station) => {
    const liveStation = liveMap.get(station.code || normalizeStationToken(station.name))
    return liveStation
      ? {
          ...station,
          liveArrival: liveStation.liveArrival || station.liveArrival,
          liveDeparture: liveStation.liveDeparture || station.liveDeparture,
          haltTime: liveStation.haltTime || station.haltTime,
        }
      : station
  })

  if (merged.length) {
    return merged
  }

  return liveStations
}

const findStationIndex = (stations, descriptorText) => {
  const descriptor = parseStationLabel(descriptorText)
  const targetCode = normalizeStationToken(descriptor.code)
  const targetName = normalizeStationToken(descriptor.name || descriptorText)

  return stations.findIndex((station) => {
    const stationCode = normalizeStationToken(station.code)
    const stationName = normalizeStationToken(station.name)
    return (
      (targetCode && stationCode === targetCode) ||
      (targetName && stationName === targetName) ||
      (targetName && `${stationName}${stationCode}` === targetName)
    )
  })
}

const getJourneyStations = (pnrData, summary) => {
  const mergedStations = mergeRouteAndLiveStations(summary)
  if (!mergedStations.length) return []

  const boardingIndex = findStationIndex(mergedStations, pnrData.boardingStation)
  const destinationIndex = findStationIndex(mergedStations, pnrData.destinationStation)

  const startIndex = boardingIndex >= 0 ? boardingIndex : 0
  const endIndex = destinationIndex >= 0 ? destinationIndex : mergedStations.length - 1

  if (startIndex <= endIndex) {
    return mergedStations.slice(startIndex, endIndex + 1)
  }

  return mergedStations
}

const fetchTrainSummary = async (trainNumber, dateOfJourney) => {
  const trainNo = onlyDigits(trainNumber).slice(0, 5)
  if (trainNo.length !== 5) {
    return { success: false, error: 'Invalid train number for route lookup.' }
  }

  const date = formatDateForApi(dateOfJourney)
  const [trainInfoResult, liveResult] = await Promise.all([
    fetchIrctcJson(`/api/getTrainInfo/${trainNo}`),
    fetchIrctcJson(`/api/trackTrain/${trainNo}/${encodeURIComponent(date)}`),
  ])

  if (!trainInfoResult?.success && !liveResult?.success) {
    if (canUseDemoFallback(trainInfoResult) && canUseDemoFallback(liveResult)) {
      return {
        success: true,
        data: buildDemoTrainSummary(),
      }
    }

    return {
      success: false,
      error: trainInfoResult?.error || liveResult?.error || 'Unable to fetch train route details.',
    }
  }

  return {
    success: true,
    data: {
      trainInfo: trainInfoResult?.data?.trainInfo || trainInfoResult?.data || {},
      route: trainInfoResult?.data?.route || [],
      live: liveResult?.data || {},
    },
  }
}

const getCoverageMatchValues = (chef, menu, station) => {
  const stationAliases = buildStationAliasSet(station)
  const chefStation = normalizeStationToken(chef.nearestStation)
  const availableDishes = Array.isArray(menu?.dishes)
    ? menu.dishes.filter((dish) => dish.available !== false)
    : []

  const matchingDishes = availableDishes.filter((dish) => {
    const dishStations = toStringArray(dish.stations)
    const stationMatches = !dishStations.length && chefStation
      ? stationAliases.has(chefStation)
      : dishStations.some((value) => stationAliases.has(normalizeStationToken(value)))

    return stationMatches && canChefPrepareForStation(chef, dish, station)
  })

  return {
    matches: matchingDishes.length > 0,
    matchingDishes,
  }
}

const fetchChefDirectory = async () => {
  const approvals = await chefRegister
    .find({ reviewStatus: 'approved', isActive: true })
    .populate('createdBy', 'name email phone')
    .lean()

  if (!approvals.length) {
    return []
  }

  const authIds = approvals
    .map((approval) => approval.createdBy?._id)
    .filter(Boolean)

  const menus = await chefMenu
    .find({ createdBy: { $in: authIds }, status: 'published' })
    .lean()

  const menuMap = new Map(menus.map((menu) => [String(menu.createdBy), menu]))

  return approvals
    .map((approval) => {
      const authUser = approval.createdBy || {}
      const menu = menuMap.get(String(authUser._id || ''))
      if (!menu) return null

      return {
        approval,
        authUser,
        menu,
      }
    })
    .filter(Boolean)
}

const buildChefListForStationFromDirectory = (chefDirectory, station) =>
  chefDirectory
    .map(({ approval, authUser, menu }) => {
      const { matches, matchingDishes } = getCoverageMatchValues(approval, menu, station)
      if (!matches || !matchingDishes.length) return null

      const prices = matchingDishes.map((dish) => Math.max(0, toNumber(dish.price, 0))).filter((price) => price > 0)

      return {
        id: String(authUser._id),
        registerId: String(approval._id),
        name: toTrimmedString(authUser.name || approval.kitchenName || 'Chef'),
        kitchenName: toTrimmedString(approval.kitchenName || ''),
        specialty: toTrimmedString(approval.speciality || approval.cuisine || 'Homemade meals'),
        cuisine: toTrimmedString(approval.cuisine || ''),
        rating: 4.7,
        dishes: matchingDishes.length,
        price: prices.length ? `Rs ${Math.min(...prices)} - Rs ${Math.max(...prices)}` : 'Menu available',
        tag: matchingDishes.length >= 6 ? 'Top Rated' : matchingDishes.length >= 3 ? 'Popular' : 'New',
        prepTime: toTrimmedString(approval.prepTime || ''),
        nearestStation: toTrimmedString(approval.nearestStation || ''),
        phone: toTrimmedString(authUser.phone || ''),
      }
    })
    .filter(Boolean)

const buildChefListForStation = async (station) =>
  buildChefListForStationFromDirectory(await fetchChefDirectory(), station)

const buildJourneyContext = async (pnrData) => {
  const summaryResult = await fetchTrainSummary(pnrData.trainNumber, pnrData.dateOfJourney)
  if (!summaryResult?.success) {
    return { success: false, error: summaryResult?.error || 'Unable to fetch journey route.' }
  }

  const journeyStations = getJourneyStations(pnrData, summaryResult.data)
  const chefDirectory = await fetchChefDirectory()

  const stationEntries = journeyStations.map((station) => ({
    station,
    chefs: buildChefListForStationFromDirectory(chefDirectory, station),
  }))

  const availableStations = stationEntries
    .filter((entry) => entry.chefs.length > 0)
    .map((entry) => ({
      code: entry.station.code,
      name: entry.station.name,
      distance: formatDistanceLabel(entry.station),
      eta: pickDisplayEta(entry.station),
      chefs: entry.chefs.length,
      sequence: entry.station.sequence,
      day: entry.station.day,
      scheduledArrival: entry.station.scheduledArrival,
      scheduledDeparture: entry.station.scheduledDeparture,
      liveArrival: entry.station.liveArrival,
      liveDeparture: entry.station.liveDeparture,
      haltTime: entry.station.haltTime,
    }))

  if (!availableStations.length && isDemoPnrEnabled()) {
    return {
      success: true,
      data: {
        pnrData,
        trainSummary: summaryResult.data,
        availableStations: buildDemoAvailableStations(),
        stationChefs: {},
      },
    }
  }

  return {
    success: true,
    data: {
      pnrData,
      trainSummary: summaryResult.data,
      availableStations,
      stationChefs: Object.fromEntries(
        stationEntries
          .filter((entry) => entry.chefs.length > 0)
          .map((entry) => [entry.station.code, entry.chefs]),
      ),
    },
  }
}

const resolvePnrSnapshot = async (req) => {
  const pnr = onlyDigits(req.body?.pnr || req.query?.pnr || '')
  const supplied = req.body?.pnrData

  if (supplied?.trainNumber && supplied?.trainName) {
    return { success: true, data: normalizePnrSnapshot(pnr || supplied.pnr, supplied) }
  }

  if (!pnr || pnr.length !== 10) {
    return { success: false, error: 'Valid PNR details are required.' }
  }

  const liveResult = await fetchIrctcJson(`/api/checkPNRStatus/${pnr}`)
  console.log('[PNR Debug] journey checkPNRStatus response:', {
    pnr,
    success: Boolean(liveResult?.success),
    status: liveResult?.status || 200,
    code: liveResult?.code || '',
    error: liveResult?.error || '',
    hasTrain: Boolean(liveResult?.data?.train || liveResult?.data?.trainNumber),
  })
  if (!liveResult?.success) {
    if (canUseDemoFallback(liveResult)) {
      return { success: true, data: buildDemoPnrSnapshot(pnr) }
    }

    return { success: false, error: liveResult?.error || 'Unable to fetch PNR details.', code: liveResult?.code }
  }

  const normalized = normalizePnrSnapshot(pnr, liveResult)
  if (!hasUsablePnrSnapshot(normalized)) {
    if (canUseDemoFallback(liveResult)) {
      return { success: true, data: buildDemoPnrSnapshot(pnr) }
    }

    return { success: false, error: 'Unable to read train details for this PNR.' }
  }

  return { success: true, data: normalized }
}

const getJourneySummary = async (req, res) => {
  try {
    const pnrResult = await resolvePnrSnapshot(req)
    if (!pnrResult?.success) {
      return res.status(400).json({ success: false, message: pnrResult?.error || 'Unable to resolve PNR data.' })
    }

    const journeyContext = await buildJourneyContext(pnrResult.data)
    if (!journeyContext?.success) {
      return res.status(400).json({ success: false, message: journeyContext?.error || 'Unable to fetch stations.' })
    }

    return res.status(200).json({
      success: true,
      message: 'Journey stations fetched successfully.',
      data: {
        pnrData: journeyContext.data.pnrData,
        availableStations: journeyContext.data.availableStations,
      },
    })
  } catch (err) {
    console.error('Error occurred while getJourneySummary in userJourney controller:', err.message)
    return res.status(500).json({ success: false, message: 'Internal server error while fetching journey summary.' })
  }
}

const getStationChefs = async (req, res) => {
  try {
    const stationCode = toTrimmedString(req.params.stationCode).toUpperCase()
    if (!stationCode) {
      return res.status(400).json({ success: false, message: 'Station code is required.' })
    }

    const station = { code: stationCode, name: req.query?.stationName || stationCode }
    let chefs = await buildChefListForStation(station)

    if (!chefs.length && isDemoPnrEnabled()) {
      chefs = getDemoChefsForStation(stationCode)
    }

    return res.status(200).json({
      success: true,
      message: chefs.length ? 'Station chefs fetched successfully.' : 'No chefs available for this station yet.',
      data: {
        stationCode,
        chefs,
      },
    })
  } catch (err) {
    console.error('Error occurred while getStationChefs in userJourney controller:', err.message)
    return res.status(500).json({ success: false, message: 'Internal server error while fetching station chefs.' })
  }
}

const getChefMenuForStation = async (req, res) => {
  try {
    const stationCode = toTrimmedString(req.params.stationCode).toUpperCase()
    const chefId = toTrimmedString(req.params.chefId)

    if (!stationCode || !chefId) {
      return res.status(400).json({ success: false, message: 'Station and chef are required.' })
    }

    const approval = await chefRegister
      .findOne({ createdBy: chefId, reviewStatus: 'approved', isActive: true })
      .populate('createdBy', 'name email phone')
      .lean()

    if (!approval) {
      if (isDemoPnrEnabled()) {
        const demoMenu = getDemoChefMenu(stationCode, chefId)
        if (demoMenu) {
          return res.status(200).json({
            success: true,
            message: 'Demo chef menu fetched successfully.',
            data: demoMenu,
          })
        }
      }

      return res.status(404).json({ success: false, message: 'Chef not found for this station.' })
    }

    const menu = await chefMenu.findOne({ createdBy: chefId, status: 'published' }).lean()
    if (!menu) {
      return res.status(404).json({ success: false, message: 'Published menu not found for this chef.' })
    }

    const station = { code: stationCode, name: req.query?.stationName || stationCode }
    const { matchingDishes } = getCoverageMatchValues(approval, menu, station)

    return res.status(200).json({
      success: true,
      message: 'Chef menu fetched successfully.',
      data: {
        chef: {
          id: String(approval.createdBy?._id || chefId),
          registerId: String(approval._id),
          name: toTrimmedString(approval.createdBy?.name || approval.kitchenName || 'Chef'),
          kitchenName: toTrimmedString(approval.kitchenName || ''),
          specialty: toTrimmedString(approval.speciality || approval.cuisine || 'Homemade meals'),
          cuisine: toTrimmedString(approval.cuisine || ''),
          rating: 4.7,
          prepTime: toTrimmedString(approval.prepTime || ''),
          nearestStation: toTrimmedString(approval.nearestStation || ''),
          phone: toTrimmedString(approval.createdBy?.phone || ''),
        },
        menuItems: matchingDishes.map((dish) => ({
          id: dish.dishId,
          name: dish.name || '',
          desc: dish.description || '',
          price: Math.max(0, toNumber(dish.price, 0)),
          isVeg: !toTrimmedString(dish.category).toLowerCase().includes('non'),
          category: dish.category || 'Main Course',
          imageUrl: dish.imageUrl || '',
          servingSize: dish.servingSize || '',
          spiceLevel: dish.spiceLevel || '',
        })),
      },
    })
  } catch (err) {
    console.error('Error occurred while getChefMenuForStation in userJourney controller:', err.message)
    return res.status(500).json({ success: false, message: 'Internal server error while fetching chef menu.' })
  }
}

const upsertOrderDraft = async (req, res) => {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' })
    }

    const pnrData = req.body?.pnrData && typeof req.body.pnrData === 'object' ? req.body.pnrData : {}
    const pnr = onlyDigits(req.body?.pnr || pnrData?.pnr || '')
    if (!pnr) {
      return res.status(400).json({ success: false, message: 'PNR is required to save the order draft.' })
    }

    const hasCartItems = Array.isArray(req.body?.cartItems || req.body?.items)
    const cartItems = hasCartItems
      ? (req.body.cartItems || req.body.items).map((item) => {
          const price = Math.max(0, toNumber(item?.price, 0))
          const quantity = Math.max(0, toNumber(item?.quantity, 0))
          return {
            ...item,
            price,
            quantity,
            lineTotal: roundCurrency(price * quantity),
          }
        })
      : []
    const billing = cartItems.length ? calculateBillingSummary(cartItems) : (req.body?.billing || {})
    const currentStep = toTrimmedString(req.body?.currentStep || 'pnr')

    const update = {
      pnr,
      currentStep,
      status: 'active',
    }

    if (Object.keys(pnrData).length) update.pnrData = pnrData
    if (req.body?.trainSummary) update.trainSummary = req.body.trainSummary
    if (Array.isArray(req.body?.availableStations)) update.availableStations = req.body.availableStations
    if (req.body?.selectedStation) update.selectedStation = req.body.selectedStation
    if (req.body?.chefId) update.chefId = toTrimmedString(req.body.chefId)
    if (req.body?.chef) update.chef = req.body.chef
    if (Array.isArray(req.body?.menuItems)) update.menuItems = req.body.menuItems
    if (hasCartItems) update.cartItems = cartItems
    if (cartItems.length || req.body?.billing) update.billing = billing
    if (req.body?.payment) update.payment = req.body.payment

    const draft = await userOrderDraft.findOneAndUpdate(
      { createdBy: userId, pnr, status: 'active' },
      { $set: update },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    ).lean()

    return res.status(200).json({
      success: true,
      message: 'Order draft saved successfully.',
      data: draft,
    })
  } catch (err) {
    console.error('Error occurred while upsertOrderDraft in userJourney controller:', err.message)
    return res.status(500).json({ success: false, message: 'Unable to save order draft right now.' })
  }
}

const createJourneyOrder = async (req, res) => {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' })
    }

    const chefId = toTrimmedString(req.body?.chefId)
    const stationCode = toTrimmedString(req.body?.stationCode).toUpperCase()
    const rawItems = Array.isArray(req.body?.items) ? req.body.items : []

    if (!chefId || !stationCode) {
      return res.status(400).json({ success: false, message: 'Chef and station are required.' })
    }

    if (!rawItems.length) {
      return res.status(400).json({ success: false, message: 'Select at least one menu item.' })
    }

    const pnrResult = await resolvePnrSnapshot(req)
    if (!pnrResult?.success) {
      return res.status(400).json({ success: false, message: pnrResult?.error || 'Unable to resolve PNR details.' })
    }

    const pnrData = pnrResult.data
    const summaryResult = await fetchTrainSummary(pnrData.trainNumber, pnrData.dateOfJourney)
    if (!summaryResult?.success) {
      return res.status(400).json({ success: false, message: summaryResult?.error || 'Unable to fetch train route details.' })
    }

    const journeyStations = getJourneyStations(pnrData, summaryResult.data)
    const selectedStation = journeyStations.find((station) => station.code === stationCode)
    if (!selectedStation) {
      return res.status(400).json({ success: false, message: 'Selected station does not belong to this journey.' })
    }

    const approval = await chefRegister
      .findOne({ createdBy: chefId, reviewStatus: 'approved', isActive: true })
      .populate('createdBy', 'name email phone')
      .lean()

    let orderChefSnapshot = null
    let dishMap = null
    let menuSnapshot = []

    if (!approval && isDemoPnrEnabled()) {
      const demoMenu = getDemoChefMenu(stationCode, chefId)
      if (demoMenu) {
        orderChefSnapshot = {
          authId: demoMenu.chef.id,
          registerId: demoMenu.chef.registerId,
          name: demoMenu.chef.name,
          kitchenName: demoMenu.chef.kitchenName,
          cuisine: demoMenu.chef.cuisine,
          speciality: demoMenu.chef.specialty,
          nearestStation: demoMenu.chef.nearestStation,
          prepTime: demoMenu.chef.prepTime,
          phone: demoMenu.chef.phone,
          email: demoMenu.chef.email,
        }
        dishMap = new Map(
          demoMenu.menuItems.map((dish) => [
            dish.id,
            {
              dishId: dish.id,
              name: dish.name,
              description: dish.desc,
              category: dish.category,
              price: dish.price,
              imageUrl: dish.imageUrl,
              servingSize: dish.servingSize,
              spiceLevel: dish.spiceLevel,
            },
          ]),
        )
        menuSnapshot = demoMenu.menuItems
      }
    }

    if (!dishMap) {
      if (!approval) {
        return res.status(404).json({ success: false, message: 'Chef not found or not active.' })
      }

      const menu = await chefMenu.findOne({ createdBy: chefId, status: 'published' }).lean()
      if (!menu) {
        return res.status(404).json({ success: false, message: 'Published menu not found for this chef.' })
      }

      const { matchingDishes } = getCoverageMatchValues(approval, menu, selectedStation)
      dishMap = new Map(matchingDishes.map((dish) => [dish.dishId, dish]))
      menuSnapshot = matchingDishes.map((dish) => ({
        dishId: dish.dishId,
        name: dish.name || '',
        description: dish.description || '',
        category: dish.category || '',
        price: Math.max(0, toNumber(dish.price, 0)),
        imageUrl: dish.imageUrl || '',
        servingSize: dish.servingSize || '',
        spiceLevel: dish.spiceLevel || '',
        stations: dish.stations || [],
        available: dish.available !== false,
      }))
      orderChefSnapshot = {
        authId: approval.createdBy?._id || chefId,
        registerId: approval._id,
        name: toTrimmedString(approval.createdBy?.name || approval.kitchenName || 'Chef'),
        kitchenName: toTrimmedString(approval.kitchenName || ''),
        cuisine: toTrimmedString(approval.cuisine || ''),
        speciality: toTrimmedString(approval.speciality || ''),
        nearestStation: toTrimmedString(approval.nearestStation || ''),
        prepTime: toTrimmedString(approval.prepTime || ''),
        phone: toTrimmedString(approval.createdBy?.phone || ''),
        email: toTrimmedString(approval.createdBy?.email || ''),
      }
    }

    const items = rawItems
      .map((item) => {
        const dishId = toTrimmedString(item?.dishId || item?.id)
        const quantity = Math.max(1, toNumber(item?.quantity, 1))
        const dish = dishMap.get(dishId)
        if (!dish) return null

        const price = Math.max(0, toNumber(dish.price, 0))
        return {
          dishId,
          name: dish.name || '',
          description: dish.description || '',
          category: dish.category || '',
          price,
          quantity,
          lineTotal: roundCurrency(price * quantity),
          imageUrl: dish.imageUrl || '',
          servingSize: dish.servingSize || '',
          spiceLevel: dish.spiceLevel || '',
        }
      })
      .filter(Boolean)

    if (!items.length) {
      return res.status(400).json({ success: false, message: 'Selected items are not available for this station.' })
    }

    let paymentMode = toTrimmedString(req.body?.payment?.mode).toLowerCase()
    const paymentMethod = toTrimmedString(req.body?.payment?.method).toLowerCase()
    const paymentProvider = toTrimmedString(req.body?.payment?.provider || DEFAULT_PAYMENT_PROVIDER)
    const paymentUpiId = paymentMethod === 'upi' ? toTrimmedString(req.body?.payment?.upiId) : ''

    if (paymentMode && paymentMode !== ONLINE_PAYMENT_MODE) {
      return res.status(400).json({ success: false, message: 'Only online payment is available right now.' })
    }

    if (!paymentMode && paymentMethod) {
      paymentMode = ONLINE_PAYMENT_MODE
    }

    const billingSummary = calculateBillingSummary(items)
    const { totalItems, subtotal, gstRate, gstAmount, deliveryCharge, totalAmount } = billingSummary
    const hasPaidOnline = paymentMode === ONLINE_PAYMENT_MODE && Boolean(paymentMethod)
    const invoiceNumber = hasPaidOnline ? buildReference('HME') : ''
    const paymentReference = hasPaidOnline ? buildReference('PAY') : ''
    const paidAt = hasPaidOnline ? new Date() : null

    const order = await userOrder.create({
      createdBy: userId,
      pnr: pnrData.pnr || onlyDigits(req.body?.pnr || ''),
      trainNumber: pnrData.trainNumber,
      trainName: pnrData.trainName,
      boardingStation: pnrData.boardingStation,
      destinationStation: pnrData.destinationStation,
      dateOfJourney: pnrData.dateOfJourney,
      passengers: pnrData.passengers,
      pnrData,
      trainSummary: summaryResult.data,
      availableStations: journeyStations,
      selectedStation: {
        code: selectedStation.code,
        name: selectedStation.name,
        sequence: selectedStation.sequence,
        day: selectedStation.day,
        distance: String(selectedStation.distance || ''),
        scheduledArrival: selectedStation.scheduledArrival,
        scheduledDeparture: selectedStation.scheduledDeparture,
        liveArrival: selectedStation.liveArrival,
        liveDeparture: selectedStation.liveDeparture,
        haltTime: selectedStation.haltTime,
      },
      chef: orderChefSnapshot,
      items,
      menuSnapshot,
      totalItems,
      subtotal,
      gstRate,
      gstAmount,
      deliveryCharge,
      totalAmount,
      currency: DEFAULT_CURRENCY,
      invoiceNumber,
      orderStatus: hasPaidOnline ? 'placed' : 'pending_payment',
      chefStatus: hasPaidOnline ? 'new' : 'new',
      paymentStatus: hasPaidOnline ? 'paid' : 'pending',
      paymentMethod,
      paymentMode,
      paymentProvider: hasPaidOnline ? paymentProvider : '',
      paymentReference,
      paymentUpiId: hasPaidOnline ? paymentUpiId : '',
      paidAt,
      source: toTrimmedString(req.body?.source || 'pnr') || 'pnr',
    })

    await userOrderDraft.findOneAndUpdate(
      { createdBy: userId, pnr: order.pnr, status: 'active' },
      {
        $set: {
          status: 'completed',
          currentStep: 'completed',
          completedOrder: order._id,
          payment: {
            mode: order.paymentMode,
            method: order.paymentMethod,
            provider: order.paymentProvider,
            upiId: order.paymentUpiId,
            reference: order.paymentReference,
          },
          billing: billingSummary,
        },
      },
    )

    if (hasPaidOnline) {
      emitToChef(String(order.chef?.authId || chefId), 'chef:new-order', mapUserOrderResponse(order))
    }

    return res.status(201).json({
      success: true,
      message: hasPaidOnline ? 'Journey order placed successfully.' : 'Journey order saved successfully.',
      data: {
        orderId: String(order._id),
        invoiceNumber: order.invoiceNumber,
        pnr: order.pnr,
        trainNumber: order.trainNumber,
        trainName: order.trainName,
        boardingStation: order.boardingStation,
        destinationStation: order.destinationStation,
        dateOfJourney: order.dateOfJourney,
        passengers: order.passengers,
        pnrData: order.pnrData,
        trainSummary: order.trainSummary,
        availableStations: order.availableStations,
        selectedStation: order.selectedStation,
        chef: order.chef,
        items: order.items,
        menuSnapshot: order.menuSnapshot,
        subtotal: order.subtotal,
        gstRate: order.gstRate,
        gstAmount: order.gstAmount,
        deliveryCharge: order.deliveryCharge,
        totalAmount: order.totalAmount,
        currency: order.currency,
        totalItems: order.totalItems,
        paymentStatus: order.paymentStatus,
        paymentMode: order.paymentMode,
        paymentMethod: order.paymentMethod,
        paymentProvider: order.paymentProvider,
        paymentReference: order.paymentReference,
        paymentUpiId: order.paymentUpiId,
        paidAt: order.paidAt,
        orderStatus: order.orderStatus,
        chefStatus: order.chefStatus,
        acceptedAt: order.acceptedAt,
        preparedAt: order.preparedAt,
        readyForPickupAt: order.readyForPickupAt,
        createdAt: order.createdAt,
      },
    })
  } catch (err) {
    console.error('Error occurred while createJourneyOrder in userJourney controller:', err.message)
    return res.status(500).json({ success: false, message: 'Internal server error while saving the order.' })
  }
}

const mapUserOrderResponse = (order) => ({
  orderId: String(order._id),
  invoiceNumber: order.invoiceNumber,
  pnr: order.pnr,
  trainNumber: order.trainNumber,
  trainName: order.trainName,
  boardingStation: order.boardingStation,
  destinationStation: order.destinationStation,
  dateOfJourney: order.dateOfJourney,
  passengers: order.passengers,
  pnrData: order.pnrData,
  trainSummary: order.trainSummary,
  availableStations: order.availableStations,
  selectedStation: order.selectedStation,
  chef: order.chef,
  items: order.items,
  menuSnapshot: order.menuSnapshot,
  subtotal: order.subtotal,
  gstRate: order.gstRate,
  gstAmount: order.gstAmount,
  deliveryCharge: order.deliveryCharge,
  totalAmount: order.totalAmount,
  currency: order.currency,
  totalItems: order.totalItems,
  paymentStatus: order.paymentStatus,
  paymentMode: order.paymentMode,
  paymentMethod: order.paymentMethod,
  paymentProvider: order.paymentProvider,
  paymentReference: order.paymentReference,
  paymentUpiId: order.paymentUpiId,
  paidAt: order.paidAt,
  orderStatus: order.orderStatus,
  chefStatus: order.chefStatus,
  acceptedAt: order.acceptedAt,
  preparedAt: order.preparedAt,
  readyForPickupAt: order.readyForPickupAt,
  createdAt: order.createdAt,
  updatedAt: order.updatedAt,
})

const getUserOrders = async (req, res) => {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' })
    }

    const orders = await userOrder
      .find({ createdBy: userId })
      .sort({ createdAt: -1 })
      .limit(12)
      .lean()

    return res.status(200).json({
      success: true,
      data: orders.map(mapUserOrderResponse),
    })
  } catch (err) {
    console.error('Error occurred while getUserOrders in userJourney controller:', err.message)
    return res.status(500).json({ success: false, message: 'Unable to fetch your orders right now.' })
  }
}

const getUserOrderById = async (req, res) => {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' })
    }

    const order = await userOrder.findOne({ _id: req.params.orderId, createdBy: userId }).lean()
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' })
    }

    return res.status(200).json({
      success: true,
      data: mapUserOrderResponse(order),
    })
  } catch (err) {
    console.error('Error occurred while getUserOrderById in userJourney controller:', err.message)
    return res.status(500).json({ success: false, message: 'Unable to fetch order details right now.' })
  }
}

module.exports = {
  getJourneySummary,
  getStationChefs,
  getChefMenuForStation,
  createJourneyOrder,
  upsertOrderDraft,
  getUserOrders,
  getUserOrderById,
}
