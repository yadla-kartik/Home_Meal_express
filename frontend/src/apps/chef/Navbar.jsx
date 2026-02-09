import React from 'react'
import logo from '../../assets/logo.png'

function Navbar() {
  return (
    <header className="w-full bg-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Home Meal Express" className="h-28 w-auto" />
          <div className="hidden items-center gap-2 rounded-full border border-[#ffe6d6] bg-[#fff6ef] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#f97316] sm:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-[#f97316]" />
            Chef Partner.
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="hidden h-9 w-9 items-center justify-center rounded-full border border-[#e2e8f0] text-[#0f172a] transition hover:border-[#f97316] hover:text-[#f97316] cursor-pointer md:inline-flex">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M18 8a6 6 0 10-12 0c0 7-3 7-3 7h18s-3 0-3-7" />
              <path d="M13.73 21a2 2 0 01-3.46 0" />
            </svg>
          </button>

          <button className="hidden items-center gap-2 rounded-full border border-[#e2e8f0] bg-white px-3 py-2 text-xs font-semibold text-[#0f172a] transition hover:border-[#f97316] hover:text-[#f97316] cursor-pointer md:inline-flex">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-[#f97316]/10 text-[#f97316]">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </span>
            Profile
          </button>

          <button className="hidden items-center gap-2 rounded-full border border-[#f97316] bg-[#f97316] px-3 py-2 text-xs font-semibold text-white shadow-[0_10px_18px_rgba(249,115,22,0.28)] transition hover:opacity-90 cursor-pointer md:inline-flex">
            Register
          </button>

          <button className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#e2e8f0] text-[#0f172a] transition hover:border-[#f97316] hover:text-[#f97316] cursor-pointer md:hidden">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M18 8a6 6 0 10-12 0c0 7-3 7-3 7h18s-3 0-3-7" />
              <path d="M13.73 21a2 2 0 01-3.46 0" />
            </svg>
          </button>
          <button className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#e2e8f0] text-[#0f172a] transition hover:border-[#f97316] hover:text-[#f97316] cursor-pointer md:hidden">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar
