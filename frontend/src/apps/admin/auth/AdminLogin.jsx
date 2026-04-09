import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CircleCheck, Eye, EyeOff, ShieldCheck } from 'lucide-react'
import logo from '../../../assets/logo.png'
import LoadingSpinner from '../../../components/LoadingSpinner'
import { adminCookieCheck, adminLogin } from '../../../../services/adminAuthService'

function AdminLogin() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [authStatus, setAuthStatus] = useState('loading')

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  })

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())

  const updateField = (key) => (event) => {
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
      <div className="theme-card w-full max-w-[420px] rounded-[22px] px-6 pb-8 pt-7">

        {/* Logo */}
        <div className="text-center">
          <img src={logo} alt="Home Meal Express" className="mx-auto -mt-12 h-auto w-60 sm:w-64" />

          {/* Badge */}
          <div className="theme-badge relative isolate -mt-1 inline-flex items-center gap-2 overflow-hidden rounded-full border border-[var(--theme-chip-border)] px-4 py-1.5 text-[15px] font-semibold theme-heading shadow-[0_12px_26px_rgba(249,115,22,0.12)]">
            <span className="pointer-events-none absolute inset-0 rounded-full bg-[linear-gradient(110deg,rgba(249,115,22,0.14),rgba(255,255,255,0),rgba(249,115,22,0.18))] opacity-80 animate-pulse" />
            <span className="relative flex h-4 w-4 items-center justify-center text-[var(--theme-accent)]">
              <ShieldCheck size={15} />
            </span>
            <span>Admin Access Panel</span>
          </div>
        </div>

        {/* Login Form */}
        <form className="mt-6 flex flex-col gap-3" onSubmit={handleLogin}>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="admin-login-email" className="theme-label text-[13px] font-semibold">
              Email
            </label>
            <div className="relative">
              <input
                id="admin-login-email"
                type="email"
                value={loginForm.email}
                onChange={updateField('email')}
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

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="admin-login-password" className="theme-label text-[13px] font-semibold">
              Password
            </label>
            <div className="relative">
              <input
                id="admin-login-password"
                type={showPassword ? 'text' : 'password'}
                value={loginForm.password}
                onChange={updateField('password')}
                placeholder="Enter admin password"
                required
                className="theme-input h-11 w-full rounded-xl px-3 pr-12 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--theme-accent)]"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="theme-primary-button mt-2 h-11 w-full rounded-xl text-[15px] font-semibold transition active:scale-[0.98]"
          >
            Login
          </button>
        </form>

        <p className="theme-muted mt-5 text-center text-xs">
          Secure admin access for stations, chefs, deliveries and order operations.
        </p>
      </div>
    </div>
  )
}

export default AdminLogin
