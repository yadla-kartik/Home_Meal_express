import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CircleCheck, Eye, EyeOff, X, KeySquare, Mail, Phone, User, ShieldPlus } from 'lucide-react'

const EMPTY = { name: '', email: '', phone: '', password: '' }

function AddAdminModal({ isOpen, onClose, onAdd }) {
  const [form, setForm] = useState(EMPTY)
  const [showPass, setShowPass] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setForm(EMPTY)
      setShowPass(false)
    }
  }, [isOpen])

  const updateField = (key) => (event) => {
    let val = event.target.value
    if (key === 'phone') {
      val = val.replace(/\D/g, '').slice(0, 10)
    }
    setForm((prev) => ({ ...prev, [key]: val }))
  }

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
  const isValidPhone = form.phone.length === 10

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    const result = await onAdd({ ...form })
    setSubmitting(false)

    if (result?.success !== false) {
      setForm(EMPTY)
      onClose()
    }
  }

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  }

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { type: "spring", bounce: 0.3, duration: 0.5 }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      y: 20,
      transition: { duration: 0.2 }
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-md"
          onClick={(event) => {
            if (event.target === event.currentTarget) onClose()
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-admin-modal-title"
        >
          <motion.div 
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="theme-card relative w-full max-w-[460px] rounded-[32px] bg-white/95 p-1 shadow-2xl shadow-orange-500/10 border-white"
          >
            <div className="rounded-[28px] bg-white px-7 pb-8 pt-7 border border-slate-100 overflow-hidden relative">
              {/* Decorative top gradient */}
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-orange-50 to-transparent opacity-80 pointer-events-none" />

              <button
                onClick={onClose}
                aria-label="Close modal"
                className="absolute right-5 top-5 z-10 grid h-9 w-9 place-items-center rounded-full bg-slate-100/80 text-slate-500 transition hover:bg-slate-200 hover:scale-105"
              >
                <X size={16} strokeWidth={2.5} />
              </button>

              <div className="mb-7 flex flex-col items-center text-center relative z-10 pt-2">
                <div className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-orange-400 to-orange-500 text-white shadow-lg shadow-orange-500/30 mb-4 ring-4 ring-orange-50">
                  <ShieldPlus size={26} strokeWidth={2.5} />
                </div>
                <h2 id="add-admin-modal-title" className="text-[22px] font-extrabold tracking-tight theme-heading">
                  Delegate Access
                </h2>
                <p className="theme-muted mt-1.5 text-[14px]">
                  Provision a completely new administrative entity.
                </p>
              </div>

              <form className="flex flex-col gap-4 relative z-10" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-1.5 ">
                  <label htmlFor="modal-admin-name" className="text-[13px] font-bold text-slate-700 ml-1">
                    System Name
                  </label>
                  <div className="relative group">
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                    <input
                      id="modal-admin-name"
                      type="text"
                      value={form.name}
                      onChange={updateField('name')}
                      placeholder="E.g. Technical Admin"
                      required
                      className="theme-input h-12 w-full rounded-[16px] pl-11 pr-4 text-[14px] font-medium bg-slate-50 focus:bg-white border-transparent"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="modal-admin-email" className="text-[13px] font-bold text-slate-700 ml-1">
                    Secure Email Link
                  </label>
                  <div className="relative group">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                    <input
                      id="modal-admin-email"
                      type="email"
                      value={form.email}
                      onChange={updateField('email')}
                      placeholder="admin@traineats.com"
                      required
                      className="theme-input h-12 w-full rounded-[16px] pl-11 pr-11 text-[14px] font-medium bg-slate-50 focus:bg-white border-transparent"
                    />
                    <AnimatePresence>
                      {isValidEmail(form.email) && (
                        <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}>
                          <CircleCheck size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="modal-admin-phone" className="text-[13px] font-bold text-slate-700 ml-1">
                    Emergency Contact
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex h-12 w-[90px] shrink-0 items-center justify-center gap-1.5 rounded-[16px] bg-slate-50 border border-slate-200 px-3">
                      <span className="rounded-md bg-orange-100 px-1.5 py-0.5 text-[11px] font-extrabold text-orange-600">IN</span>
                      <span className="text-[14px] font-bold theme-heading">+91</span>
                    </div>
                    <div className="relative flex-1 group">
                      <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                      <input
                        id="modal-admin-phone"
                        type="tel"
                        inputMode="numeric"
                        value={form.phone}
                        onChange={updateField('phone')}
                        placeholder="Mobile Number"
                        required
                        className="theme-input h-12 w-full rounded-[16px] pl-11 pr-11 text-[14px] font-medium bg-slate-50 focus:bg-white border-transparent"
                      />
                      <AnimatePresence>
                        {isValidPhone && (
                          <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}>
                            <CircleCheck size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="modal-admin-password" className="text-[13px] font-bold text-slate-700 ml-1">
                    Access Key
                  </label>
                  <div className="relative group">
                    <KeySquare size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                    <input
                      id="modal-admin-password"
                      type={showPass ? 'text' : 'password'}
                      value={form.password}
                      onChange={updateField('password')}
                      placeholder="Generate strong password"
                      required
                      className="theme-input h-12 w-full rounded-[16px] pl-11 pr-12 text-[14px] font-medium bg-slate-50 focus:bg-white border-transparent tracking-wide"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((prev) => !prev)}
                      aria-label={showPass ? 'Hide password' : 'Show password'}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-orange-500 transition-colors"
                    >
                      {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="mt-4 pt-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    id="submit-add-admin"
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 rounded-[16px] bg-gradient-to-r from-orange-500 to-orange-400 py-3.5 text-[15px] font-bold text-white shadow-xl shadow-orange-500/25 transition disabled:opacity-70 disabled:hover:scale-100"
                  >
                    {submitting ? (
                      <span className="flex items-center gap-2 animate-pulse">
                        <ShieldPlus size={18} /> Provisioning Access...
                      </span>
                    ) : (
                      <>
                        <ShieldPlus size={18} /> Finalize Provision
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default AddAdminModal
