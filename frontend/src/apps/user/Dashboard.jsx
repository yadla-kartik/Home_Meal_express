import React from 'react'
import { motion as Motion } from 'framer-motion'
import Navbar from './Navbar'
import dashboardImage from '../../assets/dashboard.png'
import FeatureCard from './components/FeatureCard'
import HowItWorks from './components/HowItWorks'
import StationAvailability from './components/StationAvailability'

function Dashboard() {
  return (
    <div className="theme-app-shell min-h-screen">
      <Navbar />

      <Motion.section
        className="w-full pt-20"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
      >
        <div className="w-full">
          <img
            src={dashboardImage}
            alt="Dashboard"
            className="w-full max-h-[380px] object-cover md:max-h-[440px]"
          />
        </div>
      </Motion.section>

      <main className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 px-2 pb-8 pt-6 sm:px-3">
        <Motion.div
          className="flex w-full max-w-2xl flex-col items-center gap-3"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.45 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          <p className="theme-heading text-base font-semibold">
            Enter your PNR number
          </p>
          <div className="theme-search-surface flex w-full max-w-md items-center gap-3 rounded-2xl p-2">
            <span className='inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff6ef] text-[#f97316]'>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-tram-front-icon lucide-tram-front"><rect width="16" height="16" x="4" y="3" rx="2"/><path d="M4 11h16"/><path d="M12 3v8"/><path d="m8 19-2 3"/><path d="m18 22-2-3"/><path d="M8 15h.01"/><path d="M16 15h.01"/></svg>
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

        <FeatureCard />
        <HowItWorks/>
        <StationAvailability />
      </main>
    </div>
  )
}

export default Dashboard
