import React from 'react'
import { motion as Motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import Navbar from '../../apps/user/Navbar'

const STEP_ITEMS = [
  { key: 'menu', label: 'Menu' },
  { key: 'cart', label: 'Cart' },
  { key: 'billing', label: 'Billing' },
  { key: 'payment', label: 'Payment' },
  { key: 'bill', label: 'Bill' },
]

function OrderJourneyShell({
  currentStep,
  title,
  description,
  onBack,
  backLabel = 'Back',
  children,
  sidebar,
}) {
  const activeStepIndex = Math.max(0, STEP_ITEMS.findIndex((step) => step.key === currentStep))

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <div className="theme-page-shell min-h-screen">
      <Navbar />

      <div className="px-4 pb-10 pt-20 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <Motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="rounded-[22px] border border-[color:var(--theme-surface-border)] bg-white/92 p-4 shadow-[var(--theme-shadow-card)]"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <button
                  type="button"
                  onClick={onBack}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--theme-chip-border)] bg-[var(--theme-accent-soft)] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--theme-accent)] transition hover:-translate-y-0.5 hover:bg-[var(--theme-accent)] hover:text-white hover:shadow-[0_10px_20px_rgba(249,115,22,0.18)]"
                >
                  <ArrowLeft size={13} />
                  {backLabel}
                </button>

                <h1 className="mt-3 text-[22px] font-black leading-tight text-[var(--theme-text)] sm:text-[26px]">
                  {title}
                </h1>
                {description ? (
                  <p className="mt-1 max-w-2xl text-[12.5px] leading-5 text-[var(--theme-muted)]">
                    {description}
                  </p>
                ) : null}
              </div>

              <div className="flex max-w-full gap-1.5 overflow-x-auto rounded-full border border-[color:var(--theme-surface-border)] bg-slate-50 p-1">
                {STEP_ITEMS.map((step, index) => {
                  const isActive = step.key === currentStep
                  const isCompleted = index < activeStepIndex

                  return (
                    <div
                      key={step.key}
                      className={`shrink-0 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] transition ${
                        isActive
                          ? 'bg-[var(--theme-accent)] text-white shadow-sm'
                          : isCompleted
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'text-[var(--theme-muted)]'
                      }`}
                    >
                      {step.label}
                    </div>
                  )
                })}
              </div>
            </div>
          </Motion.section>

          <div className={`mt-4 grid gap-4 ${sidebar ? 'lg:grid-cols-[minmax(0,1fr)_310px]' : ''}`}>
            <Motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04, duration: 0.3, ease: 'easeOut' }}
              className="min-w-0"
            >
              {children}
            </Motion.div>

            {sidebar ? (
              <Motion.aside
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08, duration: 0.3, ease: 'easeOut' }}
                className="min-w-0"
              >
                {sidebar}
              </Motion.aside>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderJourneyShell
