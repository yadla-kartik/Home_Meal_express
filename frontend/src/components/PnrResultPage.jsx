import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import {
  TrainFront,
  MapPin,
  CalendarDays,
  ArrowRight,
  UserCircle2,
  ChefHat,
  MapPinned,
  Clock3,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  Star,
  UtensilsCrossed,
  X,
} from 'lucide-react'
import Navbar from '../apps/user/Navbar'
import {
  checkPnrDetails,
  getJourneySummary,
  getStationChefs,
} from '../../services/userAuthService'

const PNR_DATA_SESSION_KEY = 'pnrSessionData'
const PNR_INPUT_SESSION_KEY = 'pnrSessionInput'
const JOURNEY_STATIONS_SESSION_KEY = 'pnrJourneyStations'
const SELECTED_STATION_SESSION_KEY = 'pnrSelectedStation'

const TAG_STYLES = {
  'Top Rated': 'bg-amber-50 text-amber-600 border-amber-200',
  Popular: 'bg-orange-50 text-orange-600 border-orange-200',
  Budget: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  New: 'bg-blue-50 text-blue-600 border-blue-200',
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.38, ease: 'easeOut' } },
}

function PnrResultPage() {
  const { pnrNumber } = useParams()
  const navigate = useNavigate()
  const [pnrData, setPnrData] = React.useState(null)
  const [stations, setStations] = React.useState([])
  const [selectedStation, setSelectedStation] = React.useState(null)
  const [chefMap, setChefMap] = React.useState({})
  const [loading, setLoading] = React.useState(true)
  const [stationLoading, setStationLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const chefCacheRef = React.useRef({})

  const loadStationChefs = React.useCallback(async (station) => {
    if (!station?.code) return
    if (chefCacheRef.current[station.code]) return

    setStationLoading(true)
    const response = await getStationChefs(station.code, station.name)
    const chefs = Array.isArray(response?.data?.chefs) ? response.data.chefs : []
    chefCacheRef.current[station.code] = chefs
    setChefMap((prev) => ({
      ...prev,
      [station.code]: chefs,
    }))
    setStationLoading(false)
  }, [])

  React.useEffect(() => {
    let isMounted = true

    const loadJourney = async () => {
      setLoading(true)
      setError('')

      try {
        const storedPnr = sessionStorage.getItem(PNR_INPUT_SESSION_KEY)
        const storedData = sessionStorage.getItem(PNR_DATA_SESSION_KEY)

        let nextPnrData = null

        if (storedData && storedPnr === pnrNumber) {
          nextPnrData = JSON.parse(storedData)
        } else {
          const pnrResponse = await checkPnrDetails(pnrNumber)
          if (!pnrResponse?.success || !pnrResponse?.data) {
            throw new Error(pnrResponse?.message || 'Invalid PNR or not found.')
          }
          nextPnrData = pnrResponse.data
          sessionStorage.setItem(PNR_DATA_SESSION_KEY, JSON.stringify(nextPnrData))
          sessionStorage.setItem(PNR_INPUT_SESSION_KEY, pnrNumber)
        }

        const summaryResponse = await getJourneySummary({
          pnr: pnrNumber,
          pnrData: nextPnrData,
        })

        if (!summaryResponse?.success) {
          throw new Error(summaryResponse?.message || 'Unable to fetch chef service stations for this journey.')
        }

        const availableStations = Array.isArray(summaryResponse?.data?.availableStations)
          ? summaryResponse.data.availableStations
          : []

        if (!isMounted) return

        setPnrData(summaryResponse?.data?.pnrData || nextPnrData)
        setStations(availableStations)
        sessionStorage.setItem(JOURNEY_STATIONS_SESSION_KEY, JSON.stringify(availableStations))

        const storedSelectedStation = sessionStorage.getItem(SELECTED_STATION_SESSION_KEY)
        const parsedSelectedStation = storedSelectedStation ? JSON.parse(storedSelectedStation) : null
        const initialStation = availableStations.find((station) => station.code === parsedSelectedStation?.code) || availableStations[0] || null

        setSelectedStation(initialStation)
        if (initialStation) {
          sessionStorage.setItem(SELECTED_STATION_SESSION_KEY, JSON.stringify(initialStation))
          await loadStationChefs(initialStation)
        }
      } catch (err) {
        if (!isMounted) return
        setError(err.message || 'Something went wrong. Please try again.')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadJourney()

    return () => {
      isMounted = false
    }
  }, [pnrNumber, loadStationChefs])

  const handleBack = () => {
    sessionStorage.removeItem(PNR_DATA_SESSION_KEY)
    sessionStorage.removeItem(PNR_INPUT_SESSION_KEY)
    sessionStorage.removeItem(JOURNEY_STATIONS_SESSION_KEY)
    sessionStorage.removeItem(SELECTED_STATION_SESSION_KEY)
    navigate('/')
  }

  const handleSelectStation = async (station) => {
    setSelectedStation(station)
    sessionStorage.setItem(SELECTED_STATION_SESSION_KEY, JSON.stringify(station))
    await loadStationChefs(station)
  }

  const handleOrder = (chef) => {
    if (!selectedStation) return

    navigate(`/station/${selectedStation.code}/chef/${chef.id}`, {
      state: {
        pnrData,
        selectedStation,
      },
    })
  }

  const selectedChefs = selectedStation ? chefMap[selectedStation.code] || [] : []

  return (
    <div className="theme-app-shell min-h-screen bg-[#f8fafc]">
      <Navbar />

      <div className="pt-16">
        <div className="sticky top-16 z-30 border-b border-slate-100 bg-white/90 shadow-sm backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleBack}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-orange-300 hover:text-orange-500"
              >
                <ArrowLeft size={16} />
              </button>
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                  <TrainFront size={17} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-orange-500">Journey Result</p>
                  <p className="text-[13px] font-black leading-tight text-slate-800">{pnrNumber}</p>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleBack}
              className="hidden text-[12px] font-semibold text-slate-500 transition hover:text-orange-500 sm:block"
            >
              Check another PNR
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <Motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center gap-4 py-32"
            >
              <Loader2 size={32} className="animate-spin text-orange-400" />
              <p className="text-[14px] font-semibold text-slate-500">Fetching journey and chef service stations...</p>
            </Motion.div>
          ) : error ? (
            <Motion.div
              key="error"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center gap-4 px-4 py-32 text-center"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-400">
                <TrainFront size={28} />
              </div>
              <p className="text-[16px] font-black text-slate-800">Journey Data Not Available</p>
              <p className="max-w-sm text-[13px] text-slate-500">{error}</p>
              <button
                type="button"
                onClick={handleBack}
                className="mt-2 inline-flex items-center gap-2 rounded-[14px] bg-orange-500 px-5 py-2.5 text-[13px] font-black text-white shadow-[0_8px_20px_rgba(249,115,22,0.24)] transition hover:-translate-y-0.5"
              >
                <ArrowLeft size={14} strokeWidth={3} /> Try Another PNR
              </button>
            </Motion.div>
          ) : (
            <Motion.div
              key="result"
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
              className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-6 sm:px-6"
            >
              <Motion.div
                variants={fadeUp}
                className="overflow-hidden rounded-[20px] border border-slate-100 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.05)]"
              >
                <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-3.5">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                      <TrainFront size={15} />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-black text-slate-900">{pnrData?.trainName}</p>
                      <p className="text-[11px] font-medium text-slate-400">Train No. {pnrData?.trainNumber}</p>
                    </div>
                  </div>
                  <div className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-700">
                    <CheckCircle2 size={10} strokeWidth={3} /> Confirmed
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-0 divide-x divide-slate-100">
                  <div className="flex min-w-0 flex-1 items-center gap-2 px-5 py-3">
                    <div className="min-w-0 text-center">
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">From</p>
                      <p className="truncate text-[13px] font-black leading-tight text-slate-800">{pnrData?.boardingStation}</p>
                    </div>
                    <ArrowRight size={13} className="shrink-0 text-orange-400" />
                    <div className="min-w-0 text-center">
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">To</p>
                      <p className="truncate text-[13px] font-black leading-tight text-slate-800">{pnrData?.destinationStation}</p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2 px-5 py-3">
                    <CalendarDays size={13} className="shrink-0 text-emerald-500" />
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Date</p>
                      <p className="text-[13px] font-bold text-slate-700">{pnrData?.dateOfJourney}</p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2 px-5 py-3">
                    <UserCircle2 size={13} className="shrink-0 text-orange-500" />
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Passengers</p>
                      <div className="mt-0.5 flex flex-wrap gap-1">
                        {pnrData?.passengers?.map((passenger, index) => (
                          <span
                            key={`${passenger.coach}-${passenger.berth}-${index}`}
                            className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-black text-slate-600"
                          >
                            {passenger.coach}-{passenger.berth}
                            <span className="ml-1 text-orange-500">{passenger.berthType}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Motion.div>

              <Motion.div variants={fadeUp} className="grid gap-4 lg:grid-cols-[300px_1fr]">
                <div className="overflow-hidden rounded-[20px] border border-slate-100 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.05)]">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-100 px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                        <MapPinned size={14} />
                      </div>
                      <div>
                        <p className="text-[11px] font-black text-slate-800">Chef Service Stations</p>
                        <p className="text-[10px] font-medium text-slate-400">Only stops where chefs are available</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 p-2">
                    {stations.length ? (
                      stations.map((station) => {
                        const isActive = selectedStation?.code === station.code
                        return (
                          <button
                            key={station.code}
                            type="button"
                            onClick={() => handleSelectStation(station)}
                            className={`flex w-full items-center gap-3 rounded-[14px] px-3.5 py-3 text-left transition-all ${
                              isActive
                                ? 'border border-orange-200 bg-orange-50 shadow-sm'
                                : 'border border-transparent hover:border-slate-100 hover:bg-slate-50'
                            }`}
                          >
                            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border transition ${
                              isActive
                                ? 'border-orange-200 bg-orange-100 text-orange-600'
                                : 'border-slate-200 bg-slate-50 text-slate-400'
                            }`}>
                              <MapPin size={14} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <p className={`truncate text-[13px] font-black ${isActive ? 'text-orange-600' : 'text-slate-800'}`}>
                                  {station.name}
                                </p>
                                <span className="shrink-0 rounded-md bg-slate-100 px-1 py-0.5 text-[8px] font-black uppercase tracking-widest text-slate-500">
                                  {station.code}
                                </span>
                              </div>
                              <div className="mt-0.5 flex items-center gap-2 text-[10px] font-medium text-slate-400">
                                <span className="flex items-center gap-0.5"><Clock3 size={9} />{station.eta}</span>
                                <span className="flex items-center gap-0.5"><ChefHat size={9} />{station.chefs} chefs</span>
                              </div>
                            </div>
                            {isActive ? <ArrowRight size={13} className="shrink-0 text-orange-400" /> : null}
                          </button>
                        )
                      })
                    ) : (
                      <div className="px-4 py-6 text-center">
                        <p className="text-[13px] font-black text-slate-700">No chef service stations yet</p>
                        <p className="mt-1 text-[11px] text-slate-400">
                          We will add chef coverage on this route soon.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="overflow-hidden rounded-[20px] border border-slate-100 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.05)]">
                  <AnimatePresence mode="wait">
                    {!selectedStation ? (
                      <Motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex min-h-[320px] flex-col items-center justify-center gap-4 px-6 py-12 text-center"
                      >
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-orange-300">
                          <ChefHat size={30} />
                        </div>
                        <div>
                          <p className="text-[15px] font-black text-slate-700">Select a Chef Service Station</p>
                          <p className="mt-1 max-w-xs text-[12px] text-slate-400">
                            Pick one stop to browse chefs who can serve meals on your route.
                          </p>
                        </div>
                      </Motion.div>
                    ) : (
                      <Motion.div
                        key={selectedStation.code}
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -16 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="flex h-full flex-col"
                      >
                        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                              <ChefHat size={14} />
                            </div>
                            <div>
                              <p className="text-[13px] font-black text-slate-800">
                                Chefs at {selectedStation.name}
                                <span className="ml-2 text-[10px] font-bold text-slate-400">({selectedStation.code})</span>
                              </p>
                              <p className="text-[10px] font-medium text-slate-400">
                                {selectedStation.chefs} chefs available • {selectedStation.eta}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setSelectedStation(null)}
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition hover:text-slate-600"
                          >
                            <X size={13} />
                          </button>
                        </div>

                        <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
                          {stationLoading && selectedChefs.length === 0 ? (
                            <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 text-center">
                              <Loader2 size={24} className="animate-spin text-orange-400" />
                              <p className="text-[12px] font-semibold text-slate-500">Loading available chefs...</p>
                            </div>
                          ) : selectedChefs.length ? (
                            selectedChefs.map((chef, index) => (
                              <Motion.div
                                key={chef.id}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.06 * index, duration: 0.3 }}
                                onClick={() => handleOrder(chef)}
                                className="group flex cursor-pointer items-center gap-4 rounded-[16px] border border-slate-100 bg-[#fafcfd] px-4 py-3.5 transition hover:border-orange-200 hover:bg-[#fffaf7] hover:shadow-[0_4px_14px_rgba(249,115,22,0.06)]"
                              >
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] border border-orange-100 bg-gradient-to-br from-orange-100 to-orange-50 text-[14px] font-black text-orange-500">
                                  {chef.name.charAt(0)}
                                </div>

                                <div className="min-w-0 flex-1">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <p className="text-[14px] font-black text-slate-800">{chef.name}</p>
                                    <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${TAG_STYLES[chef.tag] || TAG_STYLES.Popular}`}>
                                      {chef.tag}
                                    </span>
                                  </div>
                                  <p className="mt-0.5 flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                                    <UtensilsCrossed size={10} className="text-slate-400" />
                                    {chef.specialty}
                                  </p>
                                  <div className="mt-1.5 flex items-center gap-3 text-[11px] text-slate-500">
                                    <span className="flex items-center gap-1 font-bold text-amber-500">
                                      <Star size={10} fill="currentColor" />
                                      {chef.rating}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <UtensilsCrossed size={9} className="text-slate-400" />
                                      {chef.dishes} dishes
                                    </span>
                                  </div>
                                </div>

                                <div className="shrink-0 text-right">
                                  <p className="text-[12px] font-black text-slate-900">{chef.price}</p>
                                  <p className="mt-0.5 text-[10px] font-semibold text-orange-500">Browse Menu</p>
                                </div>
                              </Motion.div>
                            ))
                          ) : (
                            <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 px-6 text-center">
                              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-300">
                                <ChefHat size={24} />
                              </div>
                              <div>
                                <p className="text-[14px] font-black text-slate-700">No chefs available yet</p>
                                <p className="mt-1 text-[12px] text-slate-400">
                                  We will make chef service available at this station soon.
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </Motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Motion.div>
            </Motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default PnrResultPage
