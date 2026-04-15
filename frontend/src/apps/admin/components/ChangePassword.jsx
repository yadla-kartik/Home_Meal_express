import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { KeyRound, Lock, LockKeyhole, Eye, EyeOff, ShieldCheck } from 'lucide-react'

// Dummy props for UI demonstration
// 'isOpen' controls the visibility of the modal
export default function ChangePassword({ isOpen = true }) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  // This is purely for UI demonstration purposes
  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-md bg-white rounded-[32px] shadow-[0_24px_64px_rgba(0,0,0,0.12)] border border-slate-100 overflow-hidden"
          >
            {/* Top Decoration Gradient */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-[linear-gradient(135deg,rgba(249,115,22,0.15),transparent)] rounded-t-[32px]" />

            <div className="relative px-8 pt-10 pb-8 sm:px-10">
              {/* Icon */}
              <div className="mb-6 flex justify-center">
                <div className="h-16 w-16 rounded-[24px] bg-[linear-gradient(135deg,#fff6ef,#ffecd8)] border border-[rgba(249,115,22,0.15)] text-[var(--theme-accent)] flex items-center justify-center shadow-[0_8px_16px_rgba(249,115,22,0.12)]">
                  <KeyRound size={28} strokeWidth={2.5} />
                </div>
              </div>

              {/* Headings */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-1 mb-3 text-[10px] font-black uppercase tracking-[0.12em] text-[var(--theme-accent)] bg-[var(--theme-accent-soft)] px-2.5 py-1 rounded-full">
                  <ShieldCheck size={12} /> Mandatory Security Step
                </div>
                <h2 className="text-2xl sm:text-[26px] font-black text-[var(--theme-text-strong)] tracking-tight mb-2">
                  Update Password
                </h2>
                <p className="text-[13px] text-[var(--theme-muted)] font-medium leading-relaxed">
                  For your security, please change your default password before accessing the administrative dashboard.
                </p>
              </div>

              {/* Form UI */}
              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                
                {/* New Password Field */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[var(--theme-text)] uppercase tracking-wider pl-1">
                    New Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[var(--theme-accent)] transition-colors">
                      <Lock size={18} />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter new password"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-10 pr-10 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--theme-accent)]/20 focus:border-[var(--theme-accent)] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[var(--theme-text)] uppercase tracking-wider pl-1">
                    Confirm Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[var(--theme-accent)] transition-colors">
                      <LockKeyhole size={18} />
                    </div>
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="Re-enter new password"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-10 pr-10 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--theme-accent)]/20 focus:border-[var(--theme-accent)] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Password Requirements UI (Optional Display) */}
                <ul className="grid grid-cols-2 gap-2 pt-1 pb-3 px-1">
                  <li className="text-[11px] text-[var(--theme-muted)] font-medium flex items-center gap-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-slate-300"></div> 8+ characters
                  </li>
                  <li className="text-[11px] text-[var(--theme-muted)] font-medium flex items-center gap-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-slate-300"></div> 1 uppercase letter
                  </li>
                  <li className="text-[11px] text-[var(--theme-muted)] font-medium flex items-center gap-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-slate-300"></div> 1 number
                  </li>
                  <li className="text-[11px] text-[var(--theme-muted)] font-medium flex items-center gap-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-slate-300"></div> 1 special character
                  </li>
                </ul>

                {/* Action Button */}
                <button
                  type="button"
                  className="w-full rounded-2xl bg-[var(--theme-accent)] py-3.5 px-4 text-[15px] font-black text-white shadow-[0_8px_16px_rgba(249,115,22,0.2)] hover:bg-[#eaeaea] hover:shadow-none transition-all active:scale-[0.98]"
                  style={{
                    background: 'var(--theme-gradient-primary)'
                  }}
                >
                  Save & Continue
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
