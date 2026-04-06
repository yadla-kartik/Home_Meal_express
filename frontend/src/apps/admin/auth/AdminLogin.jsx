import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CircleCheck, Eye, EyeOff, ShieldCheck } from 'lucide-react'
import logo from '../../../assets/logo.png'
import LoadingSpinner from '../../../components/LoadingSpinner'
import { adminCookieCheck, adminLogin, adminSignup } from '../../../../services/adminAuthService'

function AdminLogin() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('signup')
  const [showSignupPassword, setShowSignupPassword] = useState(false)
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [authStatus, setAuthStatus] = useState('loading')

  const [signupForm, setSignupForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
  })

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  })

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())

  const updateSignupField = (key) => (event) => {
    setSignupForm((prev) => ({ ...prev, [key]: event.target.value }))
  }

  const updateLoginField = (key) => (event) => {
    setLoginForm((prev) => ({ ...prev, [key]: event.target.value }))
  }

  React.useEffect(() => {
    let isMounted = true

    const checkAuth = async () => {
      const res = await adminCookieCheck()
      if (!isMounted) return

      if (res?.adminUser) {
        navigate('/admin/dashboard', { replace: true })
        return
      }

      setAuthStatus('ready')
    }

    checkAuth()

    return () => {
      isMounted = false
    }
  }, [navigate])

  const handleSignup = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)

    const res = await adminSignup({
      name: signupForm.fullName,
      email: signupForm.email,
      phone: signupForm.phone,
      password: signupForm.password,
    })

    setIsSubmitting(false)

    if (res?.adminUser) {
      navigate('/admin/dashboard', { replace: true })
      return
    }

    window.alert(res?.message || 'Unable to create admin account')
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)

    const res = await adminLogin(loginForm)

    setIsSubmitting(false)

    if (res?.adminUser) {
      navigate('/admin/dashboard', { replace: true })
      return
    }

    window.alert(res?.message || 'Unable to login')
  }

  if (authStatus === 'loading' || isSubmitting) {
    return <LoadingSpinner label="Loading admin access..." />
  }

  return (
    <div className="theme-page-shell flex min-h-screen items-center justify-center px-4 py-7">
      <div className="theme-card w-full max-w-[460px] rounded-[22px] px-5 pb-6 pt-7 sm:px-6">
        <div className="text-center">
          <img src={logo} alt="Home Meal Express" className="mx-auto -mt-12 h-auto w-60 sm:w-64" />
          <div className="theme-badge relative isolate -mt-1 inline-flex items-center gap-2 overflow-hidden rounded-full border border-[var(--theme-chip-border)] px-4 py-1.5 text-[15px] font-semibold theme-heading shadow-[0_12px_26px_rgba(249,115,22,0.12)]">
            <span className="pointer-events-none absolute inset-0 rounded-full bg-[linear-gradient(110deg,rgba(249,115,22,0.14),rgba(255,255,255,0),rgba(249,115,22,0.18))] opacity-80 animate-pulse" />
            <span className="relative flex h-4 w-4 items-center justify-center text-[var(--theme-accent)]">
              <ShieldCheck size={15} />
            </span>
            <span>{activeTab === 'signup' ? 'Create admin account' : 'Admin access panel'}</span>
          </div>
        </div>

        <div className="mt-4 flex justify-center">
          <div className="tab-wrap">
            <span
              aria-hidden="true"
              className={`tab-slider ${activeTab === 'login' ? 'moved' : ''}`}
            />
            <button
              type="button"
              onClick={() => setActiveTab('signup')}
              className={`tab-btn ${activeTab === 'signup' ? 'active' : ''}`}
            >
              Sign Up
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className={`tab-btn ${activeTab === 'login' ? 'active' : ''}`}
            >
              Login
            </button>
          </div>
        </div>

        {activeTab === 'signup' ? (
          <form className="mt-4 flex flex-col gap-2.5" onSubmit={handleSignup}>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="admin-signup-name" className="theme-label text-[13px] font-semibold">
                Full Name
              </label>
              <input
                id="admin-signup-name"
                type="text"
                value={signupForm.fullName}
                onChange={updateSignupField('fullName')}
                placeholder="Enter admin full name"
                required
                className="theme-input h-11 w-full rounded-xl px-3 text-sm"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="admin-signup-email" className="theme-label text-[13px] font-semibold">
                Email
              </label>
              <div className="relative">
                <input
                  id="admin-signup-email"
                  type="email"
                  value={signupForm.email}
                  onChange={updateSignupField('email')}
                  placeholder="Enter admin email"
                  required
                  className="theme-input h-11 w-full rounded-xl px-3 pr-11 text-sm"
                />
                {isValidEmail(signupForm.email) && (
                  <CircleCheck
                    size={18}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500"
                  />
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="signup-phone" className="theme-label text-[13px] font-semibold">
                Phone Number
              </label>
              <div className="flex items-center gap-2">
                <div className="theme-input flex h-11 w-[88px] shrink-0 items-center justify-center gap-2 rounded-xl px-3">
                  <span className="rounded-full bg-[var(--theme-accent-soft)] px-2 py-0.5 text-xs font-semibold text-[var(--theme-accent)]">
                    IN
                  </span>
                  <span className="text-sm font-semibold text-[var(--theme-text)]">
                    +91
                  </span>
                </div>
                <input
                  id="signup-phone"
                  type="tel"
                  inputMode="numeric"
                  placeholder="Enter your phone number"
                  value={signupForm.phone}
                  onChange={updateSignupField('phone')}
                  required
                  maxLength={10}
                  className="theme-input h-11 min-w-0 flex-1 rounded-xl px-3 text-sm"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="admin-signup-password" className="theme-label text-[13px] font-semibold">
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-signup-password"
                  type={showSignupPassword ? 'text' : 'password'}
                  value={signupForm.password}
                  onChange={updateSignupField('password')}
                  placeholder="Create admin password"
                  required
                  className="theme-input h-11 w-full rounded-xl px-3 pr-12 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowSignupPassword((prev) => !prev)}
                  aria-label={showSignupPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--theme-accent)]"
                >
                  {showSignupPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="theme-primary-button mt-2 h-11.5 w-full rounded-xl text-[15px] font-semibold transition active:scale-[0.98]"
            >
              Create Admin Account
            </button>
          </form>
        ) : (
          <form className="mt-5 flex flex-col gap-2.5" onSubmit={handleLogin}>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="admin-login-email" className="theme-label text-[13px] font-semibold">
                Email
              </label>
              <div className="relative">
                <input
                  id="admin-login-email"
                  type="email"
                  value={loginForm.email}
                  onChange={updateLoginField('email')}
                  placeholder="Enter admin email"
                  required
                  className="theme-input h-11 w-full rounded-xl px-3 pr-11 text-sm"
                />
                {isValidEmail(loginForm.email) && (
                  <CircleCheck
                    size={18}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500"
                  />
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="admin-login-password" className="theme-label text-[13px] font-semibold">
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-login-password"
                  type={showLoginPassword ? 'text' : 'password'}
                  value={loginForm.password}
                  onChange={updateLoginField('password')}
                  placeholder="Enter admin password"
                  required
                  className="theme-input h-11 w-full rounded-xl px-3 pr-12 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword((prev) => !prev)}
                  aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--theme-accent)]"
                >
                  {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="theme-primary-button mt-3 h-11.5 w-full rounded-xl text-[15px] font-semibold transition active:scale-[0.98]"
            >
              Login
            </button>
          </form>
        )}

        <p className="theme-muted mt-5 text-center text-xs">
          Secure admin access for stations, chefs, deliveries and order operations.
        </p>
      </div>
    </div>
  )
}

export default AdminLogin
