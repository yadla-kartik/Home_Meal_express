import React from 'react'
import logo from '../../assets/logo.png'

function Navbar({ isRegistered, onRegisterClick }) {
  return (
    <header className="w-full bg-white shadow-sm">
      <div className="mx-auto flex min-h-[64px] max-w-6xl items-center justify-between gap-3 px-4 py-2 sm:py-3">
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="Home Meal Express"
            className="h-10 w-auto sm:h-12 md:h-14"
          />
          <div className="hidden items-center gap-2 rounded-full border border-[#ffe6d6] bg-[#fff6ef] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#f97316] sm:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-[#f97316]" />
            From local chefs
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={!isRegistered ? onRegisterClick : undefined}
            className={`hidden items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold transition md:inline-flex ${
              isRegistered
                ? 'border border-[#e2e8f0] bg-white text-[#0f172a] hover:border-[#f97316] hover:text-[#f97316]'
                : 'border border-[#f97316] bg-[#f97316] text-white shadow-[0_10px_18px_rgba(249,115,22,0.28)] hover:opacity-90'
            }`}
          >
            {isRegistered && (
              <span className="grid h-6 w-6 place-items-center rounded-full bg-[#f97316]/10 text-xs font-bold text-[#f97316]">
                U
              </span>
            )}
            {isRegistered ? 'Profile' : 'Register'}
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
