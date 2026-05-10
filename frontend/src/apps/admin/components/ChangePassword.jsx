import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { KeyRound, Lock, LockKeyhole, Eye, EyeOff, ShieldCheck, AlertCircle, LogOut, X } from 'lucide-react'

const passwordChecks = (password) => ({
  length: password.length >= 8,
  uppercase: /[A-Z]/.test(password),
  number: /\d/.test(password),
  special: /[^A-Za-z\d]/.test(password),
})

export default function ChangePassword({
  isOpen = false,
  isSubmitting = false,
  adminEmail = '',
  onSubmit,
  onLogout,
  onClose,
  isMandatory = false,
}) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [error, setError] = useState('')

  if (!isOpen) return null

  const checks = passwordChecks(form.newPassword)
  const allChecksPassed = Object.values(checks).every(Boolean)

  const updateField = (key) => (event) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }))
    setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!isMandatory && !form.currentPassword) {
      setError('Please enter your current password.')
      return
    }

    if (!form.newPassword || !form.confirmPassword) {
      setError('Please fill all required password fields.')
      return
    }

    if (!allChecksPassed) {
      setError('Please choose a stronger password.')
      return
    }

    if (form.newPassword !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    const res = await onSubmit?.(form)

    if (!res?.success) {
      setError(res?.message || 'Unable to update password.')
      return
    }

    setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    setError('')

    if (!isMandatory) {
      onClose?.()
    }
  }

  const handleClose = () => {
    if (isMandatory) return
    setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    setError('')
    onClose?.()
  }

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
            onClick={handleClose}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-md bg-white rounded-[32px] shadow-[0_24px_64px_rgba(0,0,0,0.12)] border border-slate-100 overflow-hidden"
          >
            {!isMandatory && (
              <button
                type="button"
                onClick={handleClose}
                className="absolute right-5 top-5 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-500 transition hover:border-slate-300 hover:text-slate-800"
              >
                <X size={16} />
              </button>
            )}

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
                <div className="inline-flex items-center gap-1 mb-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--theme-accent)] bg-[var(--theme-accent-soft)] px-2.5 py-1 rounded-full">
                  <ShieldCheck size={12} /> {isMandatory ? 'Mandatory Security Step' : 'Account Security'}
                </div>
                <h2 className="text-2xl sm:text-[26px] font-bold text-[var(--theme-text-strong)] tracking-tight mb-2">
                  Change Password
                </h2>
                <p className="text-[13px] text-[var(--theme-muted)] font-medium leading-relaxed">
                  {isMandatory
                    ? 'For your security, please change your one-time password before continuing in the administrative dashboard.'
                    : 'Update your current password to keep your admin access secure.'}
                </p>
                {adminEmail && (
                  <p className="mt-3 text-[12px] font-semibold text-[var(--theme-accent)]">
                    Logged in as {adminEmail}
                  </p>
                )}
              </div>

              {/* Form UI */}
              <form className="space-y-5" onSubmit={handleSubmit}>
                {!isMandatory && (
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-[var(--theme-text)] uppercase tracking-wider pl-1">
                      Current Password
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[var(--theme-accent)] transition-colors">
                        <LockKeyhole size={18} />
                      </div>
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        placeholder="Enter current password"
                        value={form.currentPassword}
                        onChange={updateField('currentPassword')}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-10 pr-10 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--theme-accent)]/20 focus:border-[var(--theme-accent)] transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                )}
                
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
                      value={form.newPassword}
                      onChange={updateField('newPassword')}
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
                      value={form.confirmPassword}
                      onChange={updateField('confirmPassword')}
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
                  <li className={`text-[11px] font-medium flex items-center gap-1.5 ${checks.length ? 'text-emerald-600' : 'text-[var(--theme-muted)]'}`}>
                    <div className={`h-1.5 w-1.5 rounded-full ${checks.length ? 'bg-emerald-500' : 'bg-slate-300'}`}></div> 8+ characters
                  </li>
                  <li className={`text-[11px] font-medium flex items-center gap-1.5 ${checks.uppercase ? 'text-emerald-600' : 'text-[var(--theme-muted)]'}`}>
                    <div className={`h-1.5 w-1.5 rounded-full ${checks.uppercase ? 'bg-emerald-500' : 'bg-slate-300'}`}></div> 1 uppercase letter
                  </li>
                  <li className={`text-[11px] font-medium flex items-center gap-1.5 ${checks.number ? 'text-emerald-600' : 'text-[var(--theme-muted)]'}`}>
                    <div className={`h-1.5 w-1.5 rounded-full ${checks.number ? 'bg-emerald-500' : 'bg-slate-300'}`}></div> 1 number
                  </li>
                  <li className={`text-[11px] font-medium flex items-center gap-1.5 ${checks.special ? 'text-emerald-600' : 'text-[var(--theme-muted)]'}`}>
                    <div className={`h-1.5 w-1.5 rounded-full ${checks.special ? 'bg-emerald-500' : 'bg-slate-300'}`}></div> 1 special character
                  </li>
                </ul>

                {error && (
                  <div className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-medium text-red-700">
                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Action Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-2xl bg-[var(--theme-accent)] py-3.5 px-4 text-[15px] font-semibold text-white shadow-[0_8px_16px_rgba(249,115,22,0.2)] hover:bg-[#eaeaea] hover:shadow-none transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
                  style={{
                    background: 'var(--theme-gradient-primary)'
                  }}
                >
                  {isSubmitting ? 'Updating Password...' : isMandatory ? 'Save & Continue' : 'Change Password'}
                </button>

                {typeof onLogout === 'function' && (
                  <button
                    type="button"
                    onClick={onLogout}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white py-3 text-[14px] font-bold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
                  >
                    <LogOut size={16} />
                    Logout Instead
                  </button>
                )}
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
