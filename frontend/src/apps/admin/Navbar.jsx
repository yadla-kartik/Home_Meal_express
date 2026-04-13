import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, ShieldCheck, User, LogOut, Bell } from 'lucide-react'
import logo from '../../assets/logo.png'
import { adminCookieCheck, adminLogout } from '../../../services/adminAuthService'

function Navbar() {
  const [scrollProgress, setScrollProgress] = React.useState(0)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = React.useState(false)
  const [adminUser, setAdminUser] = React.useState(null)
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
    let isMounted = true

    async function loadAdminProfile() {
      const res = await adminCookieCheck()
      if (isMounted) {
        setAdminUser(res?.adminUser || null)
      }
    }

    loadAdminProfile()

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
      isMounted = false
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

  const profileMenuItems = [
    { label: 'Chef Requests', hint: 'Review chef onboarding' },
    { label: 'Delivery Ops', hint: 'Verify delivery partner profiles' },
    { label: 'Platform Settings', hint: 'Manage station, pricing and approvals' },
  ]

  const adminName = adminUser?.name || 'Control Room Admin'
  const adminId =
    'Manages chefs and delivery profile'

  const handleLogout = async () => {
    await adminLogout()
    setIsProfileMenuOpen(false)
    window.location.href = '/admin/login'
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
      <div className="relative mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <img src={logo} alt="Home Meal Express" className="h-18 w-auto shrink-0 sm:h-24 lg:h-28" />
          <div className="hidden items-center gap-2 rounded-full border border-[color:var(--theme-chip-border)] bg-[var(--theme-accent-soft)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--theme-accent)] sm:inline-flex">
            <ShieldCheck size={13} />
            Admin Panel
          </div>
        </div>

        <nav className="hidden items-center gap-5 text-sm font-medium text-[var(--theme-text)] md:flex">
          <button className="group relative cursor-pointer transition hover:text-[var(--theme-accent)]">
            Overview
            <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-[var(--theme-accent)] transition-all group-hover:w-full" />
          </button>
          <button className="group relative cursor-pointer transition hover:text-[var(--theme-accent)]">
            Requests
            <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-[var(--theme-accent)] transition-all group-hover:w-full" />
          </button>
          <button className="group relative cursor-pointer transition hover:text-[var(--theme-accent)]">
            Reports
            <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-[var(--theme-accent)] transition-all group-hover:w-full" />
          </button>
        </nav>

        <div className="relative flex shrink-0 items-center gap-2" ref={profileMenuRef}>
          <button className="hidden h-9 w-9 items-center justify-center rounded-full border border-[color:var(--theme-surface-border)] bg-white/80 text-[var(--theme-text)] shadow-[var(--theme-shadow-soft)] transition hover:border-[var(--theme-accent)] hover:text-[var(--theme-accent)] md:inline-flex">
            <Bell size={18} />
          </button>

          <button
            type="button"
            onClick={() => setIsProfileMenuOpen((prev) => !prev)}
            className="hidden cursor-pointer items-center gap-2 rounded-full border border-[color:var(--theme-surface-border)] bg-white px-3 py-2 text-xs font-semibold text-[var(--theme-text)] transition hover:border-[var(--theme-accent)] hover:text-[var(--theme-accent)] md:inline-flex"
          >
            <span className="grid h-6 w-6 place-items-center rounded-full bg-[var(--theme-accent-soft)] text-[var(--theme-accent)]">
              <User size={16} />
            </span>
            Profile
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
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setIsProfileMenuOpen((prev) => !prev)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--theme-surface-border)] bg-white/80 text-[var(--theme-text)] shadow-[var(--theme-shadow-soft)] transition hover:border-[var(--theme-accent)] hover:text-[var(--theme-accent)] md:hidden"
          >
            <ShieldCheck size={18} />
          </button>

          {isProfileMenuOpen && (
            <div className="absolute right-0 top-[calc(100%+14px)] w-[290px] rounded-[25px] border border-[color:var(--theme-surface-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(255,247,239,0.96))] p-3 shadow-[0_26px_60px_rgba(15,23,42,0.18)] backdrop-blur-xl">
              <div className="rounded-[22px] border border-[#fde7d2] bg-[#fff8f2] p-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#f97316]/10 text-[#f97316] shadow-[0_10px_20px_rgba(249,115,22,0.15)]">
                    <ShieldCheck size={18} />
                  </span>
                  <div className="overflow-hidden">
                    <p className="truncate text-sm font-semibold text-[var(--theme-text)]">
                      {adminName}
                    </p>
                    <p className="mt-1 truncate text-xs text-[var(--theme-muted)]">
                      {adminId}
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
                    <ChevronRight size={16} className="mt-0.5 text-[var(--theme-accent)]" />
                  </button>
                ))}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-start justify-between rounded-[18px] border border-transparent bg-white/78 px-4 py-3 text-left shadow-[0_10px_24px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:border-[#fde7d2] hover:bg-[#fffaf5]"
                >
                  <div className="flex items-center gap-2">
                    <LogOut size={16} className="text-[var(--theme-accent)]" />
                    <div>
                      <p className="text-sm font-semibold text-[var(--theme-text)]">
                        Logout
                      </p>
                      <p className="mt-1 text-xs text-[var(--theme-muted)]">
                        Sign out of admin panel
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
