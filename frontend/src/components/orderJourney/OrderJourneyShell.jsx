import React from 'react'
import { motion as Motion } from 'framer-motion'
import {
  ArrowLeft,
  CalendarDays,
  ChefHat,
  MapPin,
  ShoppingBag,
  TrainFront,
  Users,
} from 'lucide-react'
import Navbar from '../../apps/user/Navbar'

const STEP_ITEMS = [
  { key: 'menu', label: 'Menu' },
  { key: 'cart', label: 'Cart' },
  { key: 'billing', label: 'Billing' },
  { key: 'payment', label: 'Payment' },
  { key: 'bill', label: 'Bill' },
]

function MetaCard({ icon, label, value }) {
  return (
    <div className="rounded-[22px] border border-[color:var(--theme-surface-border)] bg-white/88 px-4 py-3 shadow-[var(--theme-shadow-soft)]">
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-[18px] border border-[var(--theme-chip-border)] bg-[var(--theme-accent-soft)] text-[var(--theme-accent)]">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--theme-muted)]">
            {label}
          </p>
          <p className="mt-1 truncate text-[14px] font-semibold text-[var(--theme-text)]">
            {value}
          </p>
        </div>
      </div>
    </div>
  )
}

function OrderJourneyShell({
  draft,
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

      <div className="px-4 pb-12 pt-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <Motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="overflow-hidden rounded-[32px] border border-[color:var(--theme-surface-border)] bg-[linear-gradient(135deg,rgba(255,248,241,0.98),rgba(255,255,255,0.94),rgba(240,247,255,0.94))] p-5 shadow-[var(--theme-shadow-card-lg)] sm:p-6"
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                <div className="flex min-w-0 flex-col gap-4">
                  <button
                    type="button"
                    onClick={onBack}
                    className="inline-flex w-fit items-center gap-2 rounded-full border border-[color:var(--theme-surface-border)] bg-white/88 px-4 py-2 text-[12px] font-semibold text-[var(--theme-text)] transition hover:border-[var(--theme-accent)] hover:text-[var(--theme-accent)]"
                  >
                    <ArrowLeft size={14} />
                    {backLabel}
                  </button>

                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--theme-accent)]">
                      Order Journey
                    </p>
                    <h1 className="mt-2 text-[28px] font-black tracking-tight text-[var(--theme-text)] sm:text-[34px]">
                      {title}
                    </h1>
                    <p className="mt-3 max-w-2xl text-[14px] leading-7 text-[var(--theme-muted)]">
                      {description}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                  {STEP_ITEMS.map((step, index) => {
                    const isActive = step.key === currentStep
                    const isCompleted = index < activeStepIndex

                    return (
                      <div
                        key={step.key}
                        className={`rounded-[20px] border px-4 py-3 text-center transition ${
                          isActive
                            ? 'border-[var(--theme-chip-border)] bg-white text-[var(--theme-accent)] shadow-[var(--theme-shadow-soft)]'
                            : isCompleted
                              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                              : 'border-[color:var(--theme-surface-border)] bg-white/65 text-[var(--theme-muted)]'
                        }`}
                      >
                        <p className="text-[9px] font-semibold uppercase tracking-[0.18em]">
                          Step {index + 1}
                        </p>
                        <p className="mt-1 text-[13px] font-bold">{step.label}</p>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <MetaCard
                  icon={<TrainFront size={18} />}
                  label="Journey"
                  value={`${draft?.trainName || 'Meal order'} • ${draft?.pnrInput || draft?.pnrData?.pnr || 'PNR'}`}
                />
                <MetaCard
                  icon={<MapPin size={18} />}
                  label="Station"
                  value={`${draft?.selectedStation?.name || 'Selected station'} (${draft?.selectedStation?.code || draft?.stationCode || '--'})`}
                />
                <MetaCard
                  icon={<ChefHat size={18} />}
                  label="Chef"
                  value={draft?.chef?.name || 'Selected chef'}
                />
                <MetaCard
                  icon={<ShoppingBag size={18} />}
                  label="Order"
                  value={`${draft?.summary?.totalItems || 0} items for ${draft?.passengerCount || draft?.pnrData?.passengers?.length || 1} passenger${(draft?.passengerCount || draft?.pnrData?.passengers?.length || 1) > 1 ? 's' : ''}`}
                />
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <MetaCard
                  icon={<CalendarDays size={18} />}
                  label="Travel Date"
                  value={draft?.pnrData?.dateOfJourney || 'Upcoming journey'}
                />
                <MetaCard
                  icon={<Users size={18} />}
                  label="Route"
                  value={`${draft?.pnrData?.boardingStation || 'Boarding'} to ${draft?.pnrData?.destinationStation || 'Destination'}`}
                />
              </div>
            </div>
          </Motion.section>

          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.18fr)_360px]">
            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06, duration: 0.35, ease: 'easeOut' }}
              className="min-w-0"
            >
              {children}
            </Motion.div>

            <Motion.aside
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.35, ease: 'easeOut' }}
              className="min-w-0"
            >
              {sidebar}
            </Motion.aside>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderJourneyShell
