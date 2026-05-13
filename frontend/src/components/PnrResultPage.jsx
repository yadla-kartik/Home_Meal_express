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
  BadgeCheck,
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
import {
  clearOrderConfirmation,
  clearOrderDraft,
} from './orderJourney/orderJourneyUtils'

const PNR_DATA_SESSION_KEY = 'pnrSessionData'
const PNR_INPUT_SESSION_KEY = 'pnrSessionInput'
const JOURNEY_STATIONS_SESSION_KEY = 'pnrJourneyStations'
const SELECTED_STATION_SESSION_KEY = 'pnrSelectedStation'

const TAG_STYLES = {
  'Top Rated': 'border-[var(--theme-chip-border)] bg-[var(--theme-accent-soft)] text-[var(--theme-accent)]',
  Popular: 'border-[var(--theme-chip-border)] bg-[var(--theme-accent-soft)] text-[var(--theme-accent)]',
  Budget: 'border-[var(--theme-chip-border)] bg-[var(--theme-accent-soft)] text-[var(--theme-accent)]',
  New: 'border-[var(--theme-chip-border)] bg-[var(--theme-accent-soft)] text-[var(--theme-accent)]',
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.38, ease: 'easeOut' } },
}

const surfaceCardCls = 'theme-card overflow-hidden rounded-[26px]'
const headerIconCls =
  'flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--theme-chip-border)] bg-[var(--theme-accent-soft)] text-[var(--theme-accent)]'
