import React, { useEffect, useRef, useState } from 'react'

function Otp({ onVerify }) {
  const OTP_LENGTH = 6
  const RESEND_SECONDS = 30
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''))
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS)
  const inputsRef = useRef([])

  const isComplete = otp.every((digit) => digit !== '')

  useEffect(() => {
    if (secondsLeft <= 0) return
    const intervalId = setInterval(() => {
      setSecondsLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(intervalId)
  }, [secondsLeft])

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, '')
    if (!value) return

    const newOtp = [...otp]
    newOtp[index] = value[value.length - 1]
    setOtp(newOtp)

    if (index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1].focus()
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otp]
      if (otp[index]) {
        newOtp[index] = ''
        setOtp(newOtp)
      } else if (index > 0) {
        inputsRef.current[index - 1].focus()
      }
    }
  }

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH)
    if (pasted.length === OTP_LENGTH) {
      setOtp(pasted.split(''))
      inputsRef.current[OTP_LENGTH - 1].focus()
    }
  }

  const handleVerify = () => {
    const finalOtp = otp.join('')
    if (finalOtp.length === OTP_LENGTH) {
      onVerify && onVerify(finalOtp)
    }
  }

  const handleResend = () => {
    if (secondsLeft > 0) return
    setSecondsLeft(RESEND_SECONDS)
  }

  const formatTime = (value) => String(value).padStart(2, '0')

  return (
    <div className="theme-app-shell min-h-screen flex items-center justify-center px-4">
      <div className="theme-card w-full max-w-sm rounded-2xl p-6">
        <h2 className="theme-heading text-xl font-semibold text-center">
          Verify OTP
        </h2>
        <p className="theme-muted mt-1 text-sm text-center">
          Enter the 6-digit code sent to your phone
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
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="
                theme-input
                h-12 w-12 rounded-xl
                text-center text-lg font-semibold
              "
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          disabled={!isComplete}
          className={`
            mt-6 h-11.5 w-full rounded-xl text-[15px] font-semibold transition active:scale-[0.98]
            ${
              isComplete
                ? 'theme-primary-button cursor-pointer'
                : 'bg-[#e2e8f0] text-[#94a3b8] cursor-not-allowed'
            }
          `}
        >
          Verify OTP
        </button>

        <p className="theme-muted mt-4 text-center text-sm">
          Didn't receive the code?{' '}
          <button
            type="button"
            onClick={handleResend}
            className={`font-medium transition ${
              secondsLeft > 0
                ? 'text-[#3b82f6] cursor-not-allowed'
                : 'text-[var(--theme-accent)] cursor-pointer'
            }`}
          >
            {secondsLeft > 0
              ? `Resend in 00:${formatTime(secondsLeft)}`
              : 'Resend'}
          </button>
        </p>
      </div>
    </div>
  )
}

export default Otp
