import React, { useState } from 'react'
import { Mail, Phone, Trash2, ShieldCheck, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

function AdminCard({ admin, onRemove }) {
  const [removing, setRemoving] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleRemove = async () => {
    setRemoving(true)
    await onRemove(admin._id)
    if (document.body) {
      setRemoving(false)
      setShowConfirm(false)
    }
  }

  const getInitials = (name) => {
    if (!name) return 'A'
    return name.substring(0, 2).toUpperCase()
  }

  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.01 }}
      className="group relative flex flex-col gap-5 rounded-[28px] border border-white/60 bg-white/70 backdrop-blur-xl p-5 shadow-[0_12px_30px_rgba(15,23,42,0.04)] transition-all hover:shadow-[0_20px_40px_rgba(249,115,22,0.08)] hover:border-orange-200/60 overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400/5 to-transparent rounded-bl-full pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative z-10 flex items-start gap-4">
        <div className="relative grid h-[52px] w-[52px] shrink-0 place-items-center rounded-2xl bg-gradient-to-tr from-gray-900 to-gray-700 text-white shadow-lg shadow-gray-900/20">
          <span className="text-[18px] font-bold tracking-wider">
            {getInitials(admin.name)}
          </span>
          <div className="absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full border-2 border-white bg-blue-500 text-white shadow-sm">
            <ShieldCheck size={10} />
          </div>
        </div>

        <div className="min-w-0 flex-1 pt-1">
          <h3 className="truncate text-[17px] font-bold theme-heading tracking-tight mb-0.5">
            {admin.name || 'Administrator'}
          </h3>
          <p className="text-[12px] font-semibold uppercase tracking-[0.15em] text-blue-600/80">
            Admin Access
          </p>
        </div>
      </div>

      <div className="relative z-10 flex flex-col gap-3 rounded-[20px] bg-slate-50/80 p-4 border border-slate-100">
        <div className="flex items-center gap-3 text-[13.5px]">
          <div className="grid h-7 w-7 place-items-center rounded-full bg-orange-100/80 text-orange-600 shrink-0">
            <Mail size={14} />
          </div>
          <span className="truncate font-medium text-slate-700">{admin.email || '-'}</span>
        </div>
        
        <div className="flex items-center gap-3 text-[13.5px]">
          <div className="grid h-7 w-7 place-items-center rounded-full bg-orange-100/80 text-orange-600 shrink-0">
            <Phone size={14} />
          </div>
          <span className="font-medium text-slate-700">{admin.phone ? `+91 ${admin.phone}` : '-'}</span>
        </div>
      </div>

      <div className="mt-auto pt-1 relative z-10">
        <AnimatePresence mode="wait">
          {!showConfirm ? (
            <motion.button
              key="remove-btn"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={() => setShowConfirm(true)}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50/50 py-2.5 text-[13px] font-bold text-red-600 transition-colors hover:bg-red-100 hover:text-red-700"
            >
              <Trash2 size={16} />
              Revoke Access
            </motion.button>
          ) : (
            <motion.div
              key="confirm-actions"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex gap-2"
            >
              <button
                onClick={() => setShowConfirm(false)}
                disabled={removing}
                className="flex-1 rounded-xl bg-slate-100 py-2.5 text-[13px] font-bold text-slate-600 transition hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleRemove}
                disabled={removing}
                className="flex-[1.5] flex items-center justify-center gap-2 rounded-xl bg-red-500 py-2.5 text-[13px] font-bold text-white shadow-lg shadow-red-500/30 transition hover:bg-red-600 disabled:opacity-70"
              >
                {removing ? (
                  <span className="animate-pulse">Revoking...</span>
                ) : (
                  <>
                    <Trash2 size={14} />
                    Confirm
                  </>
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default AdminCard
