import React from 'react'
import { motion } from 'framer-motion'

const FEATURES = [
  {
    title: 'Homemade Over Hotel Food',
    description:
      'Home Meal Express connects passengers with local home chefs for fresh, home-style meals near stations.',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
      >
        <path d="M8 3v8" />
        <path d="M12 3v8" />
        <path d="M10 11v10" />
        <path d="M18 3a4 4 0 0 0-4 4v14" />
      </svg>
    ),
  },
  {
    title: 'Affordable And Hygienic',
    description:
      'Passengers avoid overpriced platform meals and get cleaner, budget-friendly options during long journeys.',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
      >
        <path d="M12 2v20" />
        <path d="M7 7h7a3 3 0 0 1 0 6H10a3 3 0 0 0 0 6h7" />
      </svg>
    ),
  },
  {
    title: 'Pre-Order By PNR',
    description:
      'Order in advance and receive food directly at your train seat on time, without journey stress.',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
      >
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 10h18" />
        <path d="M8 15h4" />
      </svg>
    ),
  },
  {
    title: 'Income For Home Chefs',
    description:
      'Housewives and local home chefs near railway stations earn from skill-based food delivery.',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
      >
        <path d="M4 7h16" />
        <path d="M6 7v10a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V7" />
        <path d="M8 11h8" />
        <path d="M8 15h6" />
      </svg>
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
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: 'easeOut' },
  },
}

function FeatureCard() {
  return (
    <motion.section
      className="flex min-h-[calc(100vh-80px)] w-full items-center py-4"
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="mx-auto w-full max-w-6xl rounded-3xl border border-[#f1f5f9] bg-white px-4 py-8 shadow-[0_16px_34px_rgba(15,23,42,0.08)] sm:px-6">
        <motion.div className="mx-auto max-w-2xl text-center" variants={itemVariants}>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#f97316]">
            Why Home Meal Express
          </p>
          <h2 className="mt-2 text-2xl font-bold text-[#0f172a] sm:text-[30px]">
            Homemade train meals, delivered with trust
          </h2>
          <p className="mt-3 text-sm leading-6 text-[#64748b] sm:text-[15px]">
            Home Meal Express bridges the gap between costly restaurant food and the real need for fresh, hygienic, home-style meals during train journeys.
          </p>
        </motion.div>

        <motion.div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" variants={containerVariants}>
          {FEATURES.map((feature) => (
            <motion.article
              key={feature.title}
              variants={itemVariants}
              className="group rounded-2xl border border-[#e2e8f0] bg-white p-4 transition duration-200 hover:-translate-y-1 hover:border-[#fbd7c2] hover:shadow-[0_14px_24px_rgba(249,115,22,0.14)]"
            >
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff6ef] text-[#f97316]">
                {feature.icon}
              </div>
              <h3 className="mt-3 text-sm font-semibold text-[#0f172a]">
                {feature.title}
              </h3>
              <p className="mt-2 text-xs leading-5 text-[#64748b] sm:text-[13px]">
                {feature.description}
              </p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </motion.section>
  )
}

export default FeatureCard
