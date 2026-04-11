import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  UserPlus, 
  Crown, 
  Mail, 
  Phone, 
  Fingerprint, 
  ShieldCheck,
  Zap,
  CheckCircle2,
} from 'lucide-react'

const EMPTY = { name: '', email: '', phone: '', adminCode: '' }

function AddAdminModal({ isOpen, onClose, onAdd }) {
  const [form, setForm] = useState(EMPTY)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isOpen) setForm(EMPTY)
  }, [isOpen])

  const updateField = (key, val) => {
    if (key === 'phone') val = val.replace(/\D/g, '').slice(0, 10)
    setForm(prev => ({ ...prev, [key]: val }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    const res = await onAdd(form)
    setIsSubmitting(false)
    if (res?.success) onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden border border-white"
          >
            {/* Design Header */}
            <div className="bg-slate-900 p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 text-orange-500 opacity-10 rotate-12 translate-x-12 -translate-y-8">
                   <Crown size={180} />
                </div>
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500 text-white text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                        <Zap size={10} fill="currentColor" /> Authority Provisioning
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tight leading-none mb-1">Empower a New Admin.</h2>
                    <p className="text-slate-400 text-sm font-medium">Create a new administrative cluster node.</p>
                </div>
                <button 
                  onClick={onClose}
                  className="absolute top-6 right-6 h-10 w-10 grid place-items-center rounded-2xl bg-white/10 text-white hover:bg-white/20 transition-all"
                >
                    <X size={20} />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 lg:p-10 space-y-6">
                <div className="space-y-1.5 focus-within:translate-x-1 transition-transform duration-300">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <ShieldCheck size={12} className="text-orange-500" /> Administrative Identity
                    </label>
                    <div className="relative group">
                        <input 
                            type="text" required
                            placeholder="Full Name"
                            className="w-full h-14 rounded-2xl bg-slate-50 border-2 border-transparent px-5 text-sm font-bold text-slate-800 placeholder:text-slate-300 focus:bg-white focus:border-orange-500/20 outline-none transition-all shadow-sm"
                            value={form.name}
                            onChange={e => updateField('name', e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-1.5 focus-within:translate-x-1 transition-transform duration-300">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Mail size={12} className="text-orange-500" /> Secure Communications
                    </label>
                    <input 
                        type="email" required
                        placeholder="Email Address"
                        className="w-full h-14 rounded-2xl bg-slate-50 border-2 border-transparent px-5 text-sm font-bold text-slate-800 placeholder:text-slate-300 focus:bg-white focus:border-orange-500/20 outline-none transition-all shadow-sm"
                        value={form.email}
                        onChange={e => updateField('email', e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5 focus-within:translate-x-1 transition-transform duration-300">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Mobile Link</label>
                        <div className="relative flex items-center">
                            <span className="absolute left-4 text-xs font-black text-slate-400">+91</span>
                            <input 
                                type="tel" required
                                placeholder="Number"
                                className="w-full h-14 rounded-2xl bg-slate-50 border-2 border-transparent pl-12 pr-4 text-sm font-bold text-slate-800 placeholder:text-slate-300 focus:bg-white focus:border-orange-500/20 outline-none transition-all shadow-sm"
                                value={form.phone}
                                onChange={e => updateField('phone', e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="space-y-1.5 focus-within:translate-x-1 transition-transform duration-300">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Admin Code</label>
                        <input 
                            type="text" required
                            placeholder="Node ID"
                            className="w-full h-14 rounded-2xl bg-slate-50 border-2 border-transparent px-5 text-sm font-bold text-slate-800 placeholder:text-slate-300 focus:bg-white focus:border-orange-500/20 outline-none transition-all shadow-sm"
                            value={form.adminCode}
                            onChange={e => updateField('adminCode', e.target.value.toUpperCase())}
                        />
                    </div>
                </div>

                <div className="pt-4">
                    <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-16 bg-orange-500 text-white rounded-[24px] font-black tracking-tight text-[15px] uppercase shadow-2xl shadow-orange-500/20 hover:bg-orange-600 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                    >
                        {isSubmitting ? (
                          <div className="h-5 w-5 border-2 border-white border-t-transparent animate-spin rounded-full" />
                        ) : (
                          <>
                            <CheckCircle2 size={20} /> Provision Administrative Access
                          </>
                        )}
                    </button>
                    <p className="mt-5 text-center text-[10px] font-bold text-slate-400 leading-relaxed px-6 uppercase tracking-widest">
                        Note: Passwords are automatically generated by the node controller. Access credentials will be active for 7 days.
                    </p>
                </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default AddAdminModal
