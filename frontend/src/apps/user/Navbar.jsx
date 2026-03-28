import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../../assets/logo.png'
import { userCookieCheck } from '../../../services/userAuthService'

function Navbar() {
  const [scrollProgress, setScrollProgress] = React.useState(0)
  const [authStatus, setAuthStatus] = React.useState('loading')
  const [isProfileMenuOpen, setIsProfileMenuOpen] = React.useState(false)
  const profileMenuRef = React.useRef(null)
  const [userName, setUserName] = useState(null);

  React.useEffect(() => {
    function handleScroll() {
      const progress = Math.min(window.scrollY / 72, 1)
      setScrollProgress(progress)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  React.useEffect(() => {
    let isMounted = true

    const checkAuth = async () => {
      const res = await userCookieCheck()
      if (res?.user) {
        setUserName(res.user)
      }
      if (!isMounted) return
      setAuthStatus(res?.user ? 'authed' : 'guest')
    }

    checkAuth()

    return () => {
      isMounted = false
    }
  }, [])

  React.useEffect(() => {
    function handlePointerDown(event) {
      if (!profileMenuRef.current?.contains(event.target)) {
        setIsProfileMenuOpen(false)
      }
    }

    function handleEscape(event) {
      if (event.key === 'Escape') {
        setIsProfileMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  const headerStyle = {
    backgroundImage: `linear-gradient(180deg, rgba(245,247,250,${0.1 + scrollProgress * 0.56}), rgba(245,247,250,${0.04 + scrollProgress * 0.34}))`,
    borderBottomColor: `rgba(255,255,255,${0.04 + scrollProgress * 0.16})`,
    boxShadow: `0 10px 30px rgba(15,23,42,${0.02 + scrollProgress * 0.06})`,
    backdropFilter: `blur(${2 + scrollProgress * 18}px) saturate(${110 + scrollProgress * 35}%)`,
    WebkitBackdropFilter: `blur(${2 + scrollProgress * 18}px) saturate(${110 + scrollProgress * 35}%)`,
  }

  const overlayStyle = {
    opacity: 0.08 + scrollProgress * 0.34,
  }

  const authHref = authStatus === 'authed' ? '/dashboard' : '/login'
  const authLabel = authStatus === 'authed' ? 'Profile' : 'Login / Sign up'
  const profileMenuItems = [
    { label: 'Orders', hint: 'Track recent meal orders' },
    { label: 'Payments', hint: 'View billing and payouts' },
    { label: 'Settings', hint: 'Manage preferences and account' },
  ]

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 w-full border-b transition-[background-image,border-color,box-shadow,backdrop-filter] duration-150"
      style={headerStyle}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.18),rgba(255,255,255,0.04),rgba(255,255,255,0.14))] transition-opacity duration-150"
        style={overlayStyle}
      />
      <div className="relative mx-auto flex h-16 w-auto items-center justify-between px-35">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Home Meal Express" className="h-28 w-auto" />
          <div className="hidden items-center gap-2 rounded-full border border-[#ffe6d6] bg-[#fff6ef] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#f97316] sm:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-[#f97316]" />
            Fresh. Home-Cooked.
          </div>
        </div>

        <nav className="hidden items-center gap-5 text-sm font-medium text-[#0f172a] md:flex">
          <button className="group relative cursor-pointer transition hover:text-[#f97316]">
              {authStatus == 'authed' ? "Menu" : ''}
            <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-[#f97316] transition-all group-hover:w-full" />
          </button>
          <button className="group relative cursor-pointer transition hover:text-[#f97316]">
            {authStatus == 'authed' ? "Chef Specials" : ''}
            <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-[#f97316] transition-all group-hover:w-full" />
          </button>
          <button className="group relative cursor-pointer transition hover:text-[#f97316]">
            {authStatus == 'authed' ? "Orders" : ''}
            <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-[#f97316] transition-all group-hover:w-full" />
          </button>
        </nav>

        <div className="relative flex items-center gap-2" ref={profileMenuRef}>
          {authStatus === 'authed' ? (
            <button
              type="button"
              onClick={() => setIsProfileMenuOpen((prev) => !prev)}
              className="hidden cursor-pointer items-center gap-2 rounded-full border border-[#e2e8f0] bg-white px-3 py-2 text-xs font-semibold text-[#0f172a] transition hover:border-[#f97316] hover:text-[#f97316] md:inline-flex"
            >
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
              {authLabel}
            </button>
          ) : (
            <Link
              to={authHref}
              className="hidden cursor-pointer items-center gap-2 rounded-full border border-[#e2e8f0] bg-white px-3 py-2 text-xs font-semibold text-[#0f172a] transition hover:border-[#f97316] hover:text-[#f97316] md:inline-flex"
            >
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
              {authLabel}
            </Link>
          )}
          <button className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#e2e8f0] text-[#0f172a] transition hover:border-[#f97316] hover:text-[#f97316] md:hidden">
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
          {authStatus === 'authed' ? (
            <button
              type="button"
              onClick={() => setIsProfileMenuOpen((prev) => !prev)}
              className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#e2e8f0] text-[#0f172a] transition hover:border-[#f97316] hover:text-[#f97316] md:hidden"
            >
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
          ) : (
            <Link
              to={authHref}
              className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#e2e8f0] text-[#0f172a] transition hover:border-[#f97316] hover:text-[#f97316] md:hidden"
            >
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
            </Link>
          )}

          {authStatus === 'authed' && isProfileMenuOpen && (
            <div className="absolute right-0 top-[calc(100%+14px)] w-[290px] rounded-[25px] border border-[color:var(--theme-surface-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(255,247,239,0.96))] p-3 shadow-[0_26px_60px_rgba(15,23,42,0.18)] backdrop-blur-xl">
              <div className="rounded-[22px] border border-[#fde7d2] bg-[#fff8f2] p-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#f97316]/10 text-[#f97316] shadow-[0_10px_20px_rgba(249,115,22,0.15)]">
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
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[var(--theme-text)]">
                      {userName?.name || 'User'}
                    </p>
                    <p className="mt-1 text-xs text-[var(--theme-muted)]">
                      Manage orders, payments and settings
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex flex-col gap-2">
                {profileMenuItems.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    className="flex w-full items-start justify-between rounded-[18px] border border-transparent bg-white/78 px-4 py-3 text-left shadow-[0_10px_24px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:border-[#fde7d2] hover:bg-[#fffaf5]"
                  >
                    <div>
                      <p className="text-sm font-semibold text-[var(--theme-text)]">
                        {item.label}
                      </p>
                      <p className="mt-1 text-xs text-[var(--theme-muted)]">
                        {item.hint}
                      </p>
                    </div>
                    <span className="mt-0.5 text-[var(--theme-accent)]">›</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