const mutedMetaCls = 'text-[11px] font-medium text-[var(--theme-muted)]'
const sectionEyebrowCls = 'text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--theme-muted)]'

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
    clearOrderDraft()
    clearOrderConfirmation()
    navigate('/')
  }

  const handleSelectStation = async (station) => {
    setSelectedStation(station)
    sessionStorage.setItem(SELECTED_STATION_SESSION_KEY, JSON.stringify(station))
    await loadStationChefs(station)
  }

  const handleOrder = (chef) => {
    if (!selectedStation) return

    clearOrderDraft()
    clearOrderConfirmation()
    navigate(`/station/${selectedStation.code}/chef/${chef.id}`, {
      state: {
        pnrData,
        selectedStation,
      },
    })
  }

  const selectedChefs = selectedStation ? chefMap[selectedStation.code] || [] : []

  return (
    <div className="theme-page-shell min-h-screen">
      <Navbar />

      <div className="pt-16">
        <div className="sticky top-16 z-30 border-b border-[color:var(--theme-surface-border)] bg-[rgba(255,255,255,0.84)] backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
            <div className="flex items-center gap-3.5">
              <button
                type="button"
                onClick={handleBack}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--theme-surface-border)] bg-white/90 text-[var(--theme-muted)] shadow-[var(--theme-shadow-soft)] transition hover:border-[var(--theme-accent)] hover:text-[var(--theme-accent)]"
              >
                <ArrowLeft size={16} />
              </button>

              <div className="flex items-center gap-3">
                <div className={headerIconCls}>
                  <TrainFront size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--theme-accent)]">
                    Journey Result
                  </p>
                  <p className="mt-0.5 text-[15px] font-semibold leading-tight text-[var(--theme-text)]">
                    {pnrNumber}
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleBack}
              className="hidden text-[12px] font-semibold text-[var(--theme-muted)] transition hover:text-[var(--theme-accent)] sm:block"
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
              <div className="grid h-14 w-14 place-items-center rounded-full border border-[var(--theme-chip-border)] bg-white shadow-[var(--theme-shadow-soft)]">
                <Loader2 size={24} className="animate-spin text-[var(--theme-accent)]" />
              </div>
              <p className="text-[14px] font-semibold text-[var(--theme-muted)]">
                Fetching journey and chef service stations...
              </p>
            </Motion.div>
          ) : error ? (
            <Motion.div
              key="error"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center gap-4 px-4 py-32 text-center"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-[22px] border border-[var(--theme-chip-border)] bg-[linear-gradient(180deg,#fffdf9,#fff6ee)] text-[var(--theme-accent)] shadow-[var(--theme-shadow-soft)]">
                <TrainFront size={28} />
              </div>
              <p className="text-[18px] font-semibold text-[var(--theme-text)]">Journey Data Not Available</p>
              <p className="max-w-sm text-[13px] leading-6 text-[var(--theme-muted)]">{error}</p>
              <button
                type="button"
                onClick={handleBack}
                className="theme-primary-button mt-2 inline-flex items-center gap-2 rounded-[16px] px-5 py-3 text-[13px] font-semibold text-white transition hover:-translate-y-0.5"
              >
                <ArrowLeft size={14} strokeWidth={3} />
                Try Another PNR
              </button>
            </Motion.div>
          ) : (
            <Motion.div
              key="result"
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
              className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-7"
            >
              <Motion.div variants={fadeUp} className={surfaceCardCls}>
                <div className="flex items-center justify-between gap-4 border-b border-[color:var(--theme-surface-border)] px-5 py-4 sm:px-6">
                  <div className="flex min-w-0 items-center gap-3.5">
                    <div className={headerIconCls}>
                      <TrainFront size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-[18px] font-semibold tracking-tight text-[var(--theme-text)]">
                        {pnrData?.trainName}
                      </p>
                      <p className="mt-1 text-[12px] font-medium text-[var(--theme-muted)]">
                        Train No. {pnrData?.trainNumber}
                      </p>
                    </div>
                  </div>

                  <div className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
                    <BadgeCheck size={10} strokeWidth={3} />
                    Confirmed
                  </div>
                </div>

                <div className="grid gap-0 sm:grid-cols-[minmax(0,1.35fr)_220px_260px]">
                  <div className="flex min-w-0 items-center gap-3 border-b border-[color:var(--theme-surface-border)] px-5 py-4 sm:border-b-0 sm:px-6">
                    <div className="min-w-0">
                      <p className={sectionEyebrowCls}>From</p>
                      <p className="mt-1 truncate text-[15px] font-semibold leading-tight text-[var(--theme-text)]">
                        {pnrData?.boardingStation}
                      </p>
                    </div>
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--theme-accent-soft)] text-[var(--theme-accent)]">
                      <ArrowRight size={15} />
                    </div>
                    <div className="min-w-0">
                      <p className={sectionEyebrowCls}>To</p>
                      <p className="mt-1 truncate text-[15px] font-semibold leading-tight text-[var(--theme-text)]">
                        {pnrData?.destinationStation}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-3 border-b border-[color:var(--theme-surface-border)] px-5 py-4 sm:border-b-0 sm:border-l sm:px-6">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                      <CalendarDays size={15} />
                    </div>
                    <div>
                      <p className={sectionEyebrowCls}>Date</p>
                      <p className="mt-1 text-[14px] font-semibold text-[var(--theme-text)]">
                        {pnrData?.dateOfJourney}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-start gap-3 px-5 py-4 sm:border-l sm:px-6">
                    <div className={headerIconCls}>
                      <UserCircle2 size={15} />
                    </div>
                    <div>
                      <p className={sectionEyebrowCls}>Passengers</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {pnrData?.passengers?.map((passenger, index) => (
                          <span
                            key={`${passenger.coach}-${passenger.berth}-${index}`}
                            className="rounded-full border border-[color:var(--theme-surface-border)] bg-white px-2.5 py-1 text-[10px] font-semibold text-[var(--theme-text)] shadow-[var(--theme-shadow-soft)]"
                          >
                            {passenger.coach}-{passenger.berth}
                            <span className="ml-1.5 text-[var(--theme-accent)]">{passenger.berthType}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Motion.div>

              <Motion.div variants={fadeUp} className="grid gap-5 lg:grid-cols-[320px_1fr]">
                <div className={surfaceCardCls}>
                  <div className="flex items-center justify-between gap-2 border-b border-[color:var(--theme-surface-border)] px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className={headerIconCls}>
                        <MapPinned size={14} />
                      </div>
                      <div>
                        <p className="text-[14px] font-semibold text-[var(--theme-text)]">Chef Service Stations</p>
                        <p className={mutedMetaCls}>Only stops where chefs are available</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 p-3">
                    {stations.length ? (
                      stations.map((station) => {
                        const isActive = selectedStation?.code === station.code

                        return (
                          <button
                            key={station.code}
                            type="button"
                            onClick={() => handleSelectStation(station)}
                            className={`flex w-full items-center gap-3 rounded-[18px] px-4 py-3.5 text-left transition-all ${
                              isActive
                                ? 'border border-[var(--theme-chip-border)] bg-[linear-gradient(180deg,#fffdf9,#fff6ee)] shadow-[var(--theme-shadow-soft)]'
                                : 'border border-transparent bg-white/72 hover:border-[color:var(--theme-surface-border)] hover:bg-white'
                            }`}
                          >
                            <div
                              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border transition ${
                                isActive
                                  ? 'border-[var(--theme-chip-border)] bg-[var(--theme-accent-soft)] text-[var(--theme-accent)]'
                                  : 'border-[color:var(--theme-surface-border)] bg-white text-[var(--theme-muted)]'
                              }`}
                            >
                              <MapPin size={15} />
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <p
                                  className={`truncate text-[14px] font-semibold ${
                                    isActive ? 'text-[var(--theme-accent)]' : 'text-[var(--theme-text)]'
                                  }`}
                                >
                                  {station.name}
                                </p>
                                <span className="shrink-0 rounded-full border border-[color:var(--theme-surface-border)] bg-white px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-[var(--theme-muted)]">
                                  {station.code}
                                </span>
                              </div>

                              <div className="mt-1.5 flex items-center gap-3 text-[11px] font-medium text-[var(--theme-muted)]">
                                <span className="flex items-center gap-1">
                                  <Clock3 size={9} />
                                  {station.eta}
                                </span>
                                <span className="flex items-center gap-1">
                                  <ChefHat size={9} />
                                  {station.chefs} chefs
                                </span>
                              </div>
                            </div>

                            {isActive ? <ArrowRight size={14} className="shrink-0 text-[var(--theme-accent)]" /> : null}
                          </button>
                        )
                      })
                    ) : (
                      <div className="px-4 py-8 text-center">
                        <p className="text-[14px] font-semibold text-[var(--theme-text)]">No chef service stations yet</p>
                        <p className="mt-2 text-[12px] text-[var(--theme-muted)]">
                          We will add chef coverage on this route soon.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className={surfaceCardCls}>
                  <AnimatePresence mode="wait">
                    {!selectedStation ? (
                      <Motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex min-h-[340px] flex-col items-center justify-center gap-4 px-6 py-12 text-center"
                      >
                        <div className="flex h-16 w-16 items-center justify-center rounded-[22px] border border-[var(--theme-chip-border)] bg-[var(--theme-accent-soft)] text-[var(--theme-accent)]">
                          <ChefHat size={30} />
                        </div>
                        <div>
                          <p className="text-[18px] font-semibold text-[var(--theme-text)]">Select a Chef Service Station</p>
                          <p className="mt-2 max-w-xs text-[13px] leading-6 text-[var(--theme-muted)]">
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
                        <div className="flex items-center justify-between gap-3 border-b border-[color:var(--theme-surface-border)] px-5 py-4 sm:px-6">
                          <div className="flex items-center gap-3">
                            <div className={headerIconCls}>
                              <ChefHat size={14} />
                            </div>
                            <div>
                              <p className="text-[15px] font-semibold text-[var(--theme-text)]">
                                Chefs at {selectedStation.name}
                                <span className="ml-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--theme-muted)]">
                                  ({selectedStation.code})
                                </span>
                              </p>
                              <p className={mutedMetaCls}>
                                {selectedStation.chefs} chefs available - {selectedStation.eta}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => setSelectedStation(null)}
                            className="flex h-8 w-8 items-center justify-center rounded-full border border-[color:var(--theme-surface-border)] bg-white text-[var(--theme-muted)] transition hover:border-[var(--theme-accent)] hover:text-[var(--theme-accent)]"
                          >
                            <X size={13} />
                          </button>
                        </div>

                        <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4 sm:p-5">
                          {stationLoading && selectedChefs.length === 0 ? (
                            <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 text-center">
                              <div className="grid h-12 w-12 place-items-center rounded-full border border-[var(--theme-chip-border)] bg-[var(--theme-accent-soft)]">
                                <Loader2 size={20} className="animate-spin text-[var(--theme-accent)]" />
                              </div>
                              <p className="text-[12px] font-semibold text-[var(--theme-muted)]">Loading available chefs...</p>
                            </div>
                          ) : selectedChefs.length ? (
                            selectedChefs.map((chef, index) => (
                              <Motion.div
                                key={chef.id}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.06 * index, duration: 0.3 }}
                                onClick={() => handleOrder(chef)}
                                className="group flex cursor-pointer items-center gap-4 rounded-[20px] border border-[color:var(--theme-surface-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(255,249,243,0.75))] px-4 py-4 transition hover:-translate-y-0.5 hover:border-[var(--theme-chip-border)] hover:shadow-[var(--theme-shadow-soft)]"
                              >
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] border border-[var(--theme-chip-border)] bg-[var(--theme-accent-soft)] text-[15px] font-semibold text-[var(--theme-accent)]">
                                  {chef.name.charAt(0)}
                                </div>

                                <div className="min-w-0 flex-1">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <p className="text-[16px] font-semibold text-[var(--theme-text)]">{chef.name}</p>
                                    <span
                                      className={`shrink-0 rounded-full border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] ${
                                        TAG_STYLES[chef.tag] || TAG_STYLES.Popular
                                      }`}
                                    >
                                      {chef.tag}
                                    </span>
                                  </div>

                                  <p className="mt-1 flex items-center gap-1.5 text-[12px] font-medium text-[var(--theme-muted)]">
                                    <UtensilsCrossed size={10} className="text-[var(--theme-accent)]/70" />
                                    {chef.specialty}
                                  </p>

                                  <div className="mt-2.5 flex items-center gap-4 text-[11px] text-[var(--theme-muted)]">
                                    <span className="flex items-center gap-1 font-semibold text-[var(--theme-accent)]">
                                      <Star size={10} fill="currentColor" />
                                      {chef.rating}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <UtensilsCrossed size={9} className="text-[var(--theme-muted)]" />
                                      {chef.dishes} dishes
                                    </span>
                                  </div>
                                </div>

                                <div className="shrink-0 text-right">
                                  <p className="text-[13px] font-semibold text-[var(--theme-text)]">{chef.price}</p>
                                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--theme-accent)]">
                                    Browse Menu
                                  </p>
                                </div>
                              </Motion.div>
                            ))
                          ) : (
                            <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 px-6 text-center">
                              <div className="flex h-14 w-14 items-center justify-center rounded-[20px] border border-[var(--theme-chip-border)] bg-[var(--theme-accent-soft)] text-[var(--theme-accent)]/55">
                                <ChefHat size={24} />
                              </div>
                              <div>
                                <p className="text-[15px] font-semibold text-[var(--theme-text)]">No chefs available yet</p>
                                <p className="mt-2 text-[12px] leading-6 text-[var(--theme-muted)]">
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
