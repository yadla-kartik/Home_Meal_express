import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Bike, Clock3, MapPinned, ShieldCheck, Star, WalletCards } from 'lucide-react'

const flowSteps = [
  {
    num: '01',
    icon: Bike,
    title: 'Share rider details',
    desc: 'Add your delivery profile, route coverage and required documents in one clear flow.',
  },
  {
    num: '02',
    icon: ShieldCheck,
    title: 'Move into admin review',
    desc: 'Once submitted, your delivery profile goes directly into approval for final verification.',
  },
  {
    num: '03',
    icon: WalletCards,
    title: 'Unlock delivery tools',
    desc: 'After approval, routes, assignments and delivery actions open inside your dashboard.',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
}

const panelIn = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
}

const stepIn = {
  hidden: { opacity: 0, x: -10 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  },
}

function ProgressRing() {
  const progress = 25
  const radius = 46
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className="relative flex items-center justify-center">
      <svg viewBox="0 0 120 120" className="h-36 w-36 sm:h-40 sm:w-40">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="rgba(249,115,22,0.12)" strokeWidth="10" />
        <motion.circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="url(#deliveryRegisterProgressGradient)"
          strokeWidth="10"
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.3, ease: 'easeOut' }}
        />
        <defs>
          <linearGradient id="deliveryRegisterProgressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#fb923c" />
          </linearGradient>
        </defs>
      </svg>

      <div className="absolute inset-0 m-auto flex h-24 w-24 flex-col items-center justify-center rounded-full border border-[var(--theme-chip-border)] bg-white shadow-[var(--theme-shadow-soft)]">
        <p className="text-[32px] font-bold leading-none text-[var(--theme-accent)]">25%</p>
        <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--theme-muted)]">
          done
        </p>
      </div>
    </div>
  )
}

