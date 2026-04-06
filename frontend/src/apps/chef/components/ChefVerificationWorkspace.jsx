import React from 'react'
import { motion } from 'framer-motion'
import {
  Check,
  CheckCircle2,
  CircleCheckBig,
  Clock3,
  FileCheck2,
  LockKeyhole,
  ShieldCheck,
  Star,
  ShieldAlert
} from 'lucide-react'

const steps = [
  {
    id: '01',
    state: 'done',
    icon: FileCheck2,
    title: 'Profile submitted',
    description: 'Your registration, documents and chef details were received successfully.',
  },
  {
    id: '02',
    state: 'active',
    icon: Clock3,
    title: 'Review in progress',
    description: 'Admin is checking service readiness and verifying submitted details.',
  },
  {
    id: '03',
    state: 'upcoming',
    icon: CheckCircle2,
    title: 'Go live',
    description: 'Menu setup and order visibility unlock as soon as verification is complete.',
  },
]

const nextItems = [
  'Profile visibility will unlock after approval',
  'Menu setup becomes available automatically',
  'Orders and dashboard actions will start appearing',
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

function ProgressRing() {
  const progress = 60
  const radius = 46
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className="relative flex items-center justify-center">
      <svg viewBox="0 0 120 120" className="h-36 w-36 sm:h-40 sm:w-40">
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="rgba(249,115,22,0.12)"
          strokeWidth="10"
        />
        <motion.circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="url(#chefProgressGradient)"
          strokeWidth="10"
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
        />
        <defs>
          <linearGradient id="chefProgressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#fb923c" />
          </linearGradient>
        </defs>
      </svg>

      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.55, delay: 0.2, ease: 'easeOut' }}
        className="absolute inset-0 m-auto flex h-24 w-24 flex-col items-center justify-center rounded-full border border-[var(--theme-chip-border)] bg-white shadow-[var(--theme-shadow-soft)]"
      >
        <p className="text-[32px] font-bold leading-none text-[var(--theme-accent)]">60%</p>
        <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--theme-muted)]">
          done
        </p>
      </motion.div>
    </div>
  )
}

function StepMarker({ step }) {
  if (step.state === 'done') {
    return (
      <div className="grid h-9 w-9 place-items-center rounded-full border-2 border-[var(--theme-accent)] bg-[var(--theme-accent)] text-white">
        <Check size={14} />
      </div>
    )
  }

  if (step.state === 'active') {
    return (
      <div className="grid h-9 w-9 place-items-center rounded-full border-2 border-[var(--theme-accent)] bg-[var(--theme-accent-soft)] text-[var(--theme-accent)]">
        <span className="relative flex h-3 w-3 items-center justify-center">
          <span className="absolute h-5 w-5 rounded-full bg-[var(--theme-accent)]/10 animate-ping" />
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--theme-accent)]" />
        </span>
      </div>
    )
  }

  return (
    <div className="grid h-9 w-9 place-items-center rounded-full border-2 border-[var(--theme-chip-border)] bg-white text-xs font-bold text-[var(--theme-muted)]">
      3
    </div>
  )
}

function StepIcon({ step }) {
  const Icon = step.state === 'upcoming' ? CircleCheckBig : step.icon
  const active = step.state === 'active'

  return (
    <div
      className={`grid h-10 w-10 shrink-0 place-items-center rounded-[13px] border ${
        active
          ? 'border-transparent bg-[linear-gradient(135deg,#f97316,#fb923c)] text-white shadow-[var(--theme-shadow-button)]'
          : 'border-[var(--theme-chip-border)] bg-[var(--theme-accent-soft)] text-[var(--theme-accent)]'
      }`}
    >
      <Icon size={16} />
    </div>
  )
}

