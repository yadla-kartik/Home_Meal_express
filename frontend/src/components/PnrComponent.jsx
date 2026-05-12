import React, { useState, useEffect } from 'react'
import dashboardImage from '../assets/dashboard.png'
import { motion as Motion } from 'framer-motion'
import { TrainFront, Loader2, AlertCircle } from 'lucide-react'
import { checkPnrDetails } from '../../services/userAuthService'
import { useNavigate } from 'react-router-dom'

function PnrComponent() {
  const [pnr, setPnr] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSearch = async () => {
    setError('')

    if (!pnr || pnr.trim().length !== 10 || !/^\d+$/.test(pnr.trim())) {
      setError('Please enter a valid 10-digit PNR number')
      setPnr('')
      return
    }

    setLoading(true)
    sessionStorage.removeItem('pnrSessionData')

    try {
      const response = await checkPnrDetails(pnr.trim())
      if (response?.success) {
        // Save to session before navigating so result page can read it instantly
        sessionStorage.setItem('pnrSessionData', JSON.stringify(response.data))
        sessionStorage.setItem('pnrSessionInput', pnr.trim())
        navigate(`/pnr/${pnr.trim()}`)
      } else {
        setError(response?.message || 'Invalid PNR. Please try again.')
        setPnr('')
      }
    } catch {
      setError('Something went wrong. Please try again.')
      setPnr('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Hero Banner */}
      <Motion.section
        className="w-full pt-20"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        <div className="w-full">
          <img
            src={dashboardImage}
            alt="Dashboard"
            className="w-full max-h-[380px] object-cover md:max-h-[440px]"
          />
        </div>
      </Motion.section>

      {/* PNR Search */}
      <main className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 px-2 pt-6 sm:px-3 pb-20">
        <Motion.div
          className="flex w-full max-w-2xl flex-col items-center gap-3"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.45 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <p className="theme-heading text-base font-semibold">
            Enter your PNR number
          </p>

          <Motion.div
            animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
            transition={{ duration: 0.4 }}
            className={`theme-search-surface flex w-full max-w-md items-center gap-3 rounded-2xl p-2 relative transition-colors ${
              error ? 'ring-2 ring-rose-500 bg-rose-50/50' : 'ring-1 ring-transparent'
            }`}
          >
            <span
              className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors shadow-[var(--theme-shadow-soft)] ring-1 ring-[color:var(--theme-surface-border)] ${
                error ? 'bg-rose-100 text-rose-600' : 'bg-[#fff6ef] text-[#f97316]'
              }`}
            >
              <TrainFront size={20} />
            </span>

            <div className="flex-1 relative">
              <input
                type="text"
                placeholder={error ? 'Invalid PNR' : 'PNR number'}
                value={pnr}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 10)
                  setPnr(val)
                  if (error) setError('')
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                maxLength={10}
                className={`theme-input h-11 w-full rounded-xl border border-transparent bg-transparent px-3 text-sm shadow-none focus:ring-2 disabled:opacity-50 ${
                  error ? 'text-rose-600 placeholder:text-rose-600 focus:ring-rose-200' : ''
                }`}
                disabled={loading}
              />
            </div>

            <button
              onClick={handleSearch}
              disabled={loading || pnr.length !== 10}
              className="theme-primary-button h-11 rounded-xl px-6 text-sm font-semibold transition disabled:opacity-50 disabled:active:scale-100 flex items-center gap-2 justify-center min-w-[100px] shrink-0"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : 'Search'}
            </button>
          </Motion.div>

          {/* Error */}
          {error && (
            <Motion.p
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-1.5 text-[12px] font-semibold text-rose-600"
            >
              <AlertCircle size={13} />
              {error}
            </Motion.p>
          )}
        </Motion.div>
      </main>
    </>
  )
}

export default PnrComponent