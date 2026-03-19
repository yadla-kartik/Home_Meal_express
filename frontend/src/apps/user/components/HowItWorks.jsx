import React from 'react'
import { motion as Motion } from 'framer-motion'

const STEPS = [
  {
    number: '01',
    title: 'Enter your journey',
    description:
      'Enter PNR, coach, and seat details so we can find nearby home chefs before your station arrives.',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6"
      >
        
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M3 10h18" />
        <path d="M8 15h4" />
        <circle cx="17" cy="15" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Choose and order',
    description:
      'Pick homemade meals from your chef menu and place the order with a smooth, familiar checkout flow.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8"/><path d="M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15Zm0 0 7 7"/><path d="m2.1 21.8 6.4-6.3"/><path d="m19 5-7 7"/></svg>
    ),
  },
  {
    number: '03',
    title: 'Enjoy at your seat',
    description:
      'Fresh homemade food reaches your train seat hot, clean, and on time without any platform rush.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M12 22V12"/><path d="m16 17 2 2 4-4"/><path d="M21 11.127V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.729l7 4a2 2 0 0 0 2 .001l1.32-.753"/><path d="M3.29 7 12 12l8.71-5"/><path d="m7.5 4.27 8.997 5.148"/></svg>
    ),
  },
]

const containerVariants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: 'easeOut',
      staggerChildren: 0.12,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: 'easeOut' },
  },
}

export default function HowItWorks() {
  return (
    <Motion.section
      className="flex w-full items-center py-4"
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="mx-auto w-full max-w-6xl rounded-3xl border border-[#f1f5f9] bg-white px-4 py-8 shadow-[0_16px_34px_rgba(15,23,42,0.08)]">
        <Motion.div className="mx-auto max-w-2xl text-center" variants={itemVariants}>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#f97316]">
            How It Works
          </p>
          <h2 className="mt-2 text-2xl font-bold text-[#0f172a] sm:text-[30px]">
            Home Meal Express Journey Flow
          </h2>
          <p className="mt-3 text-sm leading-6 text-[#64748b] sm:text-[15px]">
            From PNR to plate, each step feels clear, warm, and familiar just like the meal waiting at your seat.
          </p>
        </Motion.div>

        <Motion.div
          className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4"
          variants={containerVariants}
        >
          {STEPS.map((step) => (
            <Motion.article
              key={step.number}
              variants={itemVariants}
              className="group rounded-2xl border border-[#e2e8f0] bg-[linear-gradient(180deg,#ffffff,#fff7ef)] p-5 shadow-[0_12px_24px_rgba(15,23,42,0.06)] transition duration-200 hover:-translate-y-1 hover:border-[#fbd7c2] hover:shadow-[0_14px_24px_rgba(249,115,22,0.14)]"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--theme-accent-soft)] text-[var(--theme-accent)] shadow-[0_10px_18px_rgba(249,115,22,0.12)]">
                  {step.icon}
                </div>
                <span className="rounded-full bg-[#fff1e8] px-3 py-1 text-[11px] font-bold tracking-[0.12em] text-[var(--theme-accent)]">
                  STEP {step.number}
                </span>
              </div>

              <div className="mt-4 h-1 w-14 rounded-full bg-[linear-gradient(90deg,#f97316,rgba(249,115,22,0.15))]" />

              <h3 className="mt-4 text-base font-semibold text-[var(--theme-text)]">
                {step.title}
              </h3>
              <p className="theme-muted mt-2 text-sm leading-6">
                {step.description}
              </p>
            </Motion.article>
          ))}
        </Motion.div>
      </div>
    </Motion.section>
  )
}
