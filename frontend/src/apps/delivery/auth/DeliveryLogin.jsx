import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bike } from 'lucide-react'
import logo from '../../../assets/logo.png'
import LoadingSpinner from '../../../components/LoadingSpinner'
import { deliveryCookieCheck, deliveryLogin } from '../../../../services/deliveryAuthService'

function DeliveryLogin() {
  const navigate = useNavigate()
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [form, setForm] = useState({
    name: '',
    mobileNo: '',
  })

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await deliveryCookieCheck()
        if (res?.deliveryBoy) {
          navigate('/delivery/dashboard')
        }
      } finally {
        setIsCheckingAuth(false)
      }
    }

    checkAuth()
  }, [navigate])

  const updateField = (key) => (event) => {
    const value = event.target.value
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handlePhoneChange = (event) => {
    const digitsOnly = event.target.value.replace(/\D/g, '').slice(0, 10)
    setForm((prev) => ({ ...prev, mobileNo: digitsOnly }))
  }

  const handleContinue = async (event) => {
    event.preventDefault()
    if (isSubmitting) return

    setIsSubmitting(true)

    try {
      const payload = {
        name: form.name.trim(),
        mobileNo: form.mobileNo.trim(),
        country: '+91',
      }

      const res = await deliveryLogin(payload)

      if (res?.success) {
        navigate('/delivery/dashboard')
        return
      }

      alert(res?.message || 'Unable to login')
      setIsSubmitting(false)
    } catch {
      setIsSubmitting(false)
      alert('Something went wrong')
    }
  }

  if (isCheckingAuth) {
    return <LoadingSpinner label="Loading..." />
  }

  return (
    <div className="theme-page-shell min-h-screen px-4 py-7 flex items-center justify-center">
      {isSubmitting && <LoadingSpinner label="Signing you in..." />}
      <form
        className="theme-card w-full max-w-105 rounded-[18px] px-6 pb-6 pt-7 flex flex-col gap-5"
        onSubmit={handleContinue}
      >
        <div className="text-center flex flex-col items-center justify-center">
          <img src={logo} alt="Home Meal Express" className="w-64 -mt-10 h-auto" />
          <div className="theme-badge relative isolate -mt-2 inline-flex items-center gap-2 overflow-hidden rounded-full border border-[var(--theme-chip-border)] px-4 py-1.5 text-[15px] font-semibold theme-heading shadow-[0_12px_26px_rgba(249,115,22,0.12)]">
            <span className="pointer-events-none absolute inset-0 rounded-full bg-[linear-gradient(110deg,rgba(249,115,22,0.14),rgba(255,255,255,0),rgba(249,115,22,0.18))] opacity-80 animate-pulse" />
            <span className="delivery-bike-icon relative flex h-4 w-4 items-center justify-center text-[var(--theme-accent)]">
              <Bike size={14} />
            </span>
            <span>Join as Delivery Partner</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <label htmlFor="delivery-login-name" className="theme-label text-[13px] font-semibold">
              Name <span className="text-(--theme-important)">*</span>
            </label>
            <input
              id="delivery-login-name"
              name="name"
              type="text"
              placeholder="Enter your name"
              autoComplete="name"
              value={form.name}
              onChange={updateField('name')}
              required
              className="theme-input h-11 w-full rounded-xl px-3 text-sm"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="delivery-login-phone" className="theme-label text-[13px] font-semibold">
              Phone Number <span className="text-(--theme-important)">*</span>
            </label>
            <div className="flex items-center gap-2">
              <div className="theme-input flex h-11 w-[88px] shrink-0 items-center justify-center gap-2 rounded-xl px-3">
                <span className="rounded-full bg-[var(--theme-accent-soft)] px-2 py-0.5 text-xs font-semibold text-[var(--theme-accent)]">
                  IN
                </span>
                <span className="text-sm font-semibold text-[var(--theme-text)]">+91</span>
              </div>
              <input
                id="delivery-login-phone"
                name="mobileNo"
                type="tel"
                inputMode="numeric"
                placeholder="Enter your phone number"
                value={form.mobileNo}
                onChange={handlePhoneChange}
                pattern="\d{10}"
                maxLength={10}
                title="Enter a 10-digit phone number"
                required
                className="theme-input h-11 min-w-0 flex-1 rounded-xl px-3 text-sm"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="theme-primary-button h-11.5 w-full rounded-xl cursor-pointer text-[15px] font-semibold transition active:scale-[0.98]"
        >
          Continue
        </button>

        <p className="theme-muted text-center text-xs">
          By continuing, you agree to the Terms of Service.
        </p>
      </form>
    </div>
  )
}

export default DeliveryLogin
