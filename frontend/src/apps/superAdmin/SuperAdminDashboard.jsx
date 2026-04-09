import React, { useCallback, useEffect, useState } from 'react'
import { Crown, RefreshCw, ShieldAlert, UserPlus, Users, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import logo from '../../assets/logo.png'
import LoadingSpinner from '../../components/LoadingSpinner'
import AdminCard from './components/AdminCard'
import AddAdminModal from './components/AddAdminModal'
import { addAdmin, getAllAdmins, removeAdmin } from '../../../services/superAdminService'

function SuperAdminDashboard() {
  const [admins, setAdmins] = useState([])
  const [loadingAdmins, setLoadingAdmins] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    window.setTimeout(() => setToast(null), 3000)
  }

  const fetchAdmins = useCallback(async () => {
    setLoadingAdmins(true)
    const res = await getAllAdmins()
    setLoadingAdmins(false)

    if (Array.isArray(res?.admins)) {
      setAdmins(res.admins)
      return
    }

    if (Array.isArray(res)) {
      setAdmins(res)
      return
    }

    setAdmins([])
  }, [])

  useEffect(() => {
    fetchAdmins()
  }, [fetchAdmins])

  const handleAddAdmin = async (data) => {
    const res = await addAdmin(data)

    if (res?.admin || res?.adminUser || res?.message?.toLowerCase().includes('success')) {
      showToast('Admin successfully added!')
      fetchAdmins()
      return { success: true }
    }

    showToast(res?.message || 'Failed to add admin', 'error')
    return { success: false }
  }

  const handleRemoveAdmin = async (id) => {
    const res = await removeAdmin(id)

    if (res?.message?.toLowerCase().includes('success') || res?.deleted) {
      setAdmins((prev) => prev.filter((admin) => admin._id !== id))
      showToast('Admin access revoked!')
      return
    }

    showToast(res?.message || 'Failed to remove admin', 'error')
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.4, duration: 0.8 } }
  }

  return (
    <div className="theme-page-shell min-h-screen relative overflow-hidden px-4 py-4 sm:px-6">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[var(--theme-accent)]/10 to-transparent blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-orange-400/5 to-transparent blur-[80px] pointer-events-none" />

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className={`fixed right-4 top-4 z-50 rounded-2xl border px-5 py-3.5 text-sm font-semibold shadow-2xl backdrop-blur-xl flex items-center gap-3 ${toast.type === 'error'
              ? 'border-red-200/50 bg-red-50/90 text-red-700'
              : 'border-orange-200/50 bg-white/90 text-[var(--theme-text)]'
              }`}
          >
            <Sparkles size={16} className={toast.type === 'error' ? 'text-red-500' : 'text-orange-500'} />
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mx-auto max-w-6xl relative z-10">
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
          className="theme-card sticky top-4 z-30 flex items-center justify-between gap-4 rounded-[24px] px-6 py-4 backdrop-blur-xl bg-white/70 shadow-[0_8px_32px_rgba(249,115,22,0.1)] border-white/50"
        >
          <div className="flex items-center gap-4">
            <img src={logo} alt="Home Meal Express" className="h-10 w-auto drop-shadow-md" />
            <div className="h-8 w-px bg-gradient-to-b from-transparent via-orange-300 to-transparent" />
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50/80 px-4 py-1.5 text-[12px] font-bold tracking-[0.2em] text-[var(--theme-accent)] uppercase shadow-inner">
              <Crown size={14} className="text-orange-500" />
              <span>Super Admin</span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setModalOpen(true)}
            className="theme-primary-button inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-semibold shadow-orange-500/30"
          >
            <UserPlus size={16} />
            <span className="hidden sm:inline">Add Admin</span>
          </motion.button>
        </motion.header>

        <main className="py-10">
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
          >
            <div>
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.25em] text-[var(--theme-accent)] mb-3 bg-orange-100/50 px-3 py-1 rounded-full"
              >
                <Sparkles size={12} /> Access Control Hub
              </motion.div>
              <h1 className="text-[32px] font-extrabold tracking-tight theme-heading sm:text-[42px] leading-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                Command Center.
              </h1>
              <p className="theme-muted mt-3 max-w-2xl text-[15px] leading-relaxed">
                Seamlessly orchestrate your platform's administrative delegates. Provision new accesses or revoke permissions instantly.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05, rotate: 15 }}
                whileTap={{ scale: 0.95, rotate: 0 }}
                onClick={fetchAdmins}
                aria-label="Refresh admins list"
                disabled={loadingAdmins}
                className="theme-soft-button bg-white/80 backdrop-blur-md inline-flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm border-white/50 disabled:opacity-50"
              >
                <RefreshCw size={18} className={loadingAdmins ? 'animate-spin text-orange-500' : 'text-gray-600'} />
              </motion.button>
            </div>
          </motion.section>

          <motion.section 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="theme-card rounded-[32px] p-5 sm:p-6 bg-white/60 backdrop-blur-xl border-white/60 shadow-[0_20px_40px_rgba(0,0,0,0.04)]"
          >
            <div className="flex items-center gap-4 rounded-[24px] border border-orange-100/50 bg-gradient-to-br from-white to-orange-50/30 px-5 py-4 shadow-inner">
              <div className="relative grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-lg shadow-orange-500/30">
                <Users size={24} />
                <div className="absolute -top-1 -right-1 flex h-4 w-4 bg-emerald-400 rounded-full border-2 border-white animate-pulse" />
              </div>
              <div className="min-w-0">
                <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-orange-600/80 mb-1">
                  Active Administrators
                </p>
                <p className="text-[28px] font-extrabold leading-none theme-heading tracking-tight">{admins.length}</p>
              </div>
              <div className="ml-auto hidden rounded-full border border-orange-200 bg-white/80 px-4 py-1.5 text-[13px] font-bold text-[var(--theme-accent)] shadow-sm sm:inline-flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" /> System Live
              </div>
            </div>
          </motion.section>

          <section className="mt-8">
            {loadingAdmins ? (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-24 gap-4"
              >
                <LoadingSpinner label="Fetching administrators..." />
              </motion.div>
            ) : admins.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="theme-card relative overflow-hidden flex flex-col items-center justify-center rounded-[32px] py-24 bg-white/40 backdrop-blur-md border border-white/50"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-orange-50/50 to-transparent pointer-events-none" />
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="grid h-20 w-20 place-items-center rounded-full border-4 border-orange-100 bg-orange-50 text-[var(--theme-accent)] shadow-[0_0_40px_rgba(249,115,22,0.2)]"
                >
                  <ShieldAlert size={36} />
                </motion.div>
                <div className="mt-6 text-center z-10">
                  <p className="text-[20px] font-bold theme-heading tracking-tight">No delegates found</p>
                  <p className="theme-muted mt-2 text-[14px]">The system is waiting for its first administrator.</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setModalOpen(true)}
                    className="mt-6 theme-primary-button inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-[14px] font-semibold shadow-lg shadow-orange-500/20"
                  >
                    <UserPlus size={16} />
                    Provision Now
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
              >
                {admins.map((admin) => (
                  <motion.div key={admin._id} variants={itemVariants}>
                    <AdminCard admin={admin} onRemove={handleRemoveAdmin} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </section>
        </main>
      </div>

      <AddAdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAddAdmin}
      />
    </div>
  )
}

export default SuperAdminDashboard
