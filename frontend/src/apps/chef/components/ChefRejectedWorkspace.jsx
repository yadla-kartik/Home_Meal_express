import React from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, ArrowRight, CircleAlert, FileEdit, ShieldX } from 'lucide-react'

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
    transition: { duration: 0.45, ease: 'easeOut' },
  },
}

function ChefRejectedWorkspace({ rejectionReason, onReregister }) {
  const safeReason = rejectionReason?.trim() || 'Your submitted details need an update before approval can continue.'

  return (
    <motion.section
      className="w-full py-2"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <div className="flex flex-col gap-4">
        <motion.div
          variants={itemVariants}
          className="rounded-[28px] border border-[#fecaca] bg-[linear-gradient(180deg,#ffffff,#fff7f7)] px-5 py-6 shadow-[var(--theme-shadow-card)] sm:px-7 sm:py-7"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-[220px] flex-1">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#fecaca] bg-[#fff1f2] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#dc2626]">
                <ShieldX size={14} />
                Review update
              </div>

              <h2 className="mt-3.5 text-[28px] font-extrabold leading-[1.1] tracking-[-0.4px] text-[var(--theme-text)] sm:text-[34px]">
                Your chef profile needs a few changes.
              </h2>

              <p className="mt-2.5 max-w-[560px] text-sm leading-[1.7] text-[var(--theme-muted)]">
                Admin has reviewed your submission and sent an update before approval. Please check the reason below and prepare the required corrections.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-[#fecaca] bg-white px-3 py-1.5 text-xs font-semibold text-[#dc2626] shadow-[var(--theme-shadow-soft)]">
              <span className="relative flex h-3.5 w-3.5 items-center justify-center">
                <span className="absolute h-3.5 w-3.5 rounded-full bg-[#ef4444]/15 animate-ping" />
                <span className="h-2 w-2 rounded-full bg-[#ef4444]" />
              </span>
              Rejected by admin
            </div>
          </div>
        </motion.div>

        <div className="grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
          <motion.div
            variants={itemVariants}
            className="rounded-[28px] border border-[#fecaca] bg-[linear-gradient(180deg,#ffffff,#fffafa)] p-5 shadow-[var(--theme-shadow-card)] sm:p-6"
          >
            <div className="flex items-start gap-3">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#fff1f2] text-[#dc2626] shadow-[var(--theme-shadow-soft)]">
                <CircleAlert size={20} />
              </span>

              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#dc2626]">
                  Admin reason
                </p>
                <h3 className="mt-2 text-2xl font-bold text-[var(--theme-text)]">
                  Please update your submission
                </h3>
                <div className="mt-4 rounded-[22px] border border-[#fecaca] bg-white px-4 py-4 shadow-[var(--theme-shadow-soft)]">
                  <p className="text-sm leading-7 text-[var(--theme-text)]">
                    {safeReason}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="rounded-[28px] border border-[var(--theme-surface-border)] bg-[var(--theme-surface)] p-5 shadow-[var(--theme-shadow-card)] sm:p-6"
          >
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[var(--theme-accent-soft)] text-[var(--theme-accent)]">
                <FileEdit size={18} />
              </span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--theme-accent)]">
                  What to do next
                </p>
                <h3 className="text-2xl font-bold text-[var(--theme-text)]">
                  Fix and resubmit
                </h3>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {[
                'Review the admin reason carefully before changing anything.',
                'Keep your documents, kitchen details and timings accurate.',
                'Submit corrected details once the requested updates are ready.',
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-[20px] border border-[var(--theme-chip-border)] bg-[linear-gradient(180deg,#ffffff,#fff9f4)] px-4 py-3 shadow-[var(--theme-shadow-soft)]"
                >
                  <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[var(--theme-accent-soft)] text-[var(--theme-accent)]">
                    <AlertTriangle size={15} />
                  </span>
                  <p className="text-sm leading-6 text-[var(--theme-text)]">
                    {item}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onReregister}
                className="inline-flex items-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#f97316,#fb923c)] px-4 py-3 text-sm font-semibold text-white shadow-[var(--theme-shadow-button)] transition hover:-translate-y-0.5"
              >
                Re-register now
                <ArrowRight size={16} />
              </button>
              <p className="text-sm leading-6 text-[var(--theme-muted)]">
                Update your details and send the profile back for review.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}

export default ChefRejectedWorkspace
