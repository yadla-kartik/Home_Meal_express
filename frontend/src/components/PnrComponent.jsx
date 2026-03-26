import React from 'react'
import dashboardImage from '../assets/dashboard.png'
import { motion as Motion } from 'framer-motion'
import {TrainFront } from 'lucide-react'

function PnrComponent() {
  return (
    <>
        <Motion.section
        className="w-full pt-20"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        <div className="w-full">
          <img
            src={dashboardImage}
            alt="Dashboard"
            className="w-full max-h-[380px] object-cover md:max-h-[440px] "
          />
        </div>
      </Motion.section>

      <main className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 px-2 pt-6 sm:px-3">
        <Motion.div
          className="flex w-full max-w-2xl flex-col items-center gap-3"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.45 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <p className="theme-heading text-base font-semibold">
            Enter your PNR number
          </p>
          <div className="theme-search-surface flex w-full max-w-md items-center gap-3 rounded-2xl p-2">
            <span className='inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff6ef] text-[#f97316]  shadow-[var(--theme-shadow-soft)] ring-1 ring-[color:var(--theme-surface-border)]'>
              <TrainFront/>
            </span>
            <input
              type="text"
              placeholder="PNR number"
              className="theme-input h-11 flex-1 rounded-xl border border-transparent bg-transparent px-3 text-sm shadow-none focus:ring-2 " 
            />
            <button className="theme-primary-button h-11 rounded-xl px-6 text-sm font-semibold transition">
              Search
            </button>
          </div>
        </Motion.div>
      </main>
 
    </>
  )
}

export default PnrComponent