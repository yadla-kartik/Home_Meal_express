import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { sendDeliveryOtp, verifyDeliveryOtp } from '../../../../services/deliveryAuthService'

const OTP_LENGTH = 6
const RESEND_SECONDS = 30
const SESSION_KEY = 'deliveryOtpPayload'

const readPendingPayload = (locationState) => {
  if (locationState && typeof locationState === 'object') return locationState

  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function DeliveryOtp({ onVerify }) {
  const navigate = useNavigate()
  const location = useLocation()
  const inputsRef = useRef([])
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''))
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS)
  const [pending, setPending] = useState(() => readPendingPayload(location.state))
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const isComplete = otp.every((digit) => digit !== '')

  const maskedMobile = useMemo(() => {
    const mobileNo = String(pending?.mobileNo || '')
    if (mobileNo.length < 10) return ''
    return `${mobileNo.slice(0, 2)}******${mobileNo.slice(-2)}`
  }, [pending])

  useEffect(() => {
    const nextPending = readPendingPayload(location.state)
    if (nextPending) {
      setPending(nextPending)
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(nextPending))
      setError('')
      return
    }

    navigate('/delivery/login', { replace: true })
  }, [location.pathname, location.state, navigate])

  useEffect(() => {
    if (secondsLeft <= 0) return
    const intervalId = setInterval(() => {
      setSecondsLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(intervalId)
  }, [secondsLeft])

  const resetOtp = () => {
    setOtp(Array(OTP_LENGTH).fill(''))
    inputsRef.current[0]?.focus()
  }

  const handleChange = (event, index) => {
    const value = event.target.value.replace(/\D/g, '')
    if (!value) return

    const nextOtp = [...otp]
    nextOtp[index] = value[value.length - 1]
    setOtp(nextOtp)

    if (index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (event, index) => {
    if (event.key === 'Backspace') {
      const nextOtp = [...otp]
      if (otp[index]) {
        nextOtp[index] = ''
        setOtp(nextOtp)
      } else if (index > 0) {
        inputsRef.current[index - 1]?.focus()
      }
    }
  }

  const handlePaste = (event) => {
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH)
    if (pasted.length === OTP_LENGTH) {
      setOtp(pasted.split(''))
      inputsRef.current[OTP_LENGTH - 1]?.focus()
    }
  }

  const handleVerify = async () => {
    const finalOtp = otp.join('')
    if (finalOtp.length !== OTP_LENGTH || !pending) return

    if (typeof onVerify === 'function') {
      onVerify(finalOtp)
      return
    }

    setLoading(true)
    setError('')
    setStatus('')

    try {
      const res = await verifyDeliveryOtp({ ...pending, otp: finalOtp })
      if (!res?.success) {
        throw new Error(res?.message || 'OTP verification failed.')
      }

      sessionStorage.removeItem(SESSION_KEY)
      navigate('/delivery/dashboard', { replace: true })
    } catch (err) {
      setError(err?.message || 'OTP verification failed.')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (secondsLeft > 0 || !pending || loading) return

    setLoading(true)
    setError('')
    setStatus('')

    try {
      const res = await sendDeliveryOtp({ ...pending, __mode: 'resend' })
      if (!res?.success) {
        throw new Error(res?.message || 'Unable to resend OTP.')
      }

      setSecondsLeft(RESEND_SECONDS)
      resetOtp()
      setStatus('A fresh OTP has been sent to your phone.')
    } catch (err) {
      setError(err?.message || 'Unable to resend OTP.')
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (value) => String(value).padStart(2, '0')

  return (
    <div className="theme-page-shell min-h-screen flex items-center justify-center px-4 py-7">
      <div className="theme-card w-full max-w-sm rounded-2xl p-6">
        <h2 className="theme-heading text-center text-xl font-semibold">Verify OTP</h2>
        <p className="theme-muted mt-1 text-center text-sm">
          Enter the 6-digit code sent to {maskedMobile || 'your phone'}
        </p>

        <div className="mt-6 flex justify-between gap-2" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(event) => handleChange(event, index)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className="theme-input h-12 w-12 rounded-xl text-center text-lg font-semibold"
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          disabled={!isComplete || loading}
          className={`mt-6 h-11.5 w-full rounded-xl text-[15px] font-semibold transition active:scale-[0.98] ${
            isComplete && !loading
              ? 'theme-primary-button cursor-pointer'
              : 'cursor-not-allowed bg-[#e2e8f0] text-[#94a3b8]'
          }`}
        >
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>

        {status ? (
          <p className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-center text-sm font-medium text-emerald-700">
            {status}
          </p>
        ) : null}

        {error ? (
          <p className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-center text-sm font-medium text-rose-700">
            {error}
          </p>
        ) : null}

        <p className="theme-muted mt-4 text-center text-sm">
          Didn&apos;t receive the code?{' '}
          <button
            type="button"
            onClick={handleResend}
            className={`font-medium transition ${
              secondsLeft > 0 || loading
                ? 'cursor-not-allowed text-[#3b82f6]'
                : 'cursor-pointer text-[var(--theme-accent)]'
            }`}
          >
            {secondsLeft > 0 ? `Resend in 00:${formatTime(secondsLeft)}` : 'Resend'}
          </button>
        </p>
      </div>
    </div>
  )
}

export default DeliveryOtp
