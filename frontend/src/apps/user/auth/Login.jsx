import React, { useEffect, useState } from 'react'
import google from '../../../assets/google.png'
import logo from '../../../assets/logo.png'
import { userCookieCheck, userLogin } from '../../../../services/userAuthService'
import { useNavigate } from 'react-router-dom'
import LoadingSpinner from '../../../components/LoadingSpinner'

function Login() {
  const navigate = useNavigate()
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [form, setForm] = useState({
    name: '',
    country: '+91',
    mobileNo: '',
  })

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await userCookieCheck()
        if (res?.user) {
          navigate('/dashboard')
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
      const res = await userLogin(form)
      if (res?.message === 'Login Successful') {
        navigate('/dashboard')
        return
      }

      alert('Invalid Login')
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
          <img src={logo} alt="Vandhe Bharat Logo" className="w-64 -mt-10 h-auto" />
          <div className="theme-badge -mt-2 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[15px] font-semibold theme-heading">
            <span className="h-2 w-2 rounded-full bg-[var(--theme-accent)]" />
            <span>Login or Sign up</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="login-name"
              className="theme-label text-[13px] font-semibold"
            >
              Name <span className='text-(--theme-important)'>*</span>
            </label>
            <input
              id="login-name"
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
            <label
              htmlFor="login-phone"
              className="theme-label text-[13px] font-semibold"
            >
              Phone Number <span className='text-(--theme-important)'>*</span>
            </label>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="theme-input flex h-11 items-center justify-evenly gap-1 rounded-xl max-w-fit px-3">
                <span className="rounded-full bg-[var(--theme-accent-soft)] px-2 py-0.5 text-xs font-semibold text-[var(--theme-accent)]">
                  IN
                </span>
                <span className="text-sm font-semibold text-[var(--theme-text)]">
                  +91
                </span>
              </div>
              <input
                id="login-phone"
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
                className="theme-input h-11 flex-1 rounded-xl px-3 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            disabled={isSubmitting}
            className="theme-soft-button flex justify-center items-center w-full rounded-full p-2 text-[15px] font-semibold transition active:scale-[0.98] cursor-pointer"
          >
            <img src={google} alt="Google logo" className="h-5 w-5" />
            <p className="ml-2">Continue with Google</p>
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="theme-primary-button h-11.5 w-full rounded-xl cursor-pointer text-[15px] font-semibold transition active:scale-[0.98]"
          >
            Continue
          </button>
        </div>

        <p className="theme-muted text-center text-xs">
          By continuing, you agree to the Terms of Service.
        </p>
      </form>
    </div>
  )
}

export default Login
