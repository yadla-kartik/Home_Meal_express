import React, { useEffect, useState } from 'react'
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
  IndianRupee,
  X,
} from 'lucide-react'
import Navbar from '../apps/user/Navbar'
import { checkPnrDetails } from '../../services/userAuthService'
import { NEARBY_STATIONS, DUMMY_CHEFS } from '../data/dummyData'

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

/* ─── Component ──────────────────────────────────────────── */
function PnrResultPage() {
  const { pnrNumber } = useParams()
  const navigate = useNavigate()
  const [pnrData, setPnrData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedStation, setSelectedStation] = useState(null)

  useEffect(() => {
    const storedPnr = sessionStorage.getItem('pnrSessionInput')
    const storedData = sessionStorage.getItem('pnrSessionData')
    if (storedData && storedPnr === pnrNumber) {
      setPnrData(JSON.parse(storedData))
      setLoading(false)
      return
    }
    const fetchPnr = async () => {
      try {
        const response = await checkPnrDetails(pnrNumber)
        if (response?.success) {
          setPnrData(response.data)
          sessionStorage.setItem('pnrSessionData', JSON.stringify(response.data))
          sessionStorage.setItem('pnrSessionInput', pnrNumber)
        } else {
          setError(response?.message || 'Invalid PNR or not found.')
        }
      } catch {
        setError('Something went wrong. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchPnr()
  }, [pnrNumber])

  const handleBack = () => {
    sessionStorage.removeItem('pnrSessionData')
    sessionStorage.removeItem('pnrSessionInput')
    navigate('/')
  }

  const handleOrder = (chef) => {
    navigate(`/station/${selectedStation.code}/chef/${chef.id}`)
  }

  return (
    <div className="theme-app-shell min-h-screen bg-[#f8fafc]">
      <Navbar />

      <div className="pt-16">
        {/* ── Sticky Header ─────────────────────────────── */}
        <div className="sticky top-16 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
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
                  <p className="text-[10px] font-black uppercase tracking-widest text-orange-500">PNR Result</p>
                  <p className="text-[13px] font-black text-slate-800 leading-tight">{pnrNumber}</p>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleBack}
              className="text-[12px] font-semibold text-slate-500 hover:text-orange-500 transition hidden sm:block"
            >
              ← Check another PNR
            </button>
          </div>
        </div>

        {/* ── Content ───────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {loading ? (
            <Motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-32 gap-4">
              <Loader2 size={32} className="animate-spin text-orange-400" />
              <p className="text-[14px] font-semibold text-slate-500">Fetching PNR details…</p>
            </Motion.div>
          ) : error ? (
            <Motion.div key="error" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-32 gap-4 text-center px-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-400">
                <TrainFront size={28} />
              </div>
              <p className="text-[16px] font-black text-slate-800">PNR Not Found</p>
              <p className="text-[13px] text-slate-500 max-w-sm">{error}</p>
              <button type="button" onClick={handleBack}
                className="mt-2 inline-flex items-center gap-2 rounded-[14px] bg-orange-500 px-5 py-2.5 text-[13px] font-black text-white shadow-[0_8px_20px_rgba(249,115,22,0.24)] hover:-translate-y-0.5 transition">
                <ArrowLeft size={14} strokeWidth={3} /> Try Another PNR
              </button>
            </Motion.div>
          ) : (
            <Motion.div key="result" initial="hidden" animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
              className="mx-auto max-w-6xl px-4 py-6 sm:px-6 flex flex-col gap-5"
            >

              {/* ── 1. COMPACT PNR DETAILS STRIP ─────────── */}
              <Motion.div variants={fadeUp}
                className="rounded-[20px] bg-white border border-slate-100 shadow-[0_4px_20px_rgba(15,23,42,0.05)] overflow-hidden"
              >
                {/* Top bar: train name + badge */}
                <div className="flex items-center justify-between gap-4 px-5 py-3.5 border-b border-slate-100">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                      <TrainFront size={15} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[14px] font-black text-slate-900 truncate">{pnrData.trainName}</p>
                      <p className="text-[11px] text-slate-400 font-medium">Train No. {pnrData.trainNumber}</p>
                    </div>
                  </div>
                  <div className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-700">
                    <CheckCircle2 size={10} strokeWidth={3} /> Confirmed
                  </div>
                </div>

                {/* Bottom row: route + date + passengers */}
                <div className="flex flex-wrap items-center gap-0 divide-x divide-slate-100">
                  {/* Boarding → Destination */}
                  <div className="flex items-center gap-2 px-5 py-3 min-w-0 flex-1">
                    <div className="text-center min-w-0">
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">From</p>
                      <p className="text-[13px] font-black text-slate-800 leading-tight truncate">{pnrData.boardingStation}</p>
                    </div>
                    <ArrowRight size={13} className="text-orange-400 shrink-0" />
                    <div className="text-center min-w-0">
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">To</p>
                      <p className="text-[13px] font-black text-slate-800 leading-tight truncate">{pnrData.destinationStation}</p>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-2 px-5 py-3 shrink-0">
                    <CalendarDays size={13} className="text-emerald-500 shrink-0" />
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Date</p>
                      <p className="text-[13px] font-bold text-slate-700">{pnrData.dateOfJourney}</p>
                    </div>
                  </div>

                  {/* Passengers pill */}
                  <div className="flex items-center gap-2 px-5 py-3 shrink-0">
                    <UserCircle2 size={13} className="text-orange-500 shrink-0" />
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Passengers</p>
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {pnrData.passengers?.map((p, i) => (
                          <span key={i} className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-black text-slate-600">
                            {p.coach}-{p.berth}
                            <span className="ml-1 text-orange-500">{p.berthType}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Motion.div>

              {/* ── 2. STATIONS + CHEFS PANEL ─────────────── */}
              <Motion.div variants={fadeUp} className="grid gap-4 lg:grid-cols-[300px_1fr]">

                {/* LEFT: Stations list */}
                <div className="rounded-[20px] bg-white border border-slate-100 shadow-[0_4px_20px_rgba(15,23,42,0.05)] overflow-hidden">
                  <div className="flex items-center justify-between gap-2 px-4 py-3.5 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                        <MapPinned size={14} />
                      </div>
                      <div>
                        <p className="text-[11px] font-black text-slate-800">Nearby Stations</p>
                        <p className="text-[10px] text-slate-400 font-medium">Select to see chefs</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col p-2 gap-1">
                    {NEARBY_STATIONS.map((station, idx) => {
                      const isActive = selectedStation?.code === station.code
                      return (
                        <button
                          key={station.code}
                          type="button"
                          onClick={() => setSelectedStation(station)}
                          className={`flex items-center gap-3 w-full text-left rounded-[14px] px-3.5 py-3 transition-all ${
                            isActive
                              ? 'bg-orange-50 border border-orange-200 shadow-sm'
                              : 'border border-transparent hover:bg-slate-50 hover:border-slate-100'
                          }`}
                        >
                          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border transition ${
                            isActive
                              ? 'bg-orange-100 border-orange-200 text-orange-600'
                              : 'bg-slate-50 border-slate-200 text-slate-400'
                          }`}>
                            <MapPin size={14} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <p className={`text-[13px] font-black truncate ${isActive ? 'text-orange-600' : 'text-slate-800'}`}>
                                {station.name}
                              </p>
                              <span className="rounded-md bg-slate-100 px-1 py-0.5 text-[8px] font-black uppercase tracking-widest text-slate-500 shrink-0">
                                {station.code}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400 font-medium">
                              <span className="flex items-center gap-0.5"><Clock3 size={9} />{station.eta}</span>
                              <span className="flex items-center gap-0.5"><ChefHat size={9} />{station.chefs} chefs</span>
                            </div>
                          </div>
                          {isActive && (
                            <ArrowRight size={13} className="text-orange-400 shrink-0" />
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* RIGHT: Chefs panel */}
                <div className="rounded-[20px] bg-white border border-slate-100 shadow-[0_4px_20px_rgba(15,23,42,0.05)] overflow-hidden">
                  <AnimatePresence mode="wait">
                    {!selectedStation ? (
                      <Motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center h-full min-h-[320px] gap-4 text-center px-6 py-12"
                      >
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-orange-300">
                          <ChefHat size={30} />
                        </div>
                        <div>
                          <p className="text-[15px] font-black text-slate-700">Select a Station</p>
                          <p className="mt-1 text-[12px] text-slate-400 max-w-xs">
                            Click any station on the left to see available home chefs and their menus.
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
                        className="flex flex-col h-full"
                      >
                        {/* Panel header */}
                        <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-slate-100">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                              <ChefHat size={14} />
                            </div>
                            <div>
                              <p className="text-[13px] font-black text-slate-800">
                                Chefs at {selectedStation.name}
                                <span className="ml-2 text-[10px] font-bold text-slate-400">({selectedStation.code})</span>
                              </p>
                              <p className="text-[10px] text-slate-400 font-medium">
                                {(DUMMY_CHEFS[selectedStation.code] || []).length} chefs available · {selectedStation.eta}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setSelectedStation(null)}
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 text-slate-400 hover:text-slate-600 transition"
                          >
                            <X size={13} />
                          </button>
                        </div>

                        {/* Chefs list */}
                        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                          {(DUMMY_CHEFS[selectedStation.code] || []).map((chef, idx) => (
                            <Motion.div
                              key={chef.id}
                              initial={{ opacity: 0, y: 12 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.06 * idx, duration: 0.3 }}
                              onClick={() => handleOrder(chef)}
                              className="group flex items-center gap-4 rounded-[16px] border border-slate-100 bg-[#fafcfd] px-4 py-3.5 transition hover:border-orange-200 hover:bg-[#fffaf7] hover:shadow-[0_4px_14px_rgba(249,115,22,0.06)] cursor-pointer"
                            >
                              {/* Avatar */}
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-br from-orange-100 to-orange-50 text-orange-500 border border-orange-100 text-[14px] font-black">
                                {chef.name.charAt(0)}
                              </div>

                              {/* Info */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <p className="text-[14px] font-black text-slate-800">{chef.name}</p>
                                  <span className={`rounded-full border px-2 py-0.5 text-[9px] font-black uppercase tracking-wider shrink-0 ${TAG_STYLES[chef.tag] || TAG_STYLES['Popular']}`}>
                                    {chef.tag}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-500 font-medium mt-0.5 flex items-center gap-1.5">
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
                                  <span className="flex items-center gap-1 font-semibold text-emerald-600">
                                    <IndianRupee size={9} />
                                    {chef.price.replace('₹', '')}
                                  </span>
                                </div>
                              </div>

                              {/* Order CTA */}
                              <div className="shrink-0 rounded-[12px] bg-[linear-gradient(135deg,#f97316,#ea580c)] px-3.5 py-2 text-[11px] font-black text-white shadow-[0_4px_12px_rgba(249,115,22,0.2)] transition hover:brightness-110 group-hover:-translate-y-0.5 active:scale-95">
                                View Menu
                              </div>
                            </Motion.div>
                          ))}
                        </div>
                      </Motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Motion.div>

              {/* Bottom */}
              <div className="flex justify-center pb-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="text-[13px] font-semibold text-slate-500 hover:text-orange-500 transition py-2 px-5 rounded-xl hover:bg-orange-50"
                >
                  ← Check another PNR
                </button>
              </div>

            </Motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default PnrResultPage
