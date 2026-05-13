import React from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.png'

function Navbar({ isRegistered = false, onRegisterClick }) {
  const navigate = useNavigate()
  const [scrollProgress, setScrollProgress] = React.useState(0)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = React.useState(false)
  const profileMenuRef = React.useRef(null)

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

  const handleRegisterClick = () => {
    if (onRegisterClick) {
      onRegisterClick()
      return
    }
    navigate('/chef/register')
  }

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

  const profileMenuItems = [
    { label: 'Orders', hint: 'Track active meal requests and history', onClick: () => navigate('/chef/dashboard') },
    { label: 'Menu', hint: 'Manage dishes, pricing and availability', onClick: () => navigate('/chef/menu') },
    { label: 'Settings', hint: 'Keep kitchen preferences and profile updated' },
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
      <div className="relative mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <img src={logo} alt="Home Meal Express" className="h-18 w-auto shrink-0 sm:h-24 lg:h-28" />
          <div className="hidden items-center gap-2 rounded-full border border-[color:var(--theme-chip-border)] bg-[var(--theme-accent-soft)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--theme-accent)] sm:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--theme-accent)]" />
            Chef Partner.
          </div>
        </div>

        <div className="relative flex shrink-0 items-center gap-2 text-sm font-medium text-[#0f172a] sm:gap-3 md:gap-5" ref={profileMenuRef}>

          {isRegistered ? (
            <button
              type="button"
              onClick={() => setIsProfileMenuOpen((prev) => !prev)}
              className="hidden items-center gap-2 rounded-full border border-[color:var(--theme-surface-border)] bg-white/86 px-3 py-2 text-xs font-semibold text-[var(--theme-text)] shadow-[var(--theme-shadow-soft)] transition hover:border-[var(--theme-accent)] hover:text-[var(--theme-accent)] md:inline-flex"
            >
              <span className="grid h-6 w-6 place-items-center rounded-full bg-[var(--theme-accent-soft)] text-[var(--theme-accent)]">
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
          ) : (
            <button
              type="button"
              onClick={handleRegisterClick}
              className="hidden items-center gap-2 rounded-full border border-[var(--theme-accent)] bg-[var(--theme-accent)] px-3 py-2 text-xs font-semibold text-white shadow-[var(--theme-shadow-button)] transition hover:opacity-90 md:inline-flex"
            >
              Register
            </button>
          )}

          {isRegistered ? (
            <button
              type="button"
              onClick={() => setIsProfileMenuOpen((prev) => !prev)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--theme-surface-border)] bg-white/80 text-[var(--theme-text)] shadow-[var(--theme-shadow-soft)] transition hover:border-[var(--theme-accent)] hover:text-[var(--theme-accent)] md:hidden"
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
            <button
              type="button"
              onClick={handleRegisterClick}
              className="inline-flex items-center justify-center rounded-full border border-[var(--theme-accent)] bg-[var(--theme-accent)] px-2.5 py-2 text-[10px] font-semibold text-white shadow-[var(--theme-shadow-button)] transition hover:opacity-90 sm:px-3 sm:text-[11px] md:hidden"
            >
              Register
            </button>
          )}

          {isRegistered && isProfileMenuOpen && (
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
                      Chef Profile
                    </p>
                    <p className="mt-1 text-xs text-[var(--theme-muted)]">
                      Manage orders, menu and kitchen settings
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex flex-col gap-2">
                {profileMenuItems.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      setIsProfileMenuOpen(false)
                      item.onClick?.()
                    }}
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
                    <span className="mt-0.5 text-[var(--theme-accent)]">&rsaquo;</span>
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
