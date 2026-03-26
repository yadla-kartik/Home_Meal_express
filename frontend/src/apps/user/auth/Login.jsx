import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CircleCheck, Eye, EyeOff } from 'lucide-react'
import google from '../../../assets/google.png'
import logo from '../../../assets/logo.png'
import { cookieCheck, userLogin } from '../../../../services/loginService'
<<<<<<< Updated upstream
import { useNavigate } from 'react-router-dom'
import LoadingSpinner from '../../../components/LoadingSpinner'

function Login() {
  const navigate = useNavigate()
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
=======

function Login() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('signup')
  const [showSignupPassword, setShowSignupPassword] = useState(false)
  const [showLoginPassword, setShowLoginPassword] = useState(false)
>>>>>>> Stashed changes

  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    mobileNo: '',
    password: '',
  })

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  })

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await cookieCheck()
        if (res?.user) {
          navigate('/dashboard')
        }
      } finally {
        setIsCheckingAuth(false)
      }
    }

    checkAuth()
  }, [navigate])

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())

  const updateSignupField = (key) => (event) => {
    const value = key === 'mobileNo'
      ? event.target.value.replace(/\D/g, '').slice(0, 10)
      : event.target.value

    setSignupForm((prev) => ({ ...prev, [key]: value }))
  }

  const updateLoginField = (key) => (event) => {
    setLoginForm((prev) => ({ ...prev, [key]: event.target.value }))
  }

  const handleSignup = async (event) => {
    event.preventDefault()
    alert('Signup form UI is ready. Connect your signup API to complete this flow.')
    setActiveTab('login')
    setLoginForm((prev) => ({ ...prev, email: signupForm.email }))
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    if (isSubmitting) return

    setIsSubmitting(true)

    try {
      const res = await userLogin(form)
      if (res?.message === 'Login Successful') {
        navigate('/dashboard')
        return
      }

<<<<<<< Updated upstream
=======
    const res = await userLogin(loginForm)
    if (res?.message === 'Login Successful') {
      navigate('/dashboard')
    } else {
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
    <div className="theme-page-shell min-h-screen px-4 py-7 flex items-center justify-center">
      {isSubmitting && <LoadingSpinner label="Signing you in..." />}
      <form
        className="theme-card w-full max-w-105 rounded-[18px] px-6 pb-6 pt-7 flex flex-col gap-5"
        onSubmit={handleContinue}
      >
        <div className="text-center flex flex-col items-center justify-center">
          <img src={logo} alt="Vandhe Bharat Logo" className="w-64 -mt-10 h-auto" />
          <div className="theme-badge -mt-2 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[15px] font-semibold theme-heading">
=======
    <div className="theme-page-shell flex min-h-screen items-center justify-center px-4 py-7">
      <div className="theme-card w-full max-w-[440px] rounded-[22px] px-6 pb-6 pt-7">
        <div className="text-center">
          <img src={logo} alt="Vandhe Bharat Logo" className="mx-auto h-auto w-64 -mt-12" />
          <div className="theme-badge -mt-1 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[15px] font-semibold theme-heading">
>>>>>>> Stashed changes
            <span className="h-2 w-2 rounded-full bg-[var(--theme-accent)]" />
            <span>{activeTab === 'signup' ? 'Create your account' : 'Welcome back'}</span>
          </div>
        </div>

        <div className="mt-4 rounded-2xl bg-[var(--theme-accent-soft)]/60 p-1.5">
          <div className="grid grid-cols-2 gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('signup')}
              className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                activeTab === 'signup'
                  ? 'bg-white text-[var(--theme-accent)] shadow-sm'
                  : 'text-[var(--theme-text-muted)]'
              }`}
            >
              Sign Up
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                activeTab === 'login'
                  ? 'bg-white text-[var(--theme-accent)] shadow-sm'
                  : 'text-[var(--theme-text-muted)]'
              }`}
            >
              Login
            </button>
          </div>
        </div>

        {activeTab === 'signup' ? (
          <form className="mt-3 flex flex-col gap-2" onSubmit={handleSignup}>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="signup-name" className="theme-label text-[13px] font-semibold">
                Name
              </label>
              <input
                id="signup-name"
                type="text"
                placeholder="Enter your full name"
                value={signupForm.name}
                onChange={updateSignupField('name')}
                required
                className="theme-input h-11 w-full rounded-xl px-3 text-sm"
              />
            </div>

<<<<<<< Updated upstream
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
=======
            <div className="flex flex-col gap-1.5">
              <label htmlFor="signup-email" className="theme-label text-[13px] font-semibold">
                Email
              </label>
              <div className="relative">
                <input
                  id="signup-email"
                  type="email"
                  placeholder="Enter your email"
                  value={signupForm.email}
                  onChange={updateSignupField('email')}
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
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="theme-input flex h-11 items-center gap-2 rounded-xl px-3 sm:min-w-[92px]">
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
                  value={signupForm.mobileNo}
                  onChange={updateSignupField('mobileNo')}
                  required
                  maxLength={10}
                  className="theme-input h-11 w-full flex-1 rounded-xl px-3 text-sm"
                />
              </div>
            </div>
>>>>>>> Stashed changes

            <div className="flex flex-col gap-1.5">
              <label htmlFor="signup-password" className="theme-label text-[13px] font-semibold">
                Password
              </label>
              <div className="relative">
                <input
                  id="signup-password"
                  type={showSignupPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  value={signupForm.password}
                  onChange={updateSignupField('password')}
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
              Sign Up
            </button>
          </form>
        ) : (
          <form className="mt-5 flex flex-col gap-2" onSubmit={handleLogin}>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="login-email" className="theme-label text-[13px] font-semibold">
                Email
              </label>
              <div className="relative">
                <input
                  id="login-email"
                  type="email"
                  placeholder="Enter your email"
                  value={loginForm.email}
                  onChange={updateLoginField('email')}
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
              <label htmlFor="login-password" className="theme-label text-[13px] font-semibold">
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showLoginPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={loginForm.password}
                  onChange={updateLoginField('password')}
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

            <div className="flex flex-col gap-3 pt-1">
              <button
                type="button"
                className="theme-soft-button flex w-full cursor-pointer items-center justify-center rounded-full p-2 text-[15px] font-semibold transition active:scale-[0.98]"
              >
                <img src={google} alt="Google logo" className="h-5 w-5" />
                <p className="ml-2">Continue with Google</p>
              </button>

              <button
                type="submit"
                className="theme-primary-button h-11.5 w-full cursor-pointer rounded-xl text-[15px] font-semibold transition active:scale-[0.98]"
              >
                Login
              </button>
            </div>
          </form>
        )}

        <p className="theme-muted mt-5 text-center text-xs">
          By continuing, you agree to the Terms of Service.
        </p>
      </div>
    </div>
  )
}

export default Login
