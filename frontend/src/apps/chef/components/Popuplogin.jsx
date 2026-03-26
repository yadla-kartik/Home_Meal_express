import React from 'react'
import { useNavigate } from 'react-router-dom'
import { CircleCheckBig, Clock3, ShieldAlert, Sparkles, X } from 'lucide-react'

function Popuplogin({
  isOpen,
  name,
  onClose,
  onRegister,
  mode = 'register',
  successRedirectTo = '/chef/dashboard',
}) {
  const navigate = useNavigate()

  if (!isOpen) return null

  const safeName = (name || '').trim() || 'User'
  const isSuccessMode = mode === 'success'

  const handleRegister = () => {
    if (onRegister) {
      onRegister(true)
    }
    if (onClose) {
      onClose()
    }
    navigate('/chef/register')
  }

  const handleSuccessContinue = () => {
    if (onClose) {
      onClose()
    }
    navigate(successRedirectTo, {
      state: {
        hideChefPopup: true,
        chefRegistered: true,
      },
    })
  }

  const handleClose = () => {
    if (isSuccessMode) {
      handleSuccessContinue()
      return
    }

    if (onClose) {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 backdrop-blur-md">
      <div className="relative w-full max-w-sm rounded-3xl bg-white px-6 pb-6 pt-12 shadow-[0_24px_48px_rgba(15,23,42,0.25)] ring-1 ring-black/5">
        {!isSuccessMode && (
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close popup"
            className="absolute right-4 top-4 rounded-full p-2 text-slate-500 transition hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        )}

        <div className="absolute -top-8 left-1/2 flex h-20 w-20 -translate-x-1/2 items-center justify-center rounded-full bg-[#fff3e7] text-4xl shadow-[0_12px_20px_rgba(249,115,22,0.25)]">
          {isSuccessMode ? (
            <CircleCheckBig size={34} className="text-[#16a34a]" />
          ) : (
            <Sparkles size={34} className="text-[#f97316]" />
          )}
        </div>

        <h2 className="mt-4 text-center text-xl font-bold text-[#0f172a]">
          {isSuccessMode ? `Successfully registered, ${safeName}!` : `Welcome, ${safeName}!`}
        </h2>

        <p className="mt-2 text-center text-sm text-[#475569]">
          {isSuccessMode
            ? 'Your kitchen profile has been submitted successfully. We will review it shortly.'
            : 'You logged in successfully. Register now to continue.'}
        </p>

        {isSuccessMode && (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-[linear-gradient(135deg,#fff7ed,#fffbeb)] px-4 py-3 text-left shadow-[0_10px_24px_rgba(245,158,11,0.12)]">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                <Clock3 size={18} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#92400e]">
                  <ShieldAlert size={16} />
                  <span>Approval Pending</span>
                </div>
                <p className="mt-1 text-sm leading-5 text-[#78350f]">
                  Please wait for the admin to accept your request.
                </p>
              </div>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={isSuccessMode ? handleSuccessContinue : handleRegister}
          className="mt-5 w-full rounded-xl bg-[linear-gradient(135deg,#f97316,#fb923c)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_22px_rgba(249,115,22,0.28)] transition active:scale-[0.98]"
        >
          {isSuccessMode ? 'Continue' : 'Register Now'}
        </button>
      </div>
    </div>
  )
}

export default Popuplogin
