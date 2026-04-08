import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Bike, CircleCheckBig, Clock3, ShieldAlert, X } from 'lucide-react'

function DeliveryPopuplogin({
  isOpen,
  name,
  onClose,
  onRegister,
  mode = 'register',
  successRedirectTo = '/delivery/dashboard',
}) {
  const navigate = useNavigate()
  const safeName = (name || '').trim() || 'Partner'
  const isSuccessMode = mode === 'success'
  const isResubmittedMode = mode === 'resubmitted-success'
  const isAlreadyRegisteredMode = mode === 'already-registered'
  const isAlreadySubmittedMode = mode === 'already-submitted'

  if (!isOpen) return null

  const handleRegister = () => {
    if (onRegister) onRegister(true)
    if (onClose) onClose()
    navigate('/delivery/register')
  }

  const handleDashboardContinue = () => {
    if (onClose) onClose()
    navigate(successRedirectTo, {
      state: {
        hideDeliveryPopup: true,
        deliveryRegistered: true,
      },
    })
  }

  const handleClose = () => {
    if (isSuccessMode || isResubmittedMode || isAlreadyRegisteredMode || isAlreadySubmittedMode) {
      handleDashboardContinue()
      return
    }

    if (onClose) onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(15,23,42,0.16)] px-4 backdrop-blur-[3px]">
      <div className="relative w-full max-w-sm overflow-visible rounded-[26px] border border-[color:var(--theme-surface-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(255,247,239,0.96))] px-6 pb-6 pt-12 shadow-[0_26px_58px_rgba(15,23,42,0.18)]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-[linear-gradient(180deg,rgba(249,115,22,0.08),transparent)]" />

        {!isSuccessMode && (
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close popup"
            className="absolute right-4 top-4 rounded-full p-2 text-[var(--theme-muted)] transition hover:bg-white/80"
          >
            <X size={18} />
          </button>
        )}

        <div className="absolute -top-9 left-1/2 flex h-20 w-20 -translate-x-1/2 items-center justify-center rounded-full border border-white/80 bg-[linear-gradient(180deg,#fff6ee,#ffe7d1)] shadow-[0_12px_24px_rgba(249,115,22,0.2)]">
          {isSuccessMode || isResubmittedMode ? (
            <CircleCheckBig size={34} className="text-[#16a34a]" />
          ) : isAlreadyRegisteredMode || isAlreadySubmittedMode ? (
            <ShieldAlert size={34} className="text-[var(--theme-accent)]" />
          ) : (
            <Bike size={34} className="text-[var(--theme-accent)]" />
          )}
        </div>

        <h2 className="mt-4 text-center text-xl font-bold text-[var(--theme-text)]">
          {isSuccessMode
            ? `Successfully registered, ${safeName}!`
            : isResubmittedMode
              ? `Successfully resubmitted, ${safeName}!`
              : isAlreadyRegisteredMode
                ? `Already registered, ${safeName}!`
                : isAlreadySubmittedMode
                  ? `Already submitted, ${safeName}!`
                  : `Welcome, ${safeName}!`}
        </h2>

        <p className="mt-2 text-center text-sm leading-6 text-[var(--theme-muted)]">
          {isSuccessMode
            ? 'Your delivery profile has been submitted successfully. We will review it shortly.'
            : isResubmittedMode
              ? 'Your updated delivery profile has been submitted again successfully. We will review it shortly.'
              : isAlreadyRegisteredMode
                ? 'Your delivery registration is already present. Continue to the dashboard to see the current review status.'
                : isAlreadySubmittedMode
                  ? 'This delivery profile has already been submitted. Continue to the dashboard to check the current approval status.'
                  : 'You logged in successfully. Complete your delivery registration before you can receive live pickup and drop assignments.'}
        </p>

        {(isSuccessMode || isResubmittedMode || isAlreadyRegisteredMode || isAlreadySubmittedMode) ? (
          <div className="mt-4 rounded-[20px] border border-amber-200 bg-[linear-gradient(135deg,#fff7ed,#fffbeb)] px-4 py-3 text-left shadow-[0_10px_24px_rgba(245,158,11,0.12)]">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                <Clock3 size={18} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-[#92400e]">Approval Pending</div>
                <p className="mt-1 text-sm leading-5 text-[#78350f]">
                  Please wait for the admin to accept your request.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-4 rounded-[20px] border border-amber-200 bg-[linear-gradient(135deg,#fff7ed,#fffbeb)] px-4 py-3 text-left shadow-[0_10px_24px_rgba(245,158,11,0.12)]">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                <ShieldAlert size={18} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-[#92400e]">Registration required</div>
                <p className="mt-1 text-sm leading-5 text-[#78350f]">
                  Submit your delivery partner details so admin can review and activate your account.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-5 grid gap-3">
          <button
            type="button"
            onClick={
              isSuccessMode || isResubmittedMode || isAlreadyRegisteredMode || isAlreadySubmittedMode
                ? handleDashboardContinue
                : handleRegister
            }
            className="w-full rounded-xl bg-[linear-gradient(135deg,#f97316,#fb923c)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_22px_rgba(249,115,22,0.28)] transition active:scale-[0.98]"
          >
            {isSuccessMode || isResubmittedMode || isAlreadyRegisteredMode || isAlreadySubmittedMode
              ? 'Continue'
              : 'Register Now'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeliveryPopuplogin
