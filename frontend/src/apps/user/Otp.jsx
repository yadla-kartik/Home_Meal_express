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
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-[0_18px_36px_rgba(17,24,39,0.12)]">
        <h2 className="text-xl font-semibold text-[#0f172a] text-center">
          Verify OTP
        </h2>
        <p className="mt-1 text-sm text-[#64748b] text-center">
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
                h-12 w-12 rounded-xl
                border border-[#d1d5db]
                text-center text-lg font-semibold
                text-[#111827]
                outline-none
                transition
                focus:border-[#f97316]
                focus:ring-4 focus:ring-[rgba(249,115,22,0.18)]
              "
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          disabled={!isComplete}
          className={`
            mt-6 h-11.5 w-full rounded-xl
            text-[15px] font-semibold
            transition active:scale-[0.98]
            ${
              isComplete
                ? 'bg-[linear-gradient(135deg,#f97316,#fb923c)] text-white shadow-[0_14px_24px_rgba(249,115,22,0.28)] cursor-pointer'
                : 'bg-[#e2e8f0] text-[#94a3b8] cursor-not-allowed'
            }
          `}
        >
          Verify OTP
        </button>

        <p className="mt-4 text-center text-sm text-[#64748b]">
          Didn't receive the code?{' '}
          <button
            type="button"
            onClick={handleResend}
            className={`font-medium transition ${
              secondsLeft > 0
                ? 'text-[#3b82f6] cursor-not-allowed'
                : 'text-[#f97316] cursor-pointer'
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
