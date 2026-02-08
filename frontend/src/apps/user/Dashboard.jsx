import React from 'react'
import Navbar from '../../components/Navbar'
import dashboardImage from '../../assets/dashboard.png'

function Dashboard() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />

      <section className="w-full pt-4">
        <div className="w-full">
          <img
            src={dashboardImage}
            alt="Dashboard"
            className="w-full max-h-[380px] object-cover md:max-h-[440px]"
          />
        </div>
      </section>

      <main className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 px-2 pb-8 pt-6 sm:px-3">
        <div className="flex w-full max-w-2xl flex-col items-center gap-3">
          <p className="text-base font-semibold text-[#0f172a]">
            Enter your PNR number
          </p>
          <div className="flex w-full max-w-md items-center gap-3 rounded-2xl bg-white p-2 shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
            <input
              type="text"
              placeholder="PNR number"
              className="h-11 flex-1 rounded-xl border border-transparent bg-transparent px-3 text-sm text-[#0f172a] outline-none focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20"
            />
            <button className="h-11 rounded-xl bg-[#f97316] px-6 text-sm font-semibold text-white transition hover:brightness-110">
              Search
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
