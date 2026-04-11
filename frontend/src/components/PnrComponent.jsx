import React, { useState, useEffect, useRef } from 'react'
import dashboardImage from '../assets/dashboard.png'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import { TrainFront, MapPin, CalendarDays, Loader2, ArrowRight, UserCircle2, AlertCircle } from 'lucide-react'
import { checkPnrDetails } from '../../services/userAuthService'

function PnrComponent() {
  const [pnr, setPnr] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [pnrData, setPnrData] = useState(null)
  
  const resultsRef = useRef(null)

  useEffect(() => {
    const savedData = sessionStorage.getItem('pnrSessionData')
    const savedPnr = sessionStorage.getItem('pnrSessionInput')
    if (savedData && savedPnr) {
      setPnr(savedPnr)
      setPnrData(JSON.parse(savedData))
    }
  }, [])

  useEffect(() => {
    if (pnrData && resultsRef.current) {
      // Add slight delay to allow layout to settle before scrolling
      setTimeout(() => {
        resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 100)
    }
  }, [pnrData])

  const handleSearch = async () => {
    setError('')
    
    if (!pnr || pnr.trim().length !== 10 || !/^\d+$/.test(pnr.trim())) {
      setError('Invalid PNR')
      setPnr('')
      return
    }

    setLoading(true)
    setPnrData(null)
    sessionStorage.removeItem('pnrSessionData')

    try {
      const response = await checkPnrDetails(pnr.trim())
      if (response?.success) {
        setPnrData(response.data)
        sessionStorage.setItem('pnrSessionData', JSON.stringify(response.data))
        sessionStorage.setItem('pnrSessionInput', pnr)
      } else {
        setError(response?.message || 'Invalid PNR')
        setPnr('')
      }
    } catch (err) {
      setError('Invalid PNR')
      setPnr('')
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setPnr('')
    setPnrData(null)
    setError('')
    sessionStorage.removeItem('pnrSessionData')
    sessionStorage.removeItem('pnrSessionInput')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
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
            className="w-full max-h-[380px] object-cover md:max-h-[440px] "
          />
        </div>
      </Motion.section>

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
            <span className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors shadow-[var(--theme-shadow-soft)] ring-1 ring-[color:var(--theme-surface-border)] ${
              error ? 'bg-rose-100 text-rose-600' : 'bg-[#fff6ef] text-[#f97316]'
            }`}>
              <TrainFront size={20}/>
            </span>
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder={error ? "Invalid PNR" : "PNR number"}
                value={pnr}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 10);
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
        </Motion.div>

        <AnimatePresence>
          {pnrData && !loading && (
            <Motion.div 
              ref={resultsRef}
              className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-5 mt-10"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.5, staggerChildren: 0.1 }}
            >
              <div className="bg-white rounded-3xl p-6 shadow-[0_20px_40px_rgba(15,23,42,0.04)] border border-slate-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-10 text-orange-500 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12 pointer-events-none">
                   <TrainFront size={120} />
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-bold tracking-wide uppercase mb-4">
                  Confirmed Ticket
                </div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                  {pnrData.trainName}
                </h3>
                <p className="text-slate-500 font-medium flex items-center gap-1.5 mt-1">
                  Train No. <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">{pnrData.trainNumber}</span>
                </p>
                
                <div className="flex items-center gap-4 mt-6">
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Boarding</p>
                    <p className="text-[15px] font-bold text-slate-700 leading-tight">{pnrData.boardingStation}</p>
                  </div>
                  <div className="grid place-items-center h-8 w-8 rounded-full bg-slate-50 text-slate-300 shrink-0">
                    <ArrowRight size={16} />
                  </div>
                  <div className="flex-1 text-right">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Destination</p>
                    <p className="text-[15px] font-bold text-slate-700 leading-tight">{pnrData.destinationStation}</p>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-slate-100 flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-emerald-50 text-emerald-500">
                    <CalendarDays size={14} />
                  </span>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Date of Journey</p>
                    <p className="text-sm font-semibold text-slate-700">{pnrData.dateOfJourney}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-[0_20px_40px_rgba(15,23,42,0.04)] border border-slate-100 flex flex-col h-full">
                <div className="flex items-center justify-between mb-5">
                  <h4 className="text-[15px] font-bold text-slate-700 flex items-center gap-2">
                    <UserCircle2 size={18} className="text-orange-500"/>
                    Passenger Details
                  </h4>
                  <span className="text-xs font-bold px-2 py-1 bg-slate-100 text-slate-500 rounded-lg">
                    {pnrData.passengers?.length || 0} Passengers
                  </span>
                </div>
                
                <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-3 custom-scrollbar">
                  {pnrData.passengers?.map((pass, idx) => (
                    <Motion.div 
                      key={idx} 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * idx }}
                      className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-xl bg-white shadow-sm border border-slate-100 text-slate-500 text-sm font-bold">
                          #{idx + 1}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-400 uppercase">Coach • Berth</p>
                          <p className="text-[15px] font-bold text-slate-700">
                            {pass.coach} <span className="text-slate-300 mx-1">|</span> {pass.berth}
                            <span className="ml-2 text-xs font-bold text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded-md">{pass.berthType}</span>
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          {pass.currentStatus}
                        </span>
                      </div>
                    </Motion.div>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <button 
                    onClick={handleClear}
                    className="w-full py-3 rounded-xl text-sm font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Check another PNR
                  </button>
                </div>
              </div>
            </Motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  )
}

export default PnrComponent