function ChefVerificationWorkspace() {
  return (
    <motion.section
      className="py-2"
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="flex flex-col gap-3.5 py-1">
        <motion.div
          variants={itemVariants}
          className="rounded-[28px] border border-[var(--theme-chip-border)] bg-[var(--theme-surface)] px-5 py-6 shadow-[var(--theme-shadow-card)] sm:px-7 sm:py-7"
        >
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div className="min-w-[220px] flex-1">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--theme-chip-border)] bg-[var(--theme-accent-soft)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--theme-accent)]">
                           <ShieldCheck size={14} />
                           Review workspace
                </div>
              <h2 className="mt-3.5 text-[30px] font-extrabold leading-[1.1] tracking-[-0.5px] text-[var(--theme-text)] sm:text-[34px]">
                Profile under <span className="text-[var(--theme-accent)]">review</span>
              </h2>
              <p className="mt-2.5 max-w-[460px] text-sm leading-[1.7] text-[var(--theme-muted)]">
                Your profile has been sent for admin verification. You can track the current progress here while the review completes.
              </p>
            <motion.div variants={itemVariants} className="mt-2 rounded-[22px] border border-[var(--theme-chip-border)] bg-[linear-gradient(180deg,#fff8f1,#fff)] px-3 py-2 shadow-[var(--theme-shadow-soft)]">
          <div className="flex items-start gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-[var(--theme-accent)] shadow-[var(--theme-shadow-soft)]">
              <ShieldAlert size={18} />
            </span>
            <div>
              <p className="theme-muted text-sm leading-6">
                Just wait for approval. No action is needed right now.
              </p>
            </div>
          </div>
        </motion.div>
            </div>

              <div className="mt-5 flex flex-col gap-5 rounded-[22px] border border-[var(--theme-chip-border)] bg-[var(--theme-accent-soft)]/30 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-md space-y-2">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--theme-accent)]">
                  Current progress
                </p>
                <p className="text-xl font-bold text-[var(--theme-text)] sm:text-2xl">
                  Your profile is currently in admin verification.
                </p>
                <p className="theme-muted text-sm leading-6">
                  Almost everything is complete. Approval is the final step before your chef profile becomes active.
                </p>

                <div className="inline-flex items-center gap-2 rounded-full border border-[var(--theme-chip-border)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--theme-accent)] shadow-[var(--theme-shadow-soft)]">
                  <span className="relative flex h-3.5 w-3.5 items-center justify-center">
                    <span className="absolute h-3.5 w-3.5 rounded-full bg-[var(--theme-accent)]/20 animate-ping" />
                    <span className="h-2 w-2 rounded-full bg-[var(--theme-accent)]" />
                  </span>
                  Active step: Admin verification
                </div>
              </div>

              <div className="flex justify-center lg:justify-end">
                <ProgressRing />
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-3.5 xl:grid-cols-[1.08fr_0.92fr]">
          <motion.div
            variants={itemVariants}
            className="rounded-[28px] border border-[var(--theme-surface-border)] bg-[var(--theme-surface)] px-4 py-6 shadow-[var(--theme-shadow-card)] sm:px-5 sm:py-6"
          >
            <p className="mb-5 pl-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--theme-accent)]">
              Verification steps
            </p>

            <div className="space-y-1.5">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-start">
                  <div className="flex w-[50px] shrink-0 flex-col items-center">
                    <StepMarker step={step} />
                    {index !== steps.length - 1 && (
                      <div className={`my-1 h-[20px] w-[2px] rounded-full ${step.state === 'done' ? 'bg-[linear-gradient(to_bottom,var(--theme-accent),var(--theme-chip-border))] opacity-60' : 'bg-[var(--theme-chip-border)]'}`} />
                    )}
                  </div>

                  <div className="flex flex-1 items-start gap-3 rounded-[18px] border border-[var(--theme-chip-border)] bg-[linear-gradient(180deg,#fffaf4,#fff)] p-3">
                    <StepIcon step={step} />
                    <div className="min-w-0">
                      <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--theme-accent)]">
                        Step {step.id}
                      </p>
                      <p className="text-[15px] font-bold leading-[1.25] text-[var(--theme-text)]">
                        {step.title}
                      </p>
                      <p className="mt-1 text-[12.5px] leading-[1.6] text-[var(--theme-muted)]">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-col gap-3.5">
            <div className="rounded-[24px] border border-[var(--theme-surface-border)] bg-[var(--theme-surface)] p-5 shadow-[var(--theme-shadow-card)]">
              <div className="mb-4 flex items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-[13px] border border-[var(--theme-chip-border)] bg-[var(--theme-accent-soft)] text-[var(--theme-accent)]">
                  <Star size={15} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--theme-accent)]">After approval</p>
                  <p className="text-[19px] font-bold leading-[1.1] text-[var(--theme-text)]">What opens next</p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {nextItems.map((item) => (
                  <div
                    key={item}
                    className="flex cursor-default items-center gap-3 rounded-[14px] border border-[var(--theme-chip-border)] bg-[linear-gradient(180deg,#ffffff,#fff9f4)] px-3.5 py-3 shadow-[0_2px_6px_rgba(15,23,42,0.04)] transition hover:-translate-y-px hover:shadow-[0_5px_16px_rgba(249,115,22,0.13)]"
                  >
                    <div className="grid h-7 w-7 shrink-0 place-items-center rounded-[9px] border border-[var(--theme-chip-border)] bg-[var(--theme-accent-soft)] text-[var(--theme-accent)]">
                      <CheckCircle2 size={13} />
                    </div>
                    <p className="text-[13px] font-medium text-[var(--theme-text)]">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] border border-[var(--theme-chip-border)] bg-[linear-gradient(135deg,#fffbf8,#fff3e7)] p-5 shadow-[var(--theme-shadow-card)]">
              <div className="flex items-start gap-3.5">
                <div className="grid h-[46px] w-[46px] shrink-0 place-items-center rounded-[15px] border border-[var(--theme-chip-border)] bg-white text-[var(--theme-accent)] shadow-[var(--theme-shadow-soft)]">
                  <LockKeyhole size={18} />
                </div>
                <div>
                  <p className="text-[15px] font-bold text-[var(--theme-text)]">Actions locked</p>
                  <p className="mt-1.5 text-[13px] leading-[1.6] text-[var(--theme-muted)]">
                    Editing and live order actions stay locked until admin confirms your profile details.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </motion.section>
  )
}

export default ChefVerificationWorkspace
