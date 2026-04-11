import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MoreVertical, 
  Trash2, 
  Mail, 
  Phone, 
  Fingerprint,
  ShieldCheck,
  Zap,
  ChevronRight
} from 'lucide-react'

function AdminCard({ admin, onRemove }) {
  const [showOptions, setShowOptions] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)

  const handleRevoke = async () => {
    setIsRemoving(true)
    await onRemove(admin._id)
    setIsRemoving(false)
    setShowOptions(false)
  }

  const getInitials = (n) => n?.substring(0, 2).toUpperCase() || 'AD'

  return (
    <motion.div
        layout
        variants={{
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0 }
        }}
        className="group relative bg-white rounded-[32px] border border-slate-100 p-6 shadow-sm hover:shadow-2xl hover:shadow-orange-200/20 transition-all duration-500 overflow-hidden"
    >
        {/* Animated accent gradient on hover */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400/5 to-transparent rounded-bl-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="flex items-start justify-between relative z-10">
            <div className="flex items-center gap-4">
                <div className="relative h-14 w-14 shrink-0 rounded-2xl bg-slate-900 grid place-items-center text-white shadow-xl shadow-slate-900/10 overflow-hidden group-hover:scale-105 transition-transform duration-500">
                    <span className="text-lg font-black tracking-tighter">
                        {getInitials(admin.name)}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 to-transparent pointer-events-none" />
                </div>
                <div>
                    <h4 className="text-[17px] font-black text-slate-800 leading-tight group-hover:text-orange-600 transition-colors">
                        {admin.name}
                    </h4>
                    <span className="inline-flex items-center gap-1.5 mt-1.5 text-[10px] font-black uppercase tracking-[0.15em] text-orange-500">
                        <Zap size={10} fill="currentColor" /> Admin Access
                    </span>
                </div>
            </div>

            <button 
                onClick={() => setShowOptions(!showOptions)}
                className={`h-9 w-9 grid place-items-center rounded-xl transition-all ${
                    showOptions ? 'bg-slate-100 text-slate-800 rotate-90' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                }`}
            >
                <MoreVertical size={18} />
            </button>
        </div>

        <div className="mt-8 space-y-3 relative z-10">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-50 hover:border-orange-100 hover:bg-white transition-all group/cell">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-xl bg-white shadow-sm grid place-items-center text-slate-400 group-hover/cell:text-orange-500 transition-colors">
                        <Fingerprint size={16} />
                    </div>
                    <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Emp ID</p>
                        <p className="text-[13px] font-bold text-slate-700">#{admin.adminCode || 'N/A'}</p>
                    </div>
                </div>
                <ChevronRight size={14} className="text-slate-200 group-hover/cell:text-orange-200 transition-colors" />
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-50 hover:border-orange-100 hover:bg-white transition-all group/cell">
                <div className="h-8 w-8 rounded-xl bg-white shadow-sm grid place-items-center text-slate-400 group-hover/cell:text-orange-500 transition-colors">
                    <Mail size={16} />
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Email Node</p>
                    <p className="text-[13px] font-bold text-slate-700 truncate">{admin.email}</p>
                </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-50 hover:border-orange-100 hover:bg-white transition-all group/cell">
                <div className="h-8 w-8 rounded-xl bg-white shadow-sm grid place-items-center text-slate-400 group-hover/cell:text-orange-500 transition-colors">
                    <Phone size={16} />
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Secure Contact</p>
                    <p className="text-[13px] font-bold text-slate-700">+91 {admin.phone}</p>
                </div>
            </div>
        </div>

        <AnimatePresence>
            {showOptions && (
                <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                >
                    <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3">
                         <button className="h-11 rounded-xl bg-slate-100 text-[13px] font-black text-slate-600 hover:bg-slate-200 transition-colors">
                            Manage
                         </button>
                         <button 
                            onClick={handleRevoke}
                            disabled={isRemoving}
                            className="h-11 rounded-xl bg-rose-50 text-[13px] font-black text-rose-600 hover:bg-rose-100 transition-colors flex items-center justify-center gap-2"
                         >
                            {isRemoving ? <div className="h-4 w-4 border-2 border-rose-600 border-t-transparent animate-spin rounded-full" /> : <><Trash2 size={14} /> Revoke</>}
                         </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-500 opacity-0 group-hover:opacity-10 transition-opacity" />
    </motion.div>
  )
}

export default AdminCard
