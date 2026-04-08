import React from 'react'
import { ShieldAlert, Smartphone, X } from 'lucide-react'

function LoginStatusPopup({
  isOpen,
  name,
  roleLabel = 'Delivery Partner',
  title,
  message,
  onClose,
  onContinue,
  continueLabel = 'Okay',
}) {
  const safeName = (name || '').trim() || roleLabel

  if (!isOpen) return null

  const handleContinue = () => {
    if (onContinue) {
      onContinue()
      return
    }

    if (onClose) {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(15,23,42,0.16)] px-4 backdrop-blur-[3px]">
      <div className="relative w-full max-w-sm overflow-visible rounded-[26px] border border-[color:var(--theme-surface-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(255,247,239,0.96))] px-6 pb-6 pt-12 shadow-[0_26px_58px_rgba(15,23,42,0.18)]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-[linear-gradient(180deg,rgba(249,115,22,0.08),transparent)]" />

        <button
          type="button"
          onClick={onClose}
          aria-label="Close popup"
          className="absolute right-4 top-4 rounded-full p-2 text-[var(--theme-muted)] transition hover:bg-white/80"
        >
          <X size={18} />
        </button>

        <div className="absolute -top-9 left-1/2 flex h-20 w-20 -translate-x-1/2 items-center justify-center rounded-full border border-white/80 bg-[linear-gradient(180deg,#fff6ee,#ffe7d1)] shadow-[0_12px_24px_rgba(249,115,22,0.2)]">
          <ShieldAlert size={34} className="text-[var(--theme-accent)]" />
        </div>

        <h2 className="mt-4 text-center text-xl font-bold text-[var(--theme-text)]">
          {title || `${safeName} is already logged in`}
        </h2>

        <p className="mt-2 text-center text-sm leading-6 text-[var(--theme-muted)]">
          {message ||
            'This mobile number is already active on another device. Please logout there first and then try again.'}
        </p>

        <div className="mt-4 rounded-[20px] border border-amber-200 bg-[linear-gradient(135deg,#fff7ed,#fffbeb)] px-4 py-3 text-left shadow-[0_10px_24px_rgba(245,158,11,0.12)]">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-600">
              <Smartphone size={18} />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-[#92400e]">Active session detected</div>
              <p className="mt-1 text-sm leading-5 text-[#78350f]">
                Only one active login is allowed for a {roleLabel.toLowerCase()} at a time.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-3">
          <button
            type="button"
            onClick={handleContinue}
            className="w-full rounded-xl bg-[linear-gradient(135deg,#f97316,#fb923c)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_22px_rgba(249,115,22,0.28)] transition active:scale-[0.98]"
          >
            {continueLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default LoginStatusPopup
