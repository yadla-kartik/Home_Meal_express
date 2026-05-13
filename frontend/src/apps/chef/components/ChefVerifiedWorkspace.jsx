import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, BadgeCheck, CheckCircle2, ChefHat, MapPinned, Sparkles, UtensilsCrossed, Star, XCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

const launchCards = [
  {
    icon: ChefHat,
    eyebrow: 'Unlocked',
    title: 'Profile approved',
    description: 'Your chef account is verified and now visible for next setup steps.',
  },
  {
    icon: UtensilsCrossed,
    eyebrow: 'Action',
    title: 'Add your menu',
    description: 'Create dishes, pricing and timings so customers can start ordering.',
  },
  {
    icon: MapPinned,
    eyebrow: 'Go live',
    title: 'Start serving',
    description: 'Once menu is ready, your kitchen becomes active for nearby stations.',
  },
]

const quickWins = [
  'Add your best-selling home-style dishes first',
  'Set clear prices and serving availability',
  'Keep menu details updated for smoother orders',
  'Maintain food quality and hygiene standards',
  'Prepare orders on time to match train schedules',
]

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: 'easeOut',
      staggerChildren: 0.08,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

function ProgressRing({ color = '#f97316', secondaryColor = 'rgba(249,115,22,0.16)' }) {
  const progress = 100
  const radius = 46
  const circumference = 2 * Math.PI * radius

  return (
    <div className="relative flex items-center justify-center">
      <svg viewBox="0 0 120 120" className="h-36 w-36 sm:h-40 sm:w-40">
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke={secondaryColor}
          strokeWidth="10"
        />
        <motion.circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="url(#chefVerifiedWorkspaceGradient)"
          strokeWidth="10"
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
        <defs>
          <linearGradient id="chefVerifiedWorkspaceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor={color} />
          </linearGradient>
        </defs>
      </svg>

      <div className="absolute inset-0 m-auto flex h-24 w-24 flex-col items-center justify-center rounded-full border border-orange-100 bg-white shadow-[var(--theme-shadow-soft)]">
        <p className="text-[30px] font-bold leading-none text-orange-600">100%</p>
        <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--theme-muted)]">
          live
        </p>
      </div>
    </div>
  )
}

function ChefVerifiedWorkspace() {
  const [showVerifiedBanner, setShowVerifiedBanner] = React.useState(() => {
    return localStorage.getItem('hme_chef_verified_seen') !== 'true'
  })

  const dismissBanner = () => {
    localStorage.setItem('hme_chef_verified_seen', 'true')
    setShowVerifiedBanner(false)
  }

  return (
    <motion.section
      className="w-full py-4"
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="grid gap-5 lg:grid-row-[1.08fr_0.92fr]">
        <motion.div
          variants={itemVariants}
          className="theme-card relative rounded-[28px] p-5 sm:p-6"
        >
          {showVerifiedBanner && (
            <button
              type="button"
              onClick={dismissBanner}
              className="absolute right-4 top-4 z-10 grid h-8 w-8 place-items-center rounded-full bg-slate-50 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              title="Dismiss"
            >
              <XCircle size={18} className="lucide lucide-x-circle" />
            </button>
          )}
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-orange-700">
            <BadgeCheck size={14} />
            Chef verified
          </div>

          <h2 className="mt-4 text-3xl font-bold leading-tight text-[var(--theme-text)] sm:text-[38px]">
            You are approved. Now set your menu and go live.
          </h2>
          <p className="theme-muted mt-3 max-w-2xl text-sm leading-6 sm:text-[15px]">
            Your chef profile has been verified successfully. The next step is simple: add your dishes, pricing and service timing so passengers can start discovering your kitchen.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {launchCards.map((card) => {
              const Icon = card.icon
              return (
                <motion.article
                  key={card.title}
                  variants={itemVariants}
                  className="rounded-[24px] border border-orange-100 bg-[linear-gradient(180deg,#ffffff,#fffaf4)] p-4 shadow-[var(--theme-shadow-soft)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-700">
                      {card.eyebrow}
                    </span>
                    <span className="grid h-10 w-10 place-items-center rounded-2xl bg-orange-50 text-orange-600">
                      <Icon size={18} />
                    </span>
                  </div>
                  <p className="mt-4 text-base font-semibold text-[var(--theme-text)]">
                    {card.title}
                  </p>
                  <p className="theme-muted mt-2 text-xs leading-5 sm:text-[13px]">
                    {card.description}
                  </p>
                </motion.article>
              )
            })}
          </div>

          <motion.div
            variants={itemVariants}
            className="mt-5 flex flex-col gap-3 rounded-[24px] border border-orange-100 bg-orange-50/70 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-orange-600 shadow-[var(--theme-shadow-soft)]">
                <Sparkles size={18} />
              </span>
              <div>
                <p className="text-sm font-semibold text-[var(--theme-text)]">
                  Your dashboard is ready for the next chef actions.
                </p>
                <p className="theme-muted mt-1 text-xs leading-5 sm:text-[13px]">
                  Add menu details now to start moving toward live customer orders.
                </p>
              </div>
            </div>

            <Link
              to="/chef/menu"
              className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(249,115,22,0.26)] transition hover:-translate-y-0.5 hover:bg-orange-700"
            >
              Add Menu
              <ArrowRight size={16} className="transition group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </motion.div>

        <div className="grid gap-5 lg:grid-cols-2">
          <motion.div
            variants={itemVariants}
            className="theme-card rounded-[28px] p-5 sm:p-6"
          >
            <div className="rounded-[24px] border border-orange-100 bg-[linear-gradient(135deg,#fff7ed,#ffffff)] p-5 shadow-[var(--theme-shadow-soft)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-700">
                    Current status
                  </p>
                  <h3 className="mt-2 text-2xl font-bold text-[var(--theme-text)]">
                    Approved and active
                  </h3>
                </div>
                <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
                  Live
                </span>
              </div>

              <div className="mt-5 flex flex-col items-center gap-4 text-center">
                <ProgressRing />
                <div className="max-w-sm">
                  <p className="text-sm font-semibold text-[var(--theme-text)]">
                    Your profile has fully cleared verification and is ready for launch setup.
                  </p>
                  <p className="theme-muted mt-2 text-sm leading-6">
                    The next move is simple: finish your menu so customers can start seeing your kitchen.
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-3 py-1.5 text-xs font-semibold text-orange-700 shadow-[var(--theme-shadow-soft)]">
                  <span className="relative flex h-3.5 w-3.5 items-center justify-center">
                    <span className="absolute h-3.5 w-3.5 rounded-full bg-orange-500/20 animate-ping" />
                    <span className="h-2 w-2 rounded-full bg-orange-500" />
                  </span>
                  All chef actions are now unlocked
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="theme-card rounded-[28px] p-5 sm:p-6"
          >
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-orange-50 text-orange-600">
                <Star size={18} />
              </span>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-700">
                  Best next steps
                </p>
                <h3 className=" text-2xl font-bold text-[var(--theme-text)]">
                  Start strong
                </h3>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {quickWins.map((step) => (
                <div
                  key={step}
                  className="flex items-center gap-3 rounded-[22px] border border-orange-100 bg-white p-3 shadow-[var(--theme-shadow-soft)]"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-2xl bg-orange-50 text-orange-600">
                    <BadgeCheck size={16} />
                  </span>
                  <p className="text-sm font-medium text-[var(--theme-text)]">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}

export default ChefVerifiedWorkspace
