import React from 'react'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import {
  TrainFront,
  MapPin,
  CalendarDays,
  ArrowRight,
  UserCircle2,
  X,
  ChefHat,
  MapPinned,
  Clock3,
  CheckCircle2,
} from 'lucide-react'

// Dummy nearby stations data — replace with real data when API is ready
const NEARBY_STATIONS = [
  { name: 'New Delhi', code: 'NDLS', distance: '0 km', chefs: 12, eta: 'Boarding' },
  { name: 'Mathura Jn', code: 'MTJ', distance: '141 km', chefs: 5, eta: '~2h 10m' },
  { name: 'Agra Cantt', code: 'AGC', distance: '196 km', chefs: 8, eta: '~3h 00m' },
  { name: 'Jhansi Jn', code: 'JHS', distance: '403 km', chefs: 6, eta: '~5h 20m' },
  { name: 'Bhopal Jn', code: 'BPL', distance: '702 km', chefs: 14, eta: '~9h 00m' },
  { name: 'Nagpur', code: 'NGP', distance: '1092 km', chefs: 9, eta: '~13h 30m' },
]

const pageVariants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] } },
  exit: { opacity: 0, y: 30, transition: { duration: 0.3 } },
}

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

function PnrResultView({ pnrData, pnr, onClose }) {
  return (
    <Motion.div
      variants={pageVariants}
      initial="hidden"
      animate="show"
      exit="exit"
      className="w-full"
    >
      {/* ── Header Strip ─────────────────────────────────────── */}
      <div className="sticky top-16 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 py-3 flex items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
            <TrainFront size={18} />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-orange-500">PNR Result</p>
            <p className="text-[13px] font-black text-slate-800 leading-tight">{pnr}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-orange-300 hover:text-orange-500"
        >
          <X size={16} />
        </button>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Motion.div variants={staggerContainer} initial="hidden" animate="show" className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">

          {/* ── LEFT: PNR Details ───────────────────────────── */}
          <div className="flex flex-col gap-4">

            {/* Train Info Card */}
            <Motion.div
              variants={fadeUp}
              className="relative overflow-hidden rounded-[24px] bg-white border border-slate-100 p-6 shadow-[0_8px_32px_rgba(15,23,42,0.05)]"
            >
              {/* Decorative train icon */}
              <div className="pointer-events-none absolute -right-4 -top-4 opacity-[0.06] text-orange-400">
                <TrainFront size={130} />
              </div>

              <div className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-orange-600 mb-4">
                <CheckCircle2 size={11} strokeWidth={3} />
                Confirmed Ticket
              </div>

              <h2 className="text-[22px] font-black text-slate-900 leading-tight">{pnrData.trainName}</h2>
              <p className="mt-1 flex items-center gap-1.5 text-[13px] font-medium text-slate-500">
                Train No.{' '}
                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[12px] font-bold text-slate-700">
                  {pnrData.trainNumber}
                </span>
              </p>

              {/* Journey Route */}
              <div className="mt-5 flex items-center gap-4 rounded-[18px] border border-slate-100 bg-slate-50/60 px-4 py-4">
                <div className="flex-1">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Boarding</p>
                  <p className="text-[15px] font-black text-slate-800 leading-tight">{pnrData.boardingStation}</p>
                </div>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-400">
                  <ArrowRight size={15} />
                </div>
                <div className="flex-1 text-right">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Destination</p>
                  <p className="text-[15px] font-black text-slate-800 leading-tight">{pnrData.destinationStation}</p>
                </div>
              </div>

              {/* Date */}
              <div className="mt-4 flex items-center gap-3 rounded-[14px] border border-slate-100 bg-emerald-50/50 px-4 py-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shrink-0">
                  <CalendarDays size={14} />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Date of Journey</p>
                  <p className="text-[14px] font-bold text-slate-700">{pnrData.dateOfJourney}</p>
                </div>
              </div>
            </Motion.div>

            {/* Passenger Details Card */}
            <Motion.div
              variants={fadeUp}
              className="rounded-[24px] bg-white border border-slate-100 p-6 shadow-[0_8px_32px_rgba(15,23,42,0.05)]"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-[14px] font-black text-slate-700">
                  <UserCircle2 size={16} className="text-orange-500" />
                  Passenger Details
                </h3>
                <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-[10px] font-black text-slate-500">
                  {pnrData.passengers?.length || 0} Passengers
                </span>
              </div>

              <div className="space-y-2.5">
                {pnrData.passengers?.map((pass, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-[16px] border border-slate-100 bg-slate-50/60 px-3.5 py-3 transition hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 place-items-center rounded-xl border border-slate-100 bg-white text-[12px] font-black text-slate-500 shadow-sm">
                        #{idx + 1}
                      </div>
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Coach · Berth</p>
                        <p className="text-[14px] font-bold text-slate-700">
                          {pass.coach}{' '}
                          <span className="mx-1 text-slate-300">|</span>
                          {pass.berth}
                          <span className="ml-2 rounded-md bg-orange-50 px-1.5 py-0.5 text-[10px] font-black text-orange-500">
                            {pass.berthType}
                          </span>
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-100 px-2.5 py-1 text-[10px] font-black text-emerald-700">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                      {pass.currentStatus}
                    </span>
                  </div>
                ))}
              </div>
            </Motion.div>
          </div>

          {/* ── RIGHT: Nearby Stations ──────────────────────── */}
          <Motion.div variants={fadeUp} className="flex flex-col gap-4">
            <div className="rounded-[24px] bg-white border border-slate-100 p-6 shadow-[0_8px_32px_rgba(15,23,42,0.05)]">

              {/* Section Header */}
              <div className="mb-5 flex items-start justify-between gap-3">
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-orange-500 mb-2.5 border border-orange-100">
                    <MapPinned size={11} />
                    Along Your Route
                  </div>
                  <h3 className="text-[18px] font-black text-slate-900 leading-tight">Nearby Stations</h3>
                  <p className="mt-1 text-[12px] text-slate-500 font-medium">
                    Home chefs available for fresh meal delivery at these stops.
                  </p>
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-orange-50 text-orange-500">
                  <ChefHat size={18} />
                </div>
              </div>

              {/* Station List */}
              <div className="space-y-2.5">
                {NEARBY_STATIONS.map((station, idx) => (
                  <Motion.div
                    key={station.code}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 * idx, duration: 0.35, ease: 'easeOut' }}
                    className="group flex items-center gap-4 rounded-[18px] border border-slate-100 bg-[#fafcfd] px-4 py-3.5 transition-all hover:border-orange-200 hover:bg-[#fffaf7] hover:shadow-[0_4px_16px_rgba(249,115,22,0.06)] cursor-pointer"
                  >
                    {/* Station Icon */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-orange-50 text-orange-400 border border-orange-100 transition group-hover:bg-orange-100 group-hover:text-orange-600">
                      <MapPin size={16} />
                    </div>

                    {/* Station Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-[14px] font-black text-slate-800 leading-tight">{station.name}</p>
                        <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-widest text-slate-500">
                          {station.code}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-[11px] text-slate-500 font-medium">
                        <span className="flex items-center gap-1">
                          <MapPin size={10} className="text-slate-400" />
                          {station.distance}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock3 size={10} className="text-slate-400" />
                          {station.eta}
                        </span>
                      </div>
                    </div>

                    {/* Chef count badge */}
                    <div className="shrink-0 text-right">
                      <div className="inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1.5 text-[11px] font-black text-orange-600">
                        <ChefHat size={11} />
                        {station.chefs} chefs
                      </div>
                    </div>
                  </Motion.div>
                ))}
              </div>

              {/* CTA */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                  Tap a station to browse available chefs and pre-order meals.
                </p>
                <button
                  type="button"
                  className="shrink-0 inline-flex items-center gap-2 rounded-[14px] bg-[linear-gradient(135deg,#f97316,#ea580c)] px-4 py-2.5 text-[12px] font-black text-white shadow-[0_8px_20px_rgba(249,115,22,0.24)] transition hover:-translate-y-0.5 hover:brightness-110 active:scale-95"
                >
                  Browse Chefs
                  <ArrowRight size={13} strokeWidth={3} />
                </button>
              </div>
            </div>
          </Motion.div>
        </Motion.div>

        {/* Check another PNR */}
        <Motion.div variants={fadeUp} className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={onClose}
            className="text-[13px] font-semibold text-slate-500 hover:text-slate-700 transition py-2 px-4 rounded-xl hover:bg-slate-50"
          >
            ← Check another PNR
          </button>
        </Motion.div>
      </div>
    </Motion.div>
  )
}

export default PnrResultView
