import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  BadgeCheck,
  CalendarClock,
  ChevronRight,
  Clock3,
  MapPinned,
  RefreshCw,
  Route,
  Search,
  TrainFront,
  TriangleAlert,
  X,
} from 'lucide-react'
import { getTrainSummary } from '../../services/trainStatusService'

const containerVariants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: 'easeOut', staggerChildren: 0.08 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
}

const todayValue = () => new Date().toISOString().slice(0, 10)

const formatText = (value, fallback = '—') => {
  if (value === null || value === undefined || value === '') return fallback
  return String(value)
}

const formatTiming = (value) => {
  if (!value) return '—'
  if (typeof value === 'string' || typeof value === 'number') return String(value)
  if (typeof value === 'object') {
    return (
      value.scheduled ||
      value.actual ||
      value.expected ||
      value.delay ||
      value.time ||
      '—'
    )
  }
  return '—'
}

const toDisplayDate = (value) => {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return formatText(value)
  return date.toLocaleString([], {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function InfoCard({ label, value, icon }) {
  return (
    <div className="rounded-[18px] border border-[var(--theme-chip-border)] bg-[linear-gradient(180deg,#ffffff,#fff8f0)] px-4 py-3 shadow-[var(--theme-shadow-soft)]">
      <div className="flex items-center gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[var(--theme-accent-soft)] text-[var(--theme-accent)]">
          {icon}
        </span>
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--theme-accent)]">{label}</p>
          <p className="mt-1 truncate text-sm font-semibold text-[var(--theme-text)]">{value || '—'}</p>
        </div>
      </div>
    </div>
  )
}

function StationItem({ station, index }) {
  const stationCode = station?.stationCode || station?.stnCode || '—'
  const stationName = station?.stationName || station?.stnName || 'Station'
  const arrival = formatTiming(station?.arrival)
  const departure = formatTiming(station?.departure)

  return (
    <div className="flex gap-3 rounded-[18px] border border-[var(--theme-chip-border)] bg-white p-4 shadow-[var(--theme-shadow-soft)]">
      <div className="flex w-8 shrink-0 flex-col items-center">
        <span className="grid h-8 w-8 place-items-center rounded-full border border-[var(--theme-chip-border)] bg-[var(--theme-accent-soft)] text-[10px] font-bold text-[var(--theme-accent)]">
          {index + 1}
        </span>
        {index < 4 ? (
          <span className="mt-1 h-full w-px flex-1 bg-[linear-gradient(180deg,rgba(249,115,22,0.55),rgba(249,115,22,0.08))]" />
        ) : null}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-[var(--theme-text)]">{stationName}</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--theme-accent)]">{stationCode}</p>
          </div>
          {station?.platform ? (
            <span className="rounded-full bg-[var(--theme-accent-soft)] px-3 py-1 text-[11px] font-bold text-[var(--theme-accent)]">
              PF {station.platform}
            </span>
          ) : null}
        </div>
        <p className="mt-2 text-xs text-[var(--theme-muted)]">
          Arr {arrival} · Dep {departure}
        </p>
      </div>
    </div>
  )
}

function TrainStatusComponent() {
  const [trainNo, setTrainNo] = React.useState('')
  const [journeyDate, setJourneyDate] = React.useState(todayValue())
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const [modalOpen, setModalOpen] = React.useState(false)
  const [result, setResult] = React.useState(null)

  React.useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setModalOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  const closeModal = () => setModalOpen(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    const normalized = trainNo.replace(/\D/g, '').slice(0, 5)

    if (normalized.length !== 5) {
      setError('Please enter a valid 5-digit train number.')
      setModalOpen(false)
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await getTrainSummary(normalized, journeyDate)
      if (!response?.success) {
        throw new Error(response?.error || 'Unable to fetch train details right now.')
      }

      setResult(response.data)
      setModalOpen(true)
    } catch (lookupError) {
      setError(lookupError?.message || 'Unable to fetch train details right now.')
      setResult(null)
      setModalOpen(false)
    } finally {
      setLoading(false)
    }
  }

  const trainInfo = result?.trainInfo || {}
  const liveInfo = result?.live || {}
  const route = Array.isArray(result?.route) ? result.route : []
  const stations = Array.isArray(liveInfo.stations) ? liveInfo.stations : []

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <motion.div
        className="relative overflow-hidden rounded-[34px] border border-[var(--theme-surface-border)] bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.12),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.97),rgba(255,248,241,0.98))] p-5 shadow-[var(--theme-shadow-card-lg)] sm:p-6 lg:p-7"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(251,146,60,0.08),transparent_24%)]" />

        <div className="relative grid gap-5 lg:grid-cols-[1.06fr_0.94fr]">
          <motion.div
            variants={itemVariants}
            className="rounded-[30px] border border-[var(--theme-chip-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(255,246,237,0.94))] p-5 shadow-[var(--theme-shadow-soft)] sm:p-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--theme-chip-border)] bg-[var(--theme-accent-soft)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--theme-accent)]">
                <TrainFront size={13} />
                Train Live Status
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#fde7d2] bg-white px-3 py-1.5 text-[11px] font-semibold text-[var(--theme-muted)] shadow-[var(--theme-shadow-soft)]">
                <BadgeCheck size={13} className="text-[var(--theme-accent)]" />
                Backend proxy enabled
              </div>
            </div>

            <h1 className="mt-4 max-w-2xl text-[28px] font-black leading-[1.05] tracking-[-0.6px] text-[var(--theme-text)] sm:text-[38px]">
              See live train status and train details in a modal.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--theme-muted)]">
              Enter a 5-digit train number and select the journey date. The lookup now runs through the backend, so the app is not blocked by browser-side API issues.
            </p>

            <form onSubmit={handleSubmit} className="mt-5">
              <div className="theme-search-surface flex flex-col gap-3 rounded-[26px] p-3 sm:flex-row sm:items-center">
                <div className="theme-input flex h-12 items-center gap-3 rounded-2xl px-4 sm:min-w-0 sm:flex-1">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[var(--theme-accent-soft)] text-[var(--theme-accent)]">
                    <Search size={16} />
                  </span>
                  <input
                    value={trainNo}
                    onChange={(event) => setTrainNo(event.target.value.replace(/\D/g, '').slice(0, 5))}
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder="Enter 5-digit train number"
                    className="h-full w-full border-0 bg-transparent text-[15px] font-semibold tracking-[0.18em] text-[var(--theme-text)] outline-none placeholder:tracking-normal placeholder:text-[var(--theme-muted)]"
                  />
                </div>

                <div className="theme-input flex h-12 items-center gap-3 rounded-2xl px-4 sm:w-[220px]">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[var(--theme-accent-soft)] text-[var(--theme-accent)]">
                    <CalendarClock size={16} />
                  </span>
                  <input
                    value={journeyDate}
                    onChange={(event) => setJourneyDate(event.target.value)}
                    type="date"
                    className="h-full w-full border-0 bg-transparent text-sm font-semibold text-[var(--theme-text)] outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="theme-primary-button inline-flex h-12 items-center justify-center gap-2 rounded-2xl px-5 text-[14px] font-bold transition hover:-translate-y-0.5 active:translate-y-0"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      Checking
                    </>
                  ) : (
                    <>
                      Search
                      <ChevronRight size={16} />
                    </>
                  )}
                </button>
              </div>

              {error ? (
                <div className="mt-3 inline-flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                  <TriangleAlert size={16} />
                  {error}
                </div>
              ) : null}
            </form>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="rounded-[30px] border border-[var(--theme-chip-border)] bg-[linear-gradient(180deg,#fffaf4,#ffffff)] p-5 shadow-[var(--theme-shadow-soft)] sm:p-6"
          >
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--theme-accent-soft)] text-[var(--theme-accent)]">
                <Route size={18} />
              </span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--theme-accent)]">
                  What opens in modal
                </p>
                <h2 className="mt-1 text-xl font-bold text-[var(--theme-text)]">Clean train snapshot</h2>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {[
                { icon: <BadgeCheck size={15} />, title: 'Train info', text: 'Train name, number, type, from and to station details.' },
                { icon: <Clock3 size={15} />, title: 'Live status', text: 'Status note, last update and total stations from the live tracker.' },
                { icon: <MapPinned size={15} />, title: 'Route / stations', text: 'Station-by-station route or live station timeline inside the modal.' },
                { icon: <TrainFront size={15} />, title: 'Easy close', text: 'A simple close button and Escape key support keep it lightweight.' },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-3 rounded-[20px] border border-[var(--theme-chip-border)] bg-white p-4 shadow-[var(--theme-shadow-soft)]"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[var(--theme-accent-soft)] text-[var(--theme-accent)]">
                    {item.icon}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[var(--theme-text)]">{item.title}</p>
                    <p className="mt-1 text-sm leading-6 text-[var(--theme-muted)]">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <AnimatePresence>
          {modalOpen && result ? (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 py-6 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
            >
              <motion.div
                className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-[32px] border border-[var(--theme-chip-border)] bg-[linear-gradient(180deg,#ffffff,#fffaf5)] p-5 shadow-[var(--theme-shadow-card-lg)] sm:p-6"
                initial={{ scale: 0.94, y: 16, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.96, y: 10, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                onClick={(event) => event.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={closeModal}
                  className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-[var(--theme-chip-border)] bg-white text-[var(--theme-text)] shadow-[var(--theme-shadow-soft)] transition hover:-translate-y-0.5 hover:text-[var(--theme-accent)]"
                >
                  <X size={18} />
                </button>

                <div className="flex flex-wrap items-start justify-between gap-3 pr-12">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-[var(--theme-chip-border)] bg-[var(--theme-accent-soft)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--theme-accent)]">
                      <TrainFront size={13} />
                      Train details
                    </div>
                    <h3 className="mt-4 text-[28px] font-black tracking-[-0.6px] text-[var(--theme-text)] sm:text-[34px]">
                      {trainInfo.train_name || trainInfo.trainName || 'Train details'}
                    </h3>
                    <p className="mt-2 text-sm text-[var(--theme-muted)]">
                      {trainInfo.train_no || trainInfo.trainNo || trainNo} · {liveInfo.statusNote || 'Live status loaded'}
                    </p>
                  </div>

                  <div className="rounded-[22px] border border-[var(--theme-chip-border)] bg-white px-4 py-3 shadow-[var(--theme-shadow-soft)]">
                    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--theme-accent)]">
                      <Clock3 size={13} />
                      Last update
                    </div>
                    <p className="mt-1 text-sm font-semibold text-[var(--theme-text)]">
                      {toDisplayDate(liveInfo.lastUpdate || liveInfo.lastUpdated || new Date())}
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
                  <div className="space-y-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <InfoCard
                        label="Train number"
                        value={trainInfo.train_no || trainInfo.trainNo || trainNo}
                        icon={<TrainFront size={15} />}
                      />
                      <InfoCard label="Type" value={trainInfo.type || '—'} icon={<BadgeCheck size={15} />} />
                      <InfoCard
                        label="From"
                        value={`${formatText(trainInfo.from_stn_name)} (${formatText(trainInfo.from_stn_code)})`}
                        icon={<MapPinned size={15} />}
                      />
                      <InfoCard
                        label="To"
                        value={`${formatText(trainInfo.to_stn_name)} (${formatText(trainInfo.to_stn_code)})`}
                        icon={<MapPinned size={15} />}
                      />
                      <InfoCard
                        label="Departure"
                        value={trainInfo.from_time || '—'}
                        icon={<Clock3 size={15} />}
                      />
                      <InfoCard label="Arrival" value={trainInfo.to_time || '—'} icon={<Clock3 size={15} />} />
                    </div>

                    <div className="rounded-[24px] border border-[var(--theme-chip-border)] bg-[linear-gradient(180deg,#ffffff,#fff8f1)] p-4 shadow-[var(--theme-shadow-soft)]">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--theme-accent)]">
                            Route length
                          </p>
                          <p className="mt-1 text-sm text-[var(--theme-muted)]">
                            {route.length ? `${route.length} route stops found` : 'Route data not available'}
                          </p>
                        </div>
                        <div className="rounded-full bg-[var(--theme-accent-soft)] px-3 py-1 text-xs font-bold text-[var(--theme-accent)]">
                          {trainInfo.running_days || 'Running days not shown'}
                        </div>
                      </div>

                      <div className="mt-4 grid gap-3">
                        {route.length ? (
                          route.slice(0, 6).map((station, index) => (
                            <div
                              key={`${station.stnCode || station.stationCode || index}-${index}`}
                              className="flex items-start gap-3 rounded-[18px] border border-[var(--theme-chip-border)] bg-white p-4 shadow-[var(--theme-shadow-soft)]"
                            >
                              <div className="flex w-8 flex-col items-center">
                                <span className="grid h-8 w-8 place-items-center rounded-full border border-[var(--theme-chip-border)] bg-[var(--theme-accent-soft)] text-[10px] font-bold text-[var(--theme-accent)]">
                                  {index + 1}
                                </span>
                                {index < Math.min(route.length, 6) - 1 ? (
                                  <span className="mt-1 h-full w-px flex-1 bg-[linear-gradient(180deg,rgba(249,115,22,0.55),rgba(249,115,22,0.08))]" />
                                ) : null}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <div>
                                    <p className="text-sm font-semibold text-[var(--theme-text)]">
                                      {station.stnName || station.stationName || 'Station'}
                                    </p>
                                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--theme-accent)]">
                                      {station.stnCode || station.stationCode || '—'}
                                    </p>
                                  </div>
                                  <span className="rounded-full bg-[var(--theme-accent-soft)] px-3 py-1 text-[11px] font-bold text-[var(--theme-accent)]">
                                    Day {station.day || '—'}
                                  </span>
                                </div>
                                <p className="mt-2 text-xs text-[var(--theme-muted)]">
                                  Arr {station.arrival || '—'} · Dep {station.departure || '—'}
                                </p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="rounded-[20px] border border-dashed border-[var(--theme-chip-border)] bg-white px-4 py-5 text-sm text-[var(--theme-muted)]">
                            No route list returned by the API.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-[24px] border border-[var(--theme-chip-border)] bg-[linear-gradient(180deg,#ffffff,#fff7ef)] p-4 shadow-[var(--theme-shadow-soft)]">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--theme-accent)]">
                            Live running status
                          </p>
                          <p className="mt-1 text-sm font-semibold text-[var(--theme-text)]">
                            {liveInfo.statusNote || 'Status note unavailable'}
                          </p>
                        </div>
                        <span className="rounded-full border border-[var(--theme-chip-border)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--theme-muted)]">
                          {liveInfo.totalStations ? `${liveInfo.totalStations} stations` : 'Live track'}
                        </span>
                      </div>

                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <InfoCard
                          label="Train name"
                          value={liveInfo.trainName || trainInfo.train_name || '—'}
                          icon={<TrainFront size={15} />}
                        />
                        <InfoCard label="Date" value={liveInfo.date || journeyDate} icon={<CalendarClock size={15} />} />
                      </div>

                      <div className="mt-4 space-y-3">
                        {stations.length ? (
                          stations.slice(0, 5).map((station, index) => (
                            <StationItem
                              key={`${station.stationCode || station.stationName || index}-${index}`}
                              station={station}
                              index={index}
                            />
                          ))
                        ) : (
                          <div className="rounded-[20px] border border-dashed border-[var(--theme-chip-border)] bg-white px-4 py-5 text-sm text-[var(--theme-muted)]">
                            Station-wise live tracking will appear here when the API returns it.
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="rounded-[24px] border border-[var(--theme-chip-border)] bg-[linear-gradient(180deg,#ffffff,#fff8f2)] p-4 shadow-[var(--theme-shadow-soft)]">
                      <div className="flex items-center gap-3">
                        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[var(--theme-accent-soft)] text-[var(--theme-accent)]">
                          <Route size={16} />
                        </span>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--theme-accent)]">
                            At a glance
                          </p>
                          <p className="mt-1 text-sm font-semibold text-[var(--theme-text)]">
                            {liveInfo.trainNo || trainInfo.train_no || trainNo} · {liveInfo.statusNote ? 'Live' : 'Details'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </section>
  )
}

export default TrainStatusComponent
