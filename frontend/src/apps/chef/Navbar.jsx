import React from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.png'

function Navbar({ isRegistered = false, onRegisterClick }) {
  const navigate = useNavigate()
  const [scrollProgress, setScrollProgress] = React.useState(0)

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

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 w-full border-b transition-[background-image,border-color,box-shadow,backdrop-filter] duration-150"
      style={headerStyle}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.18),rgba(255,255,255,0.04),rgba(255,255,255,0.14))] transition-opacity duration-150"
        style={overlayStyle}
      />
      <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Home Meal Express" className="h-28 w-auto" />
          <div className="hidden items-center gap-2 rounded-full border border-[color:var(--theme-chip-border)] bg-[var(--theme-accent-soft)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--theme-accent)] sm:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--theme-accent)]" />
            Chef Partner.
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="hidden h-9 w-9 items-center justify-center rounded-full border border-[color:var(--theme-surface-border)] bg-white/80 text-[var(--theme-text)] shadow-[var(--theme-shadow-soft)] transition hover:border-[var(--theme-accent)] hover:text-[var(--theme-accent)] md:inline-flex">
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

          {isRegistered && (
            <button className="hidden items-center gap-2 rounded-full border border-[color:var(--theme-surface-border)] bg-white/86 px-3 py-2 text-xs font-semibold text-[var(--theme-text)] shadow-[var(--theme-shadow-soft)] transition hover:border-[var(--theme-accent)] hover:text-[var(--theme-accent)] md:inline-flex">
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
          )}

          <button
            type="button"
            onClick={handleRegisterClick}
            className="hidden items-center gap-2 rounded-full border border-[var(--theme-accent)] bg-[var(--theme-accent)] px-3 py-2 text-xs font-semibold text-white shadow-[var(--theme-shadow-button)] transition hover:opacity-90 md:inline-flex"
          >
            Register
          </button>

          <button className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--theme-surface-border)] bg-white/80 text-[var(--theme-text)] shadow-[var(--theme-shadow-soft)] transition hover:border-[var(--theme-accent)] hover:text-[var(--theme-accent)] md:hidden">
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
          <button className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--theme-surface-border)] bg-white/80 text-[var(--theme-text)] shadow-[var(--theme-shadow-soft)] transition hover:border-[var(--theme-accent)] hover:text-[var(--theme-accent)] md:hidden">
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
