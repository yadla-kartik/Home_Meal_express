import React from 'react'
import { motion } from 'framer-motion'
import { Bike, CheckCircle2, Clock3, ShieldCheck } from 'lucide-react'

function DeliveryVerificationWorkspace() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="grid gap-4"
    >
      <div className="overflow-hidden rounded-[30px] border border-[var(--theme-chip-border)] bg-[linear-gradient(180deg,#fff7ef_0%,#fff1e6_100%)] p-4 shadow-[var(--theme-shadow-card)] sm:p-5">
        <div className="rounded-[24px] border border-[rgba(249,115,22,0.12)] bg-[rgba(255,255,255,0.76)] p-5 shadow-[0_8px_40px_rgba(249,115,22,0.07)] backdrop-blur-sm sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--theme-chip-border)] bg-[rgba(255,255,255,0.72)] px-3 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[var(--theme-accent)]">
                <ShieldCheck size={13} />
                Delivery verification
              </div>

              <h2
                className="mt-4 max-w-2xl text-[26px] font-semibold leading-[1.08] tracking-[-0.5px] text-[var(--theme-text)] sm:text-[34px]"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                Your delivery profile is
                <span className="font-semibold italic text-[var(--theme-accent)]"> under review</span>.
              </h2>

              <p className="mt-4 max-w-3xl text-[13px] leading-7 text-[var(--theme-muted)] sm:text-[14px]">
                Your registration has been received successfully. The admin team is now reviewing your delivery details before activation.
              </p>
            </div>

            <div className="rounded-[24px] border border-[rgba(249,115,22,0.14)] bg-white/90 px-5 py-4 text-center shadow-[var(--theme-shadow-soft)]">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--theme-accent)]">
                Current status
              </p>
              <p className="mt-2 text-2xl font-bold text-[var(--theme-text)]">Pending</p>
              <p className="mt-1 text-xs text-[var(--theme-muted)]">Admin verification</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[26px] border border-[var(--theme-chip-border)] bg-white p-5 shadow-[var(--theme-shadow-card)] sm:p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--theme-accent)]">
            Review stage
          </p>
          <h3 className="mt-2 text-[28px] font-bold leading-tight text-[var(--theme-text)]">
            Verification in progress
          </h3>

          <div className="mt-5 space-y-3">
            {[
              {
                icon: CheckCircle2,
                title: 'Profile submitted',
                desc: 'Your rider details and uploaded documents have been received.',
              },
              {
                icon: Clock3,
                title: 'Admin review running',
                desc: 'The team is validating your profile, service area and delivery readiness.',
              },
              {
                icon: Bike,
                title: 'Go live next',
                desc: 'Assignments and dashboard actions unlock as soon as approval is complete.',
              },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.title}
                  className="rounded-[18px] border border-[rgba(249,115,22,0.14)] bg-[linear-gradient(180deg,#ffffff,#fffaf4)] p-4"
                >
                  <div className="flex items-start gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[var(--theme-accent-soft)] text-[var(--theme-accent)]">
                      <Icon size={18} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-[var(--theme-text)]">{item.title}</p>
                      <p className="mt-1 text-[12.5px] leading-6 text-[var(--theme-muted)]">{item.desc}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="rounded-[26px] border border-[var(--theme-chip-border)] bg-white p-5 shadow-[var(--theme-shadow-card)] sm:p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--theme-accent)]">
            What to expect
          </p>
          <h3 className="mt-2 text-[28px] font-bold leading-tight text-[var(--theme-text)]">
            What opens after approval
          </h3>

          <div className="mt-5 space-y-3">
            {[
              'Pickup request cards will start appearing in your dashboard.',
              'Route and shift tools will unlock for active delivery work.',
              'Partner status and assignment summaries will begin updating live.',
            ].map((line) => (
              <div
                key={line}
                className="rounded-[18px] border border-[rgba(249,115,22,0.14)] bg-[linear-gradient(180deg,#ffffff,#fffaf4)] px-4 py-3"
              >
                <p className="text-[13px] font-semibold leading-6 text-[var(--theme-text)]">{line}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-[20px] border border-[rgba(249,115,22,0.16)] bg-[var(--theme-accent-soft)]/70 p-4">
            <p className="text-sm font-semibold text-[var(--theme-text)]">Wait for approval. No action is needed right now.</p>
            <p className="mt-1 text-[12.5px] leading-6 text-[var(--theme-muted)]">
              If the admin team needs any update, your delivery profile can be reviewed again after the requested changes.
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  )
}

export default DeliveryVerificationWorkspace
