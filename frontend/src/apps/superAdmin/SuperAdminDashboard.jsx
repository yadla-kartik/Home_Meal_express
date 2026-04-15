import React, { useCallback, useEffect, useState } from 'react'
import { RefreshCw, Users, UserPlus, Search, X, CheckCircle, AlertCircle, ShieldCheck } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import LoadingSpinner from '../../components/LoadingSpinner'
import AdminCard from './components/AdminCard'
import AddAdminModal from './components/AddAdminModal'
import SuperAdminNavbar from './SuperAdminNavbar'
import { addAdmin, getAllAdmins, removeAdmin } from '../../../services/superAdminService'

function SuperAdminDashboard() {
  const [admins, setAdmins] = useState([])
  const [loadingAdmins, setLoadingAdmins] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    window.setTimeout(() => setToast(null), 4000)
  }

  const fetchAdmins = useCallback(async () => {
    setLoadingAdmins(true)
    const res = await getAllAdmins()
    setLoadingAdmins(false)
    if (res?.admins && Array.isArray(res.admins)) setAdmins(res.admins)
    else if (Array.isArray(res)) setAdmins(res)
    else setAdmins([])
  }, [])

  useEffect(() => { fetchAdmins() }, [fetchAdmins])

  const handleAddAdmin = async (data) => {
    const res = await addAdmin(data)
    if (res?.success || res?.admin) {
      const msg = res.generatedPassword
        ? `Admin added! Password: ${res.generatedPassword}`
        : 'Admin added successfully!'
      showToast(msg)
      fetchAdmins()
      return { success: true }
    }
    showToast(res?.message || 'Failed to add admin', 'error')
    return { success: false }
  }

  const handleRemoveAdmin = async (id) => {
    const res = await removeAdmin(id)
    if (res?.message?.toLowerCase().includes('success') || res?.deleted) {
      setAdmins((prev) => prev.filter((a) => a._id !== id))
      showToast('Admin removed successfully.')
      return
    }
    showToast(res?.message || 'Failed to remove admin.', 'error')
  }

  const filteredAdmins = admins.filter(
    (a) =>
      a.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.adminCode?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="theme-page-shell min-h-screen pb-14">

      {/* ── Toast ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className={`fixed top-20 right-6 z-50 flex items-center gap-3 rounded-2xl px-5 py-3.5 text-sm font-semibold shadow-xl border backdrop-blur-sm
              ${toast.type === 'error'
                ? 'bg-red-50 border-red-200 text-red-700'
                : 'bg-white border-[color:var(--theme-border)] text-[var(--theme-text)]'
              }`}
          >
            {toast.type === 'error'
              ? <AlertCircle size={16} className="text-red-500 shrink-0" />
              : <CheckCircle size={16} className="text-emerald-500 shrink-0" />
            }
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <SuperAdminNavbar onAddAdmin={() => setModalOpen(true)} />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-22">

        {/* ── Hero Banner ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="relative rounded-3xl overflow-hidden mb-8 px-8 py-10 sm:px-10"
          style={{
            background: 'var(--theme-gradient-primary)',
          }}
        >
          {/* decorative blobs */}
          <div className="absolute -right-8 -top-8 h-52 w-52 rounded-full bg-white/10 pointer-events-none" />
          <div className="absolute right-16 -bottom-10 h-36 w-36 rounded-full bg-white/5 pointer-events-none" />

          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-white/20 text-white text-[11px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
                <ShieldCheck size={11} />
                Super Admin Panel
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                Admin Management
              </h1>
              <p className="text-white/65 mt-2 text-sm font-medium">
                Manage and monitor all admins · Home Meal Express
              </p>
            </div>

            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-2.5 bg-white text-[var(--theme-accent)] font-extrabold text-sm px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-[0.98] w-fit shrink-0 cursor-pointer"
            >
              <UserPlus size={16} />
              Add New Admin
            </button>
          </div>
        </motion.div>

        {/* ── Stats Row ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
        >
          {[
            { label: 'Total Admins', value: admins.length, sub: 'Registered on platform', icon: <Users size={17} /> },
            { label: 'Active', value: admins.length, sub: 'Currently active', icon: <CheckCircle size={17} />, dot: true },
            { label: 'System Health', value: '100%', sub: 'All clusters operational', icon: <ShieldCheck size={17} /> },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.13 + i * 0.07 }}
              className="theme-card rounded-2xl px-6 py-5 border border-[color:var(--theme-border)] hover:border-[var(--theme-accent)] hover:shadow-md transition-all group overflow-hidden relative"
            >
              {/* ghost icon bg */}
              <div className="absolute -right-4 -bottom-4 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity text-[var(--theme-accent)]">
                <div className="scale-[5] origin-bottom-right">{stat.icon}</div>
              </div>
              <div className="flex items-start justify-between mb-1">
                <p className="text-xs font-extrabold uppercase tracking-widest text-[var(--theme-muted)]">{stat.label}</p>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0 text-[var(--theme-accent)]" style={{ background: 'var(--theme-accent-soft)' }}>
                  {stat.icon}
                </div>
              </div>
              <div className="flex items-end gap-2">
                <p className="text-3xl font-black" style={{ background: 'var(--theme-gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{stat.value}</p>
                {stat.dot && <span className="mb-1.5 h-2.5 w-2.5 rounded-full bg-emerald-500 shrink-0" />}
              </div>
              <p className="text-xs text-[var(--theme-muted)] font-semibold mt-2">{stat.sub}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Section Label & Search ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-8 mt-2"
        >
          <div className="flex items-center gap-3">
            <h2 className="text-2xl sm:text-3xl font-black text-[var(--theme-text)] tracking-tight">All Admins</h2>
            <span className="text-sm font-bold bg-[var(--theme-accent-soft)] text-[var(--theme-accent)] px-3 py-1 rounded-full">
              {filteredAdmins.length}
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="theme-card flex items-center gap-2.5 rounded-2xl px-4 py-3 border border-[color:var(--theme-border)] hover:border-[color:var(--theme-accent)] focus-within:!border-[color:var(--theme-accent)] focus-within:shadow-sm transition-all w-full sm:w-72">
              <Search size={15} className="text-[var(--theme-muted)] shrink-0" />
              <input
                type="text"
                placeholder="Search by name or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent text-sm text-[var(--theme-text)] outline-none placeholder-[var(--theme-muted)] w-full font-medium"
              />
              <AnimatePresence>
                {searchTerm && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => setSearchTerm('')}
                    className="text-[var(--theme-muted)] hover:text-[var(--theme-text)] transition-colors cursor-pointer"
                  >
                    <X size={14} />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={fetchAdmins}
              title="Refresh"
              className="theme-card h-11 w-11 shrink-0 flex items-center justify-center rounded-2xl border border-[color:var(--theme-border)] text-[var(--theme-muted)] hover:text-[var(--theme-accent)] hover:border-[var(--theme-accent)] transition-all active:scale-95 cursor-pointer"
            >
              <RefreshCw size={15} className={loadingAdmins ? 'animate-spin' : ''} />
            </button>
          </div>
        </motion.div>

        {/* ── Grid ── */}
        {loadingAdmins ? (
          <div className="py-28 flex items-center justify-center">
            <LoadingSpinner label="Loading admins..." />
          </div>
        ) : filteredAdmins.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="h-16 w-16 rounded-3xl bg-[var(--theme-accent-soft)] flex items-center justify-center mb-5">
              <Users size={26} className="text-[var(--theme-accent)]" />
            </div>
            <h4 className="text-lg font-bold text-[var(--theme-text)] mb-1.5">
              {searchTerm ? 'No results found' : 'No admins yet'}
            </h4>
            <p className="text-sm text-[var(--theme-muted)] max-w-xs mb-7">
              {searchTerm
                ? `No admins match "${searchTerm}"`
                : 'Add your first admin to get started.'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setModalOpen(true)}
                className="theme-primary-button inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl text-sm font-bold transition-all active:scale-[0.98] cursor-pointer"
              >
                <UserPlus size={15} />
                Add Admin
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {filteredAdmins.map((admin, i) => (
              <motion.div
                key={admin._id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, delay: i * 0.06 }}
              >
                <AdminCard admin={admin} onRemove={handleRemoveAdmin} />
              </motion.div>
            ))}
          </motion.div>
        )}

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