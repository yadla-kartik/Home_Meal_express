import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Crown, LogOut, UserPlus } from 'lucide-react'
import logo from '../../assets/logo.png'
import { superAdminLogout } from '../../../services/superAdminService'

function SuperAdminNavbar({ onAddAdmin }) {
  const navigate = useNavigate()
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const profileMenuRef = useRef(null)

  useEffect(() => {
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

  useEffect(() => {
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

  const handleLogout = async () => {
    await superAdminLogout()
    setIsProfileMenuOpen(false)
    navigate('/admin/login')
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
      <div className="relative mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <img src={logo} alt="Home Meal Express" className="h-18 w-auto shrink-0 sm:h-24 lg:h-28" />
          <div className="hidden items-center gap-2 rounded-full border border-[color:var(--theme-chip-border)] bg-[var(--theme-accent-soft)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--theme-accent)] sm:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--theme-accent)]" />
            Master Control
          </div>
        </div>

        <div className="relative flex items-center gap-3 sm:gap-4" ref={profileMenuRef}>
          {/* Add Admin Button for Desktop */}
          <button 
            onClick={onAddAdmin}
            className="theme-primary-button hidden md:inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-semibold transition hover:scale-105 active:scale-95"
          >
            <UserPlus size={16} />
            <span>Add Admin</span>
          </button>

           {/* Add Admin Button for Mobile */}
           <button 
              onClick={onAddAdmin}
              className="inline-flex md:hidden h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#f97316] bg-[#fff6ef] text-[#f97316] transition hover:scale-105"
            >
              <UserPlus size={16} />
           </button>

          <button
            type="button"
            onClick={() => setIsProfileMenuOpen((prev) => !prev)}
            className="cursor-pointer items-center gap-2 rounded-full border border-[#e2e8f0] bg-white px-3 py-2 text-xs font-semibold text-[#0f172a] transition hover:border-[#f97316] hover:text-[#f97316] flex"
          >
            <span className="grid h-6 w-6 place-items-center rounded-full bg-[#f97316]/10 text-[#f97316]">
               <Crown size={14} />
            </span>
            <span className="hidden sm:block">Super Admin</span>
          </button>
          
          {isProfileMenuOpen && (
            <div className="absolute right-0 top-[calc(100%+14px)] w-[290px] rounded-[25px] border border-[color:var(--theme-surface-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(255,247,239,0.96))] p-3 shadow-[0_26px_60px_rgba(15,23,42,0.18)] backdrop-blur-xl">
              <div className="rounded-[22px] border border-[#fde7d2] bg-[#fff8f2] p-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#f97316]/10 text-[#f97316] shadow-[0_10px_20px_rgba(249,115,22,0.15)]">
                    <Crown size={20} />
                  </span>
                  <div className="overflow-hidden">
                    <p className="truncate text-sm font-semibold text-[var(--theme-text)]">
                      System Overseer
                    </p>
                    <p className="truncate mt-1 text-xs text-[var(--theme-muted)]">
                      Master Dashboard Access
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex flex-col gap-2">
                <button
                  onClick={handleLogout}
                  type="button"
                  className="flex w-full items-start justify-between rounded-[18px] border border-transparent bg-white/78 px-4 py-3 text-left shadow-[0_10px_24px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:border-[#fde7d2] hover:bg-[#fffaf5]"
                >
                  <div className="flex items-center gap-2">
                    <LogOut size={16} className="text-[var(--theme-accent)]" />
                    <div>
                      <p className="text-sm font-semibold text-[var(--theme-text)]">
                        Logout
                      </p>
                      <p className="mt-1 text-xs text-[var(--theme-muted)]">
                        Securely disconnect node
                      </p>
                    </div>
                  </div>
                  <span className="mt-0.5 text-[var(--theme-accent)]">›</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default SuperAdminNavbar

