import React from 'react'
import { motion as Motion } from 'framer-motion'
import { MapPinned } from 'lucide-react'

const STATIONS_ROW_ONE = [
  'New Delhi',
  'Prayagraj Jn',
  'Secunderabad Jn',
  'Jaipur',
  'Pune Jn',
  'Katpadi Jn',
  'Bhubaneswar',
  'Varanasi Jn',
]

const STATIONS_ROW_TWO = [
  'Jabalpur',
  'Rajahmundry',
  'Kota Jn',
  'Nashik Road',
  'Bilaspur Jn',
  'Malda Town',
  'Renigunta Jn',
  'New Jalpaiguri',
]

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: 'easeOut',
      staggerChildren: 0.1,
    },
  },
}

const rowVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
}

function StationRow({ stations, reverse = false }) {
  const repeatedStations = [...stations, ...stations]

  return (
    <Motion.div
      variants={rowVariants}
      className="station-marquee-row relative overflow-hidden py-2"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-linear-to-r from-[#f8fafc] via-[#f8fafc]/95 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-linear-to-l from-[#f8fafc] via-[#f8fafc]/95 to-transparent" />

      <div
        className={`station-marquee-track flex items-center gap-4 ${reverse ? 'station-marquee-track-reverse' : ''}`}
      >
        {repeatedStations.map((station, index) => (
          <article key={`${station}-${index}`} className="shrink-0">
            <div className="group/station rounded-2xl border border-[#e2e8f0] bg-white/95 px-4 py-4  transition duration-300 hover:-translate-y-1 hover:border-[#fbd7c2]">
              <div className="flex min-w-[220px] items-center gap-3">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff6ef] text-[#f97316] shadow-[0_8px_16px_rgba(249,115,22,0.12)] transition duration-300 group-hover/station:scale-105 group-hover/station:rotate-3">
                  <MapPinned className="h-5 w-5" />
                </div>
                <div className="transition duration-300 group-hover/station:-translate-y-0.5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#f97316]">
                    Chef Available
                  </p>
                  <h3 className="mt-1 text-sm font-semibold text-[#0f172a]">
                    {station}
                  </h3>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </Motion.div>
  )
}

function StationAvailability() {
  return (
    <Motion.section
      className=" relative left-1/2 w-screen -translate-x-1/2 pt-20 pb-29"
      variants={sectionVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.16 }}
    >
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center px-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#f97316]">
          Station Coverage
        </p>
        <h2 className="mt-2 text-2xl font-bold text-[#0f172a] sm:text-[30px]">
          Chefs available across major journey stations
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-[#64748b] sm:text-[15px]">
         Explore major stations where home chefs are actively serving fresh, homemade meals along your journey.
        </p>
      </div>

      <div className="mt-8 space-y-4">
        <StationRow stations={STATIONS_ROW_ONE} />
        <StationRow stations={STATIONS_ROW_TWO} reverse />
      </div>
    </Motion.section>
  )
}

export default StationAvailability
