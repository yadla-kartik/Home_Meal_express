import React from 'react'
import logo from '../assets/logo.png'

function Navbar() {
  return (
    <header className="w-full bg-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Home Meal Express" className="h-28 w-auto" />
          <div className="hidden items-center gap-2 rounded-full border border-[#ffe6d6] bg-[#fff6ef] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#f97316] sm:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-[#f97316]" />
            From local chefs
          </div>
        </div>

        <nav className="hidden items-center gap-6 text-sm font-medium text-[#0f172a] md:flex">
          <button className="group relative transition hover:text-[#f97316]">
            Menu
            <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-[#f97316] transition-all group-hover:w-full" />
          </button>
          <button className="group relative transition hover:text-[#f97316]">
            Chef Specials
            <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-[#f97316] transition-all group-hover:w-full" />
          </button>
          <button className="group relative transition hover:text-[#f97316]">
            Orders
            <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-[#f97316] transition-all group-hover:w-full" />
          </button>
        </nav>

        <div className="flex items-center gap-2">
          <button className="hidden items-center gap-2 rounded-full border border-[#e2e8f0] bg-white px-3 py-2 text-xs font-semibold text-[#0f172a] transition hover:border-[#f97316] hover:text-[#f97316] md:inline-flex">
            <span className="h-6 w-6 rounded-full bg-[#f97316]/10 text-[#f97316] grid place-items-center text-xs font-bold">
              U
            </span>
            Profile
          </button>
          <button className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#e2e8f0] text-[#0f172a] transition hover:border-[#f97316] hover:text-[#f97316] md:hidden">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
          <button className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#e2e8f0] text-[#0f172a] transition hover:border-[#f97316] hover:text-[#f97316] md:hidden">
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
