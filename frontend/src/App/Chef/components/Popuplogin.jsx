import React, { useState } from 'react'

function Popuplogin({ isOpen, name, onClose, onRegister }) {
  if (!isOpen) return null

  const safeName = (name || '').trim() || 'User'
  const [showCongrats, setShowCongrats] = useState(false)

  const handleRegister = () => {
    setShowCongrats(true)
    if (onRegister) {
      onRegister(true)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md px-4">
      <div className="relative w-full max-w-sm rounded-3xl bg-white px-6 pb-6 pt-12 shadow-[0_24px_48px_rgba(15,23,42,0.25)] ring-1 ring-black/5">
        {!showCongrats ? (
          <>
            <div className="absolute -top-8 left-1/2 flex h-20 w-20 -translate-x-1/2 items-center justify-center rounded-full bg-[#fff3e7] text-4xl shadow-[0_12px_20px_rgba(249,115,22,0.25)]">
              👋
            </div>
            <h2 className="mt-4 text-center text-xl font-bold text-[#0f172a]">
              Welcome, {safeName}!
            </h2>
            <p className="mt-2 text-center text-sm text-[#475569]">
              You logged in successfully. Register now to continue. 🍳✨
            </p>

            <button
              type="button"
              onClick={handleRegister}
              className="mt-5 w-full rounded-xl bg-[linear-gradient(135deg,#f97316,#fb923c)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_22px_rgba(249,115,22,0.28)] transition active:scale-[0.98]"
            >
              Register Now 🚀
            </button>
          </>
        ) : (
          <>
            <div className="absolute -top-8 left-1/2 flex h-20 w-20 -translate-x-1/2 items-center justify-center rounded-full bg-[#fff3e7] text-4xl shadow-[0_12px_20px_rgba(249,115,22,0.25)]">
              🎉
            </div>
            <h2 className="mt-4 text-center text-xl font-bold text-[#0f172a]">
              Congratulations, {safeName}!
            </h2>
            <p className="mt-2 text-center text-sm text-[#475569]">
              You're registered! Welcome to Home Meal Express. 🎉✨
            </p>

            <button
              type="button"
              onClick={onClose}
              className="mt-5 w-full rounded-xl bg-[linear-gradient(135deg,#f97316,#fb923c)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_22px_rgba(249,115,22,0.28)] transition active:scale-[0.98]"
            >
              Continue 🧡
            </button>
          </>
        )}
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close login popup"
        className="absolute bottom-10 left-1/2 inline-flex -translate-x-1/2 items-center justify-center rounded-full border border-black/10 bg-white px-4 py-2 text-lg font-semibold text-[#0f172a] shadow-[0_8px_16px_rgba(15,23,42,0.15)] transition hover:border-[#f97316] hover:text-[#f97316]"
      >
        ×
      </button>
    </div>
  )
}

export default Popuplogin
