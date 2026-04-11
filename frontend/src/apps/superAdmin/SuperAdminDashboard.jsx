import React, { useCallback, useEffect, useState } from 'react'
import { RefreshCw, Users, ShieldAlert, Sparkles, UserPlus, Fingerprint, Mail, Phone, ExternalLink } from 'lucide-react'
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

    if (res?.admins && Array.isArray(res.admins)) {
      setAdmins(res.admins)
    } else if (Array.isArray(res)) {
      setAdmins(res)
    } else {
      setAdmins([])
    }
  }, [])

  useEffect(() => {
    fetchAdmins()
  }, [fetchAdmins])

  const handleAddAdmin = async (data) => {
    const res = await addAdmin(data)

    if (res?.success || res?.admin) {
      const msg = res.generatedPassword 
        ? `Provisioning Successful! Key: ${res.generatedPassword}` 
        : 'Admin successfully provisioned!'
      showToast(msg)
      fetchAdmins()
      return { success: true }
    }

    showToast(res?.message || 'Failed to provision admin', 'error')
    return { success: false }
  }

  const handleRemoveAdmin = async (id) => {
    const res = await removeAdmin(id)

    if (res?.message?.toLowerCase().includes('success') || res?.deleted) {
      setAdmins((prev) => prev.filter((admin) => admin._id !== id))
      showToast('Administrative node disconnected.')
      return
    }

    showToast(res?.message || 'Protocol failure during revocation.', 'error')
  }

  const filteredAdmins = admins.filter(a => 
    a.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.adminCode?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  return (
    <div className="theme-page-shell min-h-screen relative overflow-x-hidden pt-4 pb-20 bg-[#fffcf9]">
      {/* Decorative background gradients to match the peach/orange theme */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-orange-100/40 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-orange-200/20 to-transparent blur-[100px] pointer-events-none" />

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className={`fixed right-6 top-6 z-50 rounded-2xl border px-6 py-4 text-sm font-bold shadow-2xl backdrop-blur-xl flex items-center gap-3 ring-1 ${
              toast.type === 'error'
              ? 'border-red-100 bg-red-50/90 text-red-700 ring-red-200/50'
              : 'border-orange-100 bg-white/95 text-slate-800 ring-orange-200/50'
            }`}
          >
            <Sparkles size={18} className={toast.type === 'error' ? 'text-red-500' : 'text-orange-500'} />
            <span className="max-w-[420px]">{toast.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mx-auto max-w-6xl relative z-10 px-4">
        <SuperAdminNavbar onAddAdmin={() => setModalOpen(true)} />

        <main className="mt-16">
          {/* Hero / Stats Header */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between mb-12"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100/50 border border-orange-100 text-[10px] font-black uppercase tracking-[0.2em] text-orange-600 mb-4 shadow-sm">
                <Sparkles size={12} fill="currentColor" /> System Overseer
              </div>
              <h1 className="text-4xl font-black text-slate-800 tracking-tight lg:text-5xl leading-none">
                Master Dashboard.
              </h1>
              <p className="mt-4 text-slate-500 font-medium max-w-xl text-lg">
                Manage, monitor, and provision administrative access for the Home Meal Express platform.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
               <div className="flex h-14 items-center gap-3 rounded-2xl border border-slate-100 bg-white bg-opacity-70 backdrop-blur-md px-5 shadow-sm transition-all focus-within:ring-2 focus-within:ring-orange-500/10">
                  <Users size={18} className="text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search Admin..." 
                    className="bg-transparent text-sm font-bold text-slate-700 outline-none placeholder:text-slate-300 w-32 sm:w-48"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
               </div>
               <button 
                onClick={fetchAdmins}
                className="grid h-14 w-14 place-items-center rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-orange-500 hover:border-orange-200 transition-all active:scale-95 shadow-sm shadow-orange-500/5"
               >
                <RefreshCw size={18} className={loadingAdmins ? 'animate-spin' : ''} />
               </button>
            </div>
          </motion.section>

          {/* Quick Metrics */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm relative overflow-hidden group">
                  <div className="absolute -right-4 -bottom-4 text-orange-500/5 transition-transform duration-500 group-hover:scale-110">
                      <Users size={100} />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Active Clusters</p>
                  <p className="text-3xl font-black text-slate-800">{admins.length}</p>
                  <div className="mt-3 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">System Live</span>
                  </div>
              </div>
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total PNR Logs</p>
                  <p className="text-3xl font-black text-slate-800">1,248</p>
                  <div className="mt-3 text-[11px] font-bold text-emerald-600 uppercase tracking-tighter">+12.5% Growth</div>
              </div>
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Active Orders</p>
                  <p className="text-3xl font-black text-slate-800">156</p>
                  <div className="mt-3 text-[11px] font-bold text-blue-600 uppercase tracking-tighter">High Volume</div>
              </div>
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-center">
                  <button 
                    onClick={() => setModalOpen(true)}
                    className="w-full py-3 bg-orange-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-orange-500/20 hover:bg-orange-600 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    <UserPlus size={14} /> Provision New
                  </button>
              </div>
          </section>

          {/* Admin List Section */}
          <section>
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                  Node Entities
                  <span className="text-xs font-bold px-3 py-1 bg-white border border-slate-100 text-slate-400 rounded-xl shadow-sm">
                    {filteredAdmins.length} Nodes
                  </span>
               </h3>
               <div className="h-px flex-1 mx-8 bg-gradient-to-r from-slate-100 to-transparent hidden md:block" />
            </div>

            {loadingAdmins ? (
              <div className="py-24 flex flex-col items-center">
                <LoadingSpinner label="Synchronizing Node Data..." />
              </div>
            ) : filteredAdmins.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[40px] border border-dashed border-slate-200 py-24 flex flex-col items-center text-center px-10"
              >
                <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center text-slate-200 mb-6 font-black text-4xl">?</div>
                <h4 className="text-xl font-bold text-slate-800">No Administration Clusters Detected</h4>
                <p className="text-slate-400 mt-2 text-sm max-w-xs mx-auto">Either your search returned zero results or the system is currently independent.</p>
                <button 
                    onClick={() => setModalOpen(true)}
                    className="mt-8 px-8 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-bold text-sm transition-all flex items-center gap-2"
                >
                    <UserPlus size={16} /> Deploy New Cluster
                </button>
              </motion.div>
            ) : (
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredAdmins.map((admin) => (
                  <AdminCard 
                    key={admin._id} 
                    admin={admin} 
                    onRemove={handleRemoveAdmin} 
                  />
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