function DeliveryRegisterWorkspace({ onRegisterClick }) {
  return (
    <motion.section
      className="relative overflow-hidden rounded-[30px] border border-[var(--theme-chip-border)] bg-[linear-gradient(180deg,#fff7ef_0%,#fff1e6_100%)] p-4 shadow-[var(--theme-shadow-card)] sm:p-5"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <div className="pointer-events-none absolute -right-10 top-0 h-48 w-48 rounded-full bg-[rgba(249,115,22,0.12)] blur-[80px]" />
      <div className="pointer-events-none absolute -left-6 bottom-0 h-32 w-32 rounded-full bg-[rgba(251,146,60,0.1)] blur-[70px]" />

      <motion.div variants={panelIn} className="relative z-[1] flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--theme-chip-border)] bg-[rgba(255,255,255,0.7)] px-3 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[var(--theme-accent)] backdrop-blur-md">
          <Bike size={13} />
          <span>Complete delivery setup</span>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--theme-chip-border)] bg-[rgba(255,255,255,0.78)] px-4 py-2 text-xs font-medium text-[var(--theme-muted)] backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-[var(--theme-accent)] shadow-[0_0_0_4px_rgba(249,115,22,0.18)] animate-pulse" />
          <span>Registration required</span>
        </div>
      </motion.div>

      <motion.div
        variants={panelIn}
        className="relative z-[1] mt-5 overflow-hidden rounded-[24px] border border-[rgba(249,115,22,0.12)] bg-[rgba(255,255,255,0.72)] p-5 shadow-[0_8px_40px_rgba(249,115,22,0.07)] backdrop-blur-sm sm:p-6"
      >
        <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(249,115,22,0.08),transparent_68%)]" />

        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <h2
              className="max-w-2xl text-[26px] font-semibold leading-[1.08] tracking-[-0.5px] text-[var(--theme-text)] sm:text-[34px]"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              Complete your delivery registration to
              <span className="font-semibold italic text-[var(--theme-accent)]"> unlock</span>{' '}
              live assignments.
            </h2>

            <p className="mt-4 max-w-3xl text-[13px] leading-7 text-[var(--theme-muted)] sm:text-[14px]">
              You are already inside the dashboard, but your delivery partner setup is still incomplete.
              Finish this step so your profile can move into review and route actions can open.
            </p>
          </div>

          <div className="flex justify-center lg:justify-end">
            <ProgressRing />
          </div>
        </div>

        <div className="mt-6 rounded-[16px] border border-[rgba(249,115,22,0.15)] bg-[var(--theme-accent-soft)]/80 p-4">
          <div className="flex items-start gap-3">
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#f97316,#fb923c)] text-white shadow-[0_4px_12px_rgba(249,115,22,0.3)]"
            >
              <Clock3 size={17} />
            </motion.div>
            <div>
              <p className="text-sm font-semibold leading-6 text-[var(--theme-text)]">
                One clean step stands between you and delivery activation.
              </p>
              <p className="mt-1 text-[12.5px] leading-6 text-[var(--theme-muted)]">
                Add your route, identity and shift details so the admin team can approve your delivery access faster.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-[16px] border border-[rgba(249,115,22,0.15)] bg-[rgba(253,248,243,0.88)] px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--theme-accent)]">
              Current access
            </p>
            <p className="mt-1.5 text-[13px] font-semibold leading-5 text-[var(--theme-text)]">
              Signed in, waiting for registration
            </p>
          </div>
          <div className="rounded-[16px] border border-[rgba(249,115,22,0.15)] bg-[rgba(253,248,243,0.88)] px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--theme-accent)]">
              Next milestone
            </p>
            <p className="mt-1.5 text-[13px] font-semibold leading-5 text-[var(--theme-text)]">
              Verification review can start
            </p>
          </div>
        </div>

        <motion.button
          type="button"
          onClick={onRegisterClick}
          whileHover={{ y: -2, boxShadow: '0 14px 32px rgba(249,115,22,0.42)' }}
          whileTap={{ scale: 0.97 }}
          className="relative mt-6 inline-flex items-center gap-3 overflow-hidden rounded-[14px] bg-[linear-gradient(135deg,#f97316,#fb923c)] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(249,115,22,0.35)]"
        >
          <span className="pointer-events-none absolute inset-0 rounded-[14px] bg-[linear-gradient(135deg,rgba(255,255,255,0.18),transparent)]" />
          <span className="relative z-[1]">Register now</span>
          <span className="relative z-[1] flex h-[22px] w-[22px] items-center justify-center rounded-[7px] bg-[rgba(255,255,255,0.22)]">
            <ArrowRight size={13} />
          </span>
        </motion.button>
      </motion.div>

      <motion.div
        variants={panelIn}
        className="relative z-[1] mt-4 rounded-[24px] border border-[rgba(249,115,22,0.12)] bg-[rgba(255,255,255,0.72)] p-5 shadow-[0_8px_40px_rgba(249,115,22,0.07)] backdrop-blur-sm sm:p-6"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] border border-[rgba(249,115,22,0.2)] bg-[var(--theme-accent-soft)] text-[var(--theme-accent)]">
            <Star size={17} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--theme-accent)]">
              Setup flow
            </p>
            <h3 className="text-[17px] font-bold text-[var(--theme-text)]">
              What opens after this
            </h3>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3">
          {flowSteps.map((step) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.num}
                variants={stepIn}
                whileHover={{ x: 4 }}
                className="group flex items-start gap-3 rounded-[16px] border border-[rgba(249,115,22,0.1)] bg-[rgba(253,248,243,0.88)] px-4 py-4 transition hover:border-[rgba(249,115,22,0.28)] hover:shadow-[0_4px_20px_rgba(249,115,22,0.1)]"
              >
                <div className="min-w-[24px] pt-0.5 text-center text-[22px] leading-none text-[rgba(249,115,22,0.28)] transition group-hover:text-[var(--theme-accent)]">
                  {step.num}
                </div>
                <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[10px] border border-[rgba(249,115,22,0.15)] bg-white text-[var(--theme-accent)] shadow-[0_2px_6px_rgba(249,115,22,0.1)]">
                  <Icon size={15} />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-[var(--theme-text)]">
                    {step.title}
                  </p>
                  <p className="mt-1 text-[12px] leading-6 text-[var(--theme-muted)]">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>

        <div className="mt-5 rounded-[18px] border border-[rgba(249,115,22,0.12)] bg-[rgba(253,248,243,0.88)] p-4">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-[var(--theme-accent)] shadow-[var(--theme-shadow-soft)]">
              <MapPinned size={18} />
            </span>
            <div>
              <p className="text-sm font-semibold text-[var(--theme-text)]">Delivery focus unlocks next</p>
              <p className="mt-1 text-[12px] leading-6 text-[var(--theme-muted)]">
                Route zones, pickup assignment cards and delivery actions will appear here after approval.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.section>
  )
}

export default DeliveryRegisterWorkspace
