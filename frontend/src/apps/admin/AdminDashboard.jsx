import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
import { ChefHat, Bike, ArrowRight, ShieldCheck, Sparkles, Users, Clock3, CheckCircle } from 'lucide-react'
import Navbar from './Navbar'
import ChefVerification from './components/ChefVerification'
import DeliveryVerification from './components/DeliveryVerification'
import LoadingSpinner from '../../components/LoadingSpinner'
import ChangePassword from './components/ChangePassword'
import { adminCookieCheck, adminLogout, changeAdminPassword, getChefApprovals } from '../../../services/adminAuthService'

const getActiveViewFromPath = (pathname) => {
  if (pathname.endsWith('/chef-verification')) return 'chef'
  if (pathname.endsWith('/delivery-verification')) return 'delivery'
  return 'landing'
}

function AdminDashboard() {
  const navigate = useNavigate()
  const location = useLocation()
  const [adminProfile, setAdminProfile] = useState(null)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)
  const [stats, setStats] = useState({
    chef: { total: 0, pending: 0, verified: 0 },
    delivery: { total: 0, pending: 0, verified: 0 }, // placeholders for later
  })
  const activeView = getActiveViewFromPath(location.pathname)

  useEffect(() => {
    let active = true

    const loadProfile = async () => {
      setLoadingProfile(true)
      const res = await adminCookieCheck()
      if (!active) return

      if (!res?.adminUser) {
        window.location.href = '/admin/login'
        return
      }

      setAdminProfile(res.adminUser)
      setLoadingProfile(false)
    }

    loadProfile()

    return () => { active = false }
  }, [])

  useEffect(() => {
    if (!adminProfile || adminProfile.mustChangePassword) {
      return undefined
    }

    let active = true
    const loadStats = async () => {
      const res = await getChefApprovals('all')
      if (!active) return
      if (res?.approvals) {
        const total = res.approvals.length
        const pending = res.approvals.filter(a => a.reviewStatus === 'pending').length
        const verified = res.approvals.filter(a => a.reviewStatus === 'approved').length
        setStats(prev => ({ ...prev, chef: { total, pending, verified } }))
      }
    }
    loadStats()
    return () => { active = false }
  }, [adminProfile])

  const openOverview = () => navigate('/admin/dashboard')
  const openChefVerification = () => navigate('/admin/dashboard/chef-verification')
  const openDeliveryVerification = () => navigate('/admin/dashboard/delivery-verification')

  const handlePasswordChange = async ({ currentPassword, newPassword, confirmPassword }) => {
    setIsUpdatingPassword(true)
    const res = await changeAdminPassword({ currentPassword, newPassword, confirmPassword })
    setIsUpdatingPassword(false)

    if (res?.success && res?.adminUser) {
      setAdminProfile(res.adminUser)
      setIsChangePasswordOpen(false)
      return { success: true }
    }

    return { success: false, message: res?.message || 'Unable to update password.' }
  }

  const handleLogout = async () => {
    await adminLogout()
    window.location.href = '/admin/login'
  }

  if (loadingProfile) {
    return <LoadingSpinner label="Loading admin workspace..." />
  }

  return (
    <div className="theme-page-shell min-h-screen pb-10">
      <Navbar
        adminUser={adminProfile}
        currentView={activeView}
        onOpenOverview={openOverview}
        onOpenChefVerification={openChefVerification}
        onOpenDeliveryVerification={openDeliveryVerification}
        onOpenChangePassword={() => setIsChangePasswordOpen(true)}
      />
      <ChangePassword
        isOpen={Boolean(adminProfile?.mustChangePassword) || isChangePasswordOpen}
        isSubmitting={isUpdatingPassword}
        adminEmail={adminProfile?.email}
        onSubmit={handlePasswordChange}
        onLogout={adminProfile?.mustChangePassword ? handleLogout : undefined}
        onClose={() => setIsChangePasswordOpen(false)}
        isMandatory={Boolean(adminProfile?.mustChangePassword)}
      />

      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 pt-20 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          {activeView === 'landing' ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="space-y-10"
            >
              {/* ── New Light Hero Banner (Matching Image Style) ── */}
              <div
                className="relative rounded-[32px] overflow-hidden px-6 py-8 sm:px-10 sm:py-10 shadow-[0_12px_36px_rgba(249,115,22,0.06)] border border-[rgba(249,115,22,0.15)] bg-white flex flex-col lg:flex-row gap-8 lg:gap-12"
              >
                {/* Left Side */}
                <div className="relative z-10 flex flex-col items-start flex-1 lg:max-w-[40%]">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-[var(--theme-accent-soft)] px-3 py-1 mb-4 text-[10px] font-black uppercase tracking-widest text-[var(--theme-accent)] border border-[rgba(249,115,22,0.1)] shadow-[0_2px_4px_rgba(249,115,22,0.05)]">
                    <ShieldCheck size={12} strokeWidth={2.5} /> ADMIN WORKSPACE
                  </div>
                  <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-black text-[var(--theme-text-strong)] tracking-tight leading-[1.1] mb-3">
                    Partner <br className="hidden lg:block" />
                    <span className="text-[var(--theme-accent)]">Management</span>
                  </h1>
                  <p className="text-sm sm:text-[15px] text-[var(--theme-muted)] font-medium leading-relaxed mb-6">
                    Verify, monitor, and onboard new chefs and delivery partners to ensure uninterrupted platform service.
                  </p>

                  <div className="inline-flex items-center gap-3 rounded-[20px] bg-[#fffaf5] px-5 py-3.5 border border-[rgba(249,115,22,0.08)]">
                    <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center border border-[rgba(249,115,22,0.15)] shadow-sm shrink-0">
                      <Sparkles size={14} className="text-[var(--theme-accent)]" />
                    </div>
                    <p className="text-[13px] text-[var(--theme-text)] font-semibold leading-snug">
                      Keep the queue clear by reviewing new applications.
                    </p>
                  </div>
                </div>

                {/* Right Side */}
                <div className="relative z-10 flex-1 w-full rounded-[28px] border border-[rgba(249,115,22,0.12)] bg-[linear-gradient(135deg,#ffffff,#fffdfa)] p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 sm:gap-8 shadow-[0_4px_24px_rgba(249,115,22,0.02)]">
                  <div className="flex-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--theme-accent)] mb-3">CURRENT PROGRESS</p>
                    <h2 className="text-[19px] sm:text-[22px] font-bold text-[var(--theme-text-strong)] leading-tight mb-3">
                      Your platform is actively onboarding new partners.
                    </h2>
                    <p className="text-[13px] text-[var(--theme-muted)] font-medium leading-relaxed mb-5">
                      Almost everything is running smoothly. Registration approvals are the final step before a profile goes live.
                    </p>
                    <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(249,115,22,0.15)] bg-white px-3.5 py-1.5 shadow-sm">
                      <span className="h-2 w-2 rounded-full bg-[var(--theme-accent)] animate-pulse" />
                      <p className="text-[11px] font-bold text-[var(--theme-accent)]">Active step: Partner verification</p>
                    </div>
                  </div>

                  {/* Circular Progress Ring */}
                  <div className="relative flex items-center justify-center shrink-0 w-[120px] h-[120px] bg-white rounded-full shadow-[0_8px_24px_rgba(249,115,22,0.05)] border border-[rgba(249,115,22,0.05)]">
                    <svg className="w-[100px] h-[100px] -rotate-90 absolute" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="rgba(249,115,22,0.15)" strokeWidth="10" />
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--theme-accent)" strokeWidth="10" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * (stats.chef.total ? Math.round((stats.chef.verified / stats.chef.total) * 100) : 100) / 100)} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-[20px] font-black text-[var(--theme-accent)] leading-none">{stats.chef.total ? Math.round((stats.chef.verified / stats.chef.total) * 100) : 100}%</span>
                      <span className="text-[8px] font-black uppercase tracking-widest text-[var(--theme-muted)] mt-1">VERIFIED</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Selection Grid ── */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">

                {/* Chef Card */}
                <motion.button
                  whileHover={{ y: -4, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={openChefVerification}
                  className="group relative flex flex-col items-start p-6 sm:p-7 rounded-[28px] border border-[rgba(249,115,22,0.2)] bg-white text-left w-full overflow-hidden transition-all duration-300 hover:border-[rgba(249,115,22,0.5)] hover:shadow-[0_24px_54px_rgba(249,115,22,0.16)]"
                  style={{ boxShadow: '0 12px 32px rgba(249,115,22,0.06)' }}
                >
                  <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(249,115,22,0.06),transparent)] opacity-60 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="flex w-full items-start justify-between relative z-10 mb-6">
                    <div className="h-16 w-16 rounded-[20px] bg-[linear-gradient(135deg,#fff6ef,#ffecd8)] border border-[rgba(249,115,22,0.15)] text-[var(--theme-accent)] flex items-center justify-center shadow-[0_6px_12px_rgba(249,115,22,0.1)] group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                      <ChefHat size={32} strokeWidth={2.5} />
                    </div>
                    <div className="h-9 w-9 rounded-full bg-[var(--theme-app-bg)] flex items-center justify-center text-[var(--theme-muted)] group-hover:bg-[var(--theme-accent)] group-hover:text-white transition-colors duration-300 shadow-[0_2px_8px_rgba(15,23,42,0.04)] border border-[var(--theme-surface-border)] group-hover:border-transparent">
                      <ArrowRight size={16} />
                    </div>
                  </div>

                  <div className="relative z-10 w-full mb-6">
                    <h3 className="text-xl sm:text-2xl font-black text-[var(--theme-text-strong)] tracking-tight mb-1">Chef Verification</h3>
                    <p className="text-[13px] text-[var(--theme-muted)] font-medium max-w-[240px]">
                      Approve pending kitchen registrations.
                    </p>
                    <div className="relative z-10 w-full flex flex-wrap justify-end gap-3 mt-auto pt-5 border-t border-[rgba(249,115,22,0.1)]">
                      <div className="rounded-[16px] bg-white px-3.5 py-2.5 flex items-center gap-3 border border-slate-100 shadow-[0_4px_12px_rgba(15,23,42,0.03)] transition-transform hover:-translate-y-0.5">
                        <div className="h-8 w-8 rounded-full bg-[var(--theme-accent-soft)] text-[var(--theme-accent)] flex items-center justify-center shrink-0">
                          <Users size={14} />
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] font-bold text-[var(--theme-muted)] uppercase tracking-widest">Total</p>
                          <p className="text-sm font-black text-[var(--theme-text-strong)] leading-tight">{stats.chef.total}</p>
                        </div>
                      </div>

                      <div className="rounded-[16px] bg-[#fff6ef] px-3.5 py-2.5 flex items-center gap-3 border border-[rgba(249,115,22,0.15)] shadow-[0_4px_12px_rgba(249,115,22,0.04)] transition-transform hover:-translate-y-0.5">
                        <div className="h-8 w-8 rounded-full bg-white text-[var(--theme-accent)] flex items-center justify-center shrink-0 shadow-sm">
                          <CheckCircle size={14} />
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] font-bold text-[var(--theme-accent)] opacity-80 uppercase tracking-widest">Verified</p>
                          <p className="text-sm font-black text-[var(--theme-accent)] leading-tight">{stats.chef.verified}</p>
                        </div>
                      </div>

                      <div className="rounded-[16px] bg-[#fff6ef] px-3.5 py-2.5 flex items-center gap-3 border border-[rgba(249,115,22,0.15)] shadow-[0_4px_12px_rgba(249,115,22,0.04)] transition-transform hover:-translate-y-0.5">
                        <div className="h-8 w-8 rounded-full bg-white text-[var(--theme-accent)] flex items-center justify-center shrink-0 shadow-sm">
                          <Clock3 size={14} />
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] font-bold text-[var(--theme-accent)] opacity-80 uppercase tracking-widest">Pending</p>
                          <p className="text-sm font-black text-[var(--theme-accent)] leading-tight">{stats.chef.pending}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.button>

                {/* Delivery Card */}
                <motion.button
                  whileHover={{ y: -4, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={openDeliveryVerification}
                  className="group relative flex flex-col items-start p-6 sm:p-7 rounded-[28px] border border-[rgba(16,185,129,0.2)] bg-white text-left w-full overflow-hidden transition-all duration-300 hover:border-[rgba(16,185,129,0.5)] hover:shadow-[0_24px_54px_rgba(16,185,129,0.16)]"
                  style={{ boxShadow: '0 12px 32px rgba(16,185,129,0.06)' }}
                >
                  <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(16,185,129,0.06),transparent)] opacity-60 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="flex w-full items-start justify-between relative z-10 mb-6">
                    <div className="h-16 w-16 rounded-[20px] bg-[linear-gradient(135deg,#f0fdf4,#dcfce7)] border border-[rgba(16,185,129,0.15)] text-[#10b981] flex items-center justify-center shadow-[0_6px_12px_rgba(16,185,129,0.1)] group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500">
                      <Bike size={32} strokeWidth={2.5} />
                    </div>
                    <div className="h-9 w-9 rounded-full bg-[var(--theme-app-bg)] flex items-center justify-center text-[var(--theme-muted)] group-hover:bg-[#10b981] group-hover:text-white transition-colors duration-300 shadow-[0_2px_8px_rgba(15,23,42,0.04)] border border-[var(--theme-surface-border)] group-hover:border-transparent">
                      <ArrowRight size={16} />
                    </div>
                  </div>

                  <div className="relative z-10 w-full mb-6">
                    <h3 className="text-xl sm:text-2xl font-black text-[var(--theme-text-strong)] tracking-tight mb-1">Rider Verification</h3>
                    <p className="text-[13px] text-[var(--theme-muted)] font-medium max-w-[240px]">
                      Onboard new delivery partners.
                    </p>
                    <div className="relative z-10 w-full flex flex-wrap justify-end gap-3 mt-auto pt-5 border-t border-[rgba(16,185,129,0.1)]">
                      <div className="rounded-[16px] bg-white px-3.5 py-2.5 flex items-center gap-3 border border-slate-100 shadow-[0_4px_12px_rgba(15,23,42,0.03)] transition-transform hover:-translate-y-0.5">
                        <div className="h-8 w-8 rounded-full bg-[#f0fdf4] text-[#10b981] flex items-center justify-center shrink-0">
                          <Users size={14} />
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] font-bold text-[var(--theme-muted)] uppercase tracking-widest">Total</p>
                          <p className="text-sm font-black text-[var(--theme-text-strong)] leading-tight">{stats.delivery.total}</p>
                        </div>
                      </div>

                      <div className="rounded-[16px] bg-[#ecfdf5] px-3.5 py-2.5 flex items-center gap-3 border border-[rgba(16,185,129,0.15)] shadow-[0_4px_12px_rgba(16,185,129,0.04)] transition-transform hover:-translate-y-0.5">
                        <div className="h-8 w-8 rounded-full bg-white text-[#10b981] flex items-center justify-center shrink-0 shadow-sm">
                          <CheckCircle size={14} />
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] font-bold text-[#10b981] opacity-80 uppercase tracking-widest">Verified</p>
                          <p className="text-sm font-black text-[#10b981] leading-tight">{stats.delivery.verified}</p>
                        </div>
                      </div>

                      <div className="rounded-[16px] bg-[#ecfdf5] px-3.5 py-2.5 flex items-center gap-3 border border-[rgba(16,185,129,0.15)] shadow-[0_4px_12px_rgba(16,185,129,0.04)] transition-transform hover:-translate-y-0.5">
                        <div className="h-8 w-8 rounded-full bg-white text-[#10b981] flex items-center justify-center shrink-0 shadow-sm">
                          <Clock3 size={14} />
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] font-bold text-[#10b981] opacity-80 uppercase tracking-widest">Pending</p>
                          <p className="text-sm font-black text-[#10b981] leading-tight">{stats.delivery.pending}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              {activeView === 'chef' && <ChefVerification onBack={openOverview} />}
              {activeView === 'delivery' && <DeliveryVerification onBack={openOverview} />}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

export default AdminDashboard